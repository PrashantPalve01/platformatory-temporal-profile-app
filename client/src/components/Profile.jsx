import { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import toast from "react-hot-toast";
import { Save, Edit3, User, Phone, MapPin, Hash, Mail } from "lucide-react";
import { getProfile, updateProfile } from "../utils/api";

const Profile = () => {
  const { getAccessTokenSilently, user } = useAuth0();
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    city: "",
    pincode: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await getAccessTokenSilently();
      const data = await getProfile(token);
      setProfile({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        phoneNumber: data.phoneNumber || "",
        city: data.city || "",
        pincode: data.pincode || "",
      });
    } catch (error) {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = await getAccessTokenSilently();
      await updateProfile(token, profile);
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <div className="card max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-800">
          Profile Information
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
            isEditing
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
              : "bg-blue-100 text-blue-600 hover:bg-blue-200"
          }`}
        >
          <Edit3 className="h-4 w-4" />
          <span>{isEditing ? "Cancel" : "Edit"}</span>
        </button>
      </div>

      {/* User Avatar & Email */}
      <div className="flex items-center space-x-4 mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          {user?.picture ? (
            <img
              src={user.picture}
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <User className="h-8 w-8 text-white" />
          )}
        </div>
        <div>
          <h4 className="text-xl font-semibold text-gray-800">
            {profile.firstName || profile.lastName
              ? `${profile.firstName} ${profile.lastName}`.trim()
              : "Your Name"}
          </h4>
          <div className="flex items-center space-x-2 text-gray-600">
            <Mail className="h-4 w-4" />
            <span>{user?.email}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input-field ${
                !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
              placeholder="Enter your first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input-field ${
                !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Phone className="h-4 w-4 inline mr-2" />
            Phone Number
          </label>
          <input
            type="tel"
            name="phoneNumber"
            value={profile.phoneNumber}
            onChange={handleChange}
            disabled={!isEditing}
            className={`input-field ${
              !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
            }`}
            placeholder="Enter your phone number"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="h-4 w-4 inline mr-2" />
              City
            </label>
            <input
              type="text"
              name="city"
              value={profile.city}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input-field ${
                !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
              placeholder="Enter your city"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Hash className="h-4 w-4 inline mr-2" />
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={profile.pincode}
              onChange={handleChange}
              disabled={!isEditing}
              className={`input-field ${
                !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
              placeholder="Enter your pincode"
            />
          </div>
        </div>

        {isEditing && (
          <div className="flex space-x-4 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center space-x-2 flex-1"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                fetchProfile(); // Reset form
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
