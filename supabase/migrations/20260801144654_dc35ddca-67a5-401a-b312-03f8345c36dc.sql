
-- Remove public read access on all room tables
DROP POLICY IF EXISTS "Rooms are publicly viewable" ON public.rooms;
DROP POLICY IF EXISTS "Room players are publicly viewable" ON public.room_players;
DROP POLICY IF EXISTS "Room events are publicly viewable" ON public.room_events;
DROP POLICY IF EXISTS "Room messages are publicly viewable" ON public.room_messages;
DROP POLICY IF EXISTS "Room reflections are publicly viewable" ON public.room_reflections;

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_player_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_player_tokens FORCE ROW LEVEL SECURITY;

REVOKE ALL ON public.rooms FROM anon, authenticated;
REVOKE ALL ON public.room_players FROM anon, authenticated;
REVOKE ALL ON public.room_events FROM anon, authenticated;
REVOKE ALL ON public.room_messages FROM anon, authenticated;
REVOKE ALL ON public.room_reflections FROM anon, authenticated;
REVOKE ALL ON public.room_player_tokens FROM anon, authenticated;

GRANT ALL ON public.rooms TO service_role;
GRANT ALL ON public.room_players TO service_role;
GRANT ALL ON public.room_events TO service_role;
GRANT ALL ON public.room_messages TO service_role;
GRANT ALL ON public.room_reflections TO service_role;
GRANT ALL ON public.room_player_tokens TO service_role;
