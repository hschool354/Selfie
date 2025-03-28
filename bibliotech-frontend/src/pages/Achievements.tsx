import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../Hooks/useTheme';
import { Trophy, Book, Clock, Star, Award, Flame, Zap, ScrollText } from 'lucide-react';
import cultivationService from '../services/cultivationService';

const Achievements = () => {
  const { isDarkMode } = useTheme();
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [cultivationLevels, setCultivationLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [achievements, setAchievements] = useState([]);

  // Map icon names to Lucide components
  const iconMap = {
    'SCROLL': ScrollText,
    'BOOK': Book,
    'FLAME': Flame,
    'STAR': Star,
    'ZAP': Zap,
    'TROPHY': Trophy,
    'CLOCK': Clock,
    'AWARD': Award
  };

  // Calculate progress for each level based on user's stats
  const calculateProgress = (level) => {
    if (!userProgress) return 0;
    
    // If books required is 0, return 100% (already completed)
    if (level.booksRequired === 0) return 100;
    
    // Calculate progress based on books read
    const bookProgress = Math.min(100, (userProgress.totalBooksRead / level.booksRequired) * 100);
    
    // You could also factor in reading time if needed
    // const timeProgress = Math.min(100, (userProgress.totalReadingTime / level.readingTimeRequired) * 100);
    
    // For now, just use book progress
    return Math.round(bookProgress);
  };

  // Check if a level is the current level or already completed
  const getLevelStatus = (levelId) => {
    if (!userProgress || !userProgress.currentLevel) return 'locked';
    
    if (userProgress.currentLevel.levelId === levelId) return 'current';
    if (userProgress.currentLevel.levelId > levelId) return 'completed';
    
    return 'locked';
  };

  // Mock achievements data (would be fetched from an API in a real application)
  const mockAchievements = [
    { 
      id: 1, 
      type: "FIRST_BOOK",
      name: "Sách Đầu Tiên", 
      description: "Hoàn thành cuốn sách đầu tiên", 
      progress: 100,
      level: 1,
      icon: Book
    },
    { 
      id: 2, 
      type: "READING_STREAK",
      name: "Kiên Trì", 
      description: "Đọc liên tục 7 ngày", 
      progress: 75,
      level: 2,
      icon: Clock
    },
    { 
      id: 3, 
      type: "BOOKS_COUNT",
      name: "Thư Viện", 
      description: "Đọc 50 cuốn sách", 
      progress: 30,
      level: 1,
      icon: Trophy
    },
    { 
      id: 4, 
      type: "PAGES_COUNT",
      name: "Nghiên Cứu", 
      description: "Đọc 1000 trang sách", 
      progress: 60,
      level: 3,
      icon: ScrollText
    }
  ];

  // Fetch cultivation levels from API
  useEffect(() => {
    const fetchCultivationLevels = async () => {
      try {
        setLoading(true);
        const response = await cultivationService.getAllCultivationLevels();
        
        // Transform the data to include the icon component
        const levelsWithIcons = response.data.map(level => {
          // Extract icon name from iconUrl or use a default
          const iconKey = level.iconUrl.includes('/') 
            ? level.iconUrl.split('/').pop().split('.')[0].toUpperCase() 
            : level.iconUrl.toUpperCase();
          
          return {
            id: level.levelId,
            name: level.levelName,
            description: level.levelDescription || '',
            booksRequired: level.booksRequired,
            readingTime: level.readingTimeRequired,
            points: level.booksRequired * 20, // Example calculation for points
            icon: iconMap[iconKey] || ScrollText, // Default to ScrollText if icon not found
          };
        });
        
        // Sort by ID to ensure proper order
        levelsWithIcons.sort((a, b) => a.id - b.id);
        
        setCultivationLevels(levelsWithIcons);
        setAchievements(mockAchievements); // Set mock achievements
      } catch (err) {
        console.error('Error fetching cultivation levels:', err);
        setError('Failed to load cultivation levels');
      } finally {
        setLoading(false);
      }
    };

    fetchCultivationLevels();
  }, []);

  // Fetch user cultivation data
  useEffect(() => {
    const fetchUserCultivation = async () => {
      try {
        // Get the user ID from localStorage or context
        const userId = localStorage.getItem('userId') || '1'; // Default to 1 for demo
        
        const response = await cultivationService.getUserCultivationById(parseInt(userId, 10));
        
        setUserProgress({
          currentLevel: response.data.currentLevel,
          totalBooksRead: response.data.totalBooksRead,
          totalReadingTime: response.data.totalReadingTime,
          cultivationPoints: response.data.cultivationPoints,
          lastLevelUpDate: response.data.lastLevelUpDate
        });
      } catch (err) {
        console.error('Error fetching user cultivation data:', err);
        // Fallback to dummy data for development
        setUserProgress({
          currentLevel: { levelId: 1, levelName: 'Luyện Khí' },
          totalBooksRead: 4,
          totalReadingTime: 480, // in minutes (8 hours)
          cultivationPoints: 100
        });
      }
    };

    fetchUserCultivation();
  }, []);

  // Calculate progress for levels once both levels and user data are loaded
  useEffect(() => {
    if (cultivationLevels.length > 0 && userProgress) {
      const updatedLevels = cultivationLevels.map(level => ({
        ...level,
        progress: calculateProgress(level),
        status: getLevelStatus(level.id)
      }));
      
      setCultivationLevels(updatedLevels);
    }
  }, [userProgress]); // Remove cultivationLevels from the dependency array

  // Find the current level name for display
  const getCurrentLevelName = () => {
    if (!userProgress || !userProgress.currentLevel) return 'Loading...';
    return userProgress.currentLevel.levelName;
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <main 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
        }`}
        style={{
          '--scrollbar-track': isDarkMode ? '#1F2937' : '#F3F4F6',
          '--scrollbar-thumb': isDarkMode ? '#4B5563' : '#E5E7EB',
        }}
      >
        <style jsx global>{`
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          ::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
          }
          ::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
          }
          ::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb);
            opacity: 0.8;
          }
        `}</style>

        <header className={`w-full border-b ${
          isDarkMode ? "bg-gray-900 border-gray-700" : "bg-gray-50 border-gray-200"
        }`}>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Tu Luyện</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Cấp độ: {getCurrentLevelName()}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Cảnh Giới Tu Luyện</h2>
                <span className="text-blue-500">
                  {userProgress ? `${userProgress.cultivationPoints} điểm tu luyện` : 'Đang tải...'}
                </span>
              </div>
              
              {loading ? (
                <div className={`p-8 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow text-center`}>
                  <p>Đang tải dữ liệu cảnh giới...</p>
                </div>
              ) : error ? (
                <div className={`p-8 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow text-center text-red-500`}>
                  <p>{error}</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {cultivationLevels.map((level) => (
                    <motion.div
                      key={level.id}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      onClick={() => setSelectedLevel(selectedLevel === level.id ? null : level.id)}
                      className={`p-4 rounded-lg ${
                        isDarkMode ? "bg-gray-800" : "bg-white"
                      } shadow hover:shadow-md cursor-pointer`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <level.icon className={`w-6 h-6 ${
                            level.status === 'completed' ? "text-blue-500" : 
                            level.status === 'current' ? "text-yellow-500" : 
                            "text-gray-400"
                          }`} />
                          <div>
                            <h3 className="font-bold">{level.name}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {level.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{level.points} điểm</p>
                          <p className="text-xs text-gray-500">Yêu cầu</p>
                        </div>
                      </div>
                      
                      {selectedLevel === level.id && (
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                          <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <p className="text-gray-500">Sách cần đọc</p>
                            <p className="font-medium">{level.booksRequired} cuốn</p>
                          </div>
                          <div className={`p-3 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                            <p className="text-gray-500">Thời gian đọc</p>
                            <p className="font-medium">{level.readingTime} giờ</p>
                          </div>
                        </div>
                      )}

                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>
                            {userProgress ? `${userProgress.totalBooksRead}/${level.booksRequired} sách` : 'Đang tải...'}
                          </span>
                          <span>{level.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${
                              level.status === 'completed' ? "bg-blue-500" : 
                              level.status === 'current' ? "bg-yellow-500" : 
                              "bg-gray-400"
                            }`}
                            style={{ width: `${level.progress || 0}%` }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Thành Tựu</h2>
                <button className="text-blue-500 hover:text-blue-600 font-medium">
                  Xem tất cả
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`p-4 rounded-lg ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    } shadow hover:shadow-md`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${
                        achievement.progress === 100 
                          ? "bg-blue-100 dark:bg-blue-900" 
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}>
                        <achievement.icon className={`w-6 h-6 ${
                          achievement.progress === 100 
                            ? "text-blue-600 dark:text-blue-400" 
                            : "text-gray-500 dark:text-gray-400"
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold">{achievement.name}</h3>
                          <span className="text-sm text-gray-500">Cấp {achievement.level}</span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                          {achievement.description}
                        </p>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Achievements;