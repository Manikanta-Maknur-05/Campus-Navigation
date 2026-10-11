# Anurag University Campus Navigation System 🗺️🎓

An interactive, full-stack **MERN** web application engineered to help students, faculty, freshers, and visitors navigate the 55+ acre campus of **Anurag University, Hyderabad (Venkatapur, Ghatkesar)**.

The platform provides high-resolution digital mapping powered by **Leaflet**, automated shortest-walking-path calculation using **Dijkstra's Algorithm**, role-based authentication with protected student access, and an administrative dashboard to manage campus infrastructure and navigation networks.

---

## 📸 Key Highlights & Preview

- **Interactive Digital Map**: Accurate GPS coordinate mapping with customized circular block badges (Block A to F).
- **Shortest Walking Paths**: Real-time pathfinding between any two campus buildings or from the user's location.
- **Protected Student Portal**: Campus maps and building directories are strictly accessible to authenticated students and faculty.
- **Dedicated Profile Drawer**: Flyout drawer with user profile details and a quick-access **Logout** button anchored to the bottom-left corner.
- **Administrative Suite**: Visual path network editor (`/admin/paths`) and full CRUD management for campus buildings.
- **Rich Campus Showcase**: Real photos and comprehensive information about Anurag University Hyderabad and its multi-disciplinary schools.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, React Router v6, React-Leaflet, Leaflet, Axios, Vanilla CSS |
| **Backend** | Node.js, Express.js (ES Modules), Mongoose 8 |
| **Database** | MongoDB Atlas / Local MongoDB |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs (salted password hashing) |
| **Algorithms** | Dijkstra's Algorithm (shortest route), Haversine Formula (GPS geodesic distance) |

---

## 📁 Repository Structure

```
campus-navigation/
├── package.json               # Root scripts (runs client & server concurrently)
├── README.md                  # Project documentation
├── .gitignore                 # Git ignore rules (node_modules, .env, dist)
│
├── client/                    # Frontend React + Vite SPA
│   ├── public/images/         # Campus photos (School of Engineering, courtyard)
│   ├── src/
│   │   ├── api/api.js         # Axios client configured with JWT interceptor
│   │   ├── components/        # Reusable UI components
│   │   │   ├── CampusMap.jsx  # Leaflet map with custom markers and popups
│   │   │   ├── DirectionsPanel.jsx # Route planner & turn-by-turn guidance
│   │   │   ├── Navbar.jsx     # Navigation bar & profile logo drawer
│   │   │   ├── PathEditorMap.jsx # Interactive canvas to draw campus paths
│   │   │   └── ProtectedRoute.jsx# Auth guards & admin permission gates
│   │   ├── context/
│   │   │   └── AuthContext.jsx# Persistent user session and login/register state
│   │   ├── pages/
│   │   │   ├── Home.jsx       # University showcase & navigation portal
│   │   │   ├── ExploreCampus.jsx # Search, filter & interactive map
│   │   │   ├── BuildingDetails.jsx # Building specifics, coords & route finder
│   │   │   ├── AdminBuildings.jsx # Admin building management table
│   │   │   ├── AddBuilding.jsx & EditBuilding.jsx
│   │   │   ├── PathEditor.jsx # Visual path and walkway editor
│   │   │   └── Login.jsx & Register.jsx
│   │   ├── index.css          # Design system & responsive styles
│   │   └── App.jsx            # Application routing configuration
│   └── vite.config.js
│
└── server/                    # Backend REST API
    ├── config/db.js           # Mongoose connection with custom DNS resolver
    ├── middleware/
    │   ├── authMiddleware.js  # JWT validation (`protect` & `adminOnly`)
    │   └── requireDatabase.js # Database readiness check (503 guard)
    ├── models/
    │   ├── Building.js        # Schema: code, name, category, latitude, longitude
    │   ├── Path.js            # Schema: bidirectional building connections
    │   └── User.js            # Schema: name, email, password hash, role
    ├── routes/
    │   ├── authRoutes.js      # /api/auth (register, login, me)
    │   ├── BuildingRoutes.js  # /api/buildings (search, filter, CRUD)
    │   ├── pathRoutes.js      # /api/paths (path geometry & network)
    │   └── routeRoutes.js     # /api/route (Dijkstra shortest path calculation)
    ├── seed/
    │   ├── seedBuildings.js   # Seeds default campus blocks (A to F)
    │   ├── generatePaths.js   # Automatically connects buildings with paths
    │   └── makeAdmin.js       # CLI script to elevate a user to admin
    ├── utils/
    │   ├── dijkstra.js        # Graph traversal shortest path implementation
    │   ├── geo.js             # Haversine distance calculator
    │   └── routing.js         # Path planner & route step formatter
    └── server.js              # Express app entry point
```

