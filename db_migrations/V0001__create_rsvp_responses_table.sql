-- Create RSVP responses table
CREATE TABLE IF NOT EXISTS rsvp_responses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    attendance VARCHAR(10) NOT NULL CHECK (attendance IN ('yes', 'no')),
    guests_count INTEGER DEFAULT 1,
    dietary_restrictions TEXT[],
    other_dietary TEXT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_rsvp_created_at ON rsvp_responses(created_at DESC);
CREATE INDEX idx_rsvp_attendance ON rsvp_responses(attendance);