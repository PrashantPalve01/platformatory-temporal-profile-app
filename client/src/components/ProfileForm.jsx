import { useState } from "react";
import { Save, User, Phone, MapPin, Hash } from "lucide-react";

const ProfileForm = ({ profile, onSave, isLoading }) => {
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (
      formData.phoneNumber &&
      !/^\d{10}$/.test(formData.phoneNumber.replace(/\s+/g, ""))
    ) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
    }

    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Please enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave(formData);
    }
  };

  const inputFields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      icon: User,
      placeholder: "Enter your first name",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      icon: User,
      placeholder: "Enter your last name",
      required: true,
    },
    {
      name: "phoneNumber",
      label: "Phone Number",
      type: "tel",
      icon: Phone,
      placeholder: "Enter your phone number",
      required: false,
    },
    {
      name: "city",
      label: "City",
      type: "text",
      icon: MapPin,
      placeholder: "Enter your city",
      required: false,
    },
    {
      name: "pincode",
      label: "Pincode",
      type: "text",
      icon: Hash,
      placeholder: "Enter your pincode",
      required: false,
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {inputFields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.name} className="space-y-2">
              <label
                htmlFor={field.name}
                className="block text-sm font-medium text-gray-700"
              >
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Icon className="h-5 w-5 text-gray-400" />
                </div>

                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className={`input-field pl-10 ${
                    errors[field.name]
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                      : ""
                  }`}
                />
              </div>

              {errors[field.name] && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          <span className="text-red-500">*</span> Required fields
        </div>

        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setFormData(profile)}
            className="btn-secondary"
            disabled={isLoading}
          >
            Reset
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileForm;
