"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { DodgeComicBeat } from "@/components/mascot/DodgeComicBeat";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { invitationConfig } from "@/config/invitation";
import { getDodgePosition, type ElementSize } from "@/lib/decline-dodge";
import type { DeclineStep } from "@/lib/state-machine";
import { SceneFrame } from "./SceneFrame";

const DEFAULT_ARENA = { width: 328, height: 176 };
const DEFAULT_BUTTON = { width: 128, height: 54 };

export function IntroScene({
  declineStep,
  onApprove,
  onDecline,
}: {
  declineStep: DeclineStep;
  onApprove: () => void;
  onDecline: () => void;
}) {
  const [approving, setApproving] = useState(false);
  const [arenaSize, setArenaSize] = useState<ElementSize>(DEFAULT_ARENA);
  const [buttonSize, setButtonSize] = useState<ElementSize>(DEFAULT_BUTTON);
  const arenaRef = useRef<HTMLDivElement>(null);
  const declineButtonRef = useRef<HTMLButtonElement>(null);
  const approveTimerRef = useRef<number | null>(null);
  const lastDodgeAt = useRef(Number.NEGATIVE_INFINITY);
  const reducedMotion = useReducedMotion();
  const copy = invitationConfig.copy.intro;
  const declineCopy = copy.declineSteps[declineStep];
  const position = getDodgePosition(declineStep, arenaSize, buttonSize);

  const dodge = useCallback(() => {
    const now = performance.now();
    if (now - lastDodgeAt.current < 260) return;
    lastDodgeAt.current = now;
    onDecline();
  }, [onDecline]);

  useLayoutEffect(() => {
    const arena = arenaRef.current;
    const button = declineButtonRef.current;
    if (!arena || !button) return;

    const update = () => {
      setArenaSize({ width: arena.clientWidth, height: arena.clientHeight });
      setButtonSize({ width: button.offsetWidth, height: button.offsetHeight });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(arena);
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const button = declineButtonRef.current;
    if (!button) return;

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") dodge();
    };

    button.addEventListener("pointerenter", onPointerEnter);
    return () => button.removeEventListener("pointerenter", onPointerEnter);
  }, [dodge]);

  useEffect(() => () => {
    if (approveTimerRef.current !== null) window.clearTimeout(approveTimerRef.current);
  }, []);

  const approve = () => {
    if (approving) return;
    setApproving(true);
    approveTimerRef.current = window.setTimeout(onApprove, 280);
  };

  return (
    <SceneFrame variant="intro" label={copy.label}>
      <header className="intro-copy">
        <h1>{copy.title}</h1>
        <p className="scene-subtitle">{copy.subtitle}</p>
      </header>

      <DodgeComicBeat
        step={declineStep}
        note={declineStep === 0 ? copy.mascotNote : declineCopy.mascotNote}
      />

      <div className="decline-arena" ref={arenaRef} data-testid="decline-arena">
        <AnimatePresence>
          {declineStep > 0 ? (
            <motion.span
              key={declineStep}
              className="dodge-trail"
              data-testid="dodge-trail"
              aria-hidden="true"
              style={{ left: position.x, top: position.y }}
              initial={{ opacity: 0.9, scaleX: 0.4 }}
              animate={{ opacity: 0, scaleX: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.01 : 0.35 }}
            >
              · · ·
            </motion.span>
          ) : null}
        </AnimatePresence>
        <motion.button
          ref={declineButtonRef}
          type="button"
          className="decline-action"
          data-testid="decline-action"
          data-dodge-step={declineStep}
          data-dodge-position={declineStep % 12}
          aria-label={declineCopy.buttonLabel}
          onPointerDown={(event) => {
            if (event.pointerType === "touch" || event.pointerType === "pen") {
              event.preventDefault();
              dodge();
            }
          }}
          onClick={(event) => {
            if (event.detail === 0) dodge();
          }}
          initial={false}
          animate={{ x: position.x, y: position.y, rotate: position.rotate }}
          transition={reducedMotion
            ? { duration: 0.01 }
            : { type: "spring", stiffness: 480, damping: 30 }}
        >
          {declineCopy.buttonLabel}
        </motion.button>
      </div>

      <ArchiveButton
        data-testid="approve-action"
        className="approve-action"
        onClick={approve}
        disabled={approving}
      >
        {copy.approve}
      </ArchiveButton>
      {approving ? (
        <motion.span
          className="approval-heart"
          initial={{ scale: 0 }}
          animate={{ scale: 1.2 }}
          aria-hidden="true"
        >
          ♥
        </motion.span>
      ) : null}
    </SceneFrame>
  );
}
