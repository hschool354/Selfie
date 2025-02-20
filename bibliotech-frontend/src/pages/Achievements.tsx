import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../Hooks/useTheme';
import { Trophy, Book, Clock, Star, Award, Flame, Zap, ScrollText } from 'lucide-react';

const Achievements = () => {
  const { isDarkMode } = useTheme();
  const [selectedLevel, setSelectedLevel] = useState(null);

  const cultivationLevels = [
    { 
      id: 1, 
      name: "Phàm Nhân", 
      progress: 100, 
      description: "Bước đầu tu luyện",
      booksRequired: 0,
      readingTime: 0,
      points: 0,
      icon: ScrollText
    },
    { 
      id: 2, 
      name: "Luyện Khí", 
      progress: 80, 
      description: "Tích lũy tri thức cơ bản",
      booksRequired: 5,
      readingTime: 10,
      points: 100,
      icon: Book
    },
    { 
      id: 3, 
      name: "Trúc Cơ", 
      progress: 45, 
      description: "Nền tảng vững chắc",
      booksRequired: 15,
      readingTime: 30,
      points: 300,
      icon: Flame
    },
    { 
      id: 4, 
      name: "Kim Đan", 
      progress: 20, 
      description: "Kiến thức uyên thâm",
      booksRequired: 30,
      readingTime: 60,
      points: 600,
      icon: Star
    },
    { 
      id: 5, 
      name: "Nguyên Anh", 
      progress: 0, 
      description: "Học giả uyên bác",
      booksRequired: 50,
      readingTime: 100,
      points: 1000,
      icon: Zap
    }
  ];

  const achievements = [
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
                  <span className="font-medium">Cấp độ: Luyện Khí</span>
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
                <span className="text-blue-500">100 điểm tu luyện</span>
              </div>
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
                        <level.icon className={`w-6 h-6 ${level.progress === 100 ? "text-blue-500" : "text-gray-400"}`} />
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
                        <span>{level.booksRequired} sách</span>
                        <span>{level.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all duration-300"
                          style={{ width: `${level.progress}%` }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
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