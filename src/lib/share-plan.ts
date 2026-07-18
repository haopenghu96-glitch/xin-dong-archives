import { invitationConfig } from "../config/invitation";
import { normalizeActivityId } from "./food-migration";

export type SharePlan = {
  date: string;
  time: string;
  activityId: string;
};

const MAX_ENCODED_PLAN_LENGTH = 1024;
const MAX_DATE_LENGTH = 10;
const MAX_TIME_LENGTH = 5;
const MAX_ACTIVITY_LENGTH = 32;

const allowedTimes = new Set<string>(invitationConfig.timeOptions.map((option) => option.value));

const encodeBase64Url = (value: string) => {
  const bytes = new TextEncoder().encode(value);
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
};

const decodeBase64Url = (value: string) => {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
};

const isValidDate = (value: string) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (year < 1 || month < 1 || month > 12) return false;

  const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [31, isLeapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  return day >= 1 && day <= daysInMonth[month - 1];
};

const decodeSharePlan = (value: unknown): SharePlan | null => {
  if (!value || typeof value !== "object") return null;
  const plan = value as Record<string, unknown>;

  if (
    typeof plan.date !== "string" ||
    typeof plan.time !== "string" ||
    typeof plan.activityId !== "string"
  ) {
    return null;
  }

  if (
    plan.date.length === 0 ||
    plan.date.length > MAX_DATE_LENGTH ||
    plan.time.length === 0 ||
    plan.time.length > MAX_TIME_LENGTH ||
    plan.activityId.length === 0 ||
    plan.activityId.length > MAX_ACTIVITY_LENGTH
  ) {
    return null;
  }

  const activityId = normalizeActivityId(plan.activityId);
  if (
    !activityId ||
    !isValidDate(plan.date) ||
    !allowedTimes.has(plan.time)
  ) {
    return null;
  }

  return {
    date: plan.date,
    time: plan.time,
    activityId,
  };
};

export const createSharePlanUrl = (origin: string, plan: SharePlan) => {
  const url = new URL("/", origin);
  url.searchParams.set("plan", encodeBase64Url(JSON.stringify(plan)));

  return url.toString();
};

export const parseSharePlan = (encodedPlan: string | null): SharePlan | null => {
  if (
    !encodedPlan ||
    encodedPlan.length > MAX_ENCODED_PLAN_LENGTH ||
    !/^[A-Za-z0-9_-]+$/.test(encodedPlan) ||
    encodedPlan.length % 4 === 1
  ) {
    return null;
  }

  try {
    const plan = JSON.parse(decodeBase64Url(encodedPlan));
    return decodeSharePlan(plan);
  } catch {
    return null;
  }
};
