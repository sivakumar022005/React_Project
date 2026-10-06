import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  className = '',
  type = 'button'
}) => {
  const baseStyles = 'font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200';
  
  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-blue-800 focus:ring-primary',
    secondary: 'bg-secondary text-white hover:bg-blue-600 focus:ring-secondary',
    success: 'bg-success text-white hover:bg-emerald-600 focus:ring-success',
    danger: 'bg-danger text-white hover:bg-red-600 focus:ring-danger',
    warning: 'bg-warning text-white hover:bg-amber-600 focus:ring-warning',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary dark:hover:bg-blue-700',
    ghost: 'text-primary hover:bg-blue-50 focus:ring-primary dark:hover:bg-slate-700'
  };
  
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
