"use client";

import { MascotMoment } from "@/components/mascot/MascotMoment";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { invitationConfig } from "@/config/invitation";
import { SceneFrame } from "./SceneFrame";

export function SeriousChoiceScene({ onReturn, onDecline }: { onReturn: () => void; onDecline: () => void }) {
  const copy = invitationConfig.copy.decline;

  return (
    <SceneFrame variant="legacy" label={copy.label}>
      <div className="legacy-scene">
        <MascotMoment mood="serious" size="hero" note={copy.body} />
        <h1>{copy.title}</h1>
        <ArchiveButton onClick={onReturn}>{copy.return}</ArchiveButton>
        <ArchiveButton data-testid="decline-today" variant="secondary" onClick={onDecline}>{copy.today}</ArchiveButton>
      </div>
    </SceneFrame>
  );
}

export function DeclinedScene({ onReturn }: { onReturn: () => void }) {
  const copy = invitationConfig.copy.decline;

  return (
    <SceneFrame variant="legacy" label={copy.label}>
      <div className="legacy-scene">
        <MascotMoment mood="serious" size="hero" note={copy.saved} />
        <h1>本次邀请先放一放</h1>
        <ArchiveButton onClick={onReturn}>{copy.return}</ArchiveButton>
      </div>
    </SceneFrame>
  );
}
