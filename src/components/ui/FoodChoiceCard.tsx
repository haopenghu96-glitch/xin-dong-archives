"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import type { FoodOption } from "@/config/invitation";
import { FoodIcon } from "./FoodIcon";

function FoodChoiceArtwork({ food }: { food: FoodOption }) {
  const [failed, setFailed] = useState(false);

  return failed ? (
    <FoodIcon name={food.fallbackIcon} />
  ) : (
    <Image
      src={food.imageSrc}
      alt=""
      fill
      sizes="110px"
      onError={() => setFailed(true)}
    />
  );
}

export function FoodChoiceCard({
  food,
  selected,
  previewed = false,
  isSurprise = false,
  disabled = false,
  onSelect,
}: {
  food: FoodOption;
  selected: boolean;
  previewed?: boolean;
  isSurprise?: boolean;
  disabled?: boolean;
  onSelect: () => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      data-testid={`food-${food.id}`}
      data-previewed={previewed}
      className={`food-choice food-choice--${food.tone} ${selected ? "is-selected" : ""} ${previewed ? "is-previewed" : ""} ${isSurprise ? "food-choice--surprise" : ""}`.trim()}
      aria-pressed={selected}
      aria-label={isSurprise ? "交给猫猫挑选" : undefined}
      disabled={disabled}
      onClick={onSelect}
      whileTap={reducedMotion ? undefined : { scale: 0.96 }}
      animate={{ y: reducedMotion ? 0 : selected ? -4 : previewed ? -6 : 0, scale: reducedMotion ? 1 : previewed ? 1.04 : 1 }}
    >
      <span className="food-choice__image" aria-hidden="true">
        <FoodChoiceArtwork key={food.imageSrc} food={food} />
      </span>
      <strong>{food.label}</strong>
      <small>{food.tagline}</small>
      {selected ? <span className="food-choice__stamp">就它了！</span> : null}
    </motion.button>
  );
}
