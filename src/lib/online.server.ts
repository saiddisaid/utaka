/**
 * Logika server untuk mode bermain online UTAKA.
 * File ini hanya boleh dipakai dari sisi server (nama *.server.ts).
 */
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { BOARD_SIZE, playerColors } from "@/lib/board";
import { moveLogText, resolveMove, rollDiceValue } from "@/lib/game-engine";

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const MAX_PLAYERS = playerColors.length;

function randomCode(len = 5): string {
  let out = "";
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  for (let i = 0; i < len; i++) out += CODE_ALPHABET[bytes[i]! % CODE_ALPHABET.length];
  return out;
}

function randomToken(): string {
  return crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
}

function cleanName(name: string, fallback: string): string {
  const n = name.trim().slice(0, 16);
  return n.length > 0 ? n : fallback;
}

async function logEvent(roomId: string, texts: string[]) {
  if (texts.length === 0) return;
  await supabaseAdmin
    .from("room_events")
    .insert(texts.map((text) => ({ room_id: roomId, text })));
}

type Ctx = {
  room: {
    id: string;
    code: string;
    status: string;
    host_player_id: string | null;
    turn_index: number;
    total_rolls: number;
    pending_card_id: string | null;
    pending_card_player_id: string | null;
    winner_player_id: string | null;
    move_seq: number;
    started_at: string | null;
  };
  me: { id: string; name: string; seat: number; pos: number; cards: number };
  players: { id: string; name: string; seat: number; pos: number; cards: number }[];
};

async function loadContext(token: string): Promise<Ctx> {
  const { data: tok } = await supabaseAdmin
    .from("room_player_tokens")
    .select("player_id, room_id")
    .eq("token", token)
    .maybeSingle();
  if (!tok) throw new Error("Sesi pemain tidak ditemukan. Silakan gabung ulang ke room.");

  const [{ data: room }, { data: players }] = await Promise.all([
    supabaseAdmin.from("rooms").select("*").eq("id", tok.room_id).maybeSingle(),
    supabaseAdmin
      .from("room_players")
      .select("id, name, seat, pos, cards")
      .eq("room_id", tok.room_id)
      .order("seat"),
  ]);
  if (!room) throw new Error("Room tidak ditemukan.");
  const list = players ?? [];
  const me = list.find((p) => p.id === tok.player_id);
  if (!me) throw new Error("Kamu sudah tidak berada di room ini.");
  return { room: room as Ctx["room"], me, players: list };
}

export async function createRoom(name: string, userId: string | null) {
  let code = randomCode();
  for (let i = 0; i < 6; i++) {
    const { data } = await supabaseAdmin.from("rooms").select("id").eq("code", code).maybeSingle();
    if (!data) break;
    code = randomCode();
  }

  const { data: room, error } = await supabaseAdmin
    .from("rooms")
    .insert({ code })
    .select("id, code")
    .single();
  if (error || !room) throw new Error("Gagal membuat room. Coba lagi.");

  const player = await addPlayer(room.id, cleanName(name, "Pemain 1"), 0, userId);
  await supabaseAdmin.from("rooms").update({ host_player_id: player.id }).eq("id", room.id);
  await logEvent(room.id, [`${player.name} membuat room ${room.code}.`]);

  return { code: room.code, roomId: room.id, playerId: player.id, token: player.token };
}

async function addPlayer(roomId: string, name: string, seat: number, userId: string | null) {
  const { data: player, error } = await supabaseAdmin
    .from("room_players")
    .insert({ room_id: roomId, name, seat, user_id: userId })
    .select("id, name, seat")
    .single();
  if (error || !player) throw new Error("Gagal menambahkan pemain.");
  const token = randomToken();
  await supabaseAdmin
    .from("room_player_tokens")
    .insert({ player_id: player.id, room_id: roomId, token });
  return { ...player, token };
}

