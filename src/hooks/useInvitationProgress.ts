"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getBrowserStorage,
  persistInvitationState,
  restoreInvitationState,
} from "@/lib/invitation-progress-storage";
import {
  createInitialState,
  transition,
  type InvitationEvent,
  type InvitationState,
} from "@/lib/state-machine";

export function useInvitationProgress() {
  const [state, setState] = useState<InvitationState>(createInitialState);
  const [isRestored, setIsRestored] = useState(false);

  useEffect(() => {
    const restore = window.setTimeout(() => {
      setState(restoreInvitationState(getBrowserStorage(window)));
      setIsRestored(true);
    }, 0);
    return () => window.clearTimeout(restore);
  }, []);

  useEffect(() => {
    if (isRestored) {
      persistInvitationState(getBrowserStorage(window), state);
    }
  }, [isRestored, state]);

  const dispatch = useCallback((event: InvitationEvent) => {
    setState((current) => transition(current, event));
  }, []);

  return { state, dispatch, isRestored };
}
