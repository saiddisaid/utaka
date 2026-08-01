import { Link } from "@tanstack/react-router";
import logo from "@/assets/utaka-logo.png.asset.json";

export function Footer() {
  return (
    <footer className="mt-20 surface-cream border-t border-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={logo.url}
              alt="Logo UTAKA"
              width={44}
              height={44}
              loading="lazy"
              className="h-11 w-11 rounded-full bg-secondary object-contain p-0.5"
            />
            <span className="utaka-word font-display text-xl font-extrabold tracking-tight">
              <span>U</span>
              <span>T</span>
              <span>A</span>
              <span>K</span>
              <span>A</span>
            </span>
          </div>

          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Media psikoedukasi berbasis permainan untuk melatih regulasi emosi remaja saat
            menghadapi cinta tak berbalas.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Jelajahi
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/belajar" className="hover:text-primary">
                Belajar Regulasi Emosi
              </Link>
            </li>
            <li>
              <Link to="/cara-bermain" className="hover:text-primary">
                Cara Bermain
              </Link>
            </li>
            <li>
              <Link to="/kartu" className="hover:text-primary">
                Kartu Edukasi
              </Link>
            </li>
            <li>
              <Link to="/refleksi" className="hover:text-primary">
                Refleksi
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Alur Belajar
          </h3>
          <p className="mt-3 text-sm text-muted-foreground">
            Learn → Play → Reflect → Improve
          </p>
          <Link
            to="/bermain"
            className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-105"
          >
            Mulai Bermain
          </Link>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        UTAKA — Ular Tangga Kartu · Media psikoedukasi regulasi emosi remaja
      </div>
    </footer>
  );
}
