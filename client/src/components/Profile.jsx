import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { toast } from "react-hot-toast";
import ProfileForm from "./ProfileForm";
import { api } from "../utils/api";
import { User, Loader2, CheckCircle, Clock } from "lucide-react";

const Profile = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    pincode: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessTokenSilently();
      const response = await api.get("/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data) {
        setProfile(response.data);
      } else {
        // Initialize with Auth0 data if no profile exists
        setProfile((prev) => ({
          ...prev,
          firstName: user?.given_name || "",
          lastName: user?.family_name || "",
        }));
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      // Initialize with Auth0 data on error
      setProfile((prev) => ({
        ...prev,
        firstName: user?.given_name || "",
        lastName: user?.family_name || "",
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (updatedProfile) => {
    try {
      setSaving(true);
      const token = await getAccessTokenSilently();

      const response = await api.put("/profile", updatedProfile, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(response.data.profile);
      setLastSaved(new Date());

      toast.success(
        "Profile updated successfully! Syncing with external API...",
        {
          icon: "✅",
        }
      );
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="card p-6 mb-8 animate-fade-in">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={user?.picture}
              alt={user?.name}
              className="w-20 h-20 rounded-full ring-4 ring-blue-500/20"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {profile.firstName || profile.lastName
                ? `${profile.firstName} ${profile.lastName}`.trim()
                : user?.name || "Welcome!"}
            </h1>
            <p className="text-gray-600 mb-2">{user?.email}</p>

            {lastSaved && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-500 mb-1">Profile Status</div>
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Active
            </div>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center space-x-3 mb-6">
          <User className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">
            Edit Profile Information
          </h2>
          {isSaving && (
            <div className="flex items-center text-blue-600">
              <Clock className="w-4 h-4 mr-1 animate-spin" />
              <span className="text-sm">Saving...</span>
            </div>
          )}
        </div>

        <ProfileForm
          profile={profile}
          onSave={handleSave}
          isLoading={isSaving}
        />
      </div>

      {/* Temporal Workflow Info */}
      <div className="card p-6 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              Temporal Workflow Integration
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Your profile changes are processed through Temporal workflows with
              the following steps:
            </p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Immediate save to MongoDB database</li>
              <li>10-second delay for external API sync</li>
              <li>Update sent to CrudCrud API for backup</li>
              <li>Workflow completion confirmation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
