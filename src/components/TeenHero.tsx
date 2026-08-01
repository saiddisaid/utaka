/** Ilustrasi karakter remaja animatif untuk hero page UTAKA. */
export function TeenHero() {
  return (
    <div className="relative mx-auto w-full max-w-md select-none">
      <svg viewBox="0 0 420 380" className="h-auto w-full" role="img" aria-label="Dua remaja bermain ular tangga UTAKA">
        <defs>
          <linearGradient id="bgGlow" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd400" />
            <stop offset="55%" stopColor="#ff3d9a" />
            <stop offset="100%" stopColor="#1f5fe0" />
          </linearGradient>
        </defs>

        {/* latar */}
        <circle cx="210" cy="190" r="165" fill="url(#bgGlow)" opacity="0.18" />
        <g className="spin-slow" style={{ transformOrigin: "210px 190px" }}>
          <circle cx="210" cy="190" r="160" fill="none" stroke="#1f5fe0" strokeWidth="3" strokeDasharray="10 16" opacity="0.5" />
        </g>

        {/* papan ular tangga mini */}
        <g transform="translate(140 210)">
          <rect x="0" y="0" width="140" height="140" rx="12" fill="#1a2a8f" />
          {Array.from({ length: 25 }, (_, i) => {
            const colors = ["#e01b24", "#ffd400", "#ff3d9a", "#1f5fe0", "#ff6a13"];
            return (
              <rect
                key={i}
                x={6 + (i % 5) * 26}
                y={6 + Math.floor(i / 5) * 26}
                width="22"
                height="22"
                rx="4"
                fill={colors[(i * 3) % 5]}
              />
            );
          })}
          <path d="M18 120 C 60 90, 80 60, 122 24" stroke="#c05cf0" strokeWidth="8" fill="none" strokeLinecap="round" />
          <g stroke="#8ede2b" strokeWidth="4" strokeLinecap="round">
            <line x1="40" y1="126" x2="96" y2="20" />
            <line x1="54" y1="130" x2="110" y2="24" />
          </g>
        </g>

        {/* remaja 1 — melambaikan tangan */}
        <g className="teen-bob" style={{ transformOrigin: "90px 330px" }}>
          <ellipse cx="90" cy="342" rx="38" ry="7" fill="#1a2a8f" opacity="0.2" />
          <rect x="66" y="238" width="48" height="98" rx="22" fill="#e01b24" />
          <rect x="74" y="316" width="14" height="26" rx="7" fill="#1a2a8f" />
          <rect x="94" y="316" width="14" height="26" rx="7" fill="#1a2a8f" />
          <circle cx="90" cy="206" r="34" fill="#ffd7ac" />
          <path d="M56 202 a34 34 0 0 1 68 0 a34 22 0 0 0 -68 0" fill="#2b1a12" />
          <circle cx="79" cy="208" r="4" fill="#20223d" />
          <circle cx="101" cy="208" r="4" fill="#20223d" />
          <path d="M80 220 q10 10 20 0" stroke="#20223d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="70" cy="218" r="5" fill="#ff3d9a" opacity="0.55" />
          <circle cx="110" cy="218" r="5" fill="#ff3d9a" opacity="0.55" />
          <g className="teen-wave" style={{ transformOrigin: "112px 250px" }}>
            <rect x="108" y="244" width="13" height="52" rx="6.5" fill="#e01b24" />
            <circle cx="115" cy="300" r="10" fill="#ffd7ac" />
          </g>
          <rect x="58" y="248" width="13" height="48" rx="6.5" fill="#e01b24" />
          <circle cx="64" cy="300" r="10" fill="#ffd7ac" />
        </g>

        {/* remaja 2 — memegang dadu */}
        <g className="teen-bob" style={{ transformOrigin: "330px 330px", animationDelay: "0.7s" }}>
          <ellipse cx="330" cy="342" rx="38" ry="7" fill="#1a2a8f" opacity="0.2" />
          <rect x="306" y="238" width="48" height="98" rx="22" fill="#1f5fe0" />
          <rect x="314" y="316" width="14" height="26" rx="7" fill="#1a2a8f" />
          <rect x="334" y="316" width="14" height="26" rx="7" fill="#1a2a8f" />
          <circle cx="330" cy="206" r="34" fill="#f2c79a" />
          <path d="M296 200 q34 -40 68 0 q-14 -14 -34 -8 q-20 6 -34 8" fill="#3a2418" />
          <circle cx="319" cy="208" r="4" fill="#20223d" />
          <circle cx="341" cy="208" r="4" fill="#20223d" />
          <path d="M320 221 q10 9 20 0" stroke="#20223d" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <rect x="348" y="248" width="13" height="48" rx="6.5" fill="#1f5fe0" />
          <rect x="299" y="248" width="13" height="48" rx="6.5" fill="#1f5fe0" />
          <circle cx="305" cy="300" r="10" fill="#f2c79a" />
          {/* dadu di tangan */}
          <g className="animate-float" style={{ transformOrigin: "356px 296px" }}>
            <rect x="342" y="282" width="30" height="30" rx="7" fill="#ffffff" stroke="#1a2a8f" strokeWidth="2.5" />
            <circle cx="351" cy="291" r="3" fill="#e01b24" />
            <circle cx="363" cy="303" r="3" fill="#e01b24" />
            <circle cx="357" cy="297" r="3" fill="#e01b24" />
          </g>
        </g>

        {/* hati melayang */}
        <g fill="#ff3d9a">
          <path className="heart-float" style={{ animationDelay: "0s" }} d="M150 170 c 0 -8 12 -12 12 -2 c 0 -10 12 -6 12 2 c 0 10 -12 16 -12 16 c 0 0 -12 -6 -12 -16 z" />
          <path className="heart-float" style={{ animationDelay: "1.4s" }} d="M240 150 c 0 -7 10 -10 10 -2 c 0 -8 10 -5 10 2 c 0 8 -10 13 -10 13 c 0 0 -10 -5 -10 -13 z" opacity="0.8" />
          <path className="heart-float" style={{ animationDelay: "2.5s" }} d="M196 186 c 0 -6 9 -9 9 -1.5 c 0 -7.5 9 -4.5 9 1.5 c 0 7 -9 12 -9 12 c 0 0 -9 -5 -9 -12 z" opacity="0.7" />
        </g>
      </svg>

      <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-black uppercase">
        <span className="rounded-full bg-board-red px-3 py-1 text-white">Ular</span>
        <span className="rounded-full bg-board-green px-3 py-1 text-board-navy">Tangga</span>
        <span className="rounded-full bg-board-pink px-3 py-1 text-white">Funfact</span>
        <span className="rounded-full bg-board-navy px-3 py-1 text-white">Refleksi</span>
      </div>
    </div>
  );
}
