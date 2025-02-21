import React from 'react';
import { AlertDescription } from './AlertDescription';
import { Check, AlertCircle } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ type, children }) => {
  const alertStyles = {
    success: 'border-green-500 bg-green-50 text-green-700',
    error: 'border-red-500 bg-red-50 text-red-700',
  };

  const iconStyles = {
    success: <Check className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
  };

  return (
    <div className={`flex items-center p-4 border-l-4 rounded-lg shadow-sm ${alertStyles[type]}`}>
      <div className="mr-3">
        {iconStyles[type]}
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};