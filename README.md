# ProfilePro - MERN Stack Profile Management

A beautiful, modern profile management application built with MERN stack and Auth0 authentication.

## ✨ Features

- 🔐 **Secure Authentication** - Auth0 integration with OIDC
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS and smooth animations
- 📱 **Responsive Design** - Works perfectly on all devices
- ⚡ **Real-time Updates** - Instant profile updates
- 🛡️ **Secure Backend** - JWT token validation and MongoDB integration

## 🛠️ Tech Stack

### Frontend

- **React 18** with Vite
- **Tailwind CSS** for styling
- **Auth0 React SDK** for authentication
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

### Backend

- **Node.js** with Express
- **MongoDB** with Mongoose
- **Auth0** JWT verification
- **CORS** enabled

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Auth0 account

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd profile-app
```

### 2. Auth0 Setup

1. Create an Auth0 account at [auth0.com](https://auth0.com)
2. Create a new application (Single Page Application)
3. Configure the following settings:
   - **Allowed Callback URLs**: `http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:5173`
4. Create an API in Auth0 for your backend
5. Note down your Domain, Client ID, and API Audience

### 3. Environment Setup

Create `.env` file in the root directory:

```bash
# Backend
PORT=5000
MONGODB_URI=mongodb://localhost:27017/profile-app
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_AUDIENCE=your-api-audience

# Frontend (Vite)
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=your-api-audience
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Backend Setup

```bash
cd backend
npm install
npm run dev
```

The backend will start on `http://localhost:5000`

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📁 Project Structure

```
profile-app/
├── backend/
│   ├── models/
│   │   └── User.js              # User schema
│   ├── routes/
│   │   └── profile.js           # Profile routes
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── server.js                # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Profile.jsx      # Profile component
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Dashboard page
│   │   │   └── Landing.jsx      # Landing page
│   │   ├── utils/
│   │   │   └── api.js           # API utilities
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🎯 API Endpoints

### Profile Routes

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

All routes require authentication with Auth0 JWT token in the Authorization header.

## 🎨 UI Features

- **Beautiful Landing Page** - Eye-catching hero section with feature highlights
- **Smooth Animations** - Fade-in, slide-up, and hover effects
- **Modern Card Design** - Glassmorphism effects with backdrop blur
- **Responsive Grid Layout** - Perfect on desktop, tablet, and mobile
- **Interactive Elements** - Hover states and loading animations
- **Toast Notifications** - Success and error messages
- **Loading States** - Skeleton loading and spinners

## 🔧 Customization

### Styling

- Modify `frontend/src/index.css` for custom styles
- Update `frontend/tailwind.config.js` for theme customization
- Colors, animations, and effects can be customized in the Tailwind config

### Authentication

- Auth0 configuration is in `frontend/src/main.jsx`
- Backend JWT verification is in `backend/middleware/auth.js`

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables in your hosting platform

### Backend (Railway/Render)

1. Deploy the backend folder
2. Set environment variables
3. Ensure MongoDB is accessible

## 📝 Future Enhancements

This is the foundation version. Future enhancements will include:

- **Temporal.io** integration for workflow management
- **Docker** containerization
- **CrudCrud.com** API integration
- **Advanced profile features**
- **File upload for profile pictures**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you need help setting up the project:

1. Check the environment variables are correct
2. Ensure MongoDB is running
3. Verify Auth0 configuration
4. Check the browser console for errors

---

Built with ❤️ for an amazing user experience!
