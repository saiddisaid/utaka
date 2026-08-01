export type RoomSession = {
  code: string;
  roomId: string;
  playerId: string;
  token: string;
  name: string;
};

const key = (code: string) => `utaka-room-${code.toUpperCase()}`;

export function getRoomSession(code: string): RoomSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key(code));
    return raw ? (JSON.parse(raw) as RoomSession) : null;
  } catch {
    return null;
  }
}

export function saveRoomSession(s: RoomSession) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key(s.code), JSON.stringify(s));
  window.localStorage.setItem("utaka-last-name", s.name);
}

export function clearRoomSession(code: string) {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(key(code));
}

export function lastUsedName(): string {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("utaka-last-name") ?? "";
}
