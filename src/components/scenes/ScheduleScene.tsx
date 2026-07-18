"use client";

import { MascotMoment } from "@/components/mascot/MascotMoment";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { invitationConfig } from "@/config/invitation";
import { isScheduleComplete, type InvitationState } from "@/lib/state-machine";
import { SceneFrame } from "./SceneFrame";

const getToday = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export function ScheduleScene({
  state,
  onEvent,
}: {
  state: InvitationState;
  onEvent: (event: "BACK" | "NEXT" | "DATE" | "TIME" | "NOTE", value?: string) => void;
}) {
  const copy = invitationConfig.copy.schedule;
  const complete = isScheduleComplete(state);

  return (
    <SceneFrame variant="schedule" label={copy.label}>
      <div className="schedule-hero">
        <div className="scene-heading schedule-heading">
          <h1>{copy.title}</h1>
          <p className="scene-subtitle">{copy.subtitle}</p>
        </div>
        <MascotMoment mood="hunter" size="medium" align="right" priority />
      </div>

      <div className="schedule-form">
        <label className="field-label" htmlFor="date-input">{copy.dateLabel}</label>
        <input
          id="date-input"
          data-testid="date-input"
          type="date"
          min={getToday()}
          value={state.date}
          onChange={(event) => onEvent("DATE", event.target.value)}
        />

        <fieldset className="time-fieldset">
          <legend className="field-label">{copy.timeLabel}</legend>
          <div className="time-tickets">
            {invitationConfig.timeOptions.map((option) => {
              const selected = state.time === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  className={`time-ticket ${selected ? "is-selected" : ""}`}
                  data-testid={`time-${option.value.replace(":", "")}`}
                  aria-pressed={selected}
                  onClick={() => onEvent("TIME", option.value)}
                >
                  <strong>{option.label}</strong>
                  <span>{option.tagline}</span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <label className="field-label" htmlFor="note-input">{copy.noteLabel}</label>
        <textarea
          id="note-input"
          data-testid="note-input"
          value={state.note}
          maxLength={48}
          placeholder={copy.notePlaceholder}
          onChange={(event) => onEvent("NOTE", event.target.value)}
        />
      </div>

      {!complete ? <p className="validation-note">{copy.incomplete}</p> : null}
      <div className="schedule-actions">
        <ArchiveButton data-testid="schedule-next" disabled={!complete} onClick={() => onEvent("NEXT")}>{copy.next}</ArchiveButton>
        <ArchiveButton variant="plain" onClick={() => onEvent("BACK")}>← 返回上一步</ArchiveButton>
      </div>
    </SceneFrame>
  );
}
