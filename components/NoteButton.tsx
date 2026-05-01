"use client";

interface NoteButtonProps {
  name: string;
  selected?: boolean;
  onClick: () => void;
  variant?: "primary" | "correct" | "wrong" | "default";
  disabled?: boolean;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-violet-600 hover:bg-violet-700 text-white border-violet-700 shadow-violet-300",
  selected:
    "bg-violet-800 text-white border-violet-900 shadow-violet-400 ring-2 ring-violet-400",
  correct:
    "bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 shadow-emerald-300",
  wrong: "bg-rose-500 hover:bg-rose-600 text-white border-rose-600 shadow-rose-300",
  default:
    "bg-white hover:bg-violet-50 text-violet-800 border-violet-300 shadow-violet-200",
};

export default function NoteButton({
  name,
  selected = false,
  onClick,
  variant = "default",
  disabled = false,
}: NoteButtonProps) {
  const cls = selected ? variantClasses.selected : variantClasses[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 rounded-xl border-2 font-bold text-lg transition-all duration-150
        shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-violet-400
        disabled:opacity-50 disabled:cursor-not-allowed
        ${cls}
      `}
    >
      {name}
    </button>
  );
}
