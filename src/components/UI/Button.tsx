import React, { ReactElement } from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  className?: string;
  leftIcon?: ReactElement;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, variant = 'primary', disabled = false, className = '', leftIcon }) => {
  const baseClasses = "px-4 py-2 rounded font-semibold transition-colors duration-200";
  
  const variantClasses = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700"
  };

  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${disabledClasses} ${className}`}
    >
      <div className="flex items-center gap-2">
        {leftIcon && <span>{leftIcon}</span>}
        <span>{text}</span>
      </div>
    </button>
  );
};

export default Button;
