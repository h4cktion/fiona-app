// Music theory data for Fiona - Atelier Chant

export interface Note {
  name: string; // French name: Do, Ré, Mi, etc.
  id: string; // Short id: do, re, mi, etc.
  pitch: string; // VexFlow pitch: c/4, d/4, etc.
  octave: number;
  frequency: number; // Hz
  midiNote: number; // MIDI number for interval calculation
}

export interface Interval {
  name: string; // French interval name
  semitones: number;
  shortName: string;
}

export const BASE_NOTES: Note[] = [
  { name: "Do", id: "do4", pitch: "c/4", octave: 4, frequency: 261.63, midiNote: 60 },
  { name: "Ré", id: "re4", pitch: "d/4", octave: 4, frequency: 293.66, midiNote: 62 },
  { name: "Mi", id: "mi4", pitch: "e/4", octave: 4, frequency: 329.63, midiNote: 64 },
  { name: "Fa", id: "fa4", pitch: "f/4", octave: 4, frequency: 349.23, midiNote: 65 },
  { name: "Sol", id: "sol4", pitch: "g/4", octave: 4, frequency: 392.00, midiNote: 67 },
  { name: "La", id: "la4", pitch: "a/4", octave: 4, frequency: 440.00, midiNote: 69 },
  { name: "Si", id: "si4", pitch: "b/4", octave: 4, frequency: 493.88, midiNote: 71 },
];

// Quiz notes include Do5 as well
export const QUIZ_NOTES: Note[] = [
  ...BASE_NOTES,
  { name: "Do", id: "do5", pitch: "c/5", octave: 5, frequency: 523.25, midiNote: 72 },
];

export const INTERVALS: Interval[] = [
  { name: "Unisson", semitones: 0, shortName: "1" },
  { name: "Seconde majeure", semitones: 2, shortName: "2M" },
  { name: "Tierce mineure", semitones: 3, shortName: "3m" },
  { name: "Tierce majeure", semitones: 4, shortName: "3M" },
  { name: "Quarte juste", semitones: 5, shortName: "4J" },
  { name: "Quinte juste", semitones: 7, shortName: "5J" },
  { name: "Sixte majeure", semitones: 9, shortName: "6M" },
  { name: "Septième majeure", semitones: 11, shortName: "7M" },
  { name: "Octave", semitones: 12, shortName: "8" },
];

// All chromatic notes with frequencies for interval calculation
interface ChromaticNote {
  pitch: string;
  frequency: number;
  name: string;
}

const CHROMATIC_NOTES: ChromaticNote[] = [
  { pitch: "c/4", frequency: 261.63, name: "Do4" },
  { pitch: "c#/4", frequency: 277.18, name: "Do#4" },
  { pitch: "d/4", frequency: 293.66, name: "Ré4" },
  { pitch: "d#/4", frequency: 311.13, name: "Ré#4" },
  { pitch: "e/4", frequency: 329.63, name: "Mi4" },
  { pitch: "f/4", frequency: 349.23, name: "Fa4" },
  { pitch: "f#/4", frequency: 369.99, name: "Fa#4" },
  { pitch: "g/4", frequency: 392.00, name: "Sol4" },
  { pitch: "g#/4", frequency: 415.30, name: "Sol#4" },
  { pitch: "a/4", frequency: 440.00, name: "La4" },
  { pitch: "a#/4", frequency: 466.16, name: "La#4" },
  { pitch: "b/4", frequency: 493.88, name: "Si4" },
  { pitch: "c/5", frequency: 523.25, name: "Do5" },
  { pitch: "c#/5", frequency: 554.37, name: "Do#5" },
  { pitch: "d/5", frequency: 587.33, name: "Ré5" },
  { pitch: "d#/5", frequency: 622.25, name: "Ré#5" },
  { pitch: "e/5", frequency: 659.25, name: "Mi5" },
  { pitch: "f/5", frequency: 698.46, name: "Fa5" },
  { pitch: "f#/5", frequency: 739.99, name: "Fa#5" },
  { pitch: "g/5", frequency: 783.99, name: "Sol5" },
];

export interface IntervalResult {
  interval: Interval;
  rootNote: Note;
  targetNote: ChromaticNote;
}

export function getIntervalNote(rootNote: Note, semitones: number): ChromaticNote | null {
  const rootIndex = CHROMATIC_NOTES.findIndex((n) => n.pitch === rootNote.pitch);
  if (rootIndex === -1) return null;
  const targetIndex = rootIndex + semitones;
  if (targetIndex >= CHROMATIC_NOTES.length) return null;
  return CHROMATIC_NOTES[targetIndex];
}

export function getNoteByName(name: string): Note | undefined {
  return BASE_NOTES.find((n) => n.name === name);
}

export function getRandomQuizNote(): Note {
  return QUIZ_NOTES[Math.floor(Math.random() * QUIZ_NOTES.length)];
}

export function getWrongAnswers(correctNote: Note, count: number): Note[] {
  const allNames = ["Do", "Ré", "Mi", "Fa", "Sol", "La", "Si"];
  const wrong = allNames.filter((n) => n !== correctNote.name);
  // Shuffle and take count
  for (let i = wrong.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrong[i], wrong[j]] = [wrong[j], wrong[i]];
  }
  return wrong.slice(0, count).map((name) => BASE_NOTES.find((n) => n.name === name)!);
}
