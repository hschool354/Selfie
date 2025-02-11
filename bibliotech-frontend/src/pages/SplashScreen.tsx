import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AnimatedSplashScreen: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/Login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 overflow-hidden">
      <motion.div
        className="max-w-4xl w-full mx-auto bg-white rounded-3xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] 
                   overflow-hidden transform hover:scale-[1.02] transition-all duration-500"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 items-center">
          {/* Branding Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            {/* Container cho logo + chữ Shelfie */}
            <div className="flex items-center space-x-4 ml-20">
              {/* Logo */}
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                <img
                  src="/backgrounds/background_logo1.png"
                  alt="Small Logo"
                  className="w-16 h-16 object-contain transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Tên Shelfie */}
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Shelfie
              </h1>
            </div>

            {/* Thông tin khác */}
            <div className="space-y-3 text-center mt-4">
              <p className="text-gray-600 font-medium">
                © 2024 Shelfie. All rights reserved.
              </p>
              <p className="text-gray-400 text-sm">
                Artwork by Trường •{" "}
                <span className="hover:text-blue-500 cursor-pointer transition-colors">
                  About Shelfie
                </span>
              </p>
            </div>
          </motion.div>

          {/* Main Logo Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-500" />
              <img
                src="/backgrounds/logo2.jpg"
                alt="Main Logo"
                className="relative w-full rounded-lg shadow-xl transform group-hover:scale-[1.02] transition duration-500"
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedSplashScreen;
