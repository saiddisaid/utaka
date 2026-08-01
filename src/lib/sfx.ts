/**
 * Efek suara UTAKA — dibangkitkan dengan Web Audio API (tanpa file audio),
 * sehingga ringan dan bisa langsung dipakai di browser.
 */

let ctx: AudioContext | null = null;
let muted = false;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  return ctx;
}

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted() {
  return muted;
}

/** Membuka AudioContext pada interaksi pertama pengguna. */
export function unlockAudio() {
  ac();
}

type ToneOpts = {
  freq: number;
  duration?: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  slideTo?: number;
};

function tone({
  freq,
  duration = 0.18,
  type = "sine",
  gain = 0.18,
  delay = 0,
  slideTo,
}: ToneOpts) {
  const c = ac();
  if (!c || muted) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(slideTo, 1), t0 + duration);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(g).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

function noise(duration = 0.12, gain = 0.12, delay = 0) {
  const c = ac();
  if (!c || muted) return;
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
  filter.frequency.value = 1800;
  src.connect(filter).connect(g).connect(c.destination);
  src.start(t0);
}

/** Dadu diputar: rentetan bunyi kocokan. */
export function sfxDiceRoll() {
  for (let i = 0; i < 7; i++) noise(0.07, 0.1, i * 0.075);
  tone({ freq: 520, duration: 0.12, type: "triangle", gain: 0.14, delay: 0.55 });
}

/** Bidak melangkah satu petak. */
export function sfxStep() {
  tone({ freq: 640, duration: 0.07, type: "square", gain: 0.07 });
}

/** Naik tangga: nada ceria menanjak. */
export function sfxLadder() {
  [523, 659, 784, 1046].forEach((f, i) =>
    tone({ freq: f, duration: 0.16, type: "triangle", gain: 0.16, delay: i * 0.09 }),
  );
}

/** Turun ular: nada meluncur turun. */
export function sfxSnake() {
  tone({ freq: 620, slideTo: 130, duration: 0.7, type: "sawtooth", gain: 0.14 });
  tone({ freq: 310, slideTo: 90, duration: 0.7, type: "sine", gain: 0.1, delay: 0.05 });
}

/** Kartu Fun Fact: bunyi "ting" penasaran. */
export function sfxFunFact() {
  tone({ freq: 880, duration: 0.14, type: "sine", gain: 0.14 });
  tone({ freq: 1320, duration: 0.22, type: "sine", gain: 0.12, delay: 0.1 });
}

/** Popup kartu tangga (mood positif & hangat). */
export function sfxCardTangga() {
  [659, 880, 1174].forEach((f, i) =>
    tone({ freq: f, duration: 0.24, type: "sine", gain: 0.14, delay: i * 0.1 }),
  );
}

/** Popup kartu ular (mood reflektif & sendu). */
export function sfxCardUlar() {
  [523, 466, 392].forEach((f, i) =>
    tone({ freq: f, duration: 0.3, type: "triangle", gain: 0.14, delay: i * 0.12 }),
  );
}

/** Menang permainan. */
export function sfxWin() {
  [523, 659, 784, 1046, 1318].forEach((f, i) =>
    tone({ freq: f, duration: 0.28, type: "triangle", gain: 0.16, delay: i * 0.11 }),
  );
}

export function sfxForCard(type: "tangga" | "ular" | "funfact") {
  if (type === "tangga") sfxCardTangga();
  else if (type === "ular") sfxCardUlar();
  else sfxFunFact();
}
