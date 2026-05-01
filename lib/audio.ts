let ToneModule: typeof import("tone") | null = null;
let synth: import("tone").Synth | null = null;
let unlockRegistered = false;

export async function preloadAudio(): Promise<void> {
  if (ToneModule) return;
  ToneModule = await import("tone");

  if (unlockRegistered || typeof document === "undefined") return;
  unlockRegistered = true;

  // Must run synchronously in capture phase, before the button's onClick,
  // so AudioContext.resume() is called within the user gesture on iOS Safari.
  const unlock = () => {
    ToneModule?.start();
    document.removeEventListener("touchstart", unlock, true);
    document.removeEventListener("click", unlock, true);
  };
  document.addEventListener("touchstart", unlock, { capture: true, once: true });
  document.addEventListener("click", unlock, { capture: true, once: true });
}

async function getSynth(): Promise<import("tone").Synth> {
  if (!ToneModule) ToneModule = await import("tone");
  if (!synth) {
    synth = new ToneModule.Synth({
      oscillator: { type: "triangle" },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.2 },
    }).toDestination();
  }
  return synth;
}

export async function playFrequency(frequency: number, duration = "2n"): Promise<void> {
  try {
    if (!ToneModule) ToneModule = await import("tone");
    await ToneModule.start();
    const s = await getSynth();
    s.triggerAttackRelease(frequency, duration);
  } catch (err) {
    console.error("Audio playback error:", err);
  }
}

export async function playTwoNotes(
  freq1: number,
  freq2: number,
  gapSeconds = 0.6
): Promise<void> {
  try {
    if (!ToneModule) ToneModule = await import("tone");
    await ToneModule.start();
    const s = await getSynth();
    const now = ToneModule.now();
    s.triggerAttackRelease(freq1, "4n", now);
    s.triggerAttackRelease(freq2, "4n", now + gapSeconds);
  } catch (err) {
    console.error("Audio playback error:", err);
  }
}
