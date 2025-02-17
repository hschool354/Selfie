import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { authService } from "../services/authService";

type ProfileFormData = {
  fullName: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
  nationality: string;
  bio: string;
  profilePicture?: FileList;
};

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Phone number must be between 10-15 digits"),
  dob: z.string(),
  gender: z.enum(["Male", "Female", "Other"]),
  address: z.string().min(5, "Address must be at least 5 characters"),
  nationality: z.string().min(2, "Nationality must be at least 2 characters"),
  bio: z.string().max(500, "Bio must not exceed 500 characters"),
});

const InitialProfileSetup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { isDarkMode } = useTheme();
  const [error, setError] = useState<string>("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsLoading(true);
      setError("");
      
      // Validate data
      profileSchema.parse(data);
      
      // Get the user ID from the stored token
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (!userData.token) {
        throw new Error('No authentication token found');
      }
  
      // Create FormData if there's a profile picture
      const formData = new FormData();
      if (data.profilePicture?.[0]) {
        formData.append('profilePicture', data.profilePicture[0]);
      }
      
      // Add other profile data
      Object.keys(data).forEach(key => {
        if (key !== 'profilePicture') {
          formData.append(key, data[key as keyof ProfileFormData]?.toString() || '');
        }
      });
  
      // Call API to complete profile
      await authService.completeProfile(userData.userId, formData);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
      try {
          await authService.completeProfile({
              fullName: "",
              phone: "",
              dob: "",
              address: "",
              gender: "",
              nationality: "", 
              bio: ""
          });
          navigate('/dashboard');
      } catch (error) {
          console.error(error);
      }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300
      ${isDarkMode ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
        : "bg-gradient-to-br from-indigo-50 to-blue-50"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center p-4 min-h-screen"
      >
        <div
          className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden
          ${isDarkMode ? "bg-gray-800 bg-opacity-95" : "bg-white bg-opacity-95"}`}
        >
          <div className="p-8 lg:p-12">
            <motion.div
              className="text-center mb-8"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <h2 className={`text-3xl font-bold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
                Complete Your Profile
              </h2>
              <p className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                Tell us more about yourself or skip for now
              </p>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {/* Profile Picture Upload */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-500">
                    {previewImage ? (
                      <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                        <span className="text-4xl">👤</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    {...register("profilePicture")}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="profile-picture"
                  />
                  <label
                    htmlFor="profile-picture"
                    className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer
                    ${isDarkMode ? "bg-indigo-500 hover:bg-indigo-600" : "bg-indigo-600 hover:bg-indigo-700"}
                    text-white`}
                  >
                    📷
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder="Full Name"
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300
                    ${isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                      }
                    ${errors.fullName ? "border-red-500 ring-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="Phone Number"
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300
                    ${isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                      }
                    ${errors.phone ? "border-red-500 ring-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <input
                    {...register("dob")}
                    type="date"
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300
                    ${isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                      }
                    ${errors.dob ? "border-red-500 ring-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>

                <div>
                  <select
                    {...register("gender")}
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300
                    ${isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-gray-50 border-gray-200 text-gray-700"
                      }
                    ${errors.gender ? "border-red-500 ring-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <input
                    {...register("address")}
                    type="text"
                    placeholder="Address"
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300
                    ${isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                      }
                    ${errors.address ? "border-red-500 ring-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>

                <div>
                  <input
                    {...register("nationality")}
                    type="text"
                    placeholder="Nationality"
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300
                    ${isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                      }
                    ${errors.nationality ? "border-red-500 ring-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>

                <div className="md:col-span-2">
                  <textarea
                    {...register("bio")}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl transition-all duration-300
                    ${isDarkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                        : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                      }
                    ${errors.bio ? "border-red-500 ring-red-500" : ""}
                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>
                  )}
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-center">{error}</div>
              )}

              <div className="flex gap-4 justify-center mt-8">
                <motion.button
                  type="button"
                  onClick={handleSkip}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-3 rounded-xl font-semibold tracking-wide
                    ${isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600"
                      : "bg-gray-200 hover:bg-gray-300"
                    }
                    transition-all duration-200`}
                >
                  Skip for Now
                </motion.button>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-8 py-3 rounded-xl font-semibold tracking-wide
                    transition-all duration-200 relative overflow-hidden
                    ${isDarkMode
                      ? "bg-indigo-500 hover:bg-indigo-600"
                      : "bg-indigo-600 hover:bg-indigo-700"
                    }
                    text-white disabled:opacity-50`}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mx-auto"
                    />
                  ) : (
                    "Complete Profile"
                  )}
                </motion.button>
              </div>
            </motion.form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InitialProfileSetup;