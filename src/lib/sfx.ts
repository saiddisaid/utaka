/**
 * Efek suara & musik latar UTAKA — dibangkitkan dengan Web Audio API
 * (tanpa file audio), sehingga ringan dan bisa langsung dipakai di browser.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;
let musicStep = 0;
let muted = false;

const SFX_VOLUME = 0.9; // lebih keras dari sebelumnya

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : SFX_VOLUME;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.35;
    musicGain.connect(master);
  }
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  return ctx;
}

export function setMuted(value: boolean) {
  muted = value;
  ac();
  if (master && ctx) master.gain.setTargetAtTime(muted ? 0 : SFX_VOLUME, ctx.currentTime, 0.05);
}

export function isMuted() {
  return muted;
}

/** Membuka AudioContext pada interaksi pertama pengguna. */
export function unlockAudio() {
  ac();
}

/** Menurunkan musik latar sementara (mis. saat narasi kartu dibacakan). */
export function duckMusic(on: boolean) {
  if (!musicGain || !ctx) return;
  musicGain.gain.setTargetAtTime(on ? 0.06 : 0.35, ctx.currentTime, 0.15);
}

type ToneOpts = {
  freq: number;
  duration?: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  slideTo?: number;
  dest?: AudioNode;
};

function tone({
  freq,
  duration = 0.18,
  type = "sine",
  gain = 0.3,
  delay = 0,
  slideTo,
  dest,
}: ToneOpts) {
  const c = ac();
  if (!c || !master) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 1), t0 + duration);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(dest ?? master);
  osc.start(t0);
  osc.stop(t0 + duration + 0.08);
}

function noise(duration = 0.12, gain = 0.25, delay = 0) {
  const c = ac();
  if (!c || !master) return;
  const t0 = c.currentTime + delay;
  const frames = Math.floor(c.sampleRate * duration);
  const buffer = c.createBuffer(1, frames, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  const src = c.createBufferSource();
  src.buffer = buffer;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t0);
  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 1500;
  src.connect(filter).connect(g).connect(master);
  src.start(t0);
}

/* ---------------- Musik latar ---------------- */

const MELODY = [
  659, 784, 880, 784, 659, 587, 659, 523, 587, 659, 784, 880, 988, 880, 784, 659,
];
const BASS = [131, 131, 165, 165, 196, 196, 165, 165];
const BEAT = 0.28;

function musicTick() {
  const c = ac();
  if (!c || !musicGain) return;
  const i = musicStep % MELODY.length;
  tone({
    freq: MELODY[i]!,
    duration: BEAT * 0.85,
    type: "triangle",
    gain: 0.18,
    dest: musicGain,
  });
  if (i % 2 === 0) {
    tone({
      freq: BASS[(musicStep / 2) % BASS.length]!,
      duration: BEAT * 1.4,
      type: "sawtooth",
      gain: 0.12,
      dest: musicGain,
    });
  }
  if (i % 4 === 2) {
    tone({ freq: MELODY[i]! * 2, duration: 0.12, type: "sine", gain: 0.07, dest: musicGain });
  }
  musicStep += 1;
}

/** Musik latar ceria & energik saat bermain. */
export function startMusic() {
  const c = ac();
  if (!c || musicTimer !== null) return;
  musicStep = 0;
  musicTick();
  musicTimer = window.setInterval(musicTick, BEAT * 1000);
}

export function stopMusic() {
  if (musicTimer !== null) {
    window.clearInterval(musicTimer);
    musicTimer = null;
  }
}

export function isMusicPlaying() {
  return musicTimer !== null;
}

/* ---------------- Efek permainan ---------------- */

/** Dadu diputar: rentetan bunyi kocokan yang lebih tebal & lebih lama. */
export function sfxDiceRoll() {
  for (let i = 0; i < 14; i++) noise(0.09, 0.3, i * 0.085);
  tone({ freq: 520, duration: 0.2, type: "triangle", gain: 0.35, delay: 1.15 });
}

/** Bidak melangkah satu petak. */
export function sfxStep() {
  tone({ freq: 520, duration: 0.12, type: "square", gain: 0.22 });
  tone({ freq: 780, duration: 0.09, type: "triangle", gain: 0.14, delay: 0.03 });
}

/** Naik tangga: nada ceria menanjak. */
export function sfxLadder() {
  [523, 659, 784, 1046].forEach((f, i) =>
    tone({ freq: f, duration: 0.22, type: "triangle", gain: 0.32, delay: i * 0.11 }),
  );
}

/** Turun ular: nada meluncur turun. */
export function sfxSnake() {
  tone({ freq: 620, slideTo: 120, duration: 0.9, type: "sawtooth", gain: 0.3 });
  tone({ freq: 310, slideTo: 85, duration: 0.9, type: "sine", gain: 0.22, delay: 0.05 });
}

/** Kartu Fun Fact: bunyi "ting" penasaran yang berkilau. */
export function sfxFunFact() {
  [880, 1174, 1568, 2093].forEach((f, i) =>
    tone({ freq: f, duration: 0.34, type: "sine", gain: 0.34, delay: i * 0.1 }),
  );
  [2349, 2793].forEach((f, i) =>
    tone({ freq: f, duration: 0.9, type: "triangle", gain: 0.14, delay: 0.45 + i * 0.12 }),
  );
  tone({ freq: 1568, slideTo: 2637, duration: 0.8, type: "sine", gain: 0.16, delay: 0.7 });
}

/** Popup kartu tangga: fanfare gembira, meriah & positif. */
export function sfxCardTangga() {
  // fanfare naik
  [523, 659, 784, 1046, 1318, 1568].forEach((f, i) =>
    tone({ freq: f, duration: 0.4, type: "triangle", gain: 0.38, delay: i * 0.09 }),
  );
  // akord kemenangan yang bertahan lama
  [1046, 1318, 1568, 2093].forEach((f, i) =>
    tone({ freq: f, duration: 1.8, type: "sine", gain: 0.2, delay: 0.6 + i * 0.03 }),
  );
  // bass hentakan
  [131, 165, 196].forEach((f, i) =>
    tone({ freq: f, duration: 0.5, type: "sawtooth", gain: 0.2, delay: i * 0.18 }),
  );
  // kilau bintang
  [1976, 2349, 2637].forEach((f, i) =>
    tone({ freq: f, duration: 0.3, type: "sine", gain: 0.16, delay: 1.0 + i * 0.14 }),
  );
  noise(0.35, 0.16, 0.55);
}

/** Popup kartu ular: nada "yaaah" yang menyesal & dramatis. */
export function sfxCardUlar() {
  // "yaaah" turun dua tingkat
  tone({ freq: 700, slideTo: 466, duration: 0.7, type: "triangle", gain: 0.36 });
  tone({ freq: 466, slideTo: 311, duration: 0.9, type: "triangle", gain: 0.32, delay: 0.6 });
  // wah-wah trombone
  tone({ freq: 233, slideTo: 175, duration: 1.4, type: "sawtooth", gain: 0.2, delay: 0.2 });
  // akord minor sedih yang bertahan
  [392, 466, 587].forEach((f, i) =>
    tone({ freq: f, duration: 1.6, type: "sine", gain: 0.16, delay: 1.3 + i * 0.05 }),
  );
  [349, 294, 247].forEach((f, i) =>
    tone({ freq: f, duration: 1.0, type: "triangle", gain: 0.14, delay: 1.5 + i * 0.22 }),
  );
}


/** Menang permainan. */
export function sfxWin() {
  [523, 659, 784, 1046, 1318].forEach((f, i) =>
    tone({ freq: f, duration: 0.35, type: "triangle", gain: 0.34, delay: i * 0.12 }),
  );
}

export function sfxForCard(type: "tangga" | "ular" | "funfact") {
  if (type === "tangga") sfxCardTangga();
  else if (type === "ular") sfxCardUlar();
  else sfxFunFact();
}
