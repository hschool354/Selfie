import React from 'react';
import { SocialButtonProps } from '../types';

// SocialButton component: A reusable button component for social login
export const SocialButton: React.FC<SocialButtonProps> = ({
  icon, // URL of the social media icon
  label, // Label for the button (e.g., "Google", "Facebook")
  bgColor = 'bg-white', // Background color of the button, default is white
  textColor = 'text-gray-700', // Text color of the button, default is gray
  onClick // Click event handler
}) => (
  <button 
    onClick={onClick} // Attach the click event handler
    className={`w-full py-3 px-4 ${bgColor} ${textColor} rounded-xl flex items-center 
                justify-center gap-3 font-medium transition-all duration-200
                hover:shadow-md hover:translate-y-[-1px]`} // Button styling with Tailwind CSS classes
  >
    <img src={icon} alt={label} className="w-5 h-5" /> {/* Social media icon */}
    <span>Continue with {label}</span> {/* Button label */}
  </button>
);