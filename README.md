# 🚗 DriveEase — Car Management & Dealership Platform

> A full-stack web application for managing vehicles, customers, bookings, test drives, servicing, spare parts, showrooms, employees, and dealership operations through a secure role-based workspace.

[![Frontend](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Build](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vite.dev/)

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Why DriveEase](#-why-driveease)
- [Core Features](#-core-features)
- [Role-Based Access](#-role-based-access)
- [Customer Experience](#-customer-experience)
- [Employee & Supervisor Workspace](#-employee--supervisor-workspace)
- [System Architecture](#-system-architecture)
- [Technology Stack](#-technology-stack)
- [Application Modules](#-application-modules)
- [API Overview](#-api-overview)
- [Security](#-security)
- [Project Structure](#-project-structure)
- [Database](#-database)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [Running the Application](#-running-the-application)
- [Development Workflow](#-development-workflow)
- [Implementation Phases](#-implementation-phases)
- [Testing & Verification](#-testing--verification)
- [Deployment](#-deployment)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌐 Overview

**DriveEase** is a centralized car-management and dealership operations platform designed to connect the customer journey with day-to-day dealership management.

Instead of treating vehicle discovery, bookings, test drives, service requests, inventory, and staff operations as separate systems, DriveEase brings them together in one application.

The platform provides:

- A modern React customer interface
- A Node.js/Express REST API
- MySQL-backed persistent data
- JWT-based authentication
- Role-based authorization
- Vehicle and showroom management
- Car booking workflows
- Test-drive reservations
- Vehicle service tracking
- Spare-parts inventory and ordering
- Customer ownership/vehicle history through **My Garage**
- Employee and supervisor operational tools
- Live operational analytics

---

## 🎯 Why DriveEase

DriveEase is built around three connected experiences:

### 👤 Customer

Discover vehicles, select showrooms, request test drives, make bookings, schedule service, and monitor the complete journey from **My Garage**.

### 🧑‍💼 Employee

Process operational requests, review booking queues, monitor parts inventory, and view dealership analytics.

### 🛡️ Supervisor

Access employee-level operations plus higher-level management capabilities such as vehicle management, showroom management, staff management, and analytics.

---

# ✨ Core Features

## 🚘 Vehicle Management

- Vehicle catalogue
- Vehicle details and availability
- Vehicle discovery for customers
- Vehicle management for authorized staff
- Availability-aware booking/test-drive workflows

## 📅 Car Bookings

Customers can initiate vehicle bookings while dealership staff can review and manage operational booking requests.

Capabilities include:

- Customer booking requests
- Booking status tracking
- Booking queue for staff
- Customer-specific booking history
- Booking value tracking
- Status-based operational reporting

## 🚗 Test Drive Reservations

DriveEase provides a structured test-drive reservation workflow.

Customers can:

- Select a vehicle
- Select a showroom
- Select a preferred date
- Select an appointment slot
- Add comments
- Submit a reservation request
- View reservation history

The backend validates vehicle availability and prevents conflicting showroom/date/slot reservations.

## 🔧 Vehicle Service Management

Customers can submit service requests containing:

- Vehicle
- Showroom/location
- Service date
- Description
- Cost

Service requests support a lifecycle of:

`pending → in_progress → completed`

Authorized staff can manage service status and service records.

## 🏠 My Garage

**My Garage** is the customer ownership and activity hub.

It brings together:

- Vehicles connected to the customer's journey
- Booking history
- Test-drive history
- Service history
- Service cost
- Service date
- Service status
- Recent activity timeline

This creates a single customer-facing view of everything that has happened with their DriveEase vehicles.

## 📦 Spare Parts & Inventory

The platform supports spare-parts operations including:

- Parts catalogue
- Inventory quantities
- Low-stock monitoring
- Out-of-stock monitoring
- Parts orders
- Employee inventory management

## 📍 Showrooms / Locations

DriveEase supports showroom/location operations across the booking and service workflows.

Locations can be used for:

- Test-drive appointments
- Vehicle service requests
- Customer discovery
- Supervisor showroom management

## 👥 Staff Management

Supervisors have access to staff-management functionality for managing dealership employee access.

## 📊 Operational Analytics

DriveEase includes a staff-only analytics workspace covering:

- Total bookings
- Pending bookings
- Confirmed bookings
- Cancelled bookings
- Booking value
- Available vehicles
- Unavailable vehicles
- Total services
- Pending services
- Services in progress
- Completed services
- Service value
- Parts stock
- Low-stock parts
- Out-of-stock parts
- Customer count
- Active staff
- Supervisor count
- Test-drive activity
- Recent booking activity

Analytics are exposed through a protected API and presented in a dedicated operational dashboard.

---

# 🔐 Role-Based Access

DriveEase currently supports three primary roles:

| Capability | Customer | Employee | Supervisor |
|---|:---:|:---:|:---:|
| Dashboard | ✅ | ✅ | ✅ |
| Browse vehicles | ✅ | ✅ | ✅ |
| View showrooms | ✅ | ✅ | ✅ |
| My Garage | ✅ | ❌ | ❌ |
| Test drives | ✅ | ❌ | ❌ |
| Customer bookings | ✅ | ❌ | ❌ |
| Customer service | ✅ | ❌ | ❌ |
| Booking queue | ❌ | ✅ | ✅ |
| Parts inventory | ❌ | ✅ | ✅ |
| Analytics | ❌ | ✅ | ✅ |
| Vehicle management | ❌ | ❌ | ✅ |
| Showroom management | ❌ | ❌ | ✅ |
| Staff management | ❌ | ❌ | ✅ |

> Authorization is enforced on the backend; the frontend navigation also adapts to the authenticated user's role.

---

# 🧑‍💻 Customer Experience

A typical customer journey looks like this:

```text
Login
  ↓
Explore Vehicles
  ↓
Choose Vehicle
  ├── Book Vehicle
  ├── Book Test Drive
  └── Schedule Service
          ↓
      My Garage
          ↓
  Track Complete Journey
```

The customer does not need to move between unrelated systems to understand their vehicle activity.

---

# 🧑‍💼 Employee & Supervisor Workspace

Operational users have a separate workspace designed around dealership workflows.

```text
Staff Login
    ↓
Dashboard
    ├── Analytics
    ├── Booking Queue
    └── Parts Inventory

Supervisor
    ├── Vehicle Management
    ├── Showroom Management
    └── Staff Management
```

---

# 🏗️ System Architecture

DriveEase follows a client-server architecture:

```text
┌──────────────────────────────┐
│        React Frontend        │
│                              │
│  Dashboard / Customer UI     │
│  My Garage / Staff UI        │
│  React Router / Axios        │
└──────────────┬───────────────┘
               │ HTTP / REST
               │ JWT Authorization
               ▼
┌──────────────────────────────┐
│      Node.js + Express       │
│                              │
│  Routes                      │
│  Controllers                 │
│  Authentication              │
│  Authorization               │
│  Validation                  │
│  Business Logic              │
└──────────────┬───────────────┘
               │ mysql2
               ▼
┌──────────────────────────────┐
│            MySQL             │
│                              │
│ Users / Cars / Locations     │
│ Reservations / Test Drives   │
│ Services / Spare Parts       │
└──────────────────────────────┘
```

### Backend pattern

The backend is organized around:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Model
  ↓
MySQL
```

This separation keeps HTTP handling, authorization, business logic, and database access easier to maintain.

---

# 🛠️ Technology Stack

## Frontend

- **React 19** — component-based UI
- **Vite** — development server and production build
- **React Router DOM** — application navigation
- **Axios** — REST API communication
- **Lucide React** — interface icons
- **Material UI / Emotion** — UI infrastructure used by the project
- **React Toastify** — user notifications

## Backend

- **Node.js**
- **Express 4**
- **MySQL2**
- **JWT** — authentication tokens
- **bcrypt / bcryptjs** — password hashing
- **Helmet** — HTTP security headers
- **CORS** — cross-origin access control
- **Express Rate Limit** — request-rate protection
- **Morgan** — HTTP request logging
- **dotenv** — environment configuration

## Database

- **MySQL**

---

# 📦 Application Modules

| Module | Purpose |
|---|---|
| Authentication | Login, identity and token-based access |
| Vehicles | Vehicle catalogue and availability |
| Reservations | Vehicle booking workflow |
| Test Drives | Appointment and slot management |
| Services | Vehicle service requests and history |
| Showrooms | Location management |
| Spare Parts | Parts catalogue and inventory |
| Spare Bookings | Customer parts ordering |
| Booking Queue | Employee/supervisor operational processing |
| My Garage | Customer vehicle/activity hub |
| Staff Management | Supervisor staff administration |
| Analytics | Operational performance dashboard |

---

# 🔌 API Overview

The backend exposes REST-style endpoints under `/api`.

| Endpoint | Purpose |
|---|---|
| `/api/auth` | Authentication |
| `/api/cars` | Vehicle operations |
| `/api/locations` | Showroom/location operations |
| `/api/reservations` | Vehicle reservations |
| `/api/approve-bookings` | Booking approval/processing |
| `/api/services` | Vehicle service operations |
| `/api/spare-parts` | Spare-parts operations |
| `/api/spare-bookings` | Spare-parts booking/order operations |
| `/api/testdrives` | Test-drive reservations |
| `/api/staff` | Staff management |
| `/api/analytics` | Protected staff analytics |
| `/api/health` | API health check |

### Analytics API

```http
GET /api/analytics
Authorization: Bearer <JWT>
```

The analytics endpoint is protected by authentication and employee-level authorization.

### Health Check

```http
GET /api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "car-management-system"
}
```

---

# 🔒 Security

Security is treated as a first-class part of the application.

Current protections include:

- JWT authentication
- Role-based backend authorization
- Password hashing with bcrypt/bcryptjs
- Helmet security headers
- CORS configuration
- Express rate limiting support
- Disabled Express `x-powered-by` header
- Request body size limits
- Input validation on critical workflows
- Ownership checks for customer-specific resources
- Protected staff analytics
- Test-drive slot conflict prevention

### Customer data isolation

Customer-specific service history and test-drive data are checked against the authenticated user's identity.

A customer attempting to access another customer's protected resource receives an authorization failure rather than another user's data.

---

# 📁 Project Structure

```text
DriveEase/
│
├── car-management-system/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── serviceController.js
│   │   ├── testDriveController.js
│   │   └── ...
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── serviceModel.js
│   │   ├── TestDriveModel.js
│   │   └── ...
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── service.js
│   │   ├── testDriveRoutes.js
│   │   └── ...
│   ├── server.js
│   ├── package.json
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── MyGarage.jsx
│   │   │   ├── Analytics.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── ...
│   │   ├── services/
│   │   │   ├── AnalyticsService.js
│   │   │   ├── ReservationService.js
│   │   │   └── ...
│   │   ├── styles/
│   │   └── ...
│   ├── package.json
│   └── ...
│
└── README.md
```

---

# 🗄️ Database

DriveEase uses MySQL as its persistent data layer.

The application works with relational entities representing areas such as:

- Users
- Cars
- Locations
- Reservations
- Test-drive reservations
- Services
- Spare parts
- Spare-parts bookings

Relationships allow the application to connect customers with vehicles and then connect those vehicles to bookings, test drives, and service records.

For example:

```text
User
 ├── Reservations
 ├── Test Drives
 └── Services
       │
       └── Car
             │
             └── Location
```

> Use the SQL/database scripts included in the repository as the source of truth for the exact schema and seed data.

---

# 🚀 Getting Started

## Prerequisites

Install:

- Node.js (LTS recommended)
- npm
- MySQL Server
- Git

Verify installations:

```bash
node --version
npm --version
mysql --version
git --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/Nishnath12/drive_ease-car_management_system.git
cd drive_ease-car_management_system
```

---

## 2. Configure MySQL

Create the required MySQL database and load the SQL/schema files supplied with the project.

Then configure the backend database connection through the project's environment configuration.

Do **not** commit passwords, JWT secrets, or production database credentials to Git.

---

## 3. Install Backend Dependencies

```bash
cd car-management-system
npm install
```

---

## 4. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

# ⚙️ Environment Configuration

The backend is designed to read environment-specific configuration through `dotenv`.

A typical deployment should provide values for:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_secure_secret
```

Database configuration should match the connection implementation in `config/db.js`.

For production:

- Use a strong randomly generated JWT secret.
- Never commit `.env` files containing secrets.
- Restrict database access.
- Configure the frontend origin explicitly.
- Use HTTPS.

---

# ▶️ Running the Application

## Start Backend

From `car-management-system`:

```bash
npm start
```

The backend defaults to port `5000` unless configured otherwise.

## Start Frontend

From `frontend`:

```bash
npm run dev
```

Vite will display the local frontend URL in the terminal.

---

# 🧪 Development Commands

## Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Backend

```bash
npm start
npm test
```

The backend `test` script currently performs a Node syntax check of `server.js`.

---

# 🔄 Development Workflow

A recommended development flow is:

```text
1. Identify feature/bug
        ↓
2. Update database if required
        ↓
3. Implement backend model
        ↓
4. Implement controller
        ↓
5. Protect route with middleware
        ↓
6. Implement frontend service
        ↓
7. Implement/update React component
        ↓
8. Update styling
        ↓
9. Run lint/build/syntax checks
        ↓
10. Test role-specific behavior
        ↓
11. Deploy
```

This keeps backend authorization and frontend UX aligned.

---

# 🧭 Implementation Phases

DriveEase has been developed incrementally rather than as a single monolithic implementation.

## Phase 1 — Core Platform

Established the fundamental application experience:

- Authentication
- Role-based dashboards
- Vehicle discovery
- Showrooms
- Reservations
- Test-drive workflows
- Service booking
- Spare-parts workflows
- Operational navigation

## Phase 2 — Customer Ownership Experience

Focused on making DriveEase more useful after the initial booking:

- My Garage
- Vehicle journey aggregation
- Booking history
- Test-drive history
- Service history
- Service status visibility
- Service cost/date visibility
- Customer data isolation
- Stronger service validation

## Phase 3 — Operational Intelligence

Focused on dealership staff and supervisors:

- Protected analytics API
- Booking metrics
- Vehicle availability metrics
- Service workload metrics
- Parts inventory metrics
- Staff/customer metrics
- Recent booking activity
- Analytics workspace
- Staff/supervisor analytics navigation

---

# 🧪 Testing & Verification

Before considering a feature complete, verify it from both the UI and API perspectives.

### Customer checks

- Customer can log in.
- Customer can browse vehicles.
- Customer can submit a booking.
- Customer can submit a test-drive request.
- Customer can submit a service request.
- Customer can see their own history.
- Customer cannot access another customer's protected records.
- Customer cannot access staff analytics.

### Employee checks

- Employee can access booking queue.
- Employee can access parts inventory.
- Employee can access analytics.
- Employee cannot access supervisor-only management functions.

### Supervisor checks

- Supervisor can access analytics.
- Supervisor can manage vehicles.
- Supervisor can manage showrooms.
- Supervisor can manage staff.
- Supervisor can access operational booking/parts workflows.

### API checks

Check:

```text
/api/health
/api/auth
/api/cars
/api/locations
/api/reservations
/api/services
/api/testdrives
/api/spare-parts
/api/spare-bookings
/api/staff
/api/analytics
```

Also verify unauthorized and cross-user requests return appropriate HTTP errors.

---

# ☁️ Deployment

The repository includes GitHub Actions support for deploying the React frontend to GitHub Pages.

A production deployment should treat the frontend and backend as separate deployment concerns:

```text
React/Vite frontend
       │
       │ HTTPS API requests
       ▼
Node/Express backend
       │
       ▼
Production MySQL
```

For production deployment:

1. Build the frontend with `npm run build`.
2. Deploy the generated frontend assets.
3. Deploy the Node.js backend to a server/container/platform that supports Node.js.
4. Provision MySQL.
5. Configure environment variables.
6. Set the frontend API base URL to the production backend.
7. Configure CORS for the production frontend origin.
8. Enable HTTPS.
9. Verify health and authentication endpoints.

---

# 📈 Future Improvements

Potential next-generation enhancements include:

- Real-time notifications
- Email/SMS booking confirmations
- Payment gateway integration
- Invoice generation
- Advanced sales reports
- Revenue charts by date range
- Vehicle maintenance reminders
- Customer profile management
- Service technician assignment
- Service completion notes
- Parts consumption tracking
- Audit logs
- Exportable reports
- Advanced search and filtering
- Pagination for large datasets
- Automated integration tests
- End-to-end browser tests
- Dockerized development and production environments
- CI quality gates
- Monitoring and centralized application logging

---

# 🧩 Design Principles

DriveEase follows several practical engineering principles:

### Separation of concerns

Frontend presentation, API communication, business logic, and persistence are kept in separate layers.

### Security by default

Authorization is enforced at the API boundary rather than relying only on hidden frontend navigation.

### Customer data isolation

Customer-specific resources are scoped to the authenticated account.

### Operational visibility

Analytics turn transactional data into information useful to dealership employees and supervisors.

### Maintainable UI

Reusable React components and service modules reduce duplication across customer and staff workflows.

### Progressive enhancement

The application is structured so new operational capabilities can be added without replacing the core architecture.

---

# 🏁 Project Status

DriveEase is an actively developed full-stack car-management platform with customer, employee, and supervisor workflows.

Current major capabilities include:

- ✅ Authentication
- ✅ Role-based access
- ✅ Vehicle management
- ✅ Showroom/location management
- ✅ Vehicle reservations
- ✅ Test-drive reservations
- ✅ Service management
- ✅ Customer My Garage
- ✅ Service history
- ✅ Spare-parts inventory
- ✅ Staff management
- ✅ Operational analytics
- ✅ REST API architecture
- ✅ MySQL persistence
- ✅ Security middleware
- ✅ Frontend production build workflow

---

# 🤝 Contributing

Contributions and improvements are welcome.

Suggested process:

1. Create a feature branch.
2. Make focused changes.
3. Keep frontend/backend changes consistent.
4. Run lint/build/syntax checks.
5. Test affected user roles.
6. Update documentation when behavior changes.
7. Submit a pull request with a clear description.

---

# 📄 License

No explicit open-source license is currently specified in the repository. Unless a license is added, normal copyright restrictions apply.

---

# 👨‍💻 Built With

**DriveEase** combines modern frontend development, REST API design, relational database modeling, authentication, authorization, and dealership workflow automation into one full-stack application.

---

<p align="center">
  <strong>DriveEase</strong><br/>
  <sub>Explore. Book. Drive. Maintain.</sub>
</p>
