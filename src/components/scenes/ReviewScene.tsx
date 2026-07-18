"use client";

import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { PlanSummaryCard } from "@/components/ui/PlanSummaryCard";
import { invitationConfig } from "@/config/invitation";
import type { InvitationState } from "@/lib/state-machine";
import { SceneFrame } from "./SceneFrame";

export function ReviewScene({ state, onBack, onSubmit }: { state: InvitationState; onBack: () => void; onSubmit: () => void }) {
  const copy = invitationConfig.copy.review;

  return (
    <SceneFrame variant="legacy" label={copy.label}>
      <PlanSummaryCard
        date={state.date}
        time={state.time}
        activityId={state.foodId ?? "surprise"}
        note={state.note}
        title={copy.title}
      />
      <p className="scene-subtitle">{copy.subtitle}</p>
      <div className="legacy-actions">
        <ArchiveButton data-testid="submit-invitation" onClick={onSubmit}>{copy.submit}</ArchiveButton>
        <ArchiveButton variant="plain" onClick={onBack}>← 返回修改</ArchiveButton>
      </div>
    </SceneFrame>
  );
}
