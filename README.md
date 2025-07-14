# ✈️ SkyBook - Modern Flight Booking System

**[🚀 LIVE DEMO 🚀](https://flight-booking-frontend-virid.vercel.app/)**

A full-stack flight booking application built with React, Node.js, and Supabase, demonstrating enterprise-level architecture and modern development practices.

![SkyBook Banner](https://img.shields.io/badge/SkyBook-Flight%20Booking-blue?style=for-the-badge&logo=airplane)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=flat-square&logo=supabase)

## 🚀 Overview

SkyBook is a comprehensive flight booking platform that provides users with a seamless experience for searching, booking, and managing flights. Built with modern technologies and best practices, it showcases a production-ready architecture suitable for enterprise applications.

### 🎯 Key Features

- **Flight Search & Booking**: Real-time flight search with smart date handling
- **User Authentication**: Secure signup/login with JWT tokens
- **Smart Navigation**: Context-aware routing that preserves user state
- **Responsive Design**: Mobile-first approach with Material-UI
- **Real-time Updates**: Flight status and availability updates
- **Payment Integration**: Secure payment processing (Stripe ready)
- **Admin Dashboard**: Comprehensive flight and booking management
- **Email Notifications**: Automated booking confirmations

## 🏗️ Architecture

```
skybook/
├── frontend/          # React 18 + Redux + Material-UI
├── backend/           # Node.js + Express + Supabase
├── scripts/           # Database setup and data generation
└── docs/             # Additional documentation
```

### Tech Stack

**Frontend:**
- React 18 with Hooks
- Redux for state management
- Material-UI for components
- React Router v6 for navigation
- Axios for API calls

**Backend:**
- Node.js + Express
- Supabase for database (PostgreSQL)
- JWT authentication
- RESTful API design
- **Database:** PostgreSQL

### System Requirements

**DevOps:**
- Docker ready
- Environment-based configuration
- Automated testing setup

## 🚦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (via Supabase)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-github-username>/skybook.git
   cd skybook
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend configuration
   cp backend/.env.example backend/.env
   # Add your Supabase credentials
   ```

4. **Initialize database**
   ```bash
   # Run database setup
   psql -h your-db-host -U postgres -d postgres -f 00_INIT_DATABASE.sql
   ```

5. **Start development servers**
   ```bash
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📚 Documentation

- [Backend Documentation](./backend/README.md) - API endpoints, architecture
- [Frontend Documentation](./frontend/README.md) - Components, state management
- [Testing Guide](./TESTING-GUIDE.md) - Test scenarios and coverage
- [Interview Preparation](./INTERVIEW-PREP.md) - Technical insights

## 🔑 Key Design Decisions

### 1. **Microservices-Ready Architecture**
- Separated frontend and backend
- Service-oriented backend structure
- Easy to scale and deploy independently

### 2. **Smart State Management**
- Redux for global state
- Context API for auth
- Session storage for navigation state

### 3. **User Experience First**
- Preserved search state during navigation
- Smart back button behavior
- Loading states and error handling

### 4. **Security Best Practices**
- JWT token authentication
- Input validation and sanitization
- Secure password handling
- CORS configuration

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd frontend && npm run build

# Start production server
cd backend && npm run start:prod
```

### Docker Deployment

```bash
# Build and run with Docker
docker-compose up --build
```

## 📊 Performance Optimizations

- Lazy loading for routes
- Memoized selectors with Redux
- Debounced search inputs
- Optimized database queries
- CDN-ready static assets

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

- **Full Stack Developer**: Vamsi Krishna

## 🙏 Acknowledgments

- Inspired by modern flight booking platforms
- Uses best practices from React and Node.js communities

---

<p align="center">Made with ❤️ by Vamsi Krishna</p> 

### **Prerequisites**

Before you start, make sure you have done this one-time setup:
1.  **Install Dependencies:**
    *   In your terminal, run `cd backend && npm install`
    *   Then run `cd frontend && npm install`
2.  **Configure Environment:**
    *   In the `backend` folder, copy the `.env.example` file to a new file named `.env`.
    *   Edit the `.env` file and add your Supabase URL and keys.

---

### **How to Run**

You will need two terminals open at the same time.

**Terminal 1: Start the Backend API**

1.  **Reset the Database (Important):**
    From the root of your project, run the reset script. This will wipe the database and load it with over 19,000 fresh flights. You will be prompted for your database password.
    ```bash
    bash reset_database.sh
    ```

2.  **Start the Backend Server:**
    After the database reset is complete, start the backend server.
    ```bash
    cd backend
    npm start
    ```
    Leave this terminal running. The API server will be active at `http://localhost:3000`.

**Terminal 2: Start the Frontend App**

1.  **Start the Frontend:**
    In your new terminal, navigate to the frontend directory and start the development server.
    ```bash
    cd frontend
    npm run dev
    ```
    Leave this terminal running.

### **View the Application**

Now that both servers are running, you can use the application:

*   **Open your web browser and go to:** `http://localhost:5173` 