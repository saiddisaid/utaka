import { createFileRoute } from "@tanstack/react-router";

/** Pilihan suara narator Bahasa Indonesia. */
const VOICES = {
  hangat: {
    gemini: "Kore",
    openai: "alloy",
    gaya: "Bacakan dengan ramah, hangat, dan menenangkan dalam Bahasa Indonesia baku, tempo sedang",
  },
  ceria: {
    gemini: "Puck",
    openai: "nova",
    gaya: "Bacakan dengan ceria, bersemangat, dan akrab seperti kakak pendamping remaja, dalam Bahasa Indonesia baku",
  },
  tenang: {
    gemini: "Aoede",
    openai: "shimmer",
    gaya: "Bacakan dengan tenang, lembut, dan penuh empati dalam Bahasa Indonesia baku, tempo pelan",
  },
} as const;

type VoiceKey = keyof typeof VOICES;

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as
          | { text?: string; voice?: string }
          | null;
        const text = body?.text?.trim();
        if (!text) return new Response("Teks kosong", { status: 400 });

        const key = (body?.voice ?? "hangat") as VoiceKey;
        const preset = VOICES[key] ?? VOICES.hangat;
        const input = text.slice(0, 1200);
        const apiKey = process.env["LOVABLE_API_KEY"];
        const endpoint = "https://ai.gateway.lovable.dev/v1/audio/speech";
        const headers = {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        };

        // 1) Gemini TTS — pelafalan Bahasa Indonesia paling natural.
        const gemini = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-tts",
            stream_format: "sse",
            contents: [
              {
                role: "user",
                parts: [{ text: `${preset.gaya}: ${input}` }],
              },
            ],
            generationConfig: {
              responseModalities: ["AUDIO"],
              speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: preset.gemini } },
              },
            },
          }),
        }).catch(() => null);

        if (gemini?.ok && gemini.body) {
          return new Response(gemini.body, {
            headers: { "Content-Type": "text/event-stream" },
          });
        }

        const geminiDetail = gemini ? await gemini.text().catch(() => "") : "jaringan gagal";
        console.error(`Gemini TTS gagal [${gemini?.status ?? 0}]: ${geminiDetail}`);

        // 2) Cadangan: OpenAI TTS agar narasi tidak pernah hilang total.
        const fallback = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input,
            voice: preset.openai,
            instructions: `${preset.gaya}. Gunakan pelafalan Bahasa Indonesia yang jelas dan natural.`,
            stream_format: "sse",
            response_format: "pcm",
          }),
        });

        if (!fallback.ok) {
          const detail = await fallback.text().catch(() => "");
          console.error(`TTS cadangan gagal [${fallback.status}]: ${detail}`);
          return new Response(detail || "TTS gagal", { status: fallback.status });
        }

        return new Response(fallback.body, {
          headers: { "Content-Type": "text/event-stream" },
        });
      },
    },
  },
});
