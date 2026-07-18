"use client";

import type { ComponentProps, ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type ArchiveButtonProps = Omit<ComponentProps<typeof motion.button>, "children"> & {
  variant?: "primary" | "secondary" | "plain";
  children: ReactNode;
};

export function ArchiveButton({ variant = "primary", className = "", children, ...props }: ArchiveButtonProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      whileTap={reducedMotion ? undefined : { scale: 0.96, x: 1, y: 2 }}
      className={`archive-button archive-button--${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function HeartRow({ active = 5 }: { active?: number }) {
  return (
    <div className="heart-row" aria-label={`${active} 颗心已点亮`}>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} aria-hidden="true" className={index < active ? "is-active" : ""}>♥</span>
      ))}
    </div>
  );
}
