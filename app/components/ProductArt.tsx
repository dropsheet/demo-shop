// Still-life illustrations of each product, drawn in SVG so the shop has no image dependencies.

function Shadow({ cx = 200, cy = 262, rx = 120 }: { cx?: number; cy?: number; rx?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.11} fill="#000" opacity="0.09" />;
}

function LinenThrow() {
  return (
    <g>
      <Shadow rx={128} />
      {/* folded stack */}
      <rect x="82" y="196" width="236" height="62" rx="16" fill="#c9b49b" />
      <rect x="82" y="196" width="236" height="14" rx="7" fill="#b79f84" />
      <rect x="92" y="140" width="216" height="62" rx="16" fill="#dccbb5" />
      <rect x="92" y="140" width="216" height="14" rx="7" fill="#cdb99f" />
      <rect x="104" y="88" width="192" height="58" rx="16" fill="#efe3d1" />
      <path d="M104 118 h192" stroke="#d9c7ae" strokeWidth="3" />
      {/* fringe */}
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} d={`M${112 + i * 16} 258 v12`} stroke="#b79f84" strokeWidth="3" strokeLinecap="round" />
      ))}
    </g>
  );
}

function Mug() {
  const speckles = [
    [168, 150], [190, 132], [214, 160], [232, 140], [176, 188], [204, 206], [226, 190], [186, 228], [238, 222], [160, 214],
    [198, 176], [222, 118], [172, 120],
  ];
  return (
    <g>
      <Shadow rx={92} />
      <path d="M262 150 c44 -6 50 64 4 70" fill="none" stroke="#cfc8bb" strokeWidth="16" strokeLinecap="round" />
      <path d="M140 100 h132 v126 c0 22 -18 36 -40 36 h-52 c-22 0 -40 -14 -40 -36 z" fill="#e7e1d6" />
      <path d="M140 100 h132 v20 h-132 z" fill="#d8d0c2" />
      <ellipse cx="206" cy="100" rx="66" ry="10" fill="#6e5440" />
      <ellipse cx="206" cy="100" rx="66" ry="10" fill="none" stroke="#efe9df" strokeWidth="4" />
      {speckles.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.6 : 1.8} fill="#8a7e6e" opacity="0.7" />
      ))}
      {/* steam */}
      <path d="M190 80 c-10 -14 10 -22 0 -40" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.8" />
      <path d="M222 78 c-10 -14 10 -22 0 -38" fill="none" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.6" />
    </g>
  );
}

function Tray({ pear = true }: { pear?: boolean }) {
  return (
    <g>
      <Shadow cy={214} rx={160} />
      <path d="M50 176 h300 l-10 26 c-2 6 -8 10 -15 10 h-250 c-7 0 -13 -4 -15 -10 z" fill="#b8875a" />
      <path d="M50 176 h300 l-3 9 h-294 z" fill="#c9996b" />
      <rect x="40" y="162" width="320" height="18" rx="9" fill="#d6a978" />
      <rect x="62" y="167" width="34" height="8" rx="4" fill="#8f6440" />
      <rect x="304" y="167" width="34" height="8" rx="4" fill="#8f6440" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} d={`M${86 + i * 56} 190 q10 7 0 16`} fill="none" stroke="#a87a50" strokeWidth="2" opacity="0.55" />
      ))}
      {pear && (
        <g>
      <path d="M200 160 c-26 0 -30 -26 -18 -40 c8 -10 6 -22 18 -26 c12 4 10 16 18 26 c12 14 8 40 -18 40 z" fill="#c7b25a" />
      <path d="M200 94 q4 -12 12 -16" fill="none" stroke="#5b4a2e" strokeWidth="4" strokeLinecap="round" />
      <path d="M212 82 q14 -6 20 4 q-12 6 -20 -4 z" fill="#6f8a4c" />
        </g>
      )}
    </g>
  );
}

