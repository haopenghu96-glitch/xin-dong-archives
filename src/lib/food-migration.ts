export const CURRENT_FOOD_IDS = [
  "hotpot",
  "sushi",
  "bbq",
  "hunan",
  "western",
  "dessert",
  "coffee",
  "snacks",
  "surprise",
] as const;

export type CurrentFoodId = (typeof CURRENT_FOOD_IDS)[number];

export const LEGACY_ACTIVITY_IDS = ["dinner", "walk", "exhibit"] as const;

export type LegacyActivityId = (typeof LEGACY_ACTIVITY_IDS)[number];

const currentFoodIds = new Set<string>(CURRENT_FOOD_IDS);
const legacyActivityIds = new Set<string>(LEGACY_ACTIVITY_IDS);

const LEGACY_FOOD_ID_MAP: Readonly<Record<string, CurrentFoodId>> = {
  pizza: "western",
  "dim-sum": "snacks",
  ramen: "snacks",
  mala: "hunan",
  crayfish: "hunan",
  skewers: "snacks",
};

export const normalizeFoodId = (value: unknown): CurrentFoodId | null => {
  if (typeof value !== "string") return null;
  if (currentFoodIds.has(value)) return value as CurrentFoodId;
  return Object.hasOwn(LEGACY_FOOD_ID_MAP, value)
    ? LEGACY_FOOD_ID_MAP[value]
    : null;
};

export const normalizeActivityId = (
  value: unknown,
): CurrentFoodId | LegacyActivityId | null => {
  const foodId = normalizeFoodId(value);
  if (foodId) return foodId;

  return typeof value === "string" && legacyActivityIds.has(value)
    ? (value as LegacyActivityId)
    : null;
};
