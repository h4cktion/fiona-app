"use client";

import { useState, useCallback } from "react";
import { getRandomQuizNote, getWrongAnswers, type Note } from "@/lib/music";
import { playFrequency } from "@/lib/audio";
import StaffNote from "@/components/StaffNote";

type AnswerState = "idle" | "correct" | "wrong";

interface QuizState {
  currentNote: Note;
  choices: Note[];
  answerState: AnswerState;
  selectedAnswer: string | null;
  score: number;
  total: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuizState(score = 0, total = 0): QuizState {
  const currentNote = getRandomQuizNote();
  const wrongAnswers = getWrongAnswers(currentNote, 3);
  const choices = shuffle([currentNote, ...wrongAnswers]);
  return { currentNote, choices, answerState: "idle", selectedAnswer: null, score, total };
}

export default function QuizPage() {
  const [quiz, setQuiz] = useState<QuizState>(() => buildQuizState());

  const handleAnswer = useCallback(
    (chosen: Note) => {
      if (quiz.answerState !== "idle") return;
      const isCorrect = chosen.name === quiz.currentNote.name;
      playFrequency(quiz.currentNote.frequency);
      setQuiz((prev) => ({
        ...prev,
        answerState: isCorrect ? "correct" : "wrong",
        selectedAnswer: chosen.name,
        score: isCorrect ? prev.score + 1 : prev.score,
        total: prev.total + 1,
      }));
    },
    [quiz]
  );

  const nextQuestion = useCallback(() => {
    setQuiz((prev) => buildQuizState(prev.score, prev.total));
  }, []);

  const resetScore = useCallback(() => {
    setQuiz(buildQuizState(0, 0));
  }, []);

  const accuracy = quiz.total > 0 ? Math.round((quiz.score / quiz.total) * 100) : null;

  return (
    <div className="max-w-2xl mx-auto space-y-12">
      {/* Heading */}
      <div>
        <p className="font-ui text-[10px] uppercase tracking-[0.25em] text-ink-soft mb-3">
          Clé de sol · Lecture de notes
        </p>
        <h2 className="font-heading text-4xl text-ink leading-tight">Quiz de lecture</h2>
        <p className="font-ui text-ink-soft mt-3 text-[0.95rem] leading-relaxed">
          Identifiez la note affichée sur la portée.
        </p>
      </div>

      {/* Score */}
      <div className="flex items-end justify-between border-b border-cream-border pb-8">
        <div className="flex items-end gap-10">
          <ScoreItem label="Score" value={quiz.score} />
          <ScoreItem label="Questions" value={quiz.total} />
          {accuracy !== null && (
            <ScoreItem label="Précision" value={`${accuracy}%`} accent />
          )}
        </div>
        <button
          onClick={resetScore}
          className="font-ui text-[11px] text-ink-soft hover:text-ink
            underline underline-offset-4 decoration-ink-soft/40 transition-colors"
        >
          Réinitialiser
        </button>
      </div>

      {/* Question */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-xl text-ink">Quelle est cette note ?</h3>
          <button
            onClick={() => playFrequency(quiz.currentNote.frequency)}
            className="font-ui text-[11px] uppercase tracking-[0.15em] text-ink-mid
              border border-cream-border hover:border-ink-soft/50 rounded-lg px-4 py-2
              hover:text-ink transition-all duration-150"
          >
            Écouter
          </button>
        </div>

        {/* Staff */}
        <div className="flex justify-center">
          <div className="bg-white border border-cream-border rounded-2xl px-10 py-6 shadow-sm">
            <StaffNote pitch={quiz.currentNote.pitch} width={280} height={130} />
          </div>
        </div>

        {/* Feedback */}
        {quiz.answerState !== "idle" && (
          <div
            className={`rounded-xl border py-5 text-center transition-all ${
              quiz.answerState === "correct"
                ? "bg-success-light border-success/20"
                : "bg-error-light border-error/20"
            }`}
          >
            <p
              className={`font-heading text-2xl ${
                quiz.answerState === "correct" ? "text-success" : "text-error"
              }`}
            >
              {quiz.answerState === "correct"
                ? "Parfait !"
                : `C'était : ${quiz.currentNote.name}${quiz.currentNote.octave}`}
            </p>
            <p
              className={`font-ui text-[11px] mt-1 ${
                quiz.answerState === "correct" ? "text-success/70" : "text-error/70"
              }`}
            >
              {quiz.answerState === "correct" ? "Bonne réponse" : "Essayez encore"}
            </p>
          </div>
        )}

        {/* Answer buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quiz.choices.map((choice) => {
            let state: "idle" | "correct" | "wrong" | "neutral" = "idle";
            if (quiz.answerState !== "idle") {
              if (choice.name === quiz.currentNote.name) state = "correct";
              else if (choice.name === quiz.selectedAnswer) state = "wrong";
              else state = "neutral";
            }

            return (
              <button
                key={choice.id}
                onClick={() => handleAnswer(choice)}
                disabled={quiz.answerState !== "idle"}
                className={`
                  h-[5rem] rounded-xl border font-display italic text-[2rem] leading-none
                  transition-all duration-200 focus:outline-none
                  ${
                    state === "idle"
                      ? "bg-white border-cream-border text-ink hover:border-ink-soft/50 hover:shadow-sm active:scale-95 cursor-pointer"
                      : state === "correct"
                      ? "bg-success-light border-success/40 text-success cursor-default"
                      : state === "wrong"
                      ? "bg-error-light border-error/30 text-error/60 line-through cursor-default"
                      : "bg-white border-cream-border text-ink-soft/40 cursor-default"
                  }
                `}
              >
                {choice.name}
              </button>
            );
          })}
        </div>

        {/* Next question */}
        {quiz.answerState !== "idle" && (
          <div className="flex justify-center pt-2">
            <button
              onClick={nextQuestion}
              className="font-ui text-sm tracking-wide text-white bg-ink
                hover:bg-ink-mid px-10 py-3 rounded-xl transition-colors duration-200"
            >
              Note suivante →
            </button>
          </div>
        )}
      </div>

      {/* Encouragement */}
      {quiz.total >= 5 && (
        <div className="border border-cream-border rounded-xl py-5 text-center">
          <p className="font-display italic text-ink-mid text-xl">
            {accuracy! >= 80
              ? "Excellent travail, continuez ainsi."
              : accuracy! >= 60
              ? "Bon travail, continuez à pratiquer."
              : "Persévérez, vous y arriverez."}
          </p>
        </div>
      )}
    </div>
  );
}

function ScoreItem({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number | string;
  accent?: boolean;
}) {
  return (
    <div>
      <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-ink-soft mb-1">
        {label}
      </p>
      <p
        className={`font-display text-[2.5rem] leading-none ${
          accent ? "text-rose italic" : "text-ink"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
