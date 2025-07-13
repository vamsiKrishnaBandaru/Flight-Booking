# 🎨 SkyBook Frontend

Modern React-based frontend for the SkyBook flight booking system with Redux state management and Material-UI components.

## 📋 Table of Contents

- [Architecture](#architecture)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [Components](#components)
- [State Management](#state-management)
- [Routing](#routing)
- [Styling](#styling)
- [Testing](#testing)
- [Build & Deployment](#build--deployment)

## 🏗️ Architecture

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base UI components
│   │   ├── FlightCard.jsx  # Flight display component
│   │   ├── Header.jsx      # Navigation header
│   │   └── Layout.jsx      # Page layout wrapper
│   ├── pages/              # Route page components
│   │   ├── Home.jsx        # Search page
│   │   ├── Booking.jsx     # Booking flow
│   │   ├── Login.jsx       # Authentication
│   │   └── MyBookings.jsx  # User bookings
│   ├── store/              # Redux state management
│   │   ├── actions/        # Action creators
│   │   ├── reducers/       # State reducers
│   │   ├── selectors/      # Memoized selectors
│   │   └── index.js        # Store configuration
│   ├── context/            # React Context providers
│   │   ├── AuthContext.jsx # Authentication state
│   │   └── ToastContext.jsx# Notifications
│   ├── services/           # API service layer
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Root component
│   └── main.jsx            # Entry point
├── public/                 # Static assets
├── index.html             # HTML template
├── vite.config.js         # Build configuration
└── package.json           # Dependencies
```

### Tech Stack

- **React 18** - UI library with hooks
- **Redux** - State management
- **Material-UI** - Component library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **React Hot Toast** - Notifications

## 🚀 Setup

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   ```

3. **Update .env file**
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

The app will be available at http://localhost:5173

## 📁 Project Structure

### Pages

**Home** (`/`)
- Flight search form
- Search results display
- Popular destinations

**Login** (`/login`)
- User authentication
- Smart navigation back

**Register** (`/register`)
- New user signup
- Form validation

**Booking** (`/booking`)
- Passenger details form
- Flight summary
- Protected route

**My Bookings** (`/bookings`)
- User booking history
- Booking management
- Protected route

**Booking Confirmation** (`/booking-confirmation/:id`)
- Booking success page
- Booking details
- Print/Email options

### Components

#### Core Components

**FlightSearchForm**
```jsx
<FlightSearchForm onSearch={handleSearch} />
```
Props:
- `onSearch`: Callback with search parameters

**FlightCard**
```jsx
<FlightCard flight={flightData} onSelect={handleSelect} />
```
Props:
- `flight`: Flight object
- `onSelect`: Selection callback

**Header**
- Sticky navigation
- User menu
- Smart routing

#### UI Components

**GradientButton**
```jsx
<GradientButton onClick={handleClick} loading={isLoading}>
  Book Now
</GradientButton>
```

**AirportDropdown**
```jsx
<AirportDropdown
  value={selectedAirport}
  onChange={setSelectedAirport}
  airports={airportList}
/>
```

## 🗂️ State Management

### Redux Store Structure

```javascript
{
  flights: {
    outboundFlights: [],
    returnFlights: [],
    selectedFlight: null,
    searchParams: {},
    loading: false,
    error: null,
    hasSearched: false
  },
  airports: {
    airports: [],
    loading: false,
    error: null
  },
  bookings: {
    bookings: [],
    currentBooking: null,
    loading: false,
    error: null
  },
  ui: {
    notifications: []
  }
}
```

### Key Actions

```javascript
// Flight actions
searchFlightsData(searchParams)
setSelectedFlight(flight)
clearFlightSearch()

// Airport actions
getAirportsData()
searchAirports(query)

// Booking actions
createBooking(bookingData)
fetchUserBookings()
cancelBooking(bookingId)
```

### Selectors

```javascript
// Memoized selectors for performance
getOutboundFlights(state)
getReturnFlights(state)
getFlightsLoading(state)
getFlightsError(state)
getFlightsHasSearched(state)
```

## 🛣️ Routing

### Route Structure

```javascript
<Routes>
  {/* Public routes */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  
  {/* Routes with header */}
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    
    {/* Protected routes */}
    <Route path="/booking" element={
      <ProtectedRoute>
        <Booking />
      </ProtectedRoute>
    } />
    <Route path="/bookings" element={
      <ProtectedRoute>
        <MyBookings />
      </ProtectedRoute>
    } />
  </Route>
</Routes>
```

### Navigation Guards

- `ProtectedRoute` - Requires authentication
- Smart redirects after login
- State preservation during navigation

## 🎨 Styling

### Theme Configuration

```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#3B82F6',    // Blue
      light: '#60A5FA',
      dark: '#2563EB',
    },
    secondary: {
      main: '#64748B',    // Gray
    },
    background: {
      default: '#EFF7FB', // Light blue
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", sans-serif',
  }
})
```

### Component Styling

- Material-UI `sx` prop for inline styles
- Consistent spacing with theme
- Responsive breakpoints
- Custom CSS modules where needed

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm test

# Watch mode
npm test:watch

# Coverage
npm test:coverage
```

### Component Testing

```javascript
// Example test
describe('FlightCard', () => {
  it('displays flight information correctly', () => {
    const flight = {
      airline: 'SkyBook Airlines',
      flightNumber: 'SK123',
      price: 299.99
    }
    
    render(<FlightCard flight={flight} />)
    
    expect(screen.getByText('SK123')).toBeInTheDocument()
    expect(screen.getByText('$299')).toBeInTheDocument()
  })
})
```

### E2E Testing

```bash
# Run Cypress tests
npm run test:e2e
```

## 🏗️ Build & Deployment

### Development Build

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Creates optimized build in `dist/` directory.

### Build Analysis

```bash
npm run build:analyze
```

### Deployment

#### Vercel
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

#### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 🔧 Configuration

### Vite Config

```javascript
// vite.config.js
export default {
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@pages': '/src/pages',
      '@store': '/src/store',
      '@utils': '/src/utils'
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

### ESLint Config

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    'react/prop-types': 'off',
    'no-unused-vars': 'warn'
  }
}
```

## 🚀 Performance Optimizations

- Code splitting with React.lazy
- Memoized selectors with reselect
- Virtual scrolling for large lists
- Image lazy loading
- Bundle size optimization
- Service worker for offline support

## 🔍 Debugging

### Redux DevTools

Install browser extension for Redux debugging:
- View state tree
- Time-travel debugging
- Action history

### React DevTools

- Component tree inspection
- Props/State viewing
- Performance profiling

## 📱 Responsive Design

### Breakpoints

- Mobile: < 600px
- Tablet: 600px - 960px
- Desktop: > 960px

### Mobile-First Approach

```jsx
sx={{
  fontSize: { xs: '14px', md: '16px' },
  padding: { xs: 2, md: 3 },
  display: { xs: 'block', md: 'flex' }
}}
```

---

<p align="center">Built with ❤️ for SkyBook</p>
