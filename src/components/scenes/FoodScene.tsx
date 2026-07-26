"use client";

import { useEffect, useRef, useState } from "react";
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
  const [previewedId, setPreviewedId] = useState<FoodId | null>(null);
  const [isPickingForYou, setIsPickingForYou] = useState(false);
  const pickTimerRef = useRef<number | null>(null);
  const settleTimerRef = useRef<number | null>(null);
  const surpriseRoundRef = useRef(0);

  useEffect(() => () => {
    if (pickTimerRef.current !== null) window.clearInterval(pickTimerRef.current);
    if (settleTimerRef.current !== null) window.clearTimeout(settleTimerRef.current);
  }, []);

  const chooseForMe = () => {
    if (isPickingForYou) return;

    const { order, stepMs, settleMs } = invitationConfig.surprisePicker;
    const startIndex = (surpriseRoundRef.current * 3 + 1) % order.length;
    const steps = order.length + 4;
    let step = 0;
    surpriseRoundRef.current += 1;
    setIsPickingForYou(true);
    setPreviewedId(order[startIndex]);

    pickTimerRef.current = window.setInterval(() => {
      step += 1;
      const nextId = order[(startIndex + step) % order.length];
      setPreviewedId(nextId);

      if (step >= steps) {
        window.clearInterval(pickTimerRef.current ?? undefined);
        pickTimerRef.current = null;
        onSelect(nextId);
        settleTimerRef.current = window.setTimeout(() => {
          setPreviewedId(null);
          setIsPickingForYou(false);
        }, settleMs);
      }
    }, stepMs);
  };

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
            previewed={previewedId === food.id}
            isSurprise={food.id === "surprise"}
            disabled={isPickingForYou}
            onSelect={() => food.id === "surprise" ? chooseForMe() : onSelect(food.id)}
          />
        ))}
      </div>

      <SpeechBubble tone="mint" live testId="selection-feedback">
        {isPickingForYou ? copy.surprisePicking : selectedOption?.feedback ?? copy.emptyFeedback}
      </SpeechBubble>

      <div className="food-actions">
        <ArchiveButton data-testid="submit-plan" disabled={!selected} onClick={onSubmit}>{copy.submit}</ArchiveButton>
        <ArchiveButton variant="plain" onClick={onBack}>← 返回改时间</ArchiveButton>
      </div>
    </SceneFrame>
  );
}
