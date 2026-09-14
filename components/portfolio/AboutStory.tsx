"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { textReveal02 } from "./text-reveal-02";

gsap.registerPlugin(ScrollTrigger);

/*
 * Education — the verifiable spine of the story. Two schools, both in
 * Kathmandu, current one marked. Nothing beyond what's true.
 */
const EDUCATION = [
  {
    decade: "20",
    year: "21 – 23",
    place: "National School of Sciences",
    course: "+2 — Computer Science",
    note: "Kathmandu, Nepal",
  },
  {
    decade: "20",
    year: "23 — now",
    place: "NCIT",
    course: "BCA — Bachelor in Computer Application",
    note: "Kathmandu, Nepal — current",
  },
];

const SOFT_SKILLS = [
  "Communication & Collaboration",
  "Time Management",
  "Adaptability & Problem Solving",
  "Teamwork & Leadership",
];

const LANGUAGES = ["English", "Nepali", "Hindi"];

export default function AboutStory() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const build = () => {
      if (cancelled) return;

      /* Split the manual intro words and closing lines, then fade them in
         from within their own entrance timelines. */
      textReveal02(root);

      const ctx = gsap.context(() => {
      /*
       * Scene change. The door floods the screen black, so this page opens
       * like a film: the dark holds a moment, an aperture of light cracks
       * open below-centre, the camera settles back, and the words inside
       * the shot resolve into focus. Layers of motion — aperture, drift,
       * label, focus — but one continuous scene.
       */
      const words = gsap.utils.toArray<HTMLElement>(".about-title-word");

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          ".about-scene",
          {
            clipPath: "circle(0% at 50% 45%)",
            scale: 1.05,
          },
          {
            clipPath: "circle(150% at 50% 45%)",
            scale: 1,
            duration: 1.25,
            ease: "power2.inOut",
          },
          0.15
        )
        .fromTo(
          ".about-scene .about-label",
          { x: -22, autoAlpha: 0 },
          { x: 0, autoAlpha: 1, duration: 0.6 },
          0.25
        )
        .fromTo(
          ".about-scene .about-rule",
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            duration: 0.7,
          },
          0.32
        )
        .fromTo(
          words,
          { yPercent: 20, filter: "blur(8px)" },
          {
            yPercent: 0,
            filter: "blur(0px)",
            duration: 0.9,
            stagger: 0.05,
          },
          0.3
        )
        .fromTo(
          ".about-hint",
          { y: 12, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.6, ease: "power2.out" },
          0.75
        );

      /* The intro paragraph — one breath, then the facts */
      gsap.timeline({
        scrollTrigger: {
          trigger: ".about-intro",
          start: "top 76%",
          toggleActions: "play none none none",
        },
      })
        .from(
          ".about-intro .about-label",
          { autoAlpha: 0, y: 14, duration: 0.5, ease: "power3.out" },
          0
        )
        .set(".about-intro-text", { visibility: "visible" }, 0.12)
        .fromTo(
          ".about-intro-text .word",
          { opacity: 0.1 },
          { opacity: 1, duration: 0.55, ease: "power2.out", stagger: 0.03 },
          "<"
        );

      /* The spine draws itself as the education unfolds */
      gsap.fromTo(
        ".journey-spine",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".journey",
            start: "top 65%",
            end: "bottom 75%",
            scrub: 0.8,
          },
        }
      );

      /* The education heading falls into view on its own */
      gsap.timeline({
        scrollTrigger: {
          trigger: ".journey-head-label",
          start: "top 82%",
          toggleActions: "play none none none",
        },
      }).from(".journey-head-label", {
        autoAlpha: 0,
        y: 14,
        duration: 0.5,
        ease: "power3.out",
      });

      gsap.utils.toArray<HTMLElement>(".journey-item").forEach((item) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        });

        tl.from(item.querySelector(".journey-dot"), {
          scale: 0,
          duration: 0.5,
          ease: "power3.out",
        }).from(
          item.querySelectorAll(
            ".journey-year, .edu-place, .edu-course, .edu-note"
          ),
          {
            autoAlpha: 0,
            y: 26,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.08,
          },
          "<0.08"
        );
      });

      /* Soft skills — one clean staggered rise */
      gsap.timeline({
        scrollTrigger: {
          trigger: ".soft-skills",
          start: "top 74%",
          toggleActions: "play none none none",
        },
      })
        .from(
          ".soft-skills .about-label",
          { autoAlpha: 0, y: 14, duration: 0.5, ease: "power3.out" },
          0
        )
        .from(
          ".soft-card",
          {
            autoAlpha: 0,
            y: 24,
            duration: 0.7,
            ease: "power3.out",
            stagger: 0.1,
          },
          0.1
        );

      /* Languages — three words, spelled large */
      gsap.timeline({
        scrollTrigger: {
          trigger: ".languages",
          start: "top 78%",
          toggleActions: "play none none none",
        },
      })
        .from(
          ".languages .about-label",
          { autoAlpha: 0, y: 14, duration: 0.5, ease: "power3.out" },
          0
        )
        .from(
          ".languages-list li",
          {
            autoAlpha: 0,
            y: 16,
            duration: 0.6,
            ease: "power3.out",
            stagger: 0.1,
          },
          0.12
        );

      /* Closing */
      gsap.timeline({
        scrollTrigger: {
          trigger: ".about-closing",
          start: "top 75%",
          toggleActions: "play none none none",
        },
      })
        .set(".about-closing-title", { visibility: "visible" }, 0)
        .fromTo(
          ".about-closing-title .line",
          { opacity: 0.1 },
          { opacity: 1, duration: 1, ease: "power4.out", stagger: 0.14 },
          "<"
        )
        .from(
          ".about-back",
          { autoAlpha: 0, y: 14, duration: 0.6, ease: "power3.out" },
          "<0.2"
        );
      }, root);

      cleanup = () => ctx.revert();
    };

    document.fonts.ready.then(build);

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div ref={rootRef}>
      <section className="about-prologue">
        <div className="about-scene">
          <div className="about-label">
            <span>The Person</span>
            <span className="about-rule" aria-hidden="true" />
          </div>

          <h1 className="about-title">
            <span className="about-title-line">
              <span className="about-title-line-inner">
                <span className="about-title-word">Based</span>{" "}
                <span className="about-title-word">in</span>{" "}
                <span className="about-title-word">Kathmandu.</span>
              </span>
            </span>
            <span className="about-title-line">
              <span className="about-title-line-inner">
                <span className="about-title-word">
                  <em>Learning</em>
                </span>{" "}
                <span className="about-title-word">by</span>{" "}
                <span className="about-title-word">building.</span>
              </span>
            </span>
          </h1>

          <p className="about-hint">( the person behind the build )</p>
        </div>
      </section>

      <section className="about-intro">
        <div className="about-label">
          <span>Prologue</span>
          <span className="about-rule" aria-hidden="true" />
        </div>
        <p
          className="about-intro-text"
          data-reveal-02="words"
          data-manual
        >
          I’m Mandeep Acharya — a computer-application student in Kathmandu,
          studying BCA at NCIT. Most of what I know about software I’ve
          learned by building: pages, scripts, small tools — and fixing them
          until they work. Between campus lectures and late-night tabs of
          documentation, I’m becoming a software developer.
        </p>
      </section>

      <section className="journey" aria-label="Education">
        <span className="journey-spine" aria-hidden="true" />
        <div className="about-label journey-head-label">
          <span>Education</span>
          <span className="about-rule" aria-hidden="true" />
        </div>

        <ol className="journey-list">
          {EDUCATION.map((edu) => (
            <li className="journey-item" key={edu.place}>
              <span className="journey-dot" aria-hidden="true" />
              <div className="journey-body">
                <p className="journey-year">
                  <span className="journey-year-decade">{edu.decade}</span>
                  {edu.year}
                </p>
                <p className="edu-place">{edu.place}</p>
                <p className="edu-course">{edu.course}</p>
                <p className="edu-note">{edu.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="soft-skills">
        <div className="about-label">
          <span>Beyond the code</span>
          <span className="about-rule" aria-hidden="true" />
        </div>

        <ul className="soft-grid">
          {SOFT_SKILLS.map((skill) => (
            <li className="soft-card" key={skill}>
              {skill}
            </li>
          ))}
        </ul>
      </section>

      <section className="languages">
        <div className="about-label">
          <span>Languages</span>
          <span className="about-rule" aria-hidden="true" />
        </div>

        <ul className="languages-list">
          {LANGUAGES.map((language) => (
            <li key={language}>{language}</li>
          ))}
        </ul>
      </section>

      <section className="about-closing">
        <h2 className="about-closing-title" data-reveal-02="lines" data-manual>
          The story keeps
          <br />
          writing <em>itself</em>.
        </h2>

        <Link className="about-back" href="/">
          ( Back to the work )
        </Link>
      </section>
    </div>
  );
}