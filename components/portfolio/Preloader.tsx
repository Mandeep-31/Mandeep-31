"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/*
 * The wordmark — "Mandeep", bold, rising out of masks in the site's own
 * headline motion. Nothing else. The page doesn't enter until the word is
 * done, and not before the heavy assets are loaded.
 */

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let done = false;
    let assets = false;
    let words = false;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    document.documentElement.classList.add("preload-lock");

    const finish = () => {
      if (cancelled || done) return;
      done = true;
      document.documentElement.classList.remove("preload-lock");
      root.classList.add("is-skipped");
    };

    /* Everything the reveal depends on: the web font, every page resource,
       and the hero photograph. Capped so a hung asset can't trap the site. */
    const preload = async () => {
      const fonts = document.fonts?.ready ?? Promise.resolve();
      const page =
        document.readyState === "complete"
          ? Promise.resolve()
          : new Promise<void>((resolve) =>
              window.addEventListener("load", () => resolve(), { once: true })
            );
      const hero = document.querySelector<HTMLImageElement>(".visual-img");
      const photo =
        hero && !hero.complete
          ? new Promise<void>((resolve) => {
              hero.addEventListener("load", () => resolve(), { once: true });
              hero.addEventListener("error", () => resolve(), { once: true });
            })
          : Promise.resolve();
      await Promise.race([
        Promise.all([fonts, page, photo]),
        new Promise((resolve) => setTimeout(resolve, 8000)),
      ]);
    };

    const tryExit = () => {
      if (cancelled || done || !words || !assets) return;
      gsap.to(
        root,
        reduce
          ? {
              autoAlpha: 0,
              duration: 0.25,
              ease: "power1.out",
              onComplete: finish,
            }
          : {
              yPercent: -100,
              duration: 0.9,
              ease: "power2.inOut",
              onComplete: finish,
            }
      );
    };

    preload().then(() => {
      if (cancelled) return;
      assets = true;
      tryExit();
    });

    if (reduce) {
      /* Land the word statically — the mask-ed rise won't run, so the
         letters would otherwise sit parked below their clips. */
      gsap.set(".preload-char-inner", { y: 0, yPercent: 0 });
      words = true;
      tryExit();
      return () => {
        cancelled = true;
        document.documentElement.classList.remove("preload-lock");
      };
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      /*
       * `y: 0` is explicit on both ends: GSAP otherwise reads the CSS
       * translateY(120%) parking transform as a fixed pixel `y` too, which
       * would leave the letters stranded below their masks at the end.
       */
      tl.fromTo(
        ".preload-char-inner",
        { yPercent: 120, y: 0 },
        { yPercent: 0, y: 0, duration: 1, stagger: 0.06 },
        0.1
      ).call(
        () => {
          if (cancelled) return;
          words = true;
          tryExit();
        },
        [],
        1.3
      );
    }, root);

    return () => {
      cancelled = true;
      ctx.revert();
      document.documentElement.classList.remove("preload-lock");
    };
  }, []);

  return (
    <div ref={rootRef} className="preload" aria-label="Loading">
      <div className="preload-stage">
        <h1 className="preload-mark" aria-hidden="true">
          {"Mandeep".split("").map((char, i) => (
            <span className="preload-char" key={i}>
              <span className="preload-char-inner">{char}</span>
            </span>
          ))}
        </h1>
      </div>
    </div>
  );
}