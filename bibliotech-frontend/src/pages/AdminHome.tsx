import { Outlet } from "react-router-dom";
import Sidebar from "../components/components/AdminSidebar";
import { useTheme } from "../Hooks/useTheme";
import { useState } from "react";

const Home = () => {
  const { isDarkMode } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <Sidebar 
          isDarkMode={isDarkMode} 
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>
      <div className="flex-1 overflow-hidden transition-all duration-300">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;