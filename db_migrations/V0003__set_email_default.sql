-- Make email column optional
ALTER TABLE rsvp_responses ALTER COLUMN email SET DEFAULT '';

-- Update existing NULL emails to empty string
UPDATE rsvp_responses SET email = '' WHERE email IS NULL;