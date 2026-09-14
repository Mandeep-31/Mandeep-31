"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/*
 * Placeholder projects — the scenery images carry the mood while the real
 * work is in the build. Swap names, tags, years and descriptions (and the
 * /public images) when the real projects are ready.
 */
const PROJECTS = [
  {
    index: "01",
    title: "Project 01",
    tags: "Placeholder",
    year: "2026",
    image: "work-kaag.jpg",
    alt: "Black sand texture with faint natural patterns",
  },
  {
    index: "02",
    title: "Project 02",
    tags: "Placeholder",
    year: "2026",
    image: "work-himal.jpg",
    alt: "Snowy mountain ridges under a starry night sky",
  },
  {
    index: "03",
    title: "Project 03",
    tags: "Placeholder",
    year: "2026",
    image: "work-prana.jpg",
    alt: "Calm ocean swell in soft teal light",
  },
  {
    index: "04",
    title: "Project 04",
    tags: "Placeholder",
    year: "2026",
    image: "work-yatra.jpg",
    alt: "Moody sea at dusk under a clouded sunset",
  },
];

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".work-item").forEach((item) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        });

        tl.from(item.querySelector(".work-media"), {
          clipPath: "inset(14% 8% 14% 8%)",
          duration: 1.1,
          ease: "power3.out",
        })
          .from(
            item.querySelector(".work-par"),
            { scale: 1.12, duration: 1.1, ease: "power3.out" },
            0
          )
          .from(
            item.querySelector(".work-meta"),
            { autoAlpha: 0, y: 18, duration: 0.6, ease: "power3.out" },
            0.35
          );
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="work" id="work">
      <div className="work-head">
        <span>02 — Selected Work</span>
        <span className="work-rule" aria-hidden="true" />
        <span className="work-count">( 04 )</span>
      </div>

      <ul className="work-list">
        {PROJECTS.map((project) => (
          <li className="work-item" key={project.index}>
            <a className="work-link" href="#" aria-label={`${project.title} — ${project.tags}`}>
              <figure className="work-media">
                <div className="work-par">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="work-img"
                    src={project.image}
                    alt={project.alt}
                    loading="lazy"
                    draggable={false}
                  />
                </div>
              </figure>

              <div className="work-meta">
                <span className="work-index">( {project.index} )</span>
                <h3 className="work-title">{project.title}</h3>
                <span className="work-tags">{project.tags}</span>
                <span className="work-year">{project.year}</span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}