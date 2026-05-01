"use client";

import { useState } from "react";

interface PlayButtonProps {
  onPlay: () => Promise<void> | void;
  label: string;
  variant?: "default" | "accent";
  fullWidth?: boolean;
  className?: string;
}

function SoundWave() {
  return (
    <span className="flex items-end gap-[3px] h-3" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[2.5px] rounded-full bg-current"
          style={{
            height: `${5 + i * 3}px`,
            animation: `soundBar 0.55s ease-in-out ${i * 0.13}s infinite alternate`,
          }}
        />
      ))}
    </span>
  );
}

export default function PlayButton({
  onPlay,
  label,
  variant = "default",
  fullWidth = false,
  className = "",
}: PlayButtonProps) {
  const [playing, setPlaying] = useState(false);

  const handleClick = async () => {
    if (playing) return;
    setPlaying(true);
    try {
      await onPlay();
    } finally {
      setTimeout(() => setPlaying(false), 1800);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={playing}
      className={[
        "flex items-center justify-center gap-2 py-2 px-3 rounded-lg",
        "font-ui text-[11px] tracking-wide",
        "transition-all duration-150 focus:outline-none select-none",
        fullWidth ? "w-full" : "flex-1",
        className,
        playing ? "scale-[0.97]" : "active:scale-[0.96]",
        variant === "accent"
          ? `bg-rose-light border text-rose ${
              playing ? "border-rose/50" : "border-rose/20 hover:border-rose/40"
            }`
          : `border text-ink-mid hover:text-ink ${
              playing
                ? "bg-cream-dark border-ink-soft/40"
                : "border-cream-border hover:border-ink-soft/40"
            }`,
      ].join(" ")}
    >
      {playing ? <SoundWave /> : label}
    </button>
  );
}
