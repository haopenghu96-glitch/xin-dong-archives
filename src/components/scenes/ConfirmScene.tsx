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
      <div className="confirm-panels" aria-label="小猪从装镇定到惊喜的两格漫画">
        <div className="comic-panel">
          <Mascot mood="serious" className="comic-panel__mascot" animate={false} />
          <span aria-hidden="true">第一格：装镇定</span>
        </div>
        <motion.div
          className="comic-panel comic-panel--surprise"
          animate={confirmed && !reducedMotion ? { rotate: [-1, 2, 0], scale: [1, 1.04, 1] } : undefined}
        >
          <Mascot mood="surprised" className="comic-panel__mascot" animate={false} priority />
          <span aria-hidden="true">第二格：心里放烟花</span>
          <ComicBurst label="真的？！" tone="yellow" />
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
