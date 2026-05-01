import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Serif_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fiona — Atelier Chant",
  description: "Solfège interactif en clé de sol pour Fiona",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSerif.variable} ${dmSans.variable}`}>
      <body className="antialiased min-h-screen bg-cream text-ink font-ui">
        <header className="bg-white border-b border-cream-border">
          <div className="max-w-5xl mx-auto px-8 py-5 flex items-center justify-between">
            <Link href="/" className="block group">
              <span className="font-display italic text-[1.6rem] leading-none text-ink block tracking-tight">
                Fiona
              </span>
              <span className="font-ui text-[10px] uppercase tracking-[0.28em] text-ink-soft block mt-1">
                Atelier de Chant
              </span>
            </Link>

            <nav className="flex items-center gap-10">
              <NavLink href="/explorateur">Explorateur</NavLink>
              <NavLink href="/quiz">Quiz</NavLink>
            </nav>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-8 py-14">{children}</main>

        <footer className="border-t border-cream-border py-8 mt-12">
          <p className="text-center font-ui text-[10px] tracking-[0.3em] uppercase text-ink-soft">
            Fait avec soin pour Fiona
          </p>
        </footer>
      </body>
    </html>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="font-ui text-sm tracking-wide text-ink-mid hover:text-ink
        underline-offset-4 hover:underline decoration-rose/40 transition-colors duration-200"
    >
      {children}
    </Link>
  );
}
