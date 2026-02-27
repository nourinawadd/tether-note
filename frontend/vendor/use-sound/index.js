import { useCallback, useEffect, useMemo, useRef } from "react";

export default function useSound(src, options = {}) {
  const {
    volume = 1,
    loop = false,
    soundEnabled = true,
    preload = "auto",
  } = options;

  const audioRef = useRef(null);

  useEffect(() => {
    if (!src) {
      return;
    }

    const audio = new Audio(src);
    audio.loop = loop;
    audio.preload = preload;
    audio.volume = volume;
    audio.muted = !soundEnabled;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
  }, [src, loop, preload, volume, soundEnabled]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.muted = !soundEnabled;
    audioRef.current.volume = volume;
    audioRef.current.loop = loop;
  }, [soundEnabled, volume, loop]);

  const play = useCallback(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.play().catch(() => {
      // Autoplay can be blocked by the browser until user interaction.
    });
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  const pause = useCallback(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
  }, []);

  return useMemo(() => [play, { stop, pause }], [pause, play, stop]);
}
