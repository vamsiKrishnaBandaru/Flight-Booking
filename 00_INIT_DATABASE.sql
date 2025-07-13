-- Drop existing objects for a clean slate
DROP SEQUENCE IF EXISTS "Bookings_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS "Passengers_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS "Flights_id_seq" CASCADE;
DROP SEQUENCE IF EXISTS "Airports_id_seq" CASCADE;

DROP FUNCTION IF EXISTS generate_booking_reference() CASCADE;
DROP FUNCTION IF EXISTS set_booking_reference() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

DROP TABLE IF EXISTS "Passengers" CASCADE;
DROP TABLE IF EXISTS "Bookings" CASCADE;
DROP TABLE IF EXISTS "Flights" CASCADE;
DROP TABLE IF EXISTS "Airports" CASCADE;
DROP TABLE IF EXISTS "Users" CASCADE;

-- Simple Flight Booking Database Schema
-- Using normal integer IDs, not UUIDs

-- Enable RLS
ALTER DATABASE postgres SET row_security = on;

-- Users table (for authentication and profile)
CREATE TABLE IF NOT EXISTS "Users" (
    "id" UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "fullName" VARCHAR(255),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Airports table (for city/airport mapping)
CREATE TABLE IF NOT EXISTS "Airports" (
    "id" SERIAL PRIMARY KEY,
    "code" VARCHAR(3) UNIQUE NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "country" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flights table
CREATE TABLE IF NOT EXISTS "Flights" (
    "id" SERIAL PRIMARY KEY,
    "flightNumber" VARCHAR(10) NOT NULL,
    "airline" VARCHAR(100) NOT NULL,
    "originId" INTEGER REFERENCES "Airports"("id") ON DELETE SET NULL,
    "destinationId" INTEGER REFERENCES "Airports"("id") ON DELETE SET NULL,
    "departureTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "arrivalTime" TIMESTAMP WITH TIME ZONE NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "availableSeats" INTEGER NOT NULL DEFAULT 0,
    "aircraftType" VARCHAR(50),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table (links user to flight)
CREATE TABLE IF NOT EXISTS "Bookings" (
    "id" SERIAL PRIMARY KEY,
    "userId" UUID REFERENCES "Users"("id") ON DELETE CASCADE,
    "flightId" INTEGER REFERENCES "Flights"("id") ON DELETE CASCADE,
    "bookingReference" VARCHAR(20) UNIQUE NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "passengerCount" INTEGER NOT NULL,
    "status" VARCHAR(20) DEFAULT 'confirmed',
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Passengers table (individual travelers on the flight)
CREATE TABLE IF NOT EXISTS "Passengers" (
    "id" SERIAL PRIMARY KEY,
    "bookingId" INTEGER REFERENCES "Bookings"("id") ON DELETE CASCADE,
    "fullName" VARCHAR(255) NOT NULL,
    "dateOfBirth" DATE NOT NULL,
    "passportNumber" VARCHAR(50),
    "nationality" VARCHAR(100),
    "seatNumber" VARCHAR(10),
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE "Users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Airports" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Flights" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Passengers" ENABLE ROW LEVEL SECURITY;

-- Simple RLS Policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON "Users"
    FOR ALL USING (auth.uid() = "id");

-- Airports are public (everyone can see)
CREATE POLICY "Airports are public" ON "Airports"
    FOR SELECT USING (true);

-- Flights are public (everyone can see)
CREATE POLICY "Flights are public" ON "Flights"
    FOR SELECT USING (true);

-- Bookings: users can only see their own bookings
CREATE POLICY "Users can view own bookings" ON "Bookings"
    FOR ALL USING (auth.uid() = "userId");

-- Passengers: users can only see passengers from their bookings
CREATE POLICY "Users can view own passengers" ON "Passengers"
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM "Bookings" b 
            WHERE b.id = "Passengers"."bookingId"
            AND auth.uid() = b."userId"
        )
    );

-- Insert airport data
INSERT INTO "Airports" ("id", "code", "name", "city", "country") VALUES
(1, 'JFK', 'John F. Kennedy International Airport', 'New York', 'USA'),
(2, 'LAX', 'Los Angeles International Airport', 'Los Angeles', 'USA'),
(3, 'LHR', 'London Heathrow Airport', 'London', 'UK'),
(4, 'CDG', 'Charles de Gaulle Airport', 'Paris', 'France'),
(5, 'NRT', 'Narita International Airport', 'Tokyo', 'Japan'),
(6, 'DXB', 'Dubai International Airport', 'Dubai', 'UAE'),
(7, 'SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore'),
(8, 'FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany'),
(9, 'AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', 'Netherlands'),
(10, 'ICN', 'Incheon International Airport', 'Seoul', 'South Korea'),
(11, 'SFO', 'San Francisco International Airport', 'San Francisco', 'USA'),
(12, 'DEN', 'Denver International Airport', 'Denver', 'USA'),
(13, 'ATL', 'Hartsfield-Jackson Atlanta International Airport', 'Atlanta', 'USA'),
(14, 'ORD', 'O''Hare International Airport', 'Chicago', 'USA'),
(15, 'DFW', 'Dallas/Fort Worth International Airport', 'Dallas', 'USA'),
(16, 'MAD', 'Madrid-Barajas Adolfo Suárez Airport', 'Madrid', 'Spain'),
(17, 'YYZ', 'Toronto Pearson International Airport', 'Toronto', 'Canada'),
(18, 'SYD', 'Sydney Kingsford Smith Airport', 'Sydney', 'Australia'),
(19, 'MUC', 'Munich Airport', 'Munich', 'Germany'),
(20, 'ZUR', 'Zurich Airport', 'Zurich', 'Switzerland');

-- Reset sequence for airports to continue from 21
SELECT setval('"Airports_id_seq"', 20, true);

-- Load comprehensive flight data from the generated file
\i 01_FLIGHTS.sql

-- Function to generate booking reference
CREATE OR REPLACE FUNCTION generate_booking_reference()
RETURNS TEXT AS $$
BEGIN
    RETURN 'BK' || LPAD(nextval('"Bookings_id_seq"')::text, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate booking reference
CREATE OR REPLACE FUNCTION set_booking_reference()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW."bookingReference" IS NULL THEN
        NEW."bookingReference" := generate_booking_reference();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_booking_reference
    BEFORE INSERT ON "Bookings"
    FOR EACH ROW
    EXECUTE FUNCTION set_booking_reference();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_users_updated_at
    BEFORE UPDATE ON "Users"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create a user profile when a new user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public."Users" (id, email, "fullName")
    VALUES (new.id, new.email, new.raw_user_meta_data->>'fullName');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute the function after a new user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
