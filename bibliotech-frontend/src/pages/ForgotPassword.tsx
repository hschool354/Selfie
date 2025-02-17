import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTheme } from "../Hooks/useTheme";
import { authService } from "../services/authService";

const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});

type ForgotPasswordFormData = {
  email: string;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>();

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setTimeout(() => navigate("/otp-verification"), 300);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300
      ${isDarkMode ? "bg-gray-900 text-white" : "bg-indigo-50 text-gray-900"}`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-md p-8 rounded-xl shadow-lg
        ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2
          className={`text-2xl font-bold text-center ${
            isDarkMode ? "text-indigo-400" : "text-indigo-600"
          }`}
        >
          Khôi phục mật khẩu
        </h2>
        <p className="text-center text-sm mt-2">
          Nhập email để nhận liên kết đặt lại mật khẩu.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <motion.input
              {...register("email")}
              type="email"
              placeholder="Email của bạn"
              className={`w-full px-4 py-3 rounded-xl transition-all
                ${isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50 text-gray-900"}
                ${errors.email ? "border-red-500 ring-red-500" : "border-gray-300"}`}
              animate={errors.email ? { x: [-5, 5, -5, 5, 0] } : {}}
              transition={{ duration: 0.2 }}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {message && <p className="text-green-500 text-sm mt-2">{message}</p>}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            animate={isLoading ? { scale: [1, 0.9, 1] } : {}}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all
              ${
                isDarkMode
                  ? "bg-indigo-500 hover:bg-indigo-600"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }
              disabled:opacity-50`}
          >
            {isLoading ? "Đang gửi..." : "Gửi Email"}
          </motion.button>
        </form>

        <motion.button
          onClick={() => navigate("/login")}
          className="mt-4 text-sm text-center w-full block text-indigo-500 hover:underline"
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          Quay lại đăng nhập
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
