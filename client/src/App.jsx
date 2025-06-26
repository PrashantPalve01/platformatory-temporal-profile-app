import { useAuth0 } from "@auth0/auth0-react";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import Profile from "./components/Profile";
import { Loader2 } from "lucide-react";

function App() {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="card p-8 animate-fade-in">
            <div className="mb-8">
              <h1 className="text-3xl font-bold gradient-text mb-2">
                Welcome to Platformatory
              </h1>
              <p className="text-gray-600">Sign in to manage your profile</p>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => loginWithRedirect()}
                className="btn-primary w-full"
              >
                Sign In with Auth0
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                Secure authentication powered by Auth0
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <Profile />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </Layout>
  );
}

export default App;
