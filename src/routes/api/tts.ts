import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/tts")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json().catch(() => null)) as { text?: string } | null;
        const text = body?.text?.trim();
        if (!text) return new Response("Teks kosong", { status: 400 });

        const response = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input: text.slice(0, 1200),
            voice: "alloy",
            instructions:
              "Bacakan dalam Bahasa Indonesia dengan gaya ramah, hangat, dan jelas seperti pendamping remaja. Tempo sedang, tidak terburu-buru.",
            stream_format: "sse",
            response_format: "pcm",
          }),
        });

        if (!response.ok) {
          const detail = await response.text().catch(() => "");
          console.error(`TTS failed [${response.status}]: ${detail}`);
          return new Response(detail || "TTS gagal", { status: response.status });
        }

        return new Response(response.body, {
          headers: { "Content-Type": "text/event-stream" },
        });
      },
    },
  },
});
