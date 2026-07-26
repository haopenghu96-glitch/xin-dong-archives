"use client";

import { useState } from "react";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { ComicBurst } from "@/components/ui/ComicBurst";
import { PlanSummaryCard } from "@/components/ui/PlanSummaryCard";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { invitationConfig } from "@/config/invitation";
import { createSharePlanUrl } from "@/lib/share-plan";
import type { InvitationState } from "@/lib/state-machine";
import { SceneFrame } from "./SceneFrame";

export function SuccessScene({ state, onRevisit }: { state: InvitationState; onRevisit: () => void }) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const copy = invitationConfig.copy.success;

  const sharePlan = async () => {
    const url = createSharePlanUrl(`${window.location.origin}${window.location.pathname}`, {
      date: state.date,
      time: state.time,
      activityId: state.foodId ?? "surprise",
    });

    try {
      if (navigator.share) {
        await navigator.share({ title: copy.title, text: "给你一份约会计划", url });
        setShareStatus("已打开分享面板");
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareStatus("链接已复制，快发给对方吧");
    } catch {
      setShareStatus("分享已取消，计划还好好保存在这里");
    }
  };

  return (
    <SceneFrame variant="success" label={copy.label}>
      <ComicBurst label="已批准" tone="coral" testId="approval-burst" />
      <PlanSummaryCard
        date={state.date}
        time={state.time}
        activityId={state.foodId ?? "surprise"}
        note={state.note}
        title={copy.title}
      />
      <p className="success-body">{copy.body}</p>
      <SpeechBubble tone="yellow">{copy.mascotNote}</SpeechBubble>
      <p className="success-copy" role={shareStatus ? "status" : undefined}>{shareStatus ?? copy.hint}</p>
      <div className="success-actions">
        <ArchiveButton data-testid="share-plan" onClick={() => void sharePlan()}>{copy.share}</ArchiveButton>
        <div className="text-actions">
          <ArchiveButton variant="plain" onClick={() => window.print()}>{copy.save}</ArchiveButton>
          <ArchiveButton variant="plain" onClick={onRevisit}>{copy.revisit}</ArchiveButton>
        </div>
      </div>
    </SceneFrame>
  );
}
