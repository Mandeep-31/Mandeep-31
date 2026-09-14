"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { textReveal02 } from "./text-reveal-02";

gsap.registerPlugin(ScrollTrigger);

export default function Statement() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const build = () => {
      if (cancelled) return;

      /* Split the manual headlines, then animate them from within this
         section's own entrance timeline so the reveal order stays: label,
         rule, headline, note. Initial manual state = opacity 0.1 on the
         generated pieces. */
      textReveal02(section);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 72%",
            toggleActions: "play none none none",
          },
        });

        tl.from(".statement-label", {
          autoAlpha: 0,
          y: 14,
          duration: 0.5,
          ease: "power3.out",
        })
          .from(
            ".statement-rule",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.9,
              ease: "power3.out",
            },
            "<0.05"
          )
          .set(".statement-text", { visibility: "visible" }, "<0.1")
          .fromTo(
            ".statement-text .line",
            { opacity: 0.1 },
            {
              opacity: 1,
              duration: 0.9,
              ease: "power4.out",
              stagger: 0.14,
            },
            "<"
          )
          .set(".statement-note", { visibility: "visible" }, "<0.2")
          .fromTo(
            ".statement-note .word",
            { opacity: 0.1 },
            {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.03,
            },
            "<"
          );
      }, section);

      cleanup = () => ctx.revert();
    };

    document.fonts.ready.then(build);

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <section ref={sectionRef} className="statement">
      <div className="statement-label">
        <span>01 — Introduction</span>
        <span className="statement-rule" aria-hidden="true" />
      </div>

      <h2 className="statement-text" data-reveal-02="lines" data-manual>
        Beautiful is easy.
        <br />
        <em>Alive</em> is the hard part.
      </h2>

      <p
        className="statement-note"
        data-reveal-02="words"
        data-manual
      >
        I’m Mandeep — a creative developer designing and building digital
        experiences that respond, react and move with intent. Based in
        Kathmandu, working with the world.
      </p>
    </section>
  );
}
