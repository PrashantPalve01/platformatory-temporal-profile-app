import { useAuth0 } from "@auth0/auth0-react";
import { User, Shield, Zap, Star } from "lucide-react";

const Landing = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="container mx-auto px-6 py-8">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
              <User className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ProfilePro
            </span>
          </div>
          <button onClick={() => loginWithRedirect()} className="btn-primary">
            Sign In
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="animate-fade-in">
            <h1 className="text-6xl font-bold text-gray-800 mb-6">
              Your Profile,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Perfected
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Manage your personal information with style and security. A
              beautiful, modern profile management experience.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 animate-slide-up">
            <div className="card text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Secure Authentication
              </h3>
              <p className="text-gray-600">
                Industry-standard security with Auth0 integration
              </p>
            </div>

            <div className="card text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Instant updates and real-time synchronization
              </p>
            </div>

            <div className="card text-center hover:transform hover:scale-105 transition-all duration-300">
              <div className="bg-gradient-to-r from-pink-500 to-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Premium Experience
              </h3>
              <p className="text-gray-600">
                Beautiful design with smooth animations
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="animate-fade-in">
            <button
              onClick={() => loginWithRedirect()}
              className="btn-primary text-xl px-12 py-4 group"
            >
              Get Started Now
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </button>
            <p className="text-gray-500 mt-4">
              No credit card required • Free forever
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 mt-16">
        <div className="text-center text-gray-500">
          <p>
            &copy; 2025 ProfilePro. Built with ❤️ for amazing user experiences.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
