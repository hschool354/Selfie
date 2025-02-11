import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocialButton } from "../components/components/SocialButton";
import { AuthButton } from "../components/components/AuthButton";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
// import { SocialButtonProps, AuthButtonProps } from "./types";
import PasswordStrength from "../components/components/PasswordStrength";

type SignUpFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
};

const signUpSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>();

  const handleLoginClick = () => {
    setTimeout(() => navigate("/login"), 300);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    console.log(`Signing up with ${provider}`);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      await signUpSchema.parseAsync(data);
      console.log("Signing up", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300
            ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
                : "bg-gradient-to-br from-indigo-50 to-blue-50"
            }`}
    >
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="p-2 rounded-full hover:bg-opacity-10 hover:bg-white transition-colors"
        >
          {isDarkMode ? "🌞" : "🌙"}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center p-4 min-h-screen"
      >
        <div
          className={`w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden
                    ${
                      isDarkMode
                        ? "bg-gray-800 bg-opacity-95"
                        : "bg-white bg-opacity-95"
                    }`}
        >
          <div className="flex flex-col md:flex-row">
            {/* Left Panel - Illustration */}
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className={`hidden md:flex flex-col items-center justify-center w-1/2 p-12
                ${
                  isDarkMode
                    ? "bg-gradient-to-br from-gray-800 to-gray-700"
                    : "bg-gradient-to-br from-indigo-50 to-blue-50"
                }`}
            >
              <div className="max-w-md text-center space-y-8">
                <motion.h2
                  initial={{ y: -20 }}
                  animate={{ y: 0 }}
                  className={`text-3xl font-bold
                                        ${
                                          isDarkMode
                                            ? "text-gray-100"
                                            : "text-gray-800"
                                        }`}
                >
                  Turn Your Reading Dreams Into Reality
                </motion.h2>

                <motion.div
                  className="relative"
                  animate={{ y: [0, -10, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <div
                    className={`absolute inset-0 
                                        ${
                                          isDarkMode
                                            ? ""
                                            : "from-transparent to-indigo-50"
                                        } 
                                        opacity-50`}
                  ></div>
                  <img
                    src="/backgrounds/background_book1.png"
                    alt="Book Background"
                    className="w-full max-w-sm mx-auto"
                  />
                </motion.div>

                <motion.div
                  className="flex gap-4 justify-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <AuthButton
                    label="LOGIN"
                    variant="primary"
                    onClick={handleLoginClick}
                    isDark={isDarkMode}
                  />
                  <AuthButton label="SIGN UP" isDark={isDarkMode} />
                </motion.div>
              </div>
            </motion.div>

            {/* Right Panel - Sign Up Form */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="w-full md:w-1/2 p-8 lg:p-12"
            >
              <div className="max-w-md mx-auto space-y-8">
                {/* Logo & Title */}
                <motion.div
                  className="text-center"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <div className="w-36 h-36 mx-auto flex items-center justify-center rounded-full bg-white p-1">
                    <img
                      src="/backgrounds/background_logo1.png"
                      alt="Logo"
                      className="w-32 h-32 object-contain rounded-full"
                    />
                  </div>
                  <h2
                    className={`mt-6 text-3xl font-bold
                                        ${
                                          isDarkMode
                                            ? "text-indigo-400"
                                            : "text-indigo-600"
                                        }`}
                  >
                    Create Account
                  </h2>
                </motion.div>

                {/* Sign Up Form */}
                <motion.form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="space-y-4">
                    <div>
                      <input
                        {...register("username")}
                        type="text"
                        placeholder="Username"
                        className={`w-full px-4 py-3 rounded-xl transition-all duration-300
                                                    ${
                                                      isDarkMode
                                                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                                        : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                                                    }
                                                    ${
                                                      errors.username
                                                        ? "border-red-500 ring-red-500"
                                                        : ""
                                                    }
                                                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      {errors.username && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-500"
                        >
                          {errors.username.message?.toString()}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Email"
                        className={`w-full px-4 py-3 rounded-xl transition-all duration-300
                                                    ${
                                                      isDarkMode
                                                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                                        : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                                                    }
                                                    ${
                                                      errors.email
                                                        ? "border-red-500 ring-red-500"
                                                        : ""
                                                    }
                                                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-500"
                        >
                          {errors.email.message?.toString()}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <input
                        {...register("password")}
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setPasswordValue(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl transition-all duration-300
                          ${
                            isDarkMode
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                              : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                          }
                          ${
                            errors.password ? "border-red-500 ring-red-500" : ""
                          }
                          focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      <div className="mt-1">
                        <PasswordStrength password={passwordValue} />
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-1 text-sm text-red-500"
                        >
                          {errors.password.message}
                        </motion.p>
                      )}
                    </div>

                    <div>
                      <input
                        {...register("confirmPassword")}
                        type="password"
                        placeholder="Confirm Password"
                        className={`w-full px-4 py-3 rounded-xl transition-all duration-300
                                                    ${
                                                      isDarkMode
                                                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                                        : "bg-gray-50 border-gray-200 text-gray-700 placeholder-gray-400"
                                                    }
                                                    ${
                                                      errors.confirmPassword
                                                        ? "border-red-500 ring-red-500"
                                                        : ""
                                                    }
                                                    focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                      />
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-2 text-sm text-red-500"
                        >
                          {errors.confirmPassword.message?.toString()}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full py-3 rounded-xl font-semibold tracking-wide
                                            transition-all duration-200 relative overflow-hidden
                                            ${
                                              isDarkMode
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
                      "SIGN UP"
                    )}
                  </motion.button>
                </motion.form>

                {/* Social Sign Up */}
                <motion.div
                  className="space-y-4"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div
                        className={`w-full border-t ${
                          isDarkMode ? "border-gray-700" : "border-gray-200"
                        }`}
                      ></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span
                        className={`px-4 ${
                          isDarkMode
                            ? "bg-gray-800 text-gray-400"
                            : "bg-white text-gray-500"
                        }`}
                      >
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <SocialButton
                      icon="/icons/icon_google.svg"
                      label="Google"
                      onClick={() => handleSocialLogin("google")}
                      disabled={isLoading}
                      isDark={isDarkMode}
                    />
                    <SocialButton
                      icon="/icons/icon_facebook.svg"
                      label="Facebook"
                      bgColor={isDarkMode ? "bg-[#1877F2]" : "bg-[#1877F2]"}
                      textColor="text-white"
                      onClick={() => handleSocialLogin("facebook")}
                      disabled={isLoading}
                      isDark={isDarkMode}
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="text-center"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <button
                    onClick={handleLoginClick}
                    className={`text-sm hover:underline transition-colors
                                            ${
                                              isDarkMode
                                                ? "text-indigo-400 hover:text-indigo-300"
                                                : "text-indigo-600 hover:text-indigo-700"
                                            }`}
                  >
                    Already have an account? Login here
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
