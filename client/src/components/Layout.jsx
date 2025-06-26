import { useAuth0 } from "@auth0/auth0-react";
import { LogOut, User } from "lucide-react";

const Layout = ({ children }) => {
  const { user, logout } = useAuth0();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"></div>
              <h1 className="text-xl font-bold gradient-text">
                Platformatory Labs
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <img
                  src={user?.picture}
                  alt={user?.name}
                  className="w-8 h-8 rounded-full ring-2 ring-blue-500/20"
                />
                <span className="text-sm font-medium text-gray-700 hidden sm:block">
                  {user?.name}
                </span>
              </div>

              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              © 2024 Platformatory Labs. Built with ❤️ for the interview task.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
