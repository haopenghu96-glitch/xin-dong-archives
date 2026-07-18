import type { ReactNode } from "react";

type SceneFrameProps = {
  children?: ReactNode;
  variant?: string;
  className?: string;
  label?: string;
};

export function SceneFrame({ children, variant = "default", className = "", label }: SceneFrameProps) {
  return (
    <section className={`scene scene--${variant} ${className}`.trim()}>
      <span className="sticker-doodle sticker-doodle--heart" aria-hidden="true">♡</span>
      <span className="sticker-doodle sticker-doodle--star" aria-hidden="true">✦</span>
      <span className="sticker-tape sticker-tape--top" aria-hidden="true" />
      <span className="sticker-tape sticker-tape--side" aria-hidden="true" />
      <div className="scene-folder" aria-hidden="true" />
      <div className="scene-card">
        {label ? <span className="archive-label">{label}</span> : null}
        {children}
      </div>
    </section>
  );
}
