"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Mascot } from "@/components/mascot/Mascot";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { ComicBurst } from "@/components/ui/ComicBurst";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { invitationConfig } from "@/config/invitation";
import { SceneFrame } from "./SceneFrame";

export function ConfirmScene({ onConfirm, onSlip }: { onConfirm: () => void; onSlip: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  const timerRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();
  const copy = invitationConfig.copy.confirm;

  useEffect(() => () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
  }, []);

  const confirm = () => {
    if (confirmed) return;
    setConfirmed(true);
    timerRef.current = window.setTimeout(onConfirm, 280);
  };

  return (
    <SceneFrame variant="confirm" label={copy.label}>
      <header className="scene-heading confirm-heading">
        <h1>{copy.title}</h1>
        <p className="scene-subtitle">{copy.subtitle}</p>
      </header>
      <div className="confirm-reaction" aria-label="猫猫嘴上装作镇定，心里已经悄悄开心起来">
        <motion.div
          className="reaction-beat reaction-beat--calm"
          initial={reducedMotion ? false : { opacity: 0, x: -10, y: 5 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: reducedMotion ? 0.01 : 0.36, ease: "easeOut" }}
        >
          <span className="reaction-line">{copy.calmLine}</span>
          <Mascot mood="serious" className="comic-panel__mascot" animate={false} />
        </motion.div>
        <motion.span
          className="reaction-trail"
          aria-hidden="true"
          initial={reducedMotion ? false : { opacity: 0, scaleX: 0.55 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: reducedMotion ? 0 : 0.2, duration: reducedMotion ? 0.01 : 0.34 }}
        >
          · · · ♡
        </motion.span>
        <motion.div
          className="reaction-beat reaction-beat--surprise"
          initial={reducedMotion ? false : { opacity: 0, x: 12, y: 8, scale: 0.96 }}
          animate={confirmed && !reducedMotion
            ? { opacity: 1, x: 0, y: [0, -5, 0], scale: [1, 1.045, 1] }
            : { opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={confirmed && !reducedMotion
            ? { duration: 0.38, ease: "easeOut" }
            : { delay: reducedMotion ? 0 : 0.28, duration: reducedMotion ? 0.01 : 0.4, ease: "easeOut" }}
        >
          <span className="reaction-line reaction-line--happy">{copy.happyLine}</span>
          <Mascot mood="surprised" className="comic-panel__mascot" animate={false} priority />
          <ComicBurst label="尾巴先开心了" tone="yellow" />
          <motion.span
            className="reaction-heart"
            aria-hidden="true"
            animate={confirmed && !reducedMotion ? { opacity: [0, 1, 0], y: [4, -14, -22], scale: [0.7, 1.08, 0.9] } : { opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          >
            ♥
          </motion.span>
        </motion.div>
      </div>
      <SpeechBubble>{copy.mascotNote}</SpeechBubble>
      <div className="stacked-actions">
        <ArchiveButton data-testid="confirm-approval" onClick={confirm} disabled={confirmed}>{copy.approve}</ArchiveButton>
        <ArchiveButton variant="plain" onClick={onSlip}>{copy.slip}</ArchiveButton>
      </div>
    </SceneFrame>
  );
}