function Blanket() {
  return (
    <g>
      <Shadow rx={140} />
      <path d="M96 130 h208 a62 62 0 0 1 0 124 h-208 z" fill="#5f7360" />
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M${108 + i * 22} 136 l10 14 l-10 14 l10 14 l-10 14 l10 14 l-10 14 l10 14 l-10 14 l10 14`}
          fill="none"
          stroke="#7d9179"
          strokeWidth="3"
        />
      ))}
      <circle cx="96" cy="192" r="62" fill="#4f6350" />
      <circle cx="96" cy="192" r="46" fill="none" stroke="#6c806a" strokeWidth="6" />
      <circle cx="96" cy="192" r="30" fill="none" stroke="#6c806a" strokeWidth="6" />
      <circle cx="96" cy="192" r="14" fill="#6c806a" />
      <rect x="230" y="130" width="22" height="124" fill="#d9cfb8" opacity="0.9" />
    </g>
  );
}

function Candlestick() {
  return (
    <g>
      <Shadow rx={78} />
      <ellipse cx="200" cy="252" rx="70" ry="12" fill="#a8822e" />
      <path d="M134 250 c0 -18 30 -26 66 -26 s66 8 66 26 z" fill="#d9b45a" />
      <path d="M190 226 c-8 -30 6 -40 6 -64 c0 -20 -14 -24 -14 -40 h36 c0 16 -14 20 -14 40 c0 24 14 34 6 64 z" fill="#e2bf65" />
      <ellipse cx="200" cy="122" rx="30" ry="8" fill="#c99d3e" />
      <rect x="186" y="44" width="28" height="78" rx="4" fill="#f4efe4" />
      <path d="M200 44 v-8" stroke="#3a3128" strokeWidth="3" strokeLinecap="round" />
      <path d="M200 8 c12 14 10 26 0 30 c-10 -4 -12 -16 0 -30 z" fill="#f2a93b" />
      <path d="M200 20 c5 7 4 13 0 15 c-4 -2 -5 -8 0 -15 z" fill="#fde7a8" />
      <path d="M204 160 c-4 10 -4 24 2 40" stroke="#f3d68f" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.8" />
    </g>
  );
}

function Carafe() {
  return (
    <g>
      <Shadow rx={84} />
      <path
        d="M176 40 h48 v18 c0 26 52 60 52 132 c0 50 -30 72 -76 72 s-76 -22 -76 -72 c0 -72 52 -106 52 -132 z"
        fill="#ffffff"
        opacity="0.55"
        stroke="#9cb8ba"
        strokeWidth="4"
      />
      <path d="M131 176 c10 6 128 6 138 0 c4 14 6 22 6 30 c0 44 -30 56 -75 56 s-75 -12 -75 -56 c0 -8 2 -16 6 -30 z" fill="#8fc0c6" opacity="0.55" />
      <rect x="170" y="14" width="60" height="30" rx="6" fill="#ffffff" opacity="0.7" stroke="#9cb8ba" strokeWidth="4" />
      <path d="M152 120 c-10 24 -12 50 -6 74" stroke="#ffffff" strokeWidth="7" strokeLinecap="round" fill="none" opacity="0.9" />
    </g>
  );
}

const ART: Record<string, () => React.ReactElement> = {
  "linen-throw": LinenThrow,
  "ceramic-mug": Mug,
  "oak-tray": () => <Tray />,
  "wool-blanket": Blanket,
  "brass-candle": Candlestick,
  "glass-carafe": Carafe,
};

export function ProductArt({ id, backdrop, label }: { id: string; backdrop: string; label: string }) {
  const Art = ART[id];
  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={label} style={{ display: "block", width: "100%", height: "auto", background: backdrop }}>
      {Art ? <Art /> : null}
    </svg>
  );
}

// The hero still life: tray, mug, carafe and candlestick together.
export function HeroArt() {
  return (
    <svg viewBox="0 0 560 520" role="img" aria-label="A white oak tray with a speckled mug, a glass carafe and a brass candlestick" style={{ display: "block", width: "100%", height: "auto" }}>
      <defs>
        <radialGradient id="glow" cx="50%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#fbf3e4" />
          <stop offset="100%" stopColor="#ecdcc3" />
        </radialGradient>
      </defs>
      <rect width="560" height="520" rx="28" fill="url(#glow)" />
      <circle cx="430" cy="120" r="62" fill="#f3d9a6" opacity="0.6" />
      <g transform="translate(-4 168) scale(1.42)">
        <Tray pear={false} />
      </g>
      <g transform="translate(200 214) scale(0.72)">
        <Carafe />
      </g>
      <g transform="translate(30 214) scale(0.72)">
        <Mug />
      </g>
      <g transform="translate(330 239) scale(0.62)">
        <Candlestick />
      </g>
    </svg>
  );
}
