import type { ReactNode } from "react";

export function SpeechBubble({
  children,
  tone = "cream",
  live = false,
  className = "",
  testId,
}: {
  children?: ReactNode;
  tone?: "cream" | "mint" | "yellow" | "blue" | "lavender";
  live?: boolean;
  className?: string;
  testId?: string;
}) {
  return (
    <p
      className={`speech-bubble speech-bubble--${tone} ${className}`.trim()}
      role={live ? "status" : undefined}
      aria-live={live ? "polite" : undefined}
      data-testid={testId}
    >
      {children}
    </p>
  );
}
