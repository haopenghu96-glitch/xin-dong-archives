"use client";

import { motion, useReducedMotion } from "framer-motion";

export function ComicBurst({
  label,
  active = true,
  tone = "coral",
  testId,
}: {
  label: string;
  active?: boolean;
  tone?: "coral" | "blue" | "yellow";
  testId?: string;
}) {
  const reducedMotion = useReducedMotion();

  if (!active) return null;

  return (
    <motion.span
      className={`comic-burst comic-burst--${tone}`}
      data-testid={testId}
      aria-hidden="true"
      initial={reducedMotion ? false : { opacity: 0, scale: 0.55, rotate: -8 }}
      animate={{ opacity: 1, scale: 1, rotate: -3 }}
      transition={{ duration: reducedMotion ? 0.01 : 0.24, ease: "easeOut" }}
    >
      {label}
    </motion.span>
  );
}
