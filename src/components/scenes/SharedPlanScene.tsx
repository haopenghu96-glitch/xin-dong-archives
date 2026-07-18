"use client";

import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { PlanSummaryCard } from "@/components/ui/PlanSummaryCard";
import { invitationConfig } from "@/config/invitation";
import type { SharePlan } from "@/lib/share-plan";
import { SceneFrame } from "./SceneFrame";

export function SharedPlanScene({ plan, onStartNew }: { plan: SharePlan; onStartNew: () => void }) {
  const copy = invitationConfig.copy.shared;

  return (
    <SceneFrame variant="shared" label={copy.label}>
      <PlanSummaryCard
        date={plan.date}
        time={plan.time}
        activityId={plan.activityId}
        title={copy.title}
        testId="shared-plan-card"
      />
      <p className="success-copy">{copy.hint}</p>
      <ArchiveButton onClick={onStartNew}>{copy.start}</ArchiveButton>
    </SceneFrame>
  );
}
