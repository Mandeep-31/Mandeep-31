/*
 * Placeholder asset — a temporary cinematic sky photograph
 * (source: unsplash photo-1517685352821-92cf88aee5a5).
 * Swap this one constant when the real visual object is ready.
 */
const HERO_IMAGE = "/hero-sky.jpg";

export default function ExpandingVisual() {
  return (
    <div className="visual-frame">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className="visual-img"
        src={HERO_IMAGE}
        alt="Dramatic sky with large soft clouds"
        draggable={false}
        loading="eager"
        fetchPriority="high"
      />

      <div className="visual-caption">
        <p className="visual-eyebrow">Kathmandu, Nepal</p>
        <h2 className="visual-claim">
          <span className="visual-claim-line">
            <span className="visual-claim-line-inner">Under this sky,</span>
          </span>
          <span className="visual-claim-line">
            <span className="visual-claim-line-inner">
              <em>I build.</em>
            </span>
          </span>
        </h2>
        <p className="visual-sub">( where the ideas start )</p>
      </div>

      <p className="visual-note">01 — Keep Looking</p>
    </div>
  );
}