"use client";

import { useState } from "react";
import { BASE_NOTES, INTERVALS, getIntervalNote, type Note } from "@/lib/music";
import { playFrequency, playTwoNotes } from "@/lib/audio";
import StaffNote from "@/components/StaffNote";
import PlayButton from "@/components/PlayButton";

export default function ExplorateurPage() {
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  return (
    <div className="space-y-14">
      {/* Heading */}
      <div>
        <p className="font-ui text-[10px] uppercase tracking-[0.25em] text-ink-soft mb-3">
          Clé de sol · Intervalles
        </p>
        <h2 className="font-heading text-4xl text-ink leading-tight">
          Explorateur de notes
        </h2>
        <p className="font-ui text-ink-soft mt-3 text-[0.95rem] leading-relaxed max-w-md">
          Choisissez une note de départ pour découvrir tous ses intervalles musicaux.
        </p>
      </div>

      {/* Note selector */}
      <div>
        <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-5">
          Note de départ
        </p>
        <div className="flex flex-wrap gap-3">
          {BASE_NOTES.map((note) => (
            <button
              key={note.id}
              onClick={() => {
                setSelectedNote(note);
                playFrequency(note.frequency);
              }}
              className={`
                w-[4.5rem] h-[4.5rem] rounded-xl border font-display italic text-[1.75rem]
                transition-all duration-150 focus:outline-none active:scale-[0.94]
                ${
                  selectedNote?.id === note.id
                    ? "bg-rose-light border-rose/40 text-rose shadow-sm"
                    : "bg-white border-cream-border text-ink hover:border-ink-soft/50 hover:shadow-sm"
                }
              `}
            >
              {note.name}
            </button>
          ))}
        </div>
      </div>

      {/* Intervals grid */}
      {selectedNote ? (
        <div>
          <div className="flex items-baseline gap-3 mb-8">
            <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-soft">
              Intervalles depuis
            </p>
            <span className="font-display italic text-3xl text-rose leading-none">
              {selectedNote.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {INTERVALS.map((interval) => {
              const targetNote = getIntervalNote(selectedNote, interval.semitones);
              if (!targetNote) return null;
              return (
                <IntervalCard
                  key={interval.name}
                  intervalName={interval.name}
                  shortName={interval.shortName}
                  semitones={interval.semitones}
                  rootNote={selectedNote}
                  targetPitch={targetNote.pitch}
                  targetFrequency={targetNote.frequency}
                  targetName={targetNote.name}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-cream-border rounded-2xl py-24 text-center">
          <p className="font-display italic text-5xl text-ink-soft/30 mb-3 leading-none">♩</p>
          <p className="font-ui text-sm text-ink-soft">
            Sélectionnez une note pour commencer
          </p>
        </div>
      )}
    </div>
  );
}

interface IntervalCardProps {
  intervalName: string;
  shortName: string;
  semitones: number;
  rootNote: Note;
  targetPitch: string;
  targetFrequency: number;
  targetName: string;
}

function IntervalCard({
  intervalName,
  shortName,
  semitones,
  rootNote,
  targetPitch,
  targetFrequency,
  targetName,
}: IntervalCardProps) {
  const isUnison = semitones === 0;

  return (
    <div className="bg-white border border-cream-border rounded-2xl p-6 hover:border-ink-soft/30 hover:shadow-sm transition-all duration-200">
      {/* Info */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-ink-soft">
            {shortName}
          </span>
          {semitones > 0 && (
            <span className="font-ui text-[9px] text-rose/60">
              +{semitones} demi-ton{semitones > 1 ? "s" : ""}
            </span>
          )}
        </div>
        <h4 className="font-heading text-[1.1rem] text-ink leading-tight">{intervalName}</h4>
        <p className="font-display italic text-sm text-ink-soft mt-1">
          {rootNote.name} → {targetName}
        </p>
      </div>

      {/* Staff */}
      <div className="flex justify-center mb-5 bg-cream rounded-xl py-3">
        <StaffNote pitch={targetPitch} width={180} height={110} />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <PlayButton
          onPlay={() => playFrequency(targetFrequency)}
          label="Écouter la note"
        />
        {!isUnison && (
          <PlayButton
            onPlay={() => playTwoNotes(rootNote.frequency, targetFrequency)}
            label="Écouter l'intervalle"
            variant="accent"
          />
        )}
      </div>
    </div>
  );
}
