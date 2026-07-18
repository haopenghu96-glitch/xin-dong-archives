import { invitationConfig, type FoodId } from "@/config/invitation";

export type InvitationPhase =
  | "INTRO"
  | "SECOND_CONFIRM"
  | "SCHEDULE"
  | "FOOD"
  | "REVIEW"
  | "SUBMITTING"
  | "SUCCESS"
  | "SERIOUS_CHOICE"
  | "DECLINED";

export type DeclineStep =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15;

export type InvitationState = {
  phase: InvitationPhase;
  declineStep: DeclineStep;
  date: string;
  time: string;
  note: string;
  foodId: FoodId | null;
};

export type InvitationEvent =
  | { type: "APPROVE" }
  | { type: "CONFIRM_APPROVAL" }
  | { type: "DECLINE_PLAY" }
  | { type: "DECLINE_NOW" }
  | { type: "DECLINE_FOR_TODAY" }
  | { type: "RETURN_TO_INVITATION" }
  | { type: "SET_DATE"; date: string }
  | { type: "SET_TIME"; time: string }
  | { type: "SET_NOTE"; note: string }
  | { type: "CONTINUE_TO_FOOD" }
  | { type: "SELECT_FOOD"; foodId: FoodId }
  | { type: "CONTINUE_TO_REVIEW" }
  | { type: "BACK_TO_CONFIRM" }
  | { type: "BACK_TO_SCHEDULE" }
  | { type: "BACK_TO_FOOD" }
  | { type: "SUBMIT" }
  | { type: "SUBMIT_COMPLETE" }
  | { type: "RESET" };

export const createInitialState = (): InvitationState => ({
  phase: "INTRO",
  declineStep: 0,
  date: "",
  time: "",
  note: "",
  foodId: null,
});

export const nextDeclineStep = (step: DeclineStep): DeclineStep =>
  step >= 15 ? 12 : ((step + 1) as DeclineStep);

const scheduleDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

export const isValidScheduleDate = (value: string, today: Date): boolean => {
  const match = scheduleDatePattern.exec(value);
  if (!match || Number.isNaN(today.getTime())) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const candidate = new Date(0);
  candidate.setFullYear(year, month - 1, day);
  candidate.setHours(0, 0, 0, 0);

  if (
    candidate.getFullYear() !== year ||
    candidate.getMonth() !== month - 1 ||
    candidate.getDate() !== day
  ) {
    return false;
  }

  const startOfToday = new Date(today);
  startOfToday.setHours(0, 0, 0, 0);

  return candidate.getTime() >= startOfToday.getTime();
};

export const isAllowedScheduleTime = (value: string): boolean =>
  invitationConfig.timeOptions.some((option) => option.value === value);

export const isScheduleComplete = (
  state: InvitationState,
  today: Date = new Date(),
): boolean =>
  isValidScheduleDate(state.date, today) && isAllowedScheduleTime(state.time);

export const transition = (state: InvitationState, event: InvitationEvent): InvitationState => {
  switch (event.type) {
    case "RESET":
      return createInitialState();
    case "APPROVE":
      return state.phase === "INTRO" ? { ...state, phase: "SECOND_CONFIRM" } : state;
    case "CONFIRM_APPROVAL":
      return state.phase === "SECOND_CONFIRM" ? { ...state, phase: "SCHEDULE" } : state;
    case "DECLINE_PLAY": {
      if (state.phase !== "INTRO") return state;
      return { ...state, declineStep: nextDeclineStep(state.declineStep) };
    }
    case "DECLINE_FOR_TODAY":
    case "DECLINE_NOW":
      return state.phase === "SERIOUS_CHOICE" ? { ...state, phase: "DECLINED" } : state;
    case "RETURN_TO_INVITATION":
      return state.phase === "SECOND_CONFIRM" || state.phase === "SERIOUS_CHOICE" || state.phase === "DECLINED" || state.phase === "SCHEDULE"
        ? { ...state, phase: "INTRO", declineStep: 0 }
        : state;
    case "SET_DATE":
      return state.phase === "SCHEDULE" ? { ...state, date: event.date } : state;
    case "SET_TIME":
      return state.phase === "SCHEDULE" ? { ...state, time: event.time } : state;
    case "SET_NOTE":
      return state.phase === "SCHEDULE" ? { ...state, note: event.note } : state;
    case "CONTINUE_TO_FOOD":
      return state.phase === "SCHEDULE" && isScheduleComplete(state)
        ? { ...state, phase: "FOOD" }
        : state;
    case "SELECT_FOOD":
      return state.phase === "FOOD" ? { ...state, foodId: event.foodId } : state;
    case "CONTINUE_TO_REVIEW":
      return state.phase === "FOOD" && state.foodId ? { ...state, phase: "REVIEW" } : state;
    case "BACK_TO_CONFIRM":
      return state.phase === "SCHEDULE" ? { ...state, phase: "SECOND_CONFIRM" } : state;
    case "BACK_TO_SCHEDULE":
      return state.phase === "FOOD" ? { ...state, phase: "SCHEDULE" } : state;
    case "BACK_TO_FOOD":
      return state.phase === "REVIEW" ? { ...state, phase: "FOOD" } : state;
    case "SUBMIT":
      return (state.phase === "FOOD" && state.foodId) || state.phase === "REVIEW" ? { ...state, phase: "SUBMITTING" } : state;
    case "SUBMIT_COMPLETE":
      return state.phase === "SUBMITTING" ? { ...state, phase: "SUCCESS" } : state;
    default:
      return state;
  }
};
