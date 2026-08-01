ALTER TABLE public.rooms
  ADD COLUMN last_move jsonb,
  ADD COLUMN move_seq bigint NOT NULL DEFAULT 0;