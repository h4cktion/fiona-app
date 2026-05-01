// Audio utilities using Tone.js

let synth: import("tone").Synth | null = null;

async function getSynth() {
  if (synth) return synth;
  const Tone = await import("tone");
  synth = new Tone.Synth({
    oscillator: {
      type: "triangle",
    },
    envelope: {
      attack: 0.02,
      decay: 0.3,
      sustain: 0.4,
      release: 1.2,
    },
  }).toDestination();
  return synth;
}

export async function playFrequency(frequency: number, duration = "2n"): Promise<void> {
  try {
    const Tone = await import("tone");
    await Tone.start();
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
    const Tone = await import("tone");
    await Tone.start();
    const s = await getSynth();
    const now = Tone.now();
    s.triggerAttackRelease(freq1, "4n", now);
    s.triggerAttackRelease(freq2, "4n", now + gapSeconds);
  } catch (err) {
    console.error("Audio playback error:", err);
  }
}
