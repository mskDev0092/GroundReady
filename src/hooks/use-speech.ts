"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

const subscribeNoop = () => () => {};

/**
 * Minimal Web Speech wrapper. Reading questions aloud helps trainees who are
 * still building English confidence, or who simply learn better by listening.
 * The browser may not support speech synthesis — callers should hide the
 * control when `supported` is false.
 */
export function useSpeech() {
  /* SSR-safe: false on the server, real capability on the client. */
  const supported = useSyncExternalStore(
    subscribeNoop,
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    () => false,
  );
  const [speaking, setSpeaking] = useState(false);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const trimmed = text.trim();
    if (!trimmed) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(trimmed);
    utterance.lang = "en-GB";
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(
    () => () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    },
    [],
  );

  return { supported, speaking, speak, stop };
}
