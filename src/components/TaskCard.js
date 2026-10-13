import React from 'react';
import Card from './Card';
import Badge from './Badge';
import ProgressBar from './ProgressBar';
import Button from './Button';

const TaskCard = ({ task, onEdit, onDelete, onComplete }) => {
  const priorityColors = {
    High: 'danger',
    Medium: 'warning',
    Low: 'success'
  };

  const statusColors = {
    'In Progress': 'primary',
    'Completed': 'success',
    'Pending': 'warning',
    'Overdue': 'danger'
  };

  return (
    <Card hover={true} className="mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">{task.title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">{task.description}</p>
        </div>
        <div className="flex space-x-2 ml-4">
          <Badge variant={priorityColors[task.priority]} size="small">
            {task.priority}
          </Badge>
          <Badge variant={statusColors[task.status]} size="small">
            {task.status}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{task.dueDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span>{task.category}</span>
          </div>
        </div>
      </div>

      <ProgressBar progress={task.progress} size="small" showLabel={false} />

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex space-x-2">
          {onComplete && task.status !== 'Completed' && (
            <Button variant="success" size="small" onClick={() => onComplete(task.id)}>
              Complete
            </Button>
          )}
          {onEdit && (
            <Button variant="outline" size="small" onClick={() => onEdit(task.id)}>
              Edit
            </Button>
          )}
        </div>
        {onDelete && (
          <Button variant="danger" size="small" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
