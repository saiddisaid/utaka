import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const tokenSchema = z.object({ token: z.string().min(10).max(200) });

export const createRoomFn = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ name: z.string().max(40) }).parse(d))
  .handler(async ({ data }) => {
    const { createRoom } = await import("./online.server");
    return createRoom(data.name, null);
  });

export const joinRoomFn = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z.object({ code: z.string().min(3).max(12), name: z.string().max(40) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { joinRoom } = await import("./online.server");
    return joinRoom(data.code, data.name, null);
  });

export const startGameFn = createServerFn({ method: "POST" })
  .inputValidator((d) => tokenSchema.parse(d))
  .handler(async ({ data }) => {
    const { startGame } = await import("./online.server");
    return startGame(data.token);
  });

export const rollDiceFn = createServerFn({ method: "POST" })
  .inputValidator((d) => tokenSchema.parse(d))
  .handler(async ({ data }) => {
    const { rollDice } = await import("./online.server");
    return rollDice(data.token);
  });

export const closeCardFn = createServerFn({ method: "POST" })
  .inputValidator((d) => tokenSchema.parse(d))
  .handler(async ({ data }) => {
    const { closeCard } = await import("./online.server");
    return closeCard(data.token);
  });

export const skipTurnFn = createServerFn({ method: "POST" })
  .inputValidator((d) => tokenSchema.parse(d))
  .handler(async ({ data }) => {
    const { skipTurn } = await import("./online.server");
    return skipTurn(data.token);
  });

export const kickPlayerFn = createServerFn({ method: "POST" })
  .inputValidator((d) => tokenSchema.extend({ playerId: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { kickPlayer } = await import("./online.server");
    return kickPlayer(data.token, data.playerId);
  });

export const heartbeatFn = createServerFn({ method: "POST" })
  .inputValidator((d) => tokenSchema.parse(d))
  .handler(async ({ data }) => {
    const { heartbeat } = await import("./online.server");
    return heartbeat(data.token);
  });

export const sendMessageFn = createServerFn({ method: "POST" })
  .inputValidator((d) => tokenSchema.extend({ body: z.string().max(300) }).parse(d))
  .handler(async ({ data }) => {
    const { sendMessage } = await import("./online.server");
    return sendMessage(data.token, data.body);
  });

export const saveReflectionFn = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    tokenSchema.extend({ answers: z.record(z.string(), z.string()) }).parse(d),
  )
  .handler(async ({ data }) => {
    const { saveReflection } = await import("./online.server");
    return saveReflection(data.token, data.answers);
  });

export const resetRoomFn = createServerFn({ method: "POST" })
  .inputValidator((d) => tokenSchema.parse(d))
  .handler(async ({ data }) => {
    const { resetRoom } = await import("./online.server");
    return resetRoom(data.token);
  });

/** Menautkan pemain tamu ke akun yang sedang login (opsional). */
export const linkAccountFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => tokenSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { linkAccount } = await import("./online.server");
    return linkAccount(data.token, context.userId);
  });
