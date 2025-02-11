import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';

interface StrengthIndicator {
  level: string;
  color: string;
  boxes: number;
}

interface PasswordStrengthProps {
    password: string;
}

const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  // Xóa state password vì đã có từ props
  
  const strengthIndicators: StrengthIndicator[] = useMemo(() => [
    { level: 'Rất yếu', color: '#FF3B30', boxes: 1 },
    { level: 'Yếu', color: '#FF9500', boxes: 2 },
    { level: 'Trung bình', color: '#FFD60A', boxes: 3 },
    { level: 'Mạnh', color: '#34C759', boxes: 4 },
  ], []);

  const calculateStrength = useCallback((pass: string): number => {
    if (!pass) return 0;
    
    let score = 0;
    
    // Length check
    if (pass.length >= 8) score += 1;
    if (pass.length >= 12) score += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 0.5;
    if (/[^A-Za-z0-9]/.test(pass)) score += 0.5;
    
    return Math.min(Math.floor(score), 3);
  }, []);

  const strength = useMemo(() => calculateStrength(password), [password, calculateStrength]);
  const currentIndicator = strengthIndicators[strength];

  // Xóa handleChange vì không cần nữa

  return (
    <div className="w-full space-y-4">           
      {/* Strength boxes */}
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((box) => (
          <motion.div
            key={box}
            className="h-2 w-full rounded"
            animate={{
              backgroundColor: box <= strength ? currentIndicator?.color : '#E5E7EB',
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <motion.div 
        className="h-1 rounded-full"
        animate={{
          width: password ? `${(strength + 1) * 25}%` : '0%',
          backgroundColor: currentIndicator?.color
        }}
        transition={{ duration: 0.5 }}
      />

      {/* Strength level text */}
      {password && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm"
          style={{ color: currentIndicator?.color }}
        >
          {currentIndicator?.level}
        </motion.p>
      )}      
    </div>
  );
};

export default PasswordStrength;