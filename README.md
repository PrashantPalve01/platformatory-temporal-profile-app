# 👤 Profile-Temporal-App (MERN + Temporal + Auth0)

> Full-stack assignment for **Platformatory Labs**  
> Log in with Auth0, edit your profile, and let a Temporal workflow save it to MongoDB then sync to CrudCrud 10 seconds later.

---

## 🚀 Project Overview – What & Why

### Problem Statement

Modern applications need secure user authentication, reliable data persistence, and robust background processing that can handle failures gracefully. Traditional approaches often lack proper error handling, retry mechanisms, and workflow orchestration.

### Solution Architecture

| Component           | Purpose                                               | Technology                  |
| ------------------- | ----------------------------------------------------- | --------------------------- |
| **Authentication**  | Secure OIDC-based login without custom password logic | Auth0                       |
| **Frontend**        | Responsive profile management interface               | React + Vite + Tailwind CSS |
| **Backend API**     | RESTful endpoints with JWT validation                 | Node.js + Express           |
| **Database**        | Profile data persistence                              | MongoDB                     |
| **Workflow Engine** | Reliable background processing with retries           | Temporal                    |
| **External Sync**   | Demo third-party integration                          | CrudCrud API                |

### Key Features 💡

- **🔐 Secure OIDC Authentication** – OAuth 2.0 flow via Auth0
- **⚡ Real-time Profile Updates** – Instant UI feedback with background processing
- **🔄 Reliable Workflow Orchestration** – 10-second delayed sync with automatic retries
- **📱 Responsive Design** – Mobile-first UI with Tailwind CSS
- **🛡️ Error Handling** – Graceful failure recovery and user feedback
- **📊 Workflow Monitoring** – Temporal Web UI for observability

---

## ⚙️ Installation & Running Instructions

### Prerequisites

- Node.js (v16 or higher)
- **Docker Desktop** (for running Temporal server and MongoDB)
- Auth0 account
- Git

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/PrashantPalve01/platformatory-temporal-profile-app
cd platformatory-temporal-profile-app

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install

# Install Temporal worker dependencies
cd ../server/temporal && npm install
```

### 2. Auth0 Configuration

#### Create Auth0 Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create a new **Single Page Application**
3. Note down your **Domain** and **Client ID**
4. Configure application settings:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`

#### Create Auth0 API

1. Create a new API with identifier: `https://profilepro/api`
2. Enable **RS256** signing algorithm

#### Add Post-Login Action

Create a new Action in Auth0 Dashboard:

```javascript
exports.onExecutePostLogin = async (event, api) => {
  // Add user claims to access token
  api.accessToken.setCustomClaim("email", event.user.email);
  api.accessToken.setCustomClaim("given_name", event.user.given_name || "");
  api.accessToken.setCustomClaim("family_name", event.user.family_name || "");
};
```

### 3. Environment Configuration

#### Backend Environment (`server/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/profile-temporal
AUTH0_DOMAIN=dev-xxxxx.us.auth0.com
AUTH0_AUDIENCE=https://profilepro/api
CRUDCRUD_API_URL=https://crudcrud.com/api/<your-unique-token>
```

#### Frontend Environment (`client/.env`)

```env
VITE_AUTH0_DOMAIN=dev-xxxxx.us.auth0.com
VITE_AUTH0_CLIENT_ID=<your-client-id>
VITE_AUTH0_AUDIENCE=https://profilepro/api
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start Infrastructure Services

#### Prerequisites: Start Docker Desktop

```bash
# Ensure Docker Desktop is running
# Windows/macOS: Start Docker Desktop application
# Linux: Start Docker daemon

# Verify Docker is accessible
docker --version
docker-compose --version
```

#### Start Temporal Server

```bash
# Clone Temporal Docker setup
git clone https://github.com/temporalio/docker-compose.git temporal-server
cd temporal-server

# Start Temporal services (requires Docker Desktop running)
docker-compose up -d

# Verify all services are running
docker-compose ps

# Temporal Web UI will be available at http://localhost:8080
cd ..
```

#### Start MongoDB

```bash
# Option 1: Docker (Recommended)
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Option 2: Local MongoDB installation
# Ensure MongoDB service is running on port 27017

# Verify MongoDB is accessible
docker ps | grep mongo
```

### 5. Launch Application Services

Open **3 terminal tabs** and run:

| Terminal  | Command                                       | Purpose            |
| --------- | --------------------------------------------- | ------------------ |
| **Tab 1** | `cd server && npm start`                      | Express API server |
| **Tab 2** | `cd server/temporal && npx ts-node worker.ts` | Temporal worker    |
| **Tab 3** | `cd client && npm run dev`                    | React frontend     |

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Temporal Web UI**: http://localhost:8080

---

## 🗂️ App Structure & Design Decisions

```
profile-temporal-app/
│
├── client/                    # React Frontend (Vite + Tailwind)
│   ├── src/
|   |   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   └── utils/            # API utility functions
│   ├── public/               # Static assets
│   └── package.json
│
├── server/                   # Node.js Backend
│   ├── config/
│   │   └── db.js            # MongoDB connection singleton
│   ├── middleware/
│   │   └── auth.js          # Auth0 JWT verification
│   ├── models/
│   │   └── userModel.js     # Mongoose schema
│   ├── routes/
│   │   └── userRoute.js     # REST API endpoints
│   ├── temporal/            # Temporal.io Integration
│   │   ├── activities.ts    # Business logic (DB + API calls)
│   │   ├── workflows.ts     # Workflow definitions
│   │   ├── worker.ts        # Worker process entry point
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── utils/               # Shared utilities
│   ├── server.js           # Express app setup
│   └── package.json
│
├── screenshots/             # Application screenshots
└── README.md
```

### 🏗️ Architecture Design Decisions

#### **Database Layer**

- **Mongoose ODM**: Type-safe schema validation and queries
- **Connection Pooling**: Automatic connection management

#### **Authentication Strategy**

- **Auth0 Integration**: Eliminates custom authentication logic
- **JWT Middleware**: Stateless token validation on protected routes
- **Custom Claims**: User profile data embedded in tokens

#### **Workflow Orchestration**

- **Temporal Fan-out Pattern**: Each profile update triggers independent workflow
- **Unique Workflow IDs**: `profile-update-{userId}-{timestamp}` prevents conflicts

#### **API Design**

- **RESTful Endpoints**: Standard HTTP methods and status codes
- **Error Handling**: Consistent error response format
- **Input Validation**: Request payload validation with proper error messages

#### **Frontend Architecture**

- **Component-Based**: Reusable UI components with single responsibility
- **State Management**: React hooks for local state management
- **Utils Layer**: Centralized API communication
- **Responsive Design**: Mobile-first approach with Tailwind CSS

---

## 📸 Screenshots & Demo

### Landing Page

![Home Scrren](./client/public/landing.png)
_Modern landing page with Auth0 authentication_

### Authentication Flow

![Login Screen](./client/public/login.png)
_Secure Auth0 login with social providers_

### Profile Management

![Profile](./client/public/profile.png)
_User profile display with edit functionality_

![Profile Editor](./client/public/editProfile.png)
_Real-time profile editing with instant feedback_

### Workflow Monitoring

![Temporal Dashboard](./client/public/temporal-dashboard.png)
_Temporal Web UI showing completed workflows_

### Mobile Responsive

_Responsive design across all devices_

---

### Code Quality

- **TypeScript**: Full type safety across Temporal workers
- **ESLint**: Code linting with consistent style rules
- **Prettier**: Automated code formatting

---

### ✨ Implemented Beyond Requirements

- **📝 TypeScript Integration**: Full type safety across the temporal code
- **🔍 Central Logging**: Structured logging with Temporal workflow/activity context
- **🔄 Graceful Error Handling**: User-friendly error messages and recovery
- **📊 Monitoring Dashboard**: Real-time workflow status via Temporal Web UI
- **🎨 Modern UI/UX**: Tailwind CSS with responsive design patterns
- **⚡ Performance Optimization**: Connection pooling, lazy loading, and efficient re-renders
- **🔐 Security Best Practices**: JWT validation, input sanitization, CORS configuration

### 🛠️ Future Enhancements

- [ ] Unit and integration test coverage
- [ ] Docker Compose for full-stack deployment
- [ ] Profile image upload with cloud storage
- [ ] Real-time notifications for workflow status
- [ ] Audit logging for profile changes
- [ ] Rate limiting and API throttling

---

## 🐛 Troubleshooting

### Common Issues & Solutions

**Issue**: Docker commands fail with "Cannot connect to Docker daemon"

```bash
# Solution: Ensure Docker Desktop is running
# Windows/macOS: Open Docker Desktop application
# Linux: sudo systemctl start docker

# Verify Docker is accessible
docker --version
docker-compose --version
```

**Issue**: Temporal services won't start

```bash
# Solution: Check if ports are already in use or restart services
docker-compose -f temporal-server/docker-compose.yml down
docker-compose -f temporal-server/docker-compose.yml up -d

# Check service status
docker-compose -f temporal-server/docker-compose.yml ps
```

**Issue**: Temporal worker not connecting

```bash
# Solution: Ensure Temporal server is running
docker-compose -f temporal-server/docker-compose.yml ps

# Check if all Temporal services are healthy
docker-compose -f temporal-server/docker-compose.yml logs
```

**Issue**: Auth0 login redirects to error page

```bash
# Solution: Check callback URLs in Auth0 dashboard
# Ensure http://localhost:5173 is in Allowed Callback URLs
```

**Issue**: MongoDB connection failed

```bash
# Solution: Verify MongoDB is running
docker ps | grep mongo

# Or check local MongoDB service status
# Windows: net start MongoDB
# Linux/macOS: brew services start mongodb-community
```

**Issue**: Port conflicts (5000, 5173, 8080, 27017 already in use)

```bash
# Solution: Find and stop processes using these ports
# Windows: netstat -ano | findstr :5000
# Linux/macOS: lsof -i :5000

# Or change ports in environment variables
```

---

## 📞 Support & Contributing

### Getting Help

- 📧 **Email**: palveprashant526@gmail.com
- 📖 **Documentation**: Check inline code comments and this README

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👨‍💻 Author

**Prashant Palve** – Full-Stack Developer

- 🌐 **Portfolio**: [portfolio.com](https://prashantpalve-portfolio.netlify.app/)
- 💼 **LinkedIn**: [linkedin.com](www.linkedin.com/in/prashantpalve)
- 🐙 **GitHub**: [github](https://github.com/PrashantPalve01)

_Built with ❤️ for Platformatory Labs technical assessment_

---

## 🙏 Acknowledgments

- [Temporal.io](https://temporal.io/) for workflow orchestration
- [Auth0](https://auth0.com/) for authentication services
- [MongoDB](https://mongodb.com/) for database solutions
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
