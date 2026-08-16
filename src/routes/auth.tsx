import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk atau Daftar — UTAKA" },
      {
        name: "description",
        content:
          "Login opsional UTAKA agar riwayat permainan dan refleksimu tersimpan di akun. Bisa juga bermain sebagai tamu.",
      },
      { property: "og:title", content: "Masuk atau Daftar — UTAKA" },
      {
        property: "og:description",
        content: "Simpan riwayat permainan dan refleksi UTAKA di akunmu.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  ssr: false,
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setUserEmail(data.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      setUserEmail(s?.user?.email ?? null),
    );
    return () => sub.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { error: err } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (err) throw err;
        setMessage("Cek emailmu untuk mengonfirmasi pendaftaran, ya!");
      } else {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
        navigate({ to: "/online", search: {} });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Gagal masuk dengan Google. Coba lagi.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/online", search: {} });
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-3xl font-extrabold">
        {mode === "login" ? "Masuk ke UTAKA" : "Daftar Akun UTAKA"}
      </h1>
      <p className="mt-2 opacity-80">
        Login bersifat opsional. Kamu tetap bisa{" "}
        <Link to="/online" search={{}} className="underline">
          bermain sebagai tamu
        </Link>
        .
      </p>

      {userEmail ? (
        <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-5">
          <p className="font-bold">Kamu sudah masuk sebagai {userEmail}.</p>
          <div className="mt-4 flex gap-2">
            <Link to="/online" search={{}} className="btn-primary">
              Main Online
            </Link>
            <button
              type="button"
              onClick={() => void supabase.auth.signOut()}
              className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 font-bold"
            >
              Keluar
            </button>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={handleGoogle}
            className="mt-6 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 font-bold"
          >
            Lanjutkan dengan Google
          </button>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div>
              <label htmlFor="email" className="text-sm font-bold">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-white/60"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-sm font-bold">
                Kata sandi
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-white/60"
              />
            </div>
            <button
              type="submit"
              disabled={busy}
              className="btn-primary inline-flex w-full items-center justify-center gap-2 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "login" ? "Masuk" : "Daftar"}
            </button>
          </form>

          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="mt-4 text-sm underline opacity-80"
          >
            {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
          </button>
        </>
      )}

      {message && <p className="mt-4 font-semibold text-green-300">{message}</p>}
      {error && <p className="mt-4 font-semibold text-red-300">{error}</p>}
    </main>
  );
}
