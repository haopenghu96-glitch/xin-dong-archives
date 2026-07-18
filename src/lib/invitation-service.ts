import type { InvitationState } from "@/lib/state-machine";

export type InvitationPayload = Pick<InvitationState, "date" | "time" | "note" | "foodId"> & {
  requestNo: string;
  submittedAt: string;
};

export interface InvitationService {
  submitInvitation(payload: InvitationPayload): Promise<{ id: string }>;
}

export class LocalInvitationAdapter implements InvitationService {
  async submitInvitation(payload: InvitationPayload): Promise<{ id: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1650));
    const id = `local-${Date.now()}`;
    if (typeof window !== "undefined") {
      window.localStorage.setItem("xin-dong:latest-plan", JSON.stringify({ ...payload, id }));
    }
    return { id };
  }
}

export const submitInvitation = (payload: InvitationPayload) =>
  new LocalInvitationAdapter().submitInvitation(payload);
