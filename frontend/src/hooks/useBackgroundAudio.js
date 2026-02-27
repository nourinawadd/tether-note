import { createContext, createElement, useCallback, useContext, useEffect, useMemo, useState } from "react";
import useSound from "../../vendor/use-sound/index.js";

const STORAGE_KEY = "tetherBackgroundAudioMuted";
const INTERACTION_KEY = "tetherBackgroundAudioInteracted";
const BACKGROUND_AUDIO_SRC = "/assets/audio/nature-sounds3.wav";

const BackgroundAudioContext = createContext(null);

export function BackgroundAudioProvider({ children }) {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  const [hasInteracted, setHasInteracted] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return sessionStorage.getItem(INTERACTION_KEY) === "true";
  });

  const [playNature, { stop: stopNature }] = useSound(BACKGROUND_AUDIO_SRC, {
    volume: 0.35,
    loop: true,
    soundEnabled: !isMuted,
    preload: "auto",
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.setItem(STORAGE_KEY, String(isMuted));
  }, [isMuted]);

  useEffect(() => {
    if (typeof window === "undefined" || hasInteracted) {
      return;
    }

    const enableInteraction = () => {
      sessionStorage.setItem(INTERACTION_KEY, "true");
      setHasInteracted(true);
    };

    window.addEventListener("pointerdown", enableInteraction, { once: true });
    window.addEventListener("keydown", enableInteraction, { once: true });

    return () => {
      window.removeEventListener("pointerdown", enableInteraction);
      window.removeEventListener("keydown", enableInteraction);
    };
  }, [hasInteracted]);

  useEffect(() => {
    if (isMuted) {
      stopNature();
      return;
    }

    if (hasInteracted) {
      playNature();
    }
  }, [hasInteracted, isMuted, playNature, stopNature]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const value = useMemo(() => ({ isMuted, toggleMute }), [isMuted, toggleMute]);

  return createElement(BackgroundAudioContext.Provider, { value }, children);
}

export default function useBackgroundAudio() {
  const context = useContext(BackgroundAudioContext);

  if (!context) {
    return {
      isMuted: true,
      toggleMute: () => {},
    };
  }

  return context;
}
