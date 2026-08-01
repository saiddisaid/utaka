/** Narasi kartu (text-to-speech) dengan pemutaran streaming PCM. */

let ctx: AudioContext | null = null;
let controller: AbortController | null = null;
let activeSources: AudioBufferSourceNode[] = [];

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext({ sampleRate: 24000 });
  return ctx;
}

export function stopNarration() {
  controller?.abort();
  controller = null;
  activeSources.forEach((s) => {
    try {
      s.stop();
    } catch {
      /* sudah berhenti */
    }
  });
  activeSources = [];
}

export type NarratorVoice = "hangat" | "ceria" | "tenang";

/**
 * Membacakan teks dan resolve setelah pembacaan selesai.
 * Melempar error bila narasi gagal, agar pemanggil bisa lanjut tanpa suara.
 */
export async function narrate(text: string, voice: NarratorVoice = "hangat"): Promise<void> {
  stopNarration();
  const ctrl = new AbortController();
  controller = ctrl;


  const c = getCtx();
  if (c.state === "suspended") await c.resume().catch(() => {});

  let playhead = 0;
  let pending = new Uint8Array(0);

  const playChunk = (incoming: Uint8Array) => {
    const bytes = new Uint8Array(pending.length + incoming.length);
    bytes.set(pending);
    bytes.set(incoming, pending.length);
    const usable = bytes.length - (bytes.length % 2);
    pending = bytes.slice(usable);
    if (usable === 0) return;
    const samples = new Int16Array(bytes.buffer, 0, usable / 2);
    const floats = Float32Array.from(samples, (s) => s / 32768);
    const buffer = c.createBuffer(1, floats.length, 24000);
    buffer.copyToChannel(floats, 0);
    const source = c.createBufferSource();
    source.buffer = buffer;
    source.connect(c.destination);
    if (playhead === 0) playhead = c.currentTime + 0.15;
    else playhead = Math.max(playhead, c.currentTime);
    source.start(playhead);
    playhead += buffer.duration;
    activeSources.push(source);
  };

  const res = await fetch("/api/tts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, voice }),
    signal: ctrl.signal,
  });
  if (!res.ok || !res.body) throw new Error(`TTS ${res.status}`);

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buf = "";
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += value;
    const parts = buf.split("\n\n");
    buf = parts.pop() ?? "";
    for (const part of parts) {
      for (const line of part.split("\n")) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        let payload: { type?: string; audio?: string };
        try {
          payload = JSON.parse(data);
        } catch {
          continue;
        }
        if (payload.type !== "speech.audio.delta" || !payload.audio) continue;
        const binary = atob(payload.audio);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        playChunk(bytes);
      }
    }
  }

  if (ctrl.signal.aborted) return;
  const remaining = Math.max(0, playhead - c.currentTime);
  await new Promise<void>((resolve) => setTimeout(resolve, remaining * 1000 + 150));
  activeSources = [];
  if (controller === ctrl) controller = null;
}
