# 🧪 SkyBook Testing Guide

Comprehensive testing guide for the SkyBook flight booking system covering all features, user flows, and edge cases.

## 📋 Table of Contents

- [Test Environment Setup](#test-environment-setup)
- [User Flows](#user-flows)
- [Feature Testing](#feature-testing)
- [API Testing](#api-testing)
- [Edge Cases](#edge-cases)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Checklist](#checklist)

## 🚀 Test Environment Setup

### Prerequisites

1. **Backend Running**
   ```bash
   cd backend
   npm run dev
   ```
   Verify: http://localhost:3000/api/health

2. **Frontend Running**
   ```bash
   cd frontend
   npm run dev
   ```
   Verify: http://localhost:5173

3. **Database Populated**
   ```bash
   psql $DATABASE_URL < 00_INIT_DATABASE.sql
   ```

### Test Accounts

```
Regular User:
Email: test@example.com
Password: Test123!

Admin User:
Email: admin@skybook.com
Password: Admin123!
```

## 🔄 User Flows

### 1. Flight Search & Booking Flow

**Happy Path:**

1. **Home Page**
   - ✅ Page loads without errors
   - ✅ Search form is visible
   - ✅ Airport dropdowns populate

2. **Search Flights**
   - ✅ Select origin: "Atlanta (ATL)"
   - ✅ Select destination: "New York (JFK)"
   - ✅ Choose departure date: Next month, 15th
   - ✅ Choose return date: Next month, 20th
   - ✅ Select passengers: 2 adults, 1 child
   - ✅ Select cabin class: Economy
   - ✅ Click "Search Flights"

3. **View Results**
   - ✅ Loading spinner appears
   - ✅ Results display within 3 seconds
   - ✅ Flight cards show correct information
   - ✅ Prices are formatted correctly
   - ✅ "Select Flight" buttons work

4. **Select Flight**
   - ✅ Click "Select Flight" on outbound
   - ✅ If not logged in → Redirected to login
   - ✅ After login → Returns to booking

5. **Complete Booking**
   - ✅ Flight summary shows correct details
   - ✅ Passenger forms appear for each traveler
   - ✅ Form validation works
   - ✅ Total price calculates correctly
   - ✅ "Complete Booking" submits successfully

6. **Confirmation**
   - ✅ Booking confirmation page loads
   - ✅ Booking reference displayed
   - ✅ All details are correct
   - ✅ Print button works

### 2. Authentication Flow

**Registration:**
1. ✅ Navigate to /register
2. ✅ Fill email: newuser@test.com
3. ✅ Fill password: Test123!
4. ✅ Confirm password: Test123!
5. ✅ Submit form
6. ✅ Success message appears
7. ✅ Redirected to login

**Login:**
1. ✅ Navigate to /login
2. ✅ Fill email: test@example.com
3. ✅ Fill password: Test123!
4. ✅ Submit form
5. ✅ Success toast appears
6. ✅ Redirected to previous page or home
7. ✅ User menu appears in header

**Logout:**
1. ✅ Click user avatar
2. ✅ Click "Sign Out"
3. ✅ User menu disappears
4. ✅ Redirected to home

### 3. My Bookings Flow

1. ✅ Login as user with bookings
2. ✅ Navigate to "My Bookings"
3. ✅ Bookings list loads
4. ✅ Each booking shows:
   - Flight details
   - Booking reference
   - Status
   - Price
5. ✅ Click booking for details
6. ✅ Cancel booking (if applicable)

## 🎯 Feature Testing

### Search Features

**Date Selection:**
- ✅ Past dates are disabled
- ✅ Return date must be after departure
- ✅ Calendar navigation works
- ✅ Selected dates highlight

**Passenger Selection:**
- ✅ Adults: minimum 1, maximum 9
- ✅ Children: minimum 0, maximum 9
- ✅ Total passengers <= 9
- ✅ Counter buttons work
- ✅ Popover closes on outside click

**Airport Selection:**
- ✅ Search by city name
- ✅ Search by airport code
- ✅ Search by country
- ✅ Selected airport is excluded from other dropdown
- ✅ Swap button exchanges origin/destination

**No Results Handling:**
- ✅ Search Zurich (ZRH) → Dallas (DFW)
- ✅ "No flights found" message appears
- ✅ Helpful suggestions shown
- ✅ "Try Different Search" button works

**Future Flights Fallback:**
- ✅ Search for date with no exact matches
- ✅ System shows future flights
- ✅ "Alternative dates" indicator visible

### Booking Features

**Passenger Details:**
- ✅ Required fields validation
- ✅ Date of birth format
- ✅ Name format validation
- ✅ Passport number format

**Price Calculation:**
- ✅ Base price × number of passengers
- ✅ Correct currency formatting
- ✅ Updates when passenger count changes

**Navigation:**
- ✅ Back button returns to search results
- ✅ Breadcrumbs work correctly
- ✅ Cancel returns to home

### UI/UX Features

**Responsive Design:**
- ✅ Mobile (375px): Layout adjusts, menu collapses
- ✅ Tablet (768px): Two-column layouts work
- ✅ Desktop (1440px): Full layout displays

**Loading States:**
- ✅ Search button shows spinner
- ✅ Page transitions smooth
- ✅ Skeleton loaders appear

**Error States:**
- ✅ Network error: Toast notification
- ✅ Validation error: Field highlights
- ✅ 404 page: Friendly message

## 🔌 API Testing

### Flight Search API

```bash
# Test flight search
curl -X POST http://localhost:3000/api/flights/search \
  -H "Content-Type: application/json" \
  -d '{
    "originId": 1,
    "destinationId": 2,
    "departureDate": "2025-08-15",
    "returnDate": "2025-08-20",
    "passengers": {"adults": 2, "children": 0},
    "cabinClass": "economy",
    "tripType": "round-trip"
  }'
```

Expected: 200 OK with flight array

### Airport API

```bash
# Get all airports
curl http://localhost:3000/api/airports

# Search airports
curl http://localhost:3000/api/airports/search?query=new
```

Expected: 200 OK with airport array

### Booking API

```bash
# Create booking (requires auth token)
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "flightId": 123,
    "passengers": [{
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-01"
    }],
    "totalAmount": 299.99
  }'
```

Expected: 201 Created with booking details

## 🔍 Edge Cases

### Search Edge Cases

1. **Same Origin/Destination**
   - ✅ Validation prevents selection
   - ✅ Error message shown

2. **Invalid Date Range**
   - ✅ Return before departure blocked
   - ✅ Dates > 1 year blocked

3. **Special Characters in Search**
   - ✅ Airport search handles: O'Hare, São Paulo
   - ✅ SQL injection attempts blocked

### Booking Edge Cases

1. **Session Timeout**
   - ✅ Booking page handles expired session
   - ✅ Redirects to login with context

2. **Flight No Longer Available**
   - ✅ Error message on booking attempt
   - ✅ Suggests returning to search

3. **Double Booking Prevention**
   - ✅ Duplicate submission blocked
   - ✅ Loading state prevents double-click

### Authentication Edge Cases

1. **Invalid Credentials**
   - ✅ Clear error message
   - ✅ No sensitive info leaked

2. **Weak Password**
   - ✅ Validation shows requirements
   - ✅ Minimum 6 characters enforced

3. **Email Already Exists**
   - ✅ Registration shows error
   - ✅ Suggests login instead

## ⚡ Performance Testing

### Load Times

- ✅ Initial page load: < 3 seconds
- ✅ Search results: < 2 seconds
- ✅ Route transitions: < 500ms

### Bundle Size

- ✅ Initial JS bundle: < 500KB
- ✅ Lazy loaded routes work
- ✅ Images optimized

### API Response Times

- ✅ Airport list: < 200ms
- ✅ Flight search: < 1000ms
- ✅ Booking creation: < 500ms

## 🔒 Security Testing

### Input Validation

- ✅ XSS attempts blocked: `<script>alert('xss')</script>`
- ✅ SQL injection blocked: `'; DROP TABLE flights;--`
- ✅ Path traversal blocked: `../../../etc/passwd`

### Authentication

- ✅ JWT tokens expire correctly
- ✅ Protected routes require auth
- ✅ Sensitive data not in localStorage

### Data Protection

- ✅ Passwords hashed (never plain text)
- ✅ API keys not exposed in frontend
- ✅ HTTPS enforced in production

## ✅ Testing Checklist

### Pre-Deployment

- [ ] All user flows tested
- [ ] Mobile responsive verified
- [ ] API endpoints tested
- [ ] Error handling verified
- [ ] Performance acceptable
- [ ] Security measures in place

### Regression Testing

After each update:
- [ ] Search functionality
- [ ] Booking flow
- [ ] Authentication
- [ ] Navigation
- [ ] Data persistence

### Browser Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Chrome Mobile

### Accessibility

- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Color contrast passes WCAG
- [ ] Focus indicators visible
- [ ] Alt text on images

## 🐛 Common Issues & Solutions

### Issue: "No flights found" for valid routes

**Check:**
1. Database has flight data
2. Dates are in the future
3. Airport IDs are correct

**Fix:**
```bash
# Repopulate database
psql $DATABASE_URL < 01_FLIGHTS.sql
```

### Issue: Login redirects to wrong page

**Check:**
1. Navigation state preserved
2. Protected route setup

**Fix:**
- Clear sessionStorage
- Check route configuration

### Issue: Booking fails silently

**Check:**
1. Console for errors
2. Network tab for API response
3. Auth token valid

**Fix:**
- Re-login to refresh token
- Check passenger data format

## 📊 Test Results Template

```markdown
## Test Run: [Date]

### Environment
- OS: 
- Browser: 
- Node version: 
- Database: 

### Results
- ✅ Passed: X/Y
- ❌ Failed: X/Y

### Issues Found
1. [Issue description]
   - Steps to reproduce
   - Expected vs Actual
   - Priority: High/Medium/Low

### Notes
[Any additional observations]
```

---

<p align="center">Happy Testing! 🚀</p> 