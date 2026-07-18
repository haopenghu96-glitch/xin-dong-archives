import { normalizeFoodId } from "@/lib/food-migration";
import {
  createInitialState,
  isScheduleComplete,
  type DeclineStep,
  type InvitationPhase,
  type InvitationState,
} from "@/lib/state-machine";

export const INVITATION_STORAGE_KEY = "xin-dong:video-invitation-v2";

export type StorageLike = {
  getItem(key: string): string | null;
  removeItem(key: string): void;
  setItem(key: string, value: string): void;
};

export const getBrowserStorage = (target: {
  readonly localStorage?: StorageLike;
}): StorageLike | null => {
  try {
    return target.localStorage ?? null;
  } catch {
    return null;
  }
};

const invitationPhases = new Set<string>([
  "INTRO",
  "SECOND_CONFIRM",
  "SCHEDULE",
  "FOOD",
  "REVIEW",
  "SUBMITTING",
  "SUCCESS",
  "SERIOUS_CHOICE",
  "DECLINED",
]);

const phasesRequiringValidSchedule = new Set<InvitationPhase>([
  "FOOD",
  "REVIEW",
  "SUBMITTING",
]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isInvitationPhase = (value: unknown): value is InvitationPhase =>
  typeof value === "string" && invitationPhases.has(value);

const normalizeDeclineStep = (value: unknown): DeclineStep =>
  typeof value === "number" &&
  Number.isInteger(value) &&
  value >= 0 &&
  value <= 15
    ? (value as DeclineStep)
    : 0;

const decodeInvitationState = (raw: string): InvitationState | null => {
  let value: unknown;

  try {
    value = JSON.parse(raw);
  } catch {
    return null;
  }

  if (
    !isRecord(value) ||
    !isInvitationPhase(value.phase) ||
    typeof value.date !== "string" ||
    typeof value.time !== "string" ||
    typeof value.note !== "string"
  ) {
    return null;
  }

  const normalizedFoodId =
    value.foodId === null ? null : normalizeFoodId(value.foodId);
  if (value.foodId !== null && normalizedFoodId === null) return null;

  const state: InvitationState = {
    phase: value.phase,
    declineStep: normalizeDeclineStep(value.declineStep),
    date: value.date,
    time: value.time,
    note: value.note,
    foodId: normalizedFoodId,
  };

  if (
    phasesRequiringValidSchedule.has(state.phase) &&
    !isScheduleComplete(state)
  ) {
    return null;
  }

  return state;
};

export const parseInvitationState = (raw: string | null): InvitationState =>
  (raw === null ? null : decodeInvitationState(raw)) ?? createInitialState();

export const restoreInvitationState = (
  storage: StorageLike | null,
): InvitationState => {
  if (storage === null) return createInitialState();

  let raw: string | null;

  try {
    raw = storage.getItem(INVITATION_STORAGE_KEY);
  } catch {
    return createInitialState();
  }

  if (raw === null) return createInitialState();

  const restored = decodeInvitationState(raw);
  if (restored) {
    // A browser refresh cannot know whether an in-flight client-only submit completed.
    // Return to the explicit food confirmation step to avoid submitting twice.
    return restored.phase === "SUBMITTING"
      ? { ...restored, phase: "FOOD" }
      : restored;
  }

  try {
    storage.removeItem(INVITATION_STORAGE_KEY);
  } catch {
    // Storage may be unavailable or read-only. Falling back is sufficient.
  }

  return createInitialState();
};

export const persistInvitationState = (
  storage: StorageLike | null,
  state: InvitationState,
): void => {
  if (storage === null) return;

  try {
    storage.setItem(INVITATION_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Persistence is best-effort and must not interrupt the invitation flow.
  }
};
