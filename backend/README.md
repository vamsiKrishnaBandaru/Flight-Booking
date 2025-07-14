# 🚀 SkyBook Backend API

RESTful API service for the SkyBook flight booking system built with Node.js, Express, and Supabase.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Setup](#setup)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Deployment](#deployment)

## 🏗️ Architecture

```
backend/
├── src/
│   ├── app.js                 # Express app initialization
│   ├── routes/                # API route definitions
│   │   ├── flightRoutes.js    # Flight endpoints
│   │   ├── bookingRoutes.js   # Booking endpoints
│   │   ├── airportRoutes.js   # Airport endpoints
│   │   └── authRoutes.js      # Authentication endpoints
│   ├── controllers/           # Business logic layer
│   │   ├── flightController.js
│   │   ├── bookingController.js
│   │   └── airportController.js
│   ├── middleware/            # Express middleware
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Global error handling
│   │   └── validator.js      # Request validation
│   ├── helpers/              # Utility functions
│   │   └── responseHelper.js # Standardized responses
│   └── config/               # Configuration
│       └── supabase.js       # Database connection
├── .env.example              # Environment variables template
├── package.json              # Dependencies
└── README.md                 # This file
```

### Design Patterns

1. **Controller Pattern**: Business logic separated from routes
2. **Middleware Chain**: Authentication, validation, error handling
3. **Service Layer**: Database operations abstracted
4. **Response Standardization**: Consistent API responses

## 🚀 Setup

### Prerequisites

- Node.js 18+
- PostgreSQL (via Supabase)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```

3. **Update .env file**
   ```env
   # Server
   PORT=3000
   NODE_ENV=development
   
   # Database
   DATABASE_URL=postgresql://postgres:[password]@db.[project-id].supabase.co:5432/postgres
   
   # Supabase
   SUPABASE_URL=https://[project-id].supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_KEY=your-service-key
   
   # JWT
   JWT_SECRET=your-secret-key
   JWT_EXPIRES_IN=7d
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Response Format
All endpoints return responses in this format:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "timestamp": "2025-07-13T12:00:00.000Z"
}
```

### Authentication
Protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

## 🛫 Flight Endpoints

### Search Flights
```http
POST /api/flights/search
```

**Request Body:**
```json
{
  "originId": 1,
  "destinationId": 5,
  "departureDate": "2025-08-15",
  "returnDate": "2025-08-20",
  "passengers": {
    "adults": 2,
    "children": 1,
    "infants": 0
  },
  "cabinClass": "economy",
  "tripType": "round-trip"
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "flightNumber": "SK123",
      "airline": "SkyBook Airlines",
      "originId": 1,
      "destinationId": 5,
      "departureTime": "2025-08-15T10:00:00Z",
      "arrivalTime": "2025-08-15T14:30:00Z",
      "price": 299.99,
      "availableSeats": 45,
      "cabinClass": "Economy",
      "flightDirection": "outbound"
    }
  ]
}
```

### Get All Flights
```http
GET /api/flights?page=1&limit=20&originId=1&destinationId=5
```

### Get Flight by ID
```http
GET /api/flights/:flightId
```

## ✈️ Airport Endpoints

### Get All Airports
```http
GET /api/airports
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "code": "JFK",
      "name": "John F. Kennedy International Airport",
      "city": "New York",
      "country": "USA"
    }
  ]
}
```

### Search Airports
```http
GET /api/airports/search?query=new
```

## 📋 Booking Endpoints

### Create Booking
```http
POST /api/bookings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "flightId": 123,
  "passengers": [
    {
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01",
      "passportNumber": "A1234567"
    }
  ],
  "totalAmount": 299.99
}
```

### Get User Bookings
```http
GET /api/bookings
Authorization: Bearer <token>
```

### Get Booking by ID
```http
GET /api/bookings/:bookingId
Authorization: Bearer <token>
```

### Cancel Booking
```http
PUT /api/bookings/:bookingId/cancel
Authorization: Bearer <token>
```

## 🔐 Authentication Endpoints

### Register
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com"
    },
    "token": "jwt-token"
  }
}
```

## 🗄️ Database Schema

### Tables

**Airports**
```sql
CREATE TABLE "Airports" (
  id SERIAL PRIMARY KEY,
  code VARCHAR(3) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL
);
```

**Flights**
```sql
CREATE TABLE "Flights" (
  id SERIAL PRIMARY KEY,
  flightNumber VARCHAR(10) NOT NULL,
  airline VARCHAR(100) NOT NULL,
  originId INTEGER REFERENCES "Airports"(id),
  destinationId INTEGER REFERENCES "Airports"(id),
  departureTime TIMESTAMP NOT NULL,
  arrivalTime TIMESTAMP NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  availableSeats INTEGER NOT NULL,
  cabinClass VARCHAR(50) NOT NULL
);
```

**Bookings**
```sql
CREATE TABLE "Bookings" (
  id SERIAL PRIMARY KEY,
  userId UUID REFERENCES auth.users(id),
  flightId INTEGER REFERENCES "Flights"(id),
  reference VARCHAR(10) UNIQUE NOT NULL,
  totalAmount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

**Passengers**
```sql
CREATE TABLE "Passengers" (
  id SERIAL PRIMARY KEY,
  bookingId INTEGER REFERENCES "Bookings"(id),
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  dateOfBirth DATE NOT NULL,
  passportNumber VARCHAR(20)
);
```

## 🛡️ Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-07-13T12:00:00.000Z"
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Invalid request data
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (e.g., duplicate booking)
- `INTERNAL_ERROR` - Server error

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# Coverage report
npm run test:coverage
```

### Test Structure
```
tests/
├── unit/
│   ├── controllers/
│   ├── middleware/
│   └── helpers/
├── integration/
│   ├── flights.test.js
│   ├── bookings.test.js
│   └── auth.test.js
└── fixtures/
    └── testData.js
```

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables (Production)
- Use strong JWT secret
- Enable CORS for specific domains
- Set NODE_ENV=production
- Use connection pooling for database

### Health Check Endpoint
```http
GET /api/health
```

Returns:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 12345,
    "timestamp": "2025-07-13T12:00:00.000Z"
  }
}
```

## 🔧 Maintenance

### Logging
- Request/Response logging with Morgan
- Error logging with Winston
- Structured logs for production

### Monitoring
- Response time tracking
- Error rate monitoring
- Database query performance

### Security
- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection headers

---

<p align="center">Built with ❤️ for SkyBook</p> 
