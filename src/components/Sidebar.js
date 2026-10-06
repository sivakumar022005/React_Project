import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/tasks', icon: '📋', label: 'My Tasks' },
    { path: '/calendar', icon: '📅', label: 'Calendar' },
    { path: '/profile', icon: '👤', label: 'Profile' }
    
  ];

  return (
    <aside className="hidden md:block w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 fixed left-0 top-16 bottom-0 overflow-y-auto">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Menu</h2>
          <nav className="space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Quick Stats</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">Completed</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">In Progress</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">5</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-danger rounded-full"></div>
                <span className="text-sm text-slate-600 dark:text-slate-300">Overdue</span>
              </div>
              <span className="text-sm font-semibold text-slate-900 dark:text-white">2</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
