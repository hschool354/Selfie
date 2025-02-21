import React from 'react';

interface AlertDescriptionProps {
  children: React.ReactNode;
}

export const AlertDescription: React.FC<AlertDescriptionProps> = ({ children }) => {
  return (
    <p className="text-sm">
      {children}
    </p>
  );
};