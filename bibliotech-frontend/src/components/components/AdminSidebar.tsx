import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AdminMenuItem = ({ item, isActive, onClick, isCollapsed }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} p-3 rounded-lg group 
        ${isActive ? item.bg : item.defaultBg} 
        ${isActive ? "text-white" : "text-gray-700"} 
        ${item.hoverBg} 
        transition duration-200 ease-in-out transform hover:scale-105 
        shadow-md hover:shadow-lg hover:text-white`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img 
        src={item.icon} 
        alt={item.name} 
        className={`w-6 h-6 ${isCollapsed ? '' : 'mr-6'}`} 
      />
      {!isCollapsed && (
        <span className="text-md font-semibold">{item.name}</span>
      )}
    </motion.button>
  );
};

const AdminSidebar = ({ isDarkMode, isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");

  const adminMenuItems = [
    { 
      name: "Dashboard", 
      path: "/adminHome/dashboard", 
      icon: "/icons/icons_dashboard.svg", 
      bg: "bg-blue-600", 
      hoverBg: "hover:bg-blue-500", 
      defaultBg: "bg-blue-50" 
    },
    { 
      name: "Users", 
      path: "/adminHome/adminUsers", 
      icon: "/icons/icons_users.svg", 
      bg: "bg-indigo-600", 
      hoverBg: "hover:bg-indigo-500", 
      defaultBg: "bg-indigo-50" 
    },
    { 
      name: "Books", 
      path: "/adminHome/adminBooks", 
      icon: "/icons/icons_book1.svg", 
      bg: "bg-purple-600", 
      hoverBg: "hover:bg-purple-500", 
      defaultBg: "bg-purple-50" 
    },
    { 
      name: "Categories", 
      path: "/admin/categories", 
      icon: "/icons/icons_category.svg", 
      bg: "bg-violet-600", 
      hoverBg: "hover:bg-violet-500", 
      defaultBg: "bg-violet-50" 
    },
    { 
      name: "Deals", 
      path: "/admin/deals", 
      icon: "/icons/icons_deals.svg", 
      bg: "bg-fuchsia-600", 
      hoverBg: "hover:bg-fuchsia-500", 
      defaultBg: "bg-fuchsia-50" 
    },
    { 
      name: "Premium Packages", 
      path: "/admin/premium-packages", 
      icon: "/icons/icons_crown.svg", 
      bg: "bg-amber-600", 
      hoverBg: "hover:bg-amber-500", 
      defaultBg: "bg-amber-50" 
    },
    { 
      name: "Transactions", 
      path: "/admin/transactions", 
      icon: "/icons/icons_wallet.svg", 
      bg: "bg-pink-600", 
      hoverBg: "hover:bg-pink-500", 
      defaultBg: "bg-pink-50" 
    },
    { 
      name: "Reports", 
      path: "/admin/reports", 
      icon: "/icons/icons_report.svg", 
      bg: "bg-teal-600", 
      hoverBg: "hover:bg-teal-500", 
      defaultBg: "bg-teal-50" 
    },
    { 
      name: "Settings", 
      path: "/admin/settings", 
      icon: "/icons/icons_setting.svg", 
      bg: "bg-gray-600", 
      hoverBg: "hover:bg-gray-500", 
      defaultBg: "bg-gray-50" 
    },
  ];

  useEffect(() => {
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      navigate('/admin/dashboard');
      setActiveItem('/admin/dashboard');
    } else {
      setActiveItem(location.pathname);
    }
  }, [location.pathname, navigate]);

  const handleItemClick = (path) => {
    setActiveItem(path);
    navigate(path);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        width: isCollapsed ? 80 : 256
      }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`p-4 rounded-xl shadow-xl h-screen flex flex-col justify-between relative ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-black"}`}
    >
      {/* Toggle Button */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 p-1.5 rounded-full bg-white shadow-md hover:shadow-lg z-50"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isCollapsed ? 
          <ChevronRight className="w-4 h-4 text-gray-600" /> : 
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        }
      </motion.button>

      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-6">
        <motion.img 
          src="/backgrounds/background_logo1.png" 
          alt="Admin Logo" 
          className={`${isCollapsed ? 'w-12 h-12' : 'w-40 h-28'} mb-2 transition-all duration-300`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        {!isCollapsed && (
          <motion.h2 
            className="text-2xl font-semibold tracking-tight"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            Admin Panel
          </motion.h2>
        )}
      </div>

      {/* Menu Items */}
      <div className="mt-4 flex-1 space-y-3">
        {adminMenuItems.map((item) => (
          <AdminMenuItem
            key={item.name}
            item={item}
            isActive={activeItem === item.path}
            onClick={() => handleItemClick(item.path)}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {/* Bottom Spacer */}
      <div className="h-16"></div>
    </motion.div>
  );
};

export default AdminSidebar;