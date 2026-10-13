import React from 'react';

const EmptyState = ({ 
  icon,
  title = 'No data found',
  description = 'There are no items to display at the moment.',
  action = null,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-slate-300 dark:text-slate-600">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">{description}</p>
      {action && (
        <div>{action}</div>
      )}
    </div>
  );
};

export default EmptyState;
