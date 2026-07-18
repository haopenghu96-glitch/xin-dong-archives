import { ComicBurst } from "@/components/ui/ComicBurst";
import {
  getDeclineComicStage,
  getDeclineMascotMood,
} from "@/lib/decline-dodge";
import type { DeclineStep } from "@/lib/state-machine";
import { MascotMoment } from "./MascotMoment";

const burstByStage = {
  idle: "",
  ready: "咻",
  lunge: "等等！",
  miss: "扑空！",
} as const;

export function DodgeComicBeat({
  step,
  note,
}: {
  step: DeclineStep;
  note: string;
}) {
  const stage = getDeclineComicStage(step);
  const mood = getDeclineMascotMood(step);

  return (
    <div className={`dodge-comic dodge-comic--${stage}`} data-chase-phase={stage}>
      <MascotMoment
        mood={mood}
        note={note}
        size="large"
        align="right"
        live
        testId="decline-aside"
        priority
      />
      <ComicBurst
        label={burstByStage[stage]}
        active={stage !== "idle"}
        tone={stage === "lunge" ? "blue" : "coral"}
        testId="decline-sfx"
      />
    </div>
  );
}
