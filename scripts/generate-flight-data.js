
const fs = require('fs');
const path = require('path');

console.log("✈️  Starting comprehensive flight data generation...");

const airports = [
    { id: 1, name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', code: 'JFK' },
    { id: 2, name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA', code: 'LAX' },
    { id: 3, name: 'London Heathrow Airport', city: 'London', country: 'UK', code: 'LHR' },
    { id: 4, name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', code: 'CDG' },
    { id: 5, name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', code: 'NRT' },
    { id: 6, name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', code: 'DXB' },
    { id: 7, name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', code: 'SIN' },
    { id: 8, name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', code: 'FRA' },
    { id: 9, name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', code: 'AMS' },
    { id: 10, name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', code: 'ICN' },
    { id: 11, name: 'San Francisco International Airport', city: 'San Francisco', country: 'USA', code: 'SFO' },
    { id: 12, name: 'Denver International Airport', city: 'Denver', country: 'USA', 'code': 'DEN' },
    { id: 13, name: 'Hartsfield-Jackson Atlanta International Airport', city: 'Atlanta', country: 'USA', code: 'ATL' },
    { id: 14, name: 'O\'Hare International Airport', city: 'Chicago', country: 'USA', code: 'ORD' },
    { id: 15, name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'USA', code: 'DFW' },
    { id: 16, name: 'Madrid-Barajas Adolfo Suárez Airport', city: 'Madrid', country: 'Spain', code: 'MAD' },
    { id: 17, name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', code: 'YYZ' },
    { id: 18, name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', code: 'SYD' },
    { id: 19, name: 'Munich Airport', city: 'Munich', country: 'Germany', code: 'MUC' },
    { id: 20, name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', code: 'ZRH' }
];

const airlines = [
    'Delta Airlines', 'British Airways', 'Japan Airlines', 'Air Canada', 'United Airlines',
    'Qantas', 'Korean Air', 'Virgin Atlantic', 'Asiana Airlines', 'American Airlines',
    'KLM', 'Lufthansa', 'Air France', 'Iberia', 'Swiss', 'Emirates', 'Singapore Airlines', 'ANA'
];

const cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First'];

// Define routes to exclude for testing the "No Flights Found" feature
const excludedRoutes = new Set([
    '20-19', // Zurich (ZRH) -> Munich (MUC)
    '20-18', // Zurich (ZRH) -> Sydney (SYD)
    '20-17', // Zurich (ZRH) -> Toronto (YYZ)
    '20-16', // Zurich (ZRH) -> Madrid (MAD)
    '20-15', // Zurich (ZRH) -> Dallas (DFW)
]);

const flightData = [];
let flightIdCounter = 1;

function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateFlightTime(date) {
    const hour = getRandomInt(0, 23);
    const minute = getRandomInt(0, 5) * 10;
    date.setUTCHours(hour, minute, 0, 0);
    return new Date(date);
}

const today = new Date();
const startMonth = today.getMonth() + 1; 
const startYear = today.getFullYear();

// Generate flights for the next 12 months
for (let origin of airports) {
    for (let destination of airports) {
        if (origin.id === destination.id) continue;

        const routeKey = `${origin.id}-${destination.id}`;
        if (excludedRoutes.has(routeKey)) {
            console.log(`🚫 Excluding test route: ${origin.code} -> ${destination.code}`);
            continue;
        }

        // For each of the next 12 months...
        for (let monthOffset = 0; monthOffset < 12; monthOffset++) {
            const currentMonth = (startMonth + monthOffset) % 12;
            const currentYear = startYear + Math.floor((startMonth + monthOffset) / 12);
            
            // ...pick 3 random days to have flights...
            const daysWithFlights = new Set();
            for (let i = 0; i < 3; i++) {
                daysWithFlights.add(getRandomInt(1, 28)); // Use 28 to be safe for all months
            }

            for (let day of daysWithFlights) {
                const date = new Date(Date.UTC(currentYear, currentMonth, day));
                const numFlightsPerDay = getRandomInt(1, 2); // 1-2 flights per selected day

                for (let i = 0; i < numFlightsPerDay; i++) {
                    const departureTime = generateFlightTime(new Date(date));
                    const flightDurationHours = getRandomInt(1, 18);
                    const flightDurationMinutes = getRandomInt(0, 59);
                    const arrivalTime = new Date(departureTime.getTime() + (flightDurationHours * 60 + flightDurationMinutes) * 60000);

                    const flight = {
                        flightNumber: `${getRandomElement(['AA', 'DL', 'UA', 'BA', 'LH'])}${getRandomInt(100, 9999)}`,
                        airline: getRandomElement(airlines),
                        originId: origin.id,
                        destinationId: destination.id,
                        departureTime: departureTime.toISOString(),
                        arrivalTime: arrivalTime.toISOString(),
                        price: getRandomInt(150, 2500).toFixed(2),
                        availableSeats: getRandomInt(10, 250),
                        aircraftType: getRandomElement(['Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A380'])
                    };
                    flightData.push(flight);
                }
            }
        }
    }
}

console.log(`Generated a total of ${flightData.length} flights for the next 12 months.`);
console.log("Building SQL INSERT statement...");

const sqlHeader = `
-- =================================================================
-- Flight Data for Next 12 Months
-- Generated: ${new Date().toISOString()}
-- Total Flights: ${flightData.length}
-- =================================================================
INSERT INTO "Flights" ("flightNumber", "airline", "originId", "destinationId", "departureTime", "arrivalTime", "price", "availableSeats", "aircraftType") VALUES
`;

const values = flightData.map(f => 
    `('${f.flightNumber}', '${f.airline.replace(/'/g, "''")}', ${f.originId}, ${f.destinationId}, '${f.departureTime}', '${f.arrivalTime}', ${f.price}, ${f.availableSeats}, '${f.aircraftType}')`
).join(',\n');

const sqlStatement = `${sqlHeader}${values};`;

const outputPath = path.join(__dirname, '..', '01_FLIGHTS.sql');
fs.writeFileSync(outputPath, sqlStatement);

console.log(`✅ Successfully generated new flight data!`);
console.log(`SQL script saved to: ${outputPath}`);
console.log("You can now use this file to populate your database."); 