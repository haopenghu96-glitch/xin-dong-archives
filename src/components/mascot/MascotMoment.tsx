import type { MascotMood } from "@/config/invitation";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { Mascot } from "./Mascot";

export function MascotMoment({
  mood,
  note,
  size = "large",
  align = "center",
  live = false,
  testId,
  priority = false,
}: {
  mood: MascotMood;
  note?: string;
  size?: "medium" | "large" | "hero";
  align?: "left" | "center" | "right";
  live?: boolean;
  testId?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={`mascot-moment mascot-moment--${size} mascot-moment--${align}`}
      data-testid={testId}
      data-mood={mood}
    >
      <Mascot mood={mood} className="mascot-moment__art" priority={priority} />
      {note ? <SpeechBubble live={live}>{note}</SpeechBubble> : null}
    </div>
  );
}
