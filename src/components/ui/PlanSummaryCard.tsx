import type { ReactNode } from "react";
import { Mascot } from "@/components/mascot/Mascot";
import { getActivityLabel, getTimeLabel } from "@/config/invitation";
import { HeartRow } from "./ArchivePrimitives";

export function PlanSummaryCard({
  date,
  time,
  activityId,
  note,
  title,
  testId,
}: {
  date: string;
  time: string;
  activityId: string;
  note?: string;
  title: ReactNode;
  testId?: string;
}) {
  return (
    <div className="result-card-shell">
      <div className="result-card__heading">
        <div>
          <span className="result-card__eyebrow">DATE REQUEST · APPROVED</span>
          <h1>{title}</h1>
          <HeartRow active={5} />
        </div>
        <Mascot mood="cool" className="result-mascot" animate={false} priority />
      </div>
      <article className="plan-summary" data-testid={testId}>
        <div><span>DATE</span><strong>{date.replaceAll("-", ".")}</strong></div>
        <div><span>TIME</span><strong>{getTimeLabel(time)}</strong></div>
        <div><span>MENU</span><strong>{getActivityLabel(activityId)}</strong></div>
        <div><span>NOTE</span><strong>{note || "到时候见"}</strong></div>
      </article>
    </div>
  );
}
