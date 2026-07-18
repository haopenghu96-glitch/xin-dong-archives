"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
  invitationConfig,
  type MascotMood,
} from "@/config/invitation";

type MascotAsset = (typeof invitationConfig.mascots)[MascotMood];

function MascotArtwork({
  mascot,
  priority,
}: {
  mascot: MascotAsset;
  priority: boolean;
}) {
  const [currentSrc, setCurrentSrc] = useState<string>(mascot.src);

  return (
    <Image
      src={currentSrc}
      alt={mascot.alt}
      fill
      sizes="(max-width: 480px) 52vw, 240px"
      priority={priority}
      onError={() => {
        if (currentSrc !== mascot.fallbackSrc) {
          setCurrentSrc(mascot.fallbackSrc);
        }
      }}
    />
  );
}

export function Mascot({
  mood,
  className = "",
  priority = false,
  animate = true,
}: {
  mood: MascotMood;
  className?: string;
  priority?: boolean;
  animate?: boolean;
}) {
  const reducedMotion = useReducedMotion();
  const mascot = invitationConfig.mascots[mood];

  return (
    <motion.div
      className={`mascot ${className}`.trim()}
      data-mood={mood}
      initial={false}
      animate={animate && !reducedMotion ? { y: [0, -3, 0] } : { y: 0 }}
      transition={
        animate && !reducedMotion
          ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
          : { duration: 0.01 }
      }
    >
      <MascotArtwork key={mascot.src} mascot={mascot} priority={priority} />
    </motion.div>
  );
}
