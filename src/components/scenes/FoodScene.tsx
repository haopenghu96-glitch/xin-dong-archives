"use client";

import { MascotMoment } from "@/components/mascot/MascotMoment";
import { ArchiveButton } from "@/components/ui/ArchivePrimitives";
import { FoodChoiceCard } from "@/components/ui/FoodChoiceCard";
import { SpeechBubble } from "@/components/ui/SpeechBubble";
import { invitationConfig, type FoodId } from "@/config/invitation";
import { SceneFrame } from "./SceneFrame";

export function FoodScene({
  selected,
  onSelect,
  onBack,
  onSubmit,
}: {
  selected: FoodId | null;
  onSelect: (food: FoodId) => void;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const copy = invitationConfig.copy.food;
  const selectedOption = invitationConfig.foodOptions.find((food) => food.id === selected);

  return (
    <SceneFrame variant="food" label={copy.label}>
      <div className="food-hero">
        <div className="scene-heading food-heading">
          <h1>{copy.title}</h1>
          <p className="scene-subtitle">{copy.subtitle}</p>
        </div>
        <MascotMoment mood="chef" size="medium" align="right" priority />
      </div>

      <div className="food-grid">
        {invitationConfig.foodOptions.map((food) => (
          <FoodChoiceCard
            key={food.id}
            food={food}
            selected={selected === food.id}
            onSelect={() => onSelect(food.id)}
          />
        ))}
      </div>

      <SpeechBubble tone="mint" live testId="selection-feedback">
        {selectedOption?.feedback ?? copy.emptyFeedback}
      </SpeechBubble>

      <div className="food-actions">
        <ArchiveButton data-testid="submit-plan" disabled={!selected} onClick={onSubmit}>{copy.submit}</ArchiveButton>
        <ArchiveButton variant="plain" onClick={onBack}>← 返回改时间</ArchiveButton>
      </div>
    </SceneFrame>
  );
}
