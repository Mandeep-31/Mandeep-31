"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { textReveal02 } from "./text-reveal-02";

gsap.registerPlugin(ScrollTrigger);

/* Prefer Lenis when SmoothScroll is active; fall back to native scrolling */
const scrollToTop = () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = (
    window as unknown as {
      __lenis?: { scrollTo: (t: number, o?: Record<string, unknown>) => void };
    }
  ).__lenis;
  if (lenis) {
    lenis.scrollTo(0, reduce ? { duration: 0 } : { duration: 1.8 });
  } else {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }
};

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const doorRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const doorFired = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /*
     * The horizon — a slowly breathing field of thin contour lines,
     * like ridgelines at night. Pure canvas: no images, no libraries.
     */
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    let last = 0;
    let t = Math.random() * 100;
    let px = 0.5;
    let py = 0.5;
    let tx = 0.5;
    let ty = 0.5;

    const LINES = 30;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const bump = (nx: number, ny: number) => {
      const g = Math.exp(-Math.pow((nx - px) / 0.09, 2));
      return Math.max(-26, Math.min(26, g * (ny - py) * h * 0.16));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const step = Math.max(5, w / 180);
      const ridge = Math.round(LINES * 0.55);
      /* A slow swell drifting across the field — the lines bunch into a
         living, mountain-like mass instead of uniform dunes */
      const swellX = 0.62 + Math.sin(t * 0.09) * 0.16;

      for (let i = 0; i < LINES; i++) {
        const ny = i / (LINES - 1);
        const env = Math.exp(-Math.pow((ny - 0.55) / 0.3, 2));
        ctx.lineWidth = i === ridge ? 1.4 : 1;
        ctx.strokeStyle = `rgba(244, 243, 240, ${i === ridge ? 0.38 : 0.04 + 0.12 * env})`;
        ctx.beginPath();

        for (let x = -step; x <= w + step; x += step) {
          const nx = x / w;
          const swell = 0.55 + 1.1 * Math.exp(-Math.pow((nx - swellX) / 0.3, 2));
          const y =
            ny * h +
            env *
              h *
              0.075 *
              swell *
              (Math.sin(nx * 4.2 + t * 0.26 + i * 0.34) * 0.55 +
                Math.sin(nx * 9.3 - t * 0.18 + i * 0.11) * 0.3 +
                Math.sin(nx * 2.2 + t * 0.12 + i * 0.57) * 0.42) +
            bump(nx, ny);
          if (x <= 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    };

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      t += dt;
      px += (tx - px) * 0.055;
      py += (ty - py) * 0.055;
      draw();
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (!raf && visible && !reduce) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    resize();

    const io = new IntersectionObserver((entries) => {
      visible = entries[0]?.isIntersecting ?? false;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw();
    });
    ro.observe(canvas);

    const fine = window.matchMedia("(pointer: fine)").matches;
    const onMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      tx = (event.clientX - rect.left) / rect.width;
      ty = (event.clientY - rect.top) / rect.height;
    };
    const onLeave = () => {
      tx = 0.5;
      ty = 0.5;
    };
    if (fine && !reduce) {
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
    }

    if (reduce) draw();

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const door = doorRef.current;
    if (!section || !door) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* The door lives outside the footer element, so these are queried
       directly — gsap.context's selector scoping would miss them */
    const mark = door.querySelector<HTMLElement>(".door-mark-inner");
    const hint = door.querySelector<HTMLElement>(".door-hint");
    const iris = door.querySelector<HTMLElement>(".door-iris");
    const d = door.querySelector<HTMLElement>(".door-d");

    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const build = () => {
      if (cancelled) return;

      /* Split the manual CTA, then fade its lines in from within the door
         timeline so the word stays locked to the door's choreography. */
      textReveal02(section);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });

        tl.from(".footer-label", {
          autoAlpha: 0,
          y: 14,
          duration: 0.5,
          ease: "power3.out",
        })
          .from(
            ".footer-rule",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.9,
              ease: "power3.out",
            },
            "<0.05"
          )
          .set(".footer-cta", { visibility: "visible" }, "<0.1")
          .fromTo(
            ".footer-cta .line",
            { opacity: 0.1 },
            {
              opacity: 1,
              duration: 1,
              ease: "power4.out",
              stagger: 0.14,
            },
            "<"
          )
          .from(
            ".footer-mail",
            { autoAlpha: 0, y: 18, duration: 0.7, ease: "power3.out" },
            "<0.2"
          )
          .from(
            ".footer-canvas",
            { autoAlpha: 0, duration: 1.6, ease: "power2.out" },
            "<0.1"
          )
          .from(
            mark,
            { yPercent: 58, duration: 1.1, ease: "power4.out" },
            "<0.1"
          )
          .from(".footer-meta", { autoAlpha: 0, duration: 0.6 }, "<0.3");

      if (!mark || !hint || !d || !iris) return;

      /*
       * The door. Scrolling past the footer opens the word outward from
       * the counter of the "d" — its hole grows exactly as the word grows
       * — until black covers the whole page, then the door routes to /about.
       */

      /*
       * Counter geometry for Geist 750 "d", measured by rasterizing the
       * glyph on canvas and centroid-finding its enclosed counter:
       * cx = 52% of the glyph box, cy = 56.2% of the font box.
       * Recalibrate if the wordmark font or weight ever changes.
       */
      const D_CX = 0.52;
      const D_CY = 0.5622;

      /* Layout offsets (offsetLeft/offsetTop) are relative to the nearest
         positioned ancestor — the mark itself, thanks to will-change — so
         they ignore transforms like the reveal's yPercent and never change
         with scroll, unlike getBoundingClientRect. */
      const counter = () => ({
        x: mark.offsetLeft + d.offsetLeft + d.offsetWidth * D_CX,
        y: mark.offsetTop + d.offsetTop + d.offsetHeight * D_CY,
      });

      /* Disc diameter kept a hair SMALLER than the d's counter so it lives
         entirely inside the hole — never spilling past the stroke during
         the zoom — and only exists to guarantee the final full-screen
         flood of black. */
      const discBase = () => d.offsetWidth * 0.36;

      /* Scale at which the disc reaches the farthest viewport corner from
         the counter — i.e. the hole of the d has opened over the whole page.
         The diagonal alone isn't enough: the counter sits off-center, so
         some corners are farther away than the viewport's diameter. */
      const floodScale = () => {
        const c = counter();
        const w = window.innerWidth;
        const h = window.innerHeight;
        const r = discBase() / 2;
        const maxCorner = Math.max(
          Math.hypot(c.x, c.y),
          Math.hypot(c.x - w, c.y),
          Math.hypot(c.x, c.y - h),
          Math.hypot(c.x - w, c.y - h),
        );
        return (maxCorner * 1.12) / r;
      };

      const doorTl = gsap.timeline({
        scrollTrigger: {
          trigger: door,
          start: "top top",
          end: "bottom bottom",
          /* 1:1 scrub maps scroll distance to timeline progress exactly —
             no lag to catch up, so the word can't run ahead of the scroll */
          scrub: true,
          invalidateOnRefresh: true,
          /* Navigation lives here, not in a timeline .call — a fast scroll
             jump suppresses timeline callbacks but onUpdate always fires */
          onUpdate: (self) => {
            if (self.progress >= 0.94 && !doorFired.current) {
              doorFired.current = true;
              router.push("/about");
            }
          },
        },
      });

      doorTl
        .set(
          mark,
          {
            /* transformOrigin is element-relative, the iris is stage-relative */
            transformOrigin: () => {
              const c = counter();
              return `${(c.x - mark.offsetLeft).toFixed(1)}px ${(
                c.y - mark.offsetTop
              ).toFixed(1)}px`;
            },
          },
          0
        )
        .set(
          iris,
          {
            width: () => discBase(),
            height: () => discBase(),
            left: () => counter().x - discBase() / 2,
            top: () => counter().y - discBase() / 2,
          },
          0
        )
        .fromTo(
          hint,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, duration: 0.06, immediateRender: false },
          0.02
        )
        .to(hint, { autoAlpha: 0, duration: 0.06 }, 0.1)
        /* One shared, linear window across the whole run: the word opens
           outward from the counter and its hole opens with it. Nothing
           accelerates mid-way — both are locked to the scroll, 1:1. */
        .to(mark, { scale: () => floodScale(), duration: 1, ease: "none" }, 0)
        .fromTo(
          iris,
          { scale: 0 },
          {
            scale: () => floodScale(),
            duration: 1,
            ease: "none",
            immediateRender: false,
          },
          0
        );
      }, section);

      cleanup = () => ctx.revert();
    };

    document.fonts.ready.then(build);

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, [router]);

  return (
    <>
      <footer ref={sectionRef} className="footer">
        <div className="footer-inner">
          <div className="footer-label">
            <span>03 — Contact</span>
            <span className="footer-rule" aria-hidden="true" />
          </div>

          <h2 className="footer-cta" data-reveal-02="lines" data-manual>
            Have an idea?
            <br />
            Let’s make it <em>move</em>.
          </h2>

          <a className="footer-mail" href="mailto:mandeepac31@gmail.com">
            mandeepac31@gmail.com <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className="footer-art" aria-hidden="true">
          <canvas ref={canvasRef} className="footer-canvas" />
        </div>

        <div className="footer-meta">
          <span>© 2026 — Mandeep</span>
          <span className="footer-meta-center">27° 42′ N — 85° 19′ E</span>
          <button className="footer-top" type="button" onClick={scrollToTop}>
            Back to top ↑
          </button>
        </div>
      </footer>

      <section ref={doorRef} className="door" aria-label="About Mandeep">
        <div className="door-stage">
          <p className="door-hint">( There is more — keep scrolling )</p>
          <div className="door-iris" aria-hidden="true" />
          <div className="door-mark" aria-hidden="true">
            <div className="door-mark-inner">
              Man<span className="door-d">d</span>eep
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
