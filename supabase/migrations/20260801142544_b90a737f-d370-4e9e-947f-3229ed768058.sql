CREATE TABLE public.rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'lobby',
  host_player_id uuid,
  turn_index integer NOT NULL DEFAULT 0,
  dice integer NOT NULL DEFAULT 1,
  total_rolls integer NOT NULL DEFAULT 0,
  pending_card_id text,
  pending_card_player_id uuid,
  winner_player_id uuid,
  started_at timestamptz,
  finished_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.room_players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  name text NOT NULL,
  seat integer NOT NULL,
  pos integer NOT NULL DEFAULT 1,
  cards integer NOT NULL DEFAULT 0,
  user_id uuid,
  last_seen timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (room_id, seat)
);

CREATE TABLE public.room_player_tokens (
  player_id uuid PRIMARY KEY REFERENCES public.room_players(id) ON DELETE CASCADE,
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  token text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.room_events (
  id bigserial PRIMARY KEY,
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.room_messages (
  id bigserial PRIMARY KEY,
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  player_id uuid REFERENCES public.room_players(id) ON DELETE SET NULL,
  name text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.room_reflections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  player_id uuid REFERENCES public.room_players(id) ON DELETE SET NULL,
  name text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_room_players_room ON public.room_players(room_id);
CREATE INDEX idx_room_events_room ON public.room_events(room_id, id DESC);
CREATE INDEX idx_room_messages_room ON public.room_messages(room_id, id DESC);
CREATE INDEX idx_room_reflections_room ON public.room_reflections(room_id);

GRANT SELECT ON public.rooms TO anon, authenticated;
GRANT SELECT ON public.room_players TO anon, authenticated;
GRANT SELECT ON public.room_events TO anon, authenticated;
GRANT SELECT ON public.room_messages TO anon, authenticated;
GRANT SELECT ON public.room_reflections TO anon, authenticated;
GRANT ALL ON public.rooms TO service_role;
GRANT ALL ON public.room_players TO service_role;
GRANT ALL ON public.room_player_tokens TO service_role;
GRANT ALL ON public.room_events TO service_role;
GRANT ALL ON public.room_messages TO service_role;
GRANT ALL ON public.room_reflections TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.room_events_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.room_messages_id_seq TO service_role;

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_player_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_reflections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rooms are publicly viewable" ON public.rooms FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Room players are publicly viewable" ON public.room_players FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Room events are publicly viewable" ON public.room_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Room messages are publicly viewable" ON public.room_messages FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Room reflections are publicly viewable" ON public.room_reflections FOR SELECT TO anon, authenticated USING (true);

ALTER TABLE public.rooms REPLICA IDENTITY FULL;
ALTER TABLE public.room_players REPLICA IDENTITY FULL;

ALTER PUBLICATION supabase_realtime ADD TABLE public.rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_players;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.room_reflections;