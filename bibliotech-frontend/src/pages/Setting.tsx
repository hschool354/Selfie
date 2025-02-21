import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Bell,
  Lock,
  Palette,
  Camera,
  Mail,
  Key,
  Moon,
  Save,
  ChevronRight,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { Alert } from "../components/ui/alert";
import { AlertDescription } from "../components/ui/AlertDescription";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      marketing: false,
    },
    privacy: {
      profileVisibility: "public",
      activityStatus: true,
      twoFactorAuth: false,
    },
    appearance: {
      theme: "light",
      fontSize: "medium",
      reducedMotion: false,
    },
  });

  const tabs = [
    { id: "personal", icon: User, label: "Personal Info" },
    { id: "notifications", icon: Bell, label: "Notifications" },
    { id: "privacy", icon: Lock, label: "Privacy & Security" },
    { id: "appearance", icon: Palette, label: "Appearance" },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const handleSave = () => {
    setShowSuccessAlert(true);
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const renderPersonalInfo = () => (
    <motion.div {...fadeInUp} className="space-y-6">
      <div className="relative group">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1 cursor-pointer group-hover:scale-105 transition-transform duration-300">
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden">
            <img
              src="/api/placeholder/96/96"
              alt="Profile"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            placeholder="John Doe"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <div className="relative">
            <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="password"
              className="w-full pl-12 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderNotifications = () => (
    <motion.div {...fadeInUp} className="space-y-6">
      {Object.entries(settings.notifications).map(([key, value]) => (
        <div
          key={key}
          className="flex items-center justify-between p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 capitalize">
                {key} Notifications
              </h3>
              <p className="text-sm text-gray-500">
                Receive {key} notifications about your account
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={value}
              onChange={() => {
                setSettings((prev) => ({
                  ...prev,
                  notifications: {
                    ...prev.notifications,
                    [key]: !value,
                  },
                }));
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      ))}
    </motion.div>
  );

  const renderPrivacy = () => (
    <motion.div {...fadeInUp} className="space-y-6">
      <div className="p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="font-medium text-gray-900">
              Two-Factor Authentication
            </h3>
          </div>
          <button
            onClick={() => {
              setSettings((prev) => ({
                ...prev,
                privacy: {
                  ...prev.privacy,
                  twoFactorAuth: !prev.privacy.twoFactorAuth,
                },
              }));
            }}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
              settings.privacy.twoFactorAuth
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {settings.privacy.twoFactorAuth ? "Enabled" : "Disabled"}
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Add an extra layer of security to your account
        </p>
      </div>

      <div className="p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="font-medium text-gray-900 mb-4">Profile Visibility</h3>
        <div className="space-y-2">
          {["public", "private", "friends"].map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="visibility"
                value={option}
                checked={settings.privacy.profileVisibility === option}
                onChange={() => {
                  setSettings((prev) => ({
                    ...prev,
                    privacy: {
                      ...prev.privacy,
                      profileVisibility: option,
                    },
                  }));
                }}
                className="w-4 h-4 text-blue-500 focus:ring-blue-500 border-gray-300"
              />
              <span className="capitalize">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderAppearance = () => (
    <motion.div {...fadeInUp} className="space-y-6">
      <div className="p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Moon className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="font-medium text-gray-900">Dark Mode</h3>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isDarkMode}
              onChange={() => setIsDarkMode(!isDarkMode)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
          </label>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
        <h3 className="font-medium text-gray-900 mb-4">Font Size</h3>
        <div className="grid grid-cols-3 gap-3">
          {["small", "medium", "large"].map((size) => (
            <button
              key={size}
              onClick={() => {
                setSettings((prev) => ({
                  ...prev,
                  appearance: {
                    ...prev.appearance,
                    fontSize: size,
                  },
                }));
              }}
              className={`p-3 rounded-xl font-medium transition-all duration-300 ${
                settings.appearance.fontSize === size
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="capitalize">{size}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : "bg-white hover:bg-gray-100 text-gray-700"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                <ChevronRight
                  className={`w-5 h-5 ml-auto transition-transform duration-300 ${
                    activeTab === tab.id ? "rotate-90" : ""
                  }`}
                />
              </button>
            ))}
          </motion.div>

          {/* Main Content */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              {activeTab === "personal" && renderPersonalInfo()}
              {activeTab === "notifications" && renderNotifications()}
              {activeTab === "privacy" && renderPrivacy()}
              {activeTab === "appearance" && renderAppearance()}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex justify-end"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:opacity-90 transition-opacity duration-300 flex items-center space-x-2"
                >
                  <Save className="w-5 h-5" />
                  <span>Save Changes</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Success Alert */}
        <AnimatePresence>
          {showSuccessAlert && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6"
            >
              <Alert className="bg-white border-l-4 border-green-500 shadow-lg">
                <Check className="w-5 h-5 text-green-500" />
                <AlertDescription className="text-gray-700">
                  Settings saved successfully!
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Alert Example */}
        <AnimatePresence>
          {false && ( // Change to true to show error alert
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-6 right-6"
            >
              <Alert className="bg-white border-l-4 border-red-500 shadow-lg">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <AlertDescription className="text-gray-700">
                  Failed to save settings. Please try again.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Custom Scroll Styles */}
        <style jsx global>{`
          @keyframes slideIn {
            from {
              transform: translateX(-100%);
            }
            to {
              transform: translateX(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          .settings-animate-in {
            animation: slideIn 0.5s ease-out, fadeIn 0.5s ease-out;
          }

          ::-webkit-scrollbar {
            width: 8px;
            background: transparent;
          }

          ::-webkit-scrollbar-thumb {
            background: rgba(155, 155, 155, 0.5);
            border-radius: 4px;
          }

          ::-webkit-scrollbar-track {
            background: transparent;
          }

          .gradient-border {
            position: relative;
          }

          .gradient-border::after {
            content: "";
            position: absolute;
            inset: 0;
            border-radius: 0.75rem;
            padding: 2px;
            background: linear-gradient(to right, #3b82f6, #a855f7);
            mask: linear-gradient(#fff 0 0) content-box,
              linear-gradient(#fff 0 0);
            mask-composite: exclude;
            pointer-events: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Settings;
