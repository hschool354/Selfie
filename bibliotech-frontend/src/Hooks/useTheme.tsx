import { useState, useEffect } from 'react';

export const useTheme = () => {
  // Đọc giá trị từ localStorage khi component mount
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    // Nếu đã có giá trị trong localStorage thì dùng nó, không thì mặc định là false
    return savedTheme ? JSON.parse(savedTheme) : false;
  });

  // Cập nhật localStorage mỗi khi isDarkMode thay đổi
  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Trả về state và function để toggle theme
  return {
    isDarkMode,
    toggleTheme: () => setIsDarkMode(!isDarkMode)
  };
};