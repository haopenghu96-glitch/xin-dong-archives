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
  onSelect,
}: {
  food: FoodOption;
  selected: boolean;
  onSelect: () => void;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      data-testid={`food-${food.id}`}
      className={`food-choice food-choice--${food.tone} ${selected ? "is-selected" : ""}`.trim()}
      aria-pressed={selected}
      onClick={onSelect}
      whileTap={reducedMotion ? undefined : { scale: 0.96 }}
      animate={{ y: reducedMotion ? 0 : selected ? -4 : 0 }}
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
