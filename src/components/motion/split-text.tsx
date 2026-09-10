"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ElementType,
} from "react";
import { useReducedMotion } from "@/lib/use-browser";

/**
 * Text that lifts into place one *line* at a time.
 *
 * Words are measured after layout and grouped by their actual baseline, so a
 * wrapped line rises as a single unit instead of each word popping on its own —
 * the difference between type that looks set and type that looks animated.
 * A small rake within each line keeps it from feeling mechanical.
 *
 * The full string is always present for assistive tech and for no-JS.
 */
export function SplitText({
  text,
  as: Tag = "span",
  className,
  delay = 0,
  lineStagger = 0.085,
  wordRake = 0.014,
  trigger = "mount",
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  lineStagger?: number;
  wordRake?: number;
  /** `mount` plays on load (hero); `inView` waits for scroll. */
  trigger?: "mount" | "inView";
}) {
  const ref = useRef<HTMLElement>(null);
  const [lineOf, setLineOf] = useState<number[] | null>(null);
  const [revealed, setRevealed] = useState(false);
  const reduced = useReducedMotion();

  const words = text.split(" ");

  /** Group words into visual lines by their measured vertical offset. */
  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll<HTMLElement>("[data-word]");
    if (!spans.length) return;

    const tops: number[] = [];
    const mapping: number[] = [];
    spans.forEach((span) => {
      const top = span.offsetTop;
      let line = tops.findIndex((t) => Math.abs(t - top) < 4);
      if (line === -1) {
        tops.push(top);
        line = tops.length - 1;
      }
      mapping.push(line);
    });
    setLineOf(mapping);
  }, []);

  useLayoutEffect(() => {
    measure();
    // Web fonts land after first paint and change where lines break.
    document.fonts?.ready.then(measure);

    const ro = new ResizeObserver(measure);
    if (ref.current) ro.observe(ref.current);
    return () => ro.disconnect();
  }, [measure, text]);

  useEffect(() => {
    if (lineOf === null) return;
    if (trigger === "mount") {
      const id = requestAnimationFrame(() => setRevealed(true));
      return () => cancelAnimationFrame(id);
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lineOf, trigger]);

  // Before measurement (and under reduced motion) render plain, settled text.
  const active = lineOf !== null && !reduced;

  let seenInLine: Record<number, number> = {};
  if (active) seenInLine = {};

  // `as` widens to any element, which loses the ref/prop types; re-narrow to a
  // plain HTML element component so the ref below type-checks.
  const Comp = Tag as React.ComponentType<
    React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }
  >;

  return (
    <Comp ref={ref} className={className} data-revealed={revealed || undefined}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {words.map((word, i) => {
          const line = lineOf?.[i] ?? 0;
          let rake = 0;
          if (active) {
            rake = seenInLine[line] ?? 0;
            seenInLine[line] = rake + 1;
          }
          const d = active ? delay + line * lineStagger + rake * wordRake : 0;

          return (
            <span
              key={i}
              data-word
              // pb/-mb pair keeps descenders (y, g, p) from being clipped by the mask.
              className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
            >
              <span
                className="inline-block will-change-transform"
                style={
                  active
                    ? {
                        transform: revealed
                          ? "translateY(0)"
                          : "translateY(110%)",
                        opacity: revealed ? 1 : 0,
                        transition: `transform 0.82s cubic-bezier(0.16,1,0.3,1) ${d}s, opacity 0.5s linear ${d}s`,
                      }
                    : undefined
                }
              >
                {word}
                {i < words.length - 1 ? " " : ""}
              </span>
            </span>
          );
        })}
      </span>
    </Comp>
  );
}
