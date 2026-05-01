"use client";

import { useEffect, useRef } from "react";

interface StaffNoteProps {
  pitch: string;
  width?: number;
  height?: number;
}

export default function StaffNote({ pitch, width = 200, height = 120 }: StaffNoteProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    let cleanup = false;

    const render = async () => {
      try {
        const VF = await import("vexflow");
        if (cleanup || !container) return;

        const { Renderer, Stave, StaveNote, Voice, Formatter } = VF.default
          ? VF.default
          : (VF as unknown as typeof VF);

        const renderer = new Renderer(container, Renderer.Backends.SVG);
        renderer.resize(width, height);
        const context = renderer.getContext();
        context.setFont("Georgia", 10);

        const stave = new Stave(10, 14, width - 20);
        stave.addClef("treble");
        stave.setContext(context).draw();

        const note = new StaveNote({
          keys: [pitch],
          duration: "q",
          clef: "treble",
        });

        const voice = new Voice({ numBeats: 1, beatValue: 4 });
        voice.addTickable(note);

        new Formatter().joinVoices([voice]).format([voice], width - 80);
        voice.draw(context, stave);

        // Make the SVG background transparent
        const svg = container.querySelector("svg");
        if (svg) {
          svg.style.background = "transparent";
        }
      } catch (err) {
        console.error("VexFlow render error:", err);
      }
    };

    render();

    return () => {
      cleanup = true;
    };
  }, [pitch, width, height]);

  return (
    <div
      ref={containerRef}
      style={{ width, height }}
      className="flex items-center justify-center"
    />
  );
}
