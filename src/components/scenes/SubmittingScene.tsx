"use client";

import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { MascotMoment } from "@/components/mascot/MascotMoment";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { invitationConfig } from "@/config/invitation";
import { submitInvitation } from "@/lib/invitation-service";
import type { InvitationState } from "@/lib/state-machine";
import { SceneFrame } from "./SceneFrame";

type SubmissionResult = Awaited<ReturnType<typeof submitInvitation>>;

export function SubmittingScene({ state, onComplete }: { state: InvitationState; onComplete: () => void }) {
  const submissionRef = useRef<Promise<SubmissionResult> | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [hasError, setHasError] = useState(false);
  const copy = invitationConfig.copy.submitting;

  useEffect(() => {
    let active = true;
    const submission = submissionRef.current ??= submitInvitation({
      requestNo: invitationConfig.requestNo,
      date: state.date,
      time: state.time,
      note: state.note,
      foodId: state.foodId,
      submittedAt: new Date().toISOString(),
    });

    void submission.then(
      () => { if (active) onComplete(); },
      () => { if (active) setHasError(true); },
    );
    return () => { active = false; };
  }, [attempt, onComplete, state.date, state.foodId, state.note, state.time]);

  const retry = () => {
    submissionRef.current = null;
    setHasError(false);
    setAttempt((current) => current + 1);
  };

  return (
    <SceneFrame variant="submitting" label={copy.label}>
      {hasError ? (
        <div className="submission-error" role="alert">
          <MascotMoment mood="surprised" size="hero" />
          <h1>{copy.errorTitle}</h1>
          <p>{copy.errorBody}</p>
          <ArchiveButton data-testid="retry-submit" onClick={retry}>{copy.retry}</ArchiveButton>
        </div>
      ) : (
        <div className="submitting-content">
          <h1>{copy.title}</h1>
          <p>{copy.subtitle}</p>
          <div className="delivery-strip" role="img" aria-label="小猪依次出发、加速并送达约会申请">
            {["出发", "加速", "送达"].map((label, index) => (
              <div className="delivery-panel" key={label} aria-hidden="true">
                <Mascot mood="courier" className="delivery-panel__pig" animate={index === 1} priority={index === 0} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SceneFrame>
  );
}