---

## 🏛️ Campus Landmark Directory

The application models key university blocks across six distinct categories:

| Block Code | Landmark Name | Category | Highlights |
|:---:|---|---|---|
| **Block A** | Main Central Library | `Library` | 24/7 study zone, digital learning repositories |
| **Block B** | Lecture Hall Complex | `Academic` | Multimedia smart classrooms & seminar halls |
| **Block C** | Student Center | `Student Services` | Administrative offices, counseling & services |
| **Block D** | Dining Hall | `Food` | Multi-cuisine campus cafeteria & dining |
| **Block E** | Science & Engineering Labs | `Laboratory` | Physics, Chemistry, Biology & Computing labs |
| **Block F** | Indoor Sports & Games Complex | `Games` | Badminton courts, table tennis, chess & gymnasium |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18.x or v20.x LTS recommended) — [Download Node.js](https://nodejs.org/)
- **Git** — [Download Git](https://git-scm.com/)
- **MongoDB** Atlas database cluster or a local MongoDB instance.

### 2. Clone the Repository
```bash
git clone https://github.com/Manikanta-Maknur-05/Campus-Navigation.git
cd Campus-Navigation
```

### 3. Install Dependencies
Run the installation command from the project root:
```bash
npm run install-all
```
*(This installs root dev tools, backend packages, and frontend React dependencies in one step).*

---

## ⚙️ Environment Variables

Create `.env` configuration files for both server and client:

### Backend: `server/.env`
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_long_random_jwt_secret_key-for-security
JWT_EXPIRES_IN=7d
```

### Frontend: `client/.env`
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🗄️ Database Seeding & Setup

Populate your database with default campus blocks, generate navigable path connections, and configure an admin user:

```bash
# 1. Seed campus buildings (Blocks A to F)
npm run seed

# 2. Generate walking path network between buildings
node server/seed/generatePaths.js

# 3. Promote a registered user to Administrator (run after registering)
node server/seed/makeAdmin.js your_email@example.com
```

---

## 🏃 Running the Application

### Option A: Run Both Client & Server Concurrently (Recommended)
```bash
npm run dev
```

### Option B: Run in Separate Terminals
```bash
# Terminal 1 - Backend API (runs on http://localhost:5000)
npm run server

# Terminal 2 - Frontend UI (runs on http://localhost:5173)
npm run client
```

Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new student account | Public |
| `POST` | `/api/auth/login` | Authenticate and obtain JWT token | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user session | Bearer Token |

### Buildings (`/api/buildings`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/buildings/categories` | Fetch allowed building categories | Logged In |
| `GET` | `/api/buildings` | Search & filter campus buildings (`?search=&category=`) | Logged In |
| `GET` | `/api/buildings/:id` | Fetch specific building details | Logged In |
| `POST` | `/api/buildings` | Create a new campus building | Admin Only |
| `PUT` | `/api/buildings/:id` | Update an existing building | Admin Only |
| `DELETE` | `/api/buildings/:id` | Remove a building from the map | Admin Only |

### Navigation & Paths
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/route` | Compute shortest route (`?toBuilding=&fromBuilding=`) | Logged In |
| `GET` | `/api/paths` | Fetch campus path segments & connections | Logged In |
| `POST` | `/api/paths` | Create or update walkway connections | Admin Only |
| `GET` | `/api/health` | Backend and database status health check | Public |

---

## 🛡️ Security & Route Protection
- **Client Route Guards**: Protected by `<ProtectedRoute />` so unauthenticated visitors cannot access `/explore`, `/buildings/:id`, or admin panels.
- **API JWT Interceptors**: Axios automatically attaches `Authorization: Bearer <token>` to all authenticated requests.
- **Password Protection**: Passwords are never saved in plain text; they are hashed with `bcryptjs` using 10 salt rounds.
- **Role Verification**: Admin-restricted endpoints enforce `adminOnly` middleware checks before processing writes or updates.

---

## 👨‍💻 Contributing & Development
1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m "feat: Add new campus navigation feature"`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.

---

## 📄 License
This project is developed for educational and campus navigation purposes for **Anurag University, Hyderabad**.
Distributed under the **MIT License**.