export async function joinRoom(code: string, name: string, userId: string | null) {
  const clean = code.trim().toUpperCase();
  const { data: room } = await supabaseAdmin
    .from("rooms")
    .select("id, code, status")
    .eq("code", clean)
    .maybeSingle();
  if (!room) throw new Error("Kode room tidak ditemukan.");
  if (room.status !== "lobby") throw new Error("Permainan di room ini sudah dimulai.");

  const { data: players } = await supabaseAdmin
    .from("room_players")
    .select("seat")
    .eq("room_id", room.id)
    .order("seat");
  const used = (players ?? []).map((p) => p.seat);
  if (used.length >= MAX_PLAYERS) throw new Error("Room sudah penuh (maksimal 4 pemain).");
  let seat = 0;
  while (used.includes(seat)) seat += 1;

  const player = await addPlayer(room.id, cleanName(name, `Pemain ${seat + 1}`), seat, userId);
  await logEvent(room.id, [`${player.name} bergabung ke room.`]);
  return { code: room.code, roomId: room.id, playerId: player.id, token: player.token };
}

export async function startGame(token: string) {
  const { room, me, players } = await loadContext(token);
  if (room.host_player_id !== me.id) throw new Error("Hanya host yang bisa memulai permainan.");
  if (room.status !== "lobby") throw new Error("Permainan sudah dimulai.");
  if (players.length < 2) throw new Error("Butuh minimal 2 pemain untuk bermain online.");

  await supabaseAdmin
    .from("rooms")
    .update({
      status: "playing",
      started_at: new Date().toISOString(),
      turn_index: 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", room.id);
  await logEvent(room.id, [
    `Permainan dimulai! Giliran pertama: ${players[0]!.name}.`,
  ]);
  return { ok: true };
}

export async function rollDice(token: string) {
  const { room, me, players } = await loadContext(token);
  if (room.status !== "playing") throw new Error("Permainan belum berjalan.");
  if (room.pending_card_id) throw new Error("Masih ada kartu yang sedang dibacakan.");
  const currentSeat = players[room.turn_index % players.length]!.seat;
  if (currentSeat !== me.seat) throw new Error("Bukan giliranmu.");

  const dice = rollDiceValue();
  const move = resolveMove(me.pos, dice);

  await supabaseAdmin
    .from("room_players")
    .update({
      pos: move.to,
      cards: me.cards + (move.cardId ? 1 : 0),
      last_seen: new Date().toISOString(),
    })
    .eq("id", me.id);

  const win = move.win;
  await supabaseAdmin
    .from("rooms")
    .update({
      dice,
      total_rolls: room.total_rolls + 1,
      move_seq: room.move_seq + 1,
      last_move: {
        seq: room.move_seq + 1,
        playerId: me.id,
        dice,
        from: move.from,
        landed: move.landed,
        to: move.to,
        kind: move.kind,
        cardId: move.cardId,
      },
      pending_card_id: move.cardId,
      pending_card_player_id: move.cardId ? me.id : null,
      turn_index: move.cardId || win ? room.turn_index : (room.turn_index + 1) % players.length,
      status: win ? "finished" : "playing",
      winner_player_id: win ? me.id : null,
      finished_at: win ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", room.id);

  await logEvent(room.id, moveLogText(me.name, move));
  return { dice, move };
}

export async function closeCard(token: string) {
  const { room, me, players } = await loadContext(token);
  if (!room.pending_card_id) return { ok: true };
  if (room.pending_card_player_id !== me.id && room.host_player_id !== me.id) {
    throw new Error("Hanya pemain yang mendapat kartu yang bisa menutupnya.");
  }
  const finished = room.status === "finished";
  await supabaseAdmin
    .from("rooms")
    .update({
      pending_card_id: null,
      pending_card_player_id: null,
      turn_index: finished ? room.turn_index : (room.turn_index + 1) % players.length,
      updated_at: new Date().toISOString(),
    })
    .eq("id", room.id);
  return { ok: true };
}

export async function skipTurn(token: string) {
  const { room, me, players } = await loadContext(token);
  if (room.host_player_id !== me.id) throw new Error("Hanya host yang bisa melewati giliran.");
  if (room.status !== "playing") throw new Error("Permainan belum berjalan.");
  const skipped = players[room.turn_index % players.length]!;
  await supabaseAdmin
    .from("rooms")
    .update({
      pending_card_id: null,
      pending_card_player_id: null,
      turn_index: (room.turn_index + 1) % players.length,
      updated_at: new Date().toISOString(),
    })
    .eq("id", room.id);
  await logEvent(room.id, [`⏭️ Giliran ${skipped.name} dilewati oleh host.`]);
  return { ok: true };
}

export async function kickPlayer(token: string, playerId: string) {
  const { room, me, players } = await loadContext(token);
  if (room.host_player_id !== me.id) throw new Error("Hanya host yang bisa mengeluarkan pemain.");
  if (room.status !== "lobby") throw new Error("Pemain hanya bisa dikeluarkan saat masih di lobi.");
  if (playerId === me.id) throw new Error("Host tidak bisa mengeluarkan dirinya sendiri.");
  const target = players.find((p) => p.id === playerId);
  if (!target) return { ok: true };

  await supabaseAdmin.from("room_players").delete().eq("id", playerId);
  const rest = players.filter((p) => p.id !== playerId).sort((a, b) => a.seat - b.seat);
  for (let i = 0; i < rest.length; i++) {
    if (rest[i]!.seat !== i) {
      await supabaseAdmin.from("room_players").update({ seat: 100 + i }).eq("id", rest[i]!.id);
    }
  }
  for (let i = 0; i < rest.length; i++) {
    await supabaseAdmin.from("room_players").update({ seat: i }).eq("id", rest[i]!.id);
  }
  await logEvent(room.id, [`${target.name} dikeluarkan dari room oleh host.`]);
  return { ok: true };
}

export async function heartbeat(token: string) {
  const { data: tok } = await supabaseAdmin
    .from("room_player_tokens")
    .select("player_id")
    .eq("token", token)
    .maybeSingle();
  if (!tok) return { ok: false };
  await supabaseAdmin
    .from("room_players")
    .update({ last_seen: new Date().toISOString() })
    .eq("id", tok.player_id);
  return { ok: true };
}

export async function sendMessage(token: string, body: string) {
  const { room, me } = await loadContext(token);
  const text = body.trim().slice(0, 300);
  if (!text) return { ok: true };
  await supabaseAdmin
    .from("room_messages")
    .insert({ room_id: room.id, player_id: me.id, name: me.name, body: text });
  return { ok: true };
}

export async function saveReflection(token: string, answers: Record<string, string>) {
  const { room, me } = await loadContext(token);
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(answers)) clean[k.slice(0, 40)] = String(v).slice(0, 800);
  await supabaseAdmin
    .from("room_reflections")
    .insert({ room_id: room.id, player_id: me.id, name: me.name, answers: clean });
  return { ok: true };
}

export async function resetRoom(token: string) {
  const { room, me, players } = await loadContext(token);
  if (room.host_player_id !== me.id) throw new Error("Hanya host yang bisa memulai ulang.");
  await supabaseAdmin
    .from("room_players")
    .update({ pos: 1, cards: 0 })
    .eq("room_id", room.id);
  await supabaseAdmin
    .from("rooms")
    .update({
      status: "lobby",
      turn_index: 0,
      dice: 1,
      total_rolls: 0,
      pending_card_id: null,
      pending_card_player_id: null,
      winner_player_id: null,
      started_at: null,
      finished_at: null,
      last_move: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", room.id);
  await logEvent(room.id, [`Room disetel ulang oleh host. (${players.length} pemain siap)`]);
  return { ok: true, board: BOARD_SIZE };
}
