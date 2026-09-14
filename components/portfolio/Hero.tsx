"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ExpandingVisual from "./ExpandingVisual";

gsap.registerPlugin(ScrollTrigger);

/* Kathmandu, like the reference's coordinate bar */
const COORD_N = "N 27° 42' 51.900\"";
const COORD_E = "E 85° 19' 14.600\"";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 10_000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const type = typeRef.current;
    if (!section || !type) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const visual = section.querySelector<HTMLElement>(".visual-frame");
    const note = section.querySelector<HTMLElement>(".visual-note");
    const scrim = section.querySelector<HTMLElement>(".nav-scrim");
    const slot = section.querySelector<HTMLElement>(".visual-slot");
    const metaRow = section.querySelector<HTMLElement>(".hero-meta-row");
    const stage = visual?.parentElement;
    if (!visual || !note || !scrim || !slot || !metaRow || !stage) return;

    /*
     * The frame is fullscreen and clipped down to the slot's rectangle;
     * expanding means animating the clip open, which stays on the
     * compositor (no layout, no image re-rasterization per frame).
     */
    const slotInset = () => {
      const s = stage.getBoundingClientRect();
      const f = slot.getBoundingClientRect();
      const top = f.top - s.top;
      const left = f.left - s.left;
      const right = s.width - left - slot.offsetWidth;
      const bottom = s.height - top - slot.offsetHeight;
      return `inset(${top}px ${right}px ${bottom}px ${left}px)`;
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          /* Heavy damping — Lenis smooths the input, this smooths the tail */
          scrub: 1.1,
          invalidateOnRefresh: true,
        },
      });

      /* 0 → 0.72 expansion, 0.72 → 1 hold with the sky as the full background */
      tl.fromTo(
        visual,
        { clipPath: () => slotInset() },
        {
          clipPath: "inset(0px 0px 0px 0px)",
          /* power4 sprints through the middle and reads snappy; power2 spreads the velocity */
          ease: "power2.inOut",
          duration: 0.72,
        },
        0
      )
        .to(type, {
          yPercent: -14,
          autoAlpha: 0,
          ease: "power2.out",
          duration: 0.36,
        }, 0.02)
        .to(metaRow, { autoAlpha: 0, ease: "power1.out", duration: 0.17 }, 0.03)
        .to(scrim, { opacity: 1, ease: "power1.inOut", duration: 0.35 }, 0.2)
        .fromTo(
          ".visual-caption",
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, ease: "power3.out", duration: 0.5 },
          0.48
        )
        .fromTo(
          ".visual-claim-line-inner",
          { yPercent: 112 },
          {
            yPercent: 0,
            ease: "power4.out",
            duration: 0.7,
            stagger: 0.16,
          },
          0.5
        )
        .fromTo(
          ".visual-eyebrow, .visual-sub",
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            ease: "power2.out",
            duration: 0.4,
            stagger: 0.08,
          },
          0.56
        )
        .fromTo(
          note,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, ease: "power3.out", duration: 0.14 },
          0.58
        );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="hero">
      <div className="hero-stage">
        <div className="nav-scrim" />

        <div ref={typeRef} className="hero-type">
          <h1 className="hero-title">
            <span className="type-line">Ideas</span>
            <span className="type-line">
              should
              <span className="visual-slot" aria-hidden="true" />
            </span>
            <span className="type-line">move.</span>
          </h1>
        </div>

        <ExpandingVisual />

        <div className="hero-meta-row">
          <span>{COORD_N}</span>
          <span className="meta-clock">{time || "\u00a0"}</span>
          <span className="meta-right">{COORD_E}</span>
        </div>
      </div>
    </section>
  );
}