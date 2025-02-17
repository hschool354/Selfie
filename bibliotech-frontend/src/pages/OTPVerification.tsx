import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../Hooks/useTheme";
import  OTPInput from "../components/components/OTPInput";

const OTPVerification = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const [error, setError] = useState("");

  const handleOTPComplete = (otpCode: string) => {
    if (otpCode.length < 6) {
      setError("Vui lòng nhập đầy đủ mã OTP");
      return;
    }
    // Xác thực OTP
    navigate("/reset-password");
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-colors duration-300
      ${isDarkMode ? "bg-gray-900 text-white" : "bg-indigo-50 text-gray-900"}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-md p-8 rounded-xl shadow-lg
        ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <h2 className={`text-2xl font-bold text-center ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>
          Xác nhận OTP
        </h2>
        <p className="text-center text-sm mt-2">Nhập mã OTP đã gửi đến email của bạn.</p>

        {/* Sử dụng OTPInput component */}
        <div className="mt-6 flex justify-center gap-2">
          <OTPInput length={6} onComplete={handleOTPComplete} />
        </div>

        {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}

        <button
          onClick={() => navigate("/forgot-password")}
          className="mt-4 text-sm text-center w-full block text-indigo-500 hover:underline"
        >
          Gửi lại mã OTP
        </button>
      </motion.div>
    </div>
  );
};

export default OTPVerification;
