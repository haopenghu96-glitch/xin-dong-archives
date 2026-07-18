"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { useInvitationProgress } from "@/hooks/useInvitationProgress";
import { parseSharePlan, type SharePlan } from "@/lib/share-plan";
import { ConfirmScene } from "./ConfirmScene";
import { DeclinedScene, SeriousChoiceScene } from "./DeclineScene";
import { FoodScene } from "./FoodScene";
import { IntroScene } from "./IntroScene";
import { ReviewScene } from "./ReviewScene";
import { ScheduleScene } from "./ScheduleScene";
import { SharedPlanScene } from "./SharedPlanScene";
import { SubmittingScene } from "./SubmittingScene";
import { SuccessScene } from "./SuccessScene";

const subscribeToLocation = () => () => undefined;
let cachedSearch = "";
let cachedSharedPlan: SharePlan | null = null;

const getSharedPlanSnapshot = () => {
  if (typeof window === "undefined") return null;
  if (window.location.search === cachedSearch) return cachedSharedPlan;

  cachedSearch = window.location.search;
  cachedSharedPlan = parseSharePlan(new URLSearchParams(cachedSearch).get("plan"));
  return cachedSharedPlan;
};

export function InvitationFlow() {
  const { state, dispatch, isRestored } = useInvitationProgress();
  const sharedPlan = useSyncExternalStore(subscribeToLocation, getSharedPlanSnapshot, () => null) as SharePlan | null;
  const sceneTransitionRef = useRef<HTMLDivElement>(null);
  const focusKey = sharedPlan ? "SHARED_PLAN" : state.phase;

  useEffect(() => {
    let animationFrame = 0;
    let cancelled = false;
    const focusCurrentScene = () => {
      if (cancelled) return;
      const transition = sceneTransitionRef.current;
      if (transition?.dataset.phase === focusKey) {
        transition.focus({ preventScroll: true });
        return;
      }
      animationFrame = window.requestAnimationFrame(focusCurrentScene);
    };
    animationFrame = window.requestAnimationFrame(focusCurrentScene);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
    };
  }, [focusKey, isRestored]);

  if (!isRestored) {
    return <main className="loading-stage"><span>正在准备邀请…</span></main>;
  }

  if (sharedPlan) {
    return (
      <main className="invitation-page">
        <div className="mobile-stage">
          <div ref={sceneTransitionRef} data-testid="scene-transition" data-phase={focusKey} tabIndex={-1}>
            <SharedPlanScene plan={sharedPlan} onStartNew={() => window.location.assign(window.location.pathname)} />
          </div>
        </div>
      </main>
    );
  }

  const scene = (() => {
    switch (state.phase) {
      case "SECOND_CONFIRM":
        return <ConfirmScene onConfirm={() => dispatch({ type: "CONFIRM_APPROVAL" })} onSlip={() => dispatch({ type: "RETURN_TO_INVITATION" })} />;
      case "SCHEDULE":
        return (
          <ScheduleScene
            state={state}
            onEvent={(event, value) => {
              if (event === "BACK") dispatch({ type: "BACK_TO_CONFIRM" });
              if (event === "NEXT") dispatch({ type: "CONTINUE_TO_FOOD" });
              if (event === "DATE") dispatch({ type: "SET_DATE", date: value ?? "" });
              if (event === "TIME") dispatch({ type: "SET_TIME", time: value ?? "" });
              if (event === "NOTE") dispatch({ type: "SET_NOTE", note: value ?? "" });
            }}
          />
        );
      case "FOOD":
        return <FoodScene selected={state.foodId} onSelect={(foodId) => dispatch({ type: "SELECT_FOOD", foodId })} onBack={() => dispatch({ type: "BACK_TO_SCHEDULE" })} onSubmit={() => dispatch({ type: "SUBMIT" })} />;
      case "REVIEW":
        return <ReviewScene state={state} onBack={() => dispatch({ type: "BACK_TO_FOOD" })} onSubmit={() => dispatch({ type: "SUBMIT" })} />;
      case "SUBMITTING":
        return <SubmittingScene state={state} onComplete={() => dispatch({ type: "SUBMIT_COMPLETE" })} />;
      case "SUCCESS":
        return <SuccessScene state={state} onRevisit={() => dispatch({ type: "RESET" })} />;
      case "SERIOUS_CHOICE":
        return <SeriousChoiceScene onReturn={() => dispatch({ type: "RETURN_TO_INVITATION" })} onDecline={() => dispatch({ type: "DECLINE_FOR_TODAY" })} />;
      case "DECLINED":
        return <DeclinedScene onReturn={() => dispatch({ type: "RETURN_TO_INVITATION" })} />;
      default:
        return <IntroScene declineStep={state.declineStep} onApprove={() => dispatch({ type: "APPROVE" })} onDecline={() => dispatch({ type: "DECLINE_PLAY" })} />;
    }
  })();

  return (
    <main className="invitation-page">
      <div className="mobile-stage">
        <AnimatePresence mode="wait">
          <motion.div
            ref={sceneTransitionRef}
            key={state.phase}
            data-testid="scene-transition"
            data-phase={state.phase}
            tabIndex={-1}
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.99 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            {scene}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
