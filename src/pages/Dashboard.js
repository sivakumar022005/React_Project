import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Card from '../components/Card';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';

import tasks from '../data/tasks';

const STORAGE_KEY = 'task-forge-tasks';

const getStoredTasks = () => {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);

    if (storedTasks) {
      return JSON.parse(storedTasks);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));

    return tasks;
  } catch (error) {
    console.error('Unable to load tasks:', error);
    return tasks;
  }
};

const Dashboard = () => {
  const [taskList, setTaskList] = useState(() => getStoredTasks());
  const [searchQuery, setSearchQuery] = useState('');

  /*
   * Sync with localStorage when another tab changes the data.
   */
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          setTaskList(JSON.parse(event.newValue));
        } catch (error) {
          console.error('Unable to sync dashboard tasks:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  /*
   * Save tasks after dashboard actions.
   */
  const saveTasks = (updatedTasks) => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedTasks)
    );

    setTaskList(updatedTasks);
  };

  /*
   * Statistics.
   */
  const totalTasks = taskList.length;

  const completedTasks = taskList.filter(
    (task) => task.status === 'Completed'
  ).length;

  const pendingTasks = taskList.filter(
    (task) => task.status === 'Pending'
  ).length;

  const inProgressTasks = taskList.filter(
    (task) => task.status === 'In Progress'
  ).length;

  /*
   * Today's tasks.
   */
  const today = new Date().toISOString().split('T')[0];

  const todayTasks = taskList.filter(
    (task) => task.dueDate === today
  );

  /*
   * Upcoming tasks.
   */
  const upcomingTasks = taskList
    .filter((task) => {
      const taskDate = new Date(task.dueDate);

      return (
        taskDate > new Date() &&
        task.status !== 'Completed'
      );
    })
    .sort(
      (a, b) =>
        new Date(a.dueDate) - new Date(b.dueDate)
    )
    .slice(0, 3);

  /*
   * Dynamic recent activity.
   */
  const recentActivity = [
    ...taskList
      .filter((task) => task.status === 'Completed')
      .slice(-2)
      .reverse()
      .map((task) => ({
        action: 'Completed',
        task: task.title,
        time: 'Recently'
      })),

    ...taskList
      .filter((task) => task.status !== 'Completed')
      .slice(-2)
      .reverse()
      .map((task) => ({
        action: 'Active',
        task: task.title,
        time: 'Recently'
      }))
  ].slice(0, 4);

  /*
   * Complete Task.
   */
  const handleCompleteTask = (taskId) => {
    const updatedTasks = taskList.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status: 'Completed',
            progress: 100
          }
        : task
    );

    saveTasks(updatedTasks);
  };

  /*
   * Edit Task.
   * Dashboard sends user to Tasks page.
   */
  const handleEditTask = () => {
    window.location.href = '/tasks';
  };

  /*
   * Delete Task.
   */
  const handleDeleteTask = (taskId) => {
    const shouldDelete = window.confirm(
      'Are you sure you want to delete this task?'
    );

    if (!shouldDelete) return;

    const updatedTasks = taskList.filter(
      (task) => task.id !== taskId
    );

    saveTasks(updatedTasks);
  };

  /*
   * Search.
   */
  const displayedTodayTasks = todayTasks.filter((task) => {
    const search = searchQuery.toLowerCase();

    return (
      task.title?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search)
    );
  });

  /*
   * Dynamic category progress.
   */
  const categories = [
    'Development',
    'Work',
    'Learning',
    'Personal'
  ];

  const categoryProgress = categories.map((category) => {
    const categoryTasks = taskList.filter(
      (task) => task.category === category
    );

    const completed = categoryTasks.filter(
      (task) => task.status === 'Completed'
    ).length;

    const progress =
      categoryTasks.length > 0
        ? Math.round(
            (completed / categoryTasks.length) * 100
          )
        : 0;

    return {
      category,
      progress
    };
  });

  /*
   * Overall productivity.
   */
  const overallProgress =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100
        )
      : 0;

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-8">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">

          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back! 👋
            </h1>

            <p className="text-slate-600 dark:text-slate-300">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />

              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

          

            {/* Profile */}
            <Link
              to="/profile"
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-semibold">
                JP
              </div>
            </Link>

          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">

          <Link to="/tasks">
            <Button variant="primary">
              + Add Task
            </Button>
          </Link>

          <Link to="/dashboard">
            <Button variant="outline">
              📊 View Reports
            </Button>
          </Link>

          <Link to="/calendar">
            <Button variant="outline">
              📅 Calendar
            </Button>
          </Link>

          <Link to="/settings">
            <Button variant="outline">
              ⚙️ Settings
            </Button>
          </Link>

        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

        <StatCard
          icon="📊"
          value={totalTasks}
          label="Total Tasks"
          trend="Live"
          trendUp={true}
          description="All tasks"
        />

        <StatCard
          icon="✅"
          value={completedTasks}
          label="Completed"
          trend="Live"
          trendUp={true}
          description="Completed tasks"
        />

        <StatCard
          icon="⏳"
          value={inProgressTasks}
          label="In Progress"
          trend="Live"
          trendUp={true}
          description="Currently working"
        />

        <StatCard
          icon="⚠️"
          value={pendingTasks}
          label="Pending"
          trend="Live"
          trendUp={false}
          description="Awaiting action"
        />

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Productivity */}
          <Card>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Productivity Progress
              </h3>

              <Badge variant="primary">
                Live
              </Badge>
            </div>

            <div className="space-y-4">

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    Overall Progress
                  </span>

                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {overallProgress}%
                  </span>
                </div>

                <ProgressBar
                  progress={overallProgress}
                  color="primary"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">

                <div className="text-center">
                  <div className="text-2xl font-bold text-success">
                    {completedTasks}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Completed
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {inProgressTasks}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    In Progress
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">
                    {pendingTasks}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Pending
                  </div>
                </div>

              </div>
            </div>
          </Card>

          {/* Today's Tasks */}
          <Card>

            <div className="flex items-center justify-between mb-4">

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Today's Tasks
              </h3>

              <Link
                to="/tasks"
                className="text-primary text-sm font-medium hover:underline"
              >
                View All
              </Link>

            </div>

            {displayedTodayTasks.length > 0 ? (
              <div className="space-y-4">

                {displayedTodayTasks
                  .slice(0, 3)
                  .map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onComplete={handleCompleteTask}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}

              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">

                <p>
                  {searchQuery
                    ? 'No matching tasks found'
                    : 'No tasks scheduled for today'}
                </p>

                {!searchQuery && (
                  <Link
                    to="/tasks"
                    className="text-primary font-medium mt-2 inline-block"
                  >
                    Create a task
                  </Link>
                )}

              </div>
            )}

          </Card>

          {/* Task Completion Overview */}
          <Card>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Task Completion Overview
            </h3>

            <div className="space-y-4">

              {categoryProgress.map(
                ({ category, progress }) => (
                  <div key={category}>

                    <div className="flex justify-between mb-2">

                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {category}
                      </span>

                      <span className="text-sm font-semibold text-slate-900 dark:text-white">
                        {progress}%
                      </span>

                    </div>

                    <ProgressBar
                      progress={progress}
                      color={
                        category === 'Development'
                          ? 'primary'
                          : category === 'Work'
                          ? 'success'
                          : category === 'Learning'
                          ? 'warning'
                          : 'danger'
                      }
                    />

                  </div>
                )
              )}

            </div>

          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Upcoming */}
          <Card>

            <div className="flex items-center justify-between mb-4">

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Upcoming
              </h3>

              <Link
                to="/calendar"
                className="text-primary text-sm font-medium hover:underline"
              >
                Calendar
              </Link>

            </div>

            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">

                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                  >

                    <div className="w-2 h-2 mt-2 bg-primary rounded-full flex-shrink-0"></div>

                    <div className="flex-1 min-w-0">

                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {task.title}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {task.dueDate}
                      </p>

                    </div>

                    <Badge
                      variant={
                        task.priority === 'High'
                          ? 'danger'
                          : task.priority === 'Medium'
                          ? 'warning'
                          : 'success'
                      }
                      size="small"
                    >
                      {task.priority}
                    </Badge>

                  </div>
                ))}

              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                No upcoming tasks
              </div>
            )}

          </Card>

          {/* Recent Activity */}
          <Card>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Recent Activity
            </h3>

            {recentActivity.length > 0 ? (
              <div className="space-y-4">

                {recentActivity.map((activity, index) => (
                  <div
                    key={`${activity.task}-${index}`}
                    className="flex items-start space-x-3"
                  >

                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.action === 'Completed'
                          ? 'bg-success/10'
                          : 'bg-primary/10'
                      }`}
                    >
                      <span className="text-sm">
                        {activity.action === 'Completed'
                          ? '✅'
                          : '📌'}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">

                      <p className="text-sm text-slate-900 dark:text-white">
                        <span className="font-medium">
                          {activity.action}
                        </span>{' '}
                        {activity.task}
                      </p>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activity.time}
                      </p>

                    </div>

                  </div>
                ))}

              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No recent activity
              </p>
            )}

          </Card>

          {/* Quick Stats */}
          <Card>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Quick Stats
            </h3>

            <div className="space-y-3">

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Tasks Due Today
                </span>

                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {todayTasks.length}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Active Tasks
                </span>

                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {pendingTasks + inProgressTasks}
                </span>

              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Productivity Score
                </span>

                <span className="text-sm font-semibold text-primary">
                  {overallProgress}%
                </span>

              </div>

            </div>
          </Card>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;