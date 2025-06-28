import { useAuth0 } from "@auth0/auth0-react";
import { LogOut, User } from "lucide-react";
import Profile from "../components/Profile";

const Dashboard = () => {
  const { logout, user } = useAuth0();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">ProfilePro</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {user?.given_name || "User"}!
                </p>
              </div>
            </div>

            <button
              onClick={() => logout({ returnTo: window.location.origin })}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Your Profile
            </h2>
            <p className="text-gray-600">
              Manage your personal information and preferences
            </p>
          </div>

          <div className="animate-slide-up">
            <Profile />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
