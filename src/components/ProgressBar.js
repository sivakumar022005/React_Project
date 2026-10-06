import React from 'react';

const ProgressBar = ({ 
  progress = 0, 
  color = 'primary',
  size = 'medium',
  showLabel = false,
  className = ''
}) => {
  const colorStyles = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger'
  };
  
  const sizeStyles = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };
  
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Progress</span>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full ${sizeStyles[size]}`}>
        <div
          className={`${colorStyles[color]} ${sizeStyles[size]} rounded-full transition-all duration-300`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
