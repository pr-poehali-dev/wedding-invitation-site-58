ALTER TABLE rsvp_responses 
ADD COLUMN IF NOT EXISTS music_preferences TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS return_transfer TEXT DEFAULT '';