# 👤 Profile-Temporal-App (MERN + Temporal + Auth0)

> Full-stack assignment for **Platformatory Labs**  
> Log in with Auth0, edit your profile, and let a Temporal workflow save it to MongoDB then sync to CrudCrud 10 seconds later.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.x-blue)](https://reactjs.org/)

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
- Docker and Docker Compose
- MongoDB (local or Docker)
- Auth0 account

### 1. Clone Repository & Install Dependencies

```bash
git clone https://github.com/<your-github>/profile-temporal-app.git
cd profile-temporal-app

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
NODE_ENV=development
```

#### Frontend Environment (`client/.env`)

```env
VITE_AUTH0_DOMAIN=dev-xxxxx.us.auth0.com
VITE_AUTH0_CLIENT_ID=<your-client-id>
VITE_AUTH0_AUDIENCE=https://profilepro/api
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Start Infrastructure Services

#### Start Temporal Server

```bash
# Clone Temporal Docker setup
git clone https://github.com/temporalio/docker-compose.git temporal-server
cd temporal-server

# Start Temporal services
docker-compose up -d

# Verify setup - Web UI available at http://localhost:8233
cd ..
```

#### Start MongoDB

```bash
# Option 1: Docker
docker run -d --name mongodb -p 27017:27017 mongo:latest

# Option 2: Local installation
# Make sure MongoDB is running on port 27017
```

### 5. Launch Application Services

Open **3 terminal tabs** and run:

| Terminal  | Command                                       | Purpose            |
| --------- | --------------------------------------------- | ------------------ |
| **Tab 1** | `cd server && npm run dev`                    | Express API server |
| **Tab 2** | `cd server/temporal && npx ts-node worker.ts` | Temporal worker    |
| **Tab 3** | `cd client && npm run dev`                    | React frontend     |

### 6. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Temporal Web UI**: http://localhost:8233

---

## 🗂️ App Structure & Design Decisions

```
profile-temporal-app/
│
├── client/                    # React Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API service layer
│   │   └── utils/            # Helper functions
│   ├── public/               # Static assets
│   └── package.json
│
├── server/                   # Node.js Backend
│   ├── config/
│   │   └── db.ts            # MongoDB connection singleton
│   ├── middleware/
│   │   └── auth.ts          # Auth0 JWT verification
│   ├── models/
│   │   └── userModel.ts     # Mongoose schema
│   ├── routes/
│   │   └── userRoute.ts     # REST API endpoints
│   ├── temporal/            # Temporal.io Integration
│   │   ├── activities.ts    # Business logic (DB + API calls)
│   │   ├── workflows.ts     # Workflow definitions
│   │   └── worker.ts        # Worker process entry point
│   ├── utils/               # Shared utilities
│   ├── server.ts           # Express app setup
│   └── package.json
│
├── screenshots/             # Application screenshots
├── docker-compose.yml      # Optional: Full stack Docker setup
└── README.md
```

### 🏗️ Architecture Design Decisions

#### **Database Layer**

- **Single MongoDB Connection**: Reused across all modules for efficiency
- **Mongoose ODM**: Type-safe schema validation and queries
- **Connection Pooling**: Automatic connection management

#### **Authentication Strategy**

- **Auth0 Integration**: Eliminates custom authentication logic
- **JWT Middleware**: Stateless token validation on protected routes
- **Custom Claims**: User profile data embedded in tokens

#### **Workflow Orchestration**

- **Temporal Fan-out Pattern**: Each profile update triggers independent workflow
- **Unique Workflow IDs**: `profile-update-{userId}-{timestamp}` prevents conflicts
- **Retry Policies**: 3-attempt limit with exponential backoff
- **Deterministic Execution**: Guaranteed workflow completion even after server restarts

#### **API Design**

- **RESTful Endpoints**: Standard HTTP methods and status codes
- **Error Handling**: Consistent error response format
- **Input Validation**: Request payload validation with proper error messages

#### **Frontend Architecture**

- **Component-Based**: Reusable UI components with single responsibility
- **Custom Hooks**: Business logic separation from UI components
- **Service Layer**: Centralized API communication
- **State Management**: React Context for global state

---

## 📸 Screenshots & Demo

### Authentication Flow

![Login Screen](./screenshots/login-screen.png)
_Secure Auth0 login with social providers_

### Profile Management

![Profile Editor](./screenshots/profile-editor.png)
_Real-time profile editing with instant feedback_

### Workflow Monitoring

![Temporal Dashboard](./screenshots/temporal-dashboard.png)
_Temporal Web UI showing completed workflows_

### Mobile Responsive

<img src="./screenshots/mobile-view.png" alt="Mobile View" width="300">

_Responsive design across all devices_

> 📝 **Note**: Add your actual screenshots to the `/screenshots` folder and update the paths above.

---

## 🧪 Testing & Quality Assurance

### Running Tests

```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test

# E2E tests (if implemented)
npm run test:e2e
```

### Code Quality

- **TypeScript**: Full type safety across backend and Temporal workers
- **ESLint**: Code linting with consistent style rules
- **Prettier**: Automated code formatting

---

## 🚀 Deployment & Production

### Environment Variables for Production

```env
# Backend
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/profiledb
AUTH0_DOMAIN=your-production-domain.auth0.com
CRUDCRUD_API_URL=https://crudcrud.com/api/your-production-token

# Frontend
VITE_AUTH0_DOMAIN=your-production-domain.auth0.com
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Build Commands

```bash
# Frontend production build
cd client && npm run build

# Backend (already production-ready)
cd server && npm start
```

---

## 🎁 Extras & Advanced Features

### ✨ Implemented Beyond Requirements

- **📝 TypeScript Integration**: Full type safety across the entire stack
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

**Issue**: Temporal worker not connecting

```bash
# Solution: Ensure Temporal server is running
docker-compose -f temporal-server/docker-compose.yml ps
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
```

---

## 📞 Support & Contributing

### Getting Help

- 📧 **Email**: prashant.palve@example.com
- 💬 **Issues**: [GitHub Issues](https://github.com/<your-github>/profile-temporal-app/issues)
- 📖 **Documentation**: Check inline code comments and this README

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Prashant Palve** – Full-Stack Developer

- 🌐 **Portfolio**: [your-portfolio.com](https://your-portfolio.com)
- 💼 **LinkedIn**: [linkedin.com/in/prashant-palve](https://linkedin.com/in/prashant-palve)
- 🐙 **GitHub**: [@your-github](https://github.com/your-github)

_Built with ❤️ for Platformatory Labs technical assessment_

---

## 🙏 Acknowledgments

- [Temporal.io](https://temporal.io/) for workflow orchestration
- [Auth0](https://auth0.com/) for authentication services
- [MongoDB](https://mongodb.com/) for database solutions
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
