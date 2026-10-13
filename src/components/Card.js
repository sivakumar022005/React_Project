import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'medium'
}) => {
  const baseStyles = 'bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700';
  
  const hoverStyles = hover ? 'hover:shadow-md hover:scale-[1.02] transition-all duration-200' : '';
  
  const paddingStyles = {
    none: 'p-0',
    small: 'p-3',
    medium: 'p-6',
    large: 'p-8'
  };
  
  return (
    <div className={`${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
