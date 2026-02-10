-- Make phone column required (email stays for backward compatibility but not used)
ALTER TABLE rsvp_responses ALTER COLUMN phone SET NOT NULL;