import React from 'react';
import Card from './Card';

const StatCard = ({ 
  icon, 
  value, 
  label, 
  trend, 
  trendUp = true,
  description,
  className = ''
}) => {
  return (
    <Card hover={true} className={`text-center ${className}`}>
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-3">
          <span className="text-2xl">{icon}</span>
        </div>
        <div className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{value}</div>
        <div className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">{label}</div>
        
        {trend && (
          <div className={`flex items-center space-x-1 text-sm ${
            trendUp ? 'text-success' : 'text-danger'
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {trendUp ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              )}
            </svg>
            <span>{trend}</span>
          </div>
        )}
        
        {description && (
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{description}</p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
