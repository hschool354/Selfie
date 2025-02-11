import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypingTextProps {
  className?: string;
  isDarkMode?: boolean;
}

const TypingText: React.FC<TypingTextProps> = ({ 
  className = "text-3xl font-bold",
  isDarkMode = false 
}) => {
  const text = "Turn Your Reading Dreams Into Reality";
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 100);

      return () => clearTimeout(timeout);
    } else {
      const resetTimeout = setTimeout(() => {
        setDisplayedText('');
        setCurrentIndex(0);
      }, 2000);

      return () => clearTimeout(resetTimeout);
    }
  }, [currentIndex]);

  return (
    <motion.h2 
      className={`${className} ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
    >
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block ml-1"
      >
        |
      </motion.span>
    </motion.h2>
  );
};

export default TypingText;