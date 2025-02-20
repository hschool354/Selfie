import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const MenuItem = ({ item, isActive, onClick, isCollapsed }) => {
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
        className={`w-6 h-6 ${isCollapsed ? '' : 'mr-6'} ${item.name === "Premium" ? "animate-pulse" : ""}`} 
      />
      {!isCollapsed && (
        <span className="text-md font-semibold">{item.name}</span>
      )}
    </motion.button>
  );
};

const PremiumMenuItem = ({ item, isActive, onClick, isCollapsed }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} p-3 rounded-lg relative overflow-hidden 
        ${isActive ? item.bg : item.defaultBg} 
        ${isActive ? "text-white" : "text-gray-700"} 
        ${item.hoverBg} 
        transition duration-200 ease-in-out transform hover:scale-105 
        shadow-md hover:shadow-lg hover:text-white
        ring-2 ring-amber-300 ring-opacity-50
        before:absolute before:content-[''] before:top-0 before:left-[-100%] before:w-1/2 before:h-full 
        before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent 
        before:opacity-30 before:skew-x-[-20deg] before:animate-[shimmer_3s_infinite]`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img 
        src={item.icon} 
        alt={item.name} 
        className={`w-6 h-6 ${isCollapsed ? '' : 'mr-6'} animate-pulse relative z-10`} 
      />
      {!isCollapsed && (
        <span className="text-md font-semibold relative z-10">{item.name}</span>
      )}
    </motion.button>
  );
};

const Sidebar = ({ isDarkMode , isCollapsed, setIsCollapsed}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState("");
//   const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Discover", path: "/home/discover", icon: "/icons/icons_home.svg", bg: "bg-blue-600", hoverBg: "hover:bg-blue-500", defaultBg: "bg-blue-50" },
    { name: "Category", path: "/home/category", icon: "/icons/icons_category.svg", bg: "bg-indigo-600", hoverBg: "hover:bg-indigo-500", defaultBg: "bg-indigo-50" },
    { name: "My Library", path: "/home/myLibrary", icon: "/icons/icons_book1.svg", bg: "bg-purple-600", hoverBg: "hover:bg-purple-500", defaultBg: "bg-purple-50" },
    { name: "Achievements", path: "/home/achievements", icon: "/icons/icons_achievements.svg", bg: "bg-violet-600", hoverBg: "hover:bg-violet-500", defaultBg: "bg-violet-50" },
    { name: "Favorites", path: "/home/favorites", icon: "/icons/icons_favorite.svg", bg: "bg-fuchsia-600", hoverBg: "hover:bg-fuchsia-500", defaultBg: "bg-fuchsia-50" },
    { name: "Wallet", path: "/home/wallet", icon: "/icons/icons_wallet.svg", bg: "bg-pink-600", hoverBg: "hover:bg-pink-500", defaultBg: "bg-pink-50" },
  ];

  const extraItems = [
    { 
      name: "Premium", 
      path: "/home/premium", 
      icon: "/icons/icons_crown.svg", 
      bg: "bg-gradient-to-r from-amber-500 to-orange-600",
      hoverBg: "hover:from-amber-400 hover:to-orange-500",
      defaultBg: "bg-gradient-to-r from-amber-100 to-orange-200"
    },
    { 
      name: "Setting", 
      path: "/home/setting", 
      icon: "/icons/icons_setting.svg", 
      bg: "bg-slate-600",
      hoverBg: "hover:bg-slate-500",
      defaultBg: "bg-slate-50"
    },
    { 
      name: "Support", 
      path: "/home/support", 
      icon: "/icons/icons_chat.svg", 
      bg: "bg-gray-600",
      hoverBg: "hover:bg-gray-500",
      defaultBg: "bg-gray-50"
    },
  ];

  useEffect(() => {
    if (location.pathname === '/home' || location.pathname === '/home/') {
      navigate('/home/discover');
      setActiveItem('/home/discover');
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
          alt="Logo" 
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
            Shelfie
          </motion.h2>
        )}
      </div>

      {/* Menu Items */}
      <div className="mt-4 flex-1 space-y-3">
        {menuItems.map((item) => (
          <MenuItem
            key={item.name}
            item={item}
            isActive={activeItem === item.path}
            onClick={() => handleItemClick(item.path)}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {/* Divider */}
      <div className="my-4 border-t border-gray-300" />

      {/* Extra Items */}
      <div className="mt-4 space-y-3">
        {extraItems.map((item) => (
          item.name === "Premium" ? (
            <PremiumMenuItem
              key={item.name}
              item={item}
              isActive={activeItem === item.path}
              onClick={() => handleItemClick(item.path)}
              isCollapsed={isCollapsed}
            />
          ) : (
            <MenuItem
              key={item.name}
              item={item}
              isActive={activeItem === item.path}
              onClick={() => handleItemClick(item.path)}
              isCollapsed={isCollapsed}
            />
          )
        ))}
      </div>

      {/* Bottom Spacer */}
      <div className="h-16"></div>
    </motion.div>
  );
};

export default Sidebar;