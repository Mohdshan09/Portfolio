import { useEffect, useState } from 'react';

export function useTypedLines(texts: string[], speed = 28) {
  const [output, setOutput] = useState<string[]>(() => texts.map(() => ''));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setOutput(texts);
      setActiveIndex(texts.length);
      return;
    }

    let cancelled = false;
    let lineIndex = 0;
    let charIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    function tick() {
      if (cancelled) return;
      if (lineIndex >= texts.length) {
        setActiveIndex(texts.length);
        return;
      }
      const currentText = texts[lineIndex] ?? '';
      charIndex += 1;
      // Snapshot before queuing: React runs the updater later, after lineIndex/charIndex
      // may already have advanced to the next line (which used to drop each line's last char).
      const line = lineIndex;
      const typed = currentText.slice(0, charIndex);
      setOutput((prev) => {
        const next = [...prev];
        next[line] = typed;
        return next;
      });
      if (charIndex >= currentText.length) {
        lineIndex += 1;
        charIndex = 0;
        setActiveIndex(lineIndex);
        timeoutId = setTimeout(tick, 260);
      } else {
        timeoutId = setTimeout(tick, speed);
      }
    }

    timeoutId = setTimeout(tick, 300);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [texts, speed]);

  return { output, activeIndex, done: activeIndex >= texts.length };
}
