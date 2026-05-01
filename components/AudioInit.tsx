"use client";

import { useEffect } from "react";
import { preloadAudio } from "@/lib/audio";

export default function AudioInit() {
  useEffect(() => {
    preloadAudio();
  }, []);
  return null;
}
