"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SPLASH_DURATION_MS = 2000;
const FADE_DURATION_MS = 500;
const STORAGE_KEY = "spacetime-splash-shown";

function useSystemDarkMode() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDark(media.matches);

    const onChange = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  return isDark;
}

export function SplashScreen() {
  const isSystemDark = useSystemDarkMode();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    setMounted(true);

    if (sessionStorage.getItem(STORAGE_KEY)) return;

    setVisible(true);

    const fadeTimer = setTimeout(() => setFadeOut(true), SPLASH_DURATION_MS);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, SPLASH_DURATION_MS + FADE_DURATION_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!mounted || !visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center transition-opacity duration-500 ${fadeOut ? "opacity-0" : "opacity-100"
        } ${isSystemDark ? "bg-black" : "bg-[#f5f5f0]"}`}
    >
      <Image
        src={
          isSystemDark ? "/images/blackwhite.png" : "/images/whiteblack.png"
        }
        alt="SpaceTime"
        width={1920}
        height={1080}
        priority
        sizes="100vw"
        className="h-auto w-full"
      />
    </div>
  );
}
