import React from 'react';
import { AuthButtonProps } from '../types';

// AuthButton component definition with props destructuring
export const AuthButton: React.FC<AuthButtonProps> = ({
    label, // Text to be displayed on the button
    variant = 'primary', // Button style variant, defaults to 'primary'
    onClick // Click event handler
}) => {
    // Base styles for the button
    const baseStyles = "px-6 py-2 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-1px]";
    
    // Conditional styles based on the variant prop
    const variantStyles = variant === 'primary' 
        ? "bg-blue-600 text-white" // Styles for primary variant
        : "bg-white text-blue-600"; // Styles for secondary variant

    return (
        // Button element with combined styles and click event handler
        <button 
            onClick={onClick}
            className={`${baseStyles} ${variantStyles}`}
        >
            {label} {/* Display the button label */}
        </button>
    );
};