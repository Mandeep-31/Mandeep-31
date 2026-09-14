import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText, ScrollTrigger);

/*
 * Text Reveal 02 — a GSAP-based split-text reveal system.
 *
 * Opt text in with `data-reveal-02="lines" | "words" | "chars"`. It splits
 * the element with SplitText and fades each piece in from opacity 0.1.
 *
 * Modes:
 *   - auto:        `data-scroll` (threshold) or `data-scroll="scrub"`
 *   - manual:      `data-manual` — split only; drive the .line/.word/.char
 *                  elements from a custom timeline. Initial manual state:
 *                  `gsap.set(pieces, { opacity: 0.1 })`, then tween to 1.
 *                  The container stays `visibility: hidden` (see the
 *                  [data-reveal-02] CSS rule) so reveal it with
 *                  `gsap.set(el, { visibility: "visible" })` when the
 *                  timeline plays.
 *
 * Runs on the client after the target text rendered. Re-run per container for
 * dynamically injected content: `textReveal02(nextContainer)`.
 */
type RevealMode = "lines" | "words" | "chars";

const CONFIG = {
  lines: { duration: 0.04, stagger: 0.03, ease: "power1.out" },
  words: { duration: 0.04, stagger: 0.03, ease: "power1.out" },
  chars: { duration: 0.04, stagger: 0.03, ease: "power1.out" },
  scrollStart: "top 85%",
  scrubStart: "top 80%",
  scrubEnd: "top 20%",
  once: true,
  markers: false,
} as const;

export function textReveal02(
  scope: ParentNode = document,
  delay = 0,
  { ignoreManual = false }: { ignoreManual?: boolean } = {},
) {
  const allSplitEls = Array.from(
    scope.querySelectorAll<HTMLElement>("[data-reveal-02]"),
  );
  const autoEls = ignoreManual
    ? allSplitEls
    : allSplitEls.filter((el) => !el.hasAttribute("data-manual"));

  gsap.set(autoEls, { visibility: "visible" });

  allSplitEls.forEach((el) => {
    const splitType = el.getAttribute("data-reveal-02") as RevealMode | null;
    const c = splitType ? CONFIG[splitType] : undefined;
    if (!c || !splitType) return;

    let type = "";
    let linesClass = "";
    let wordsClass = "";
    let charsClass = "";

    switch (splitType) {
      case "lines":
        type = "lines";
        linesClass = "line";
        break;
      case "words":
        type = "words, lines";
        wordsClass = "word";
        linesClass = "line";
        break;
      case "chars":
        type = "chars, words, lines";
        charsClass = "char";
        wordsClass = "word";
        linesClass = "line";
        break;
      default:
        return;
    }

    const splitOptions = {
      type,
      autoSplit: true,
      ...(linesClass ? { linesClass } : {}),
      ...(wordsClass ? { wordsClass } : {}),
      ...(charsClass ? { charsClass } : {}),
    };

    if (!ignoreManual && el.hasAttribute("data-manual")) {
      SplitText.create(el, splitOptions);
      return;
    }

    const scrollMode = el.getAttribute("data-scroll");
    const useScroll = el.hasAttribute("data-scroll");
    const useScrub = scrollMode === "scrub";

    SplitText.create(el, {
      ...splitOptions,
      onSplit(instance: SplitText) {
        const durationValue = el.dataset.duration
          ? parseFloat(el.dataset.duration)
          : NaN;
        const staggerValue = el.dataset.stagger
          ? parseFloat(el.dataset.stagger)
          : NaN;
        const delayValue = el.dataset.delay
          ? parseFloat(el.dataset.delay)
          : NaN;

        const duration = Number.isNaN(durationValue)
          ? c.duration
          : durationValue;
        const stagger = Number.isNaN(staggerValue) ? c.stagger : staggerValue;
        const elDelay = Number.isNaN(delayValue) ? 0 : delayValue;
        const ease = el.dataset.ease || c.ease;

        const targets = (
          instance as unknown as Record<RevealMode, Element[]>
        )[splitType];
        const once = el.hasAttribute("data-once")
          ? el.getAttribute("data-once") !== "false"
          : CONFIG.once;

        const tween: gsap.TweenVars = {
          opacity: 0.1,
          duration,
          stagger,
          delay: useScroll ? elDelay : elDelay + delay,
          immediateRender: true,
          ease,
        };

        if (useScrub) {
          tween.scrollTrigger = {
            trigger: el,
            start: CONFIG.scrubStart,
            end: CONFIG.scrubEnd,
            scrub: true,
            markers: CONFIG.markers,
            ...(once
              ? { onLeave: (self: ScrollTrigger) => self.kill(false) }
              : {}),
          };
        } else if (useScroll) {
          const start = scrollMode || CONFIG.scrollStart;
          tween.scrollTrigger = {
            trigger: el,
            start: `clamp(${start})`,
            markers: CONFIG.markers,
            ...(once
              ? { once: true }
              : { toggleActions: "play none none reverse" }),
          };
        }

        return gsap.from(targets, tween);
      },
    });
  });
}