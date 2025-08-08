-- Create the vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id SERIAL PRIMARY KEY,
  plate_number VARCHAR(20) NOT NULL UNIQUE,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  year INTEGER NOT NULL,
  type VARCHAR(30) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  location VARCHAR(100),
  fuel_level INTEGER DEFAULT 100,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO vehicles (plate_number, make, model, year, type, status, location, fuel_level) VALUES
('ABC-123', 'Ford', 'Transit', 2022, 'Van', 'active', 'Fleet Depot', 85),
('DEF-456', 'Mercedes', 'Sprinter', 2021, 'Van', 'maintenance', 'Service Center', 45),
('GHI-789', 'Chevrolet', 'Express', 2023, 'Van', 'active', 'Main Office', 92),
('JKL-012', 'Isuzu', 'NPR', 2020, 'Truck', 'active', 'Warehouse', 78);
