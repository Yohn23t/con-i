-- Maintenance mode table
CREATE TABLE IF NOT EXISTS maintenance_mode (
  id SERIAL PRIMARY KEY,
  is_enabled BOOLEAN DEFAULT FALSE,
  message VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial record
INSERT INTO maintenance_mode (is_enabled, message) 
VALUES (FALSE, 'System is operational')
ON CONFLICT DO NOTHING;
