import React, { useEffect, useState } from 'react';

import Card from '../components/Card';
import Badge from '../components/Badge';
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
    console.error('Unable to load calendar tasks:', error);
    return tasks;
  }
};

const Calendar = () => {
  const [taskList, setTaskList] = useState(() =>
    getStoredTasks()
  );

  const [currentDate, setCurrentDate] = useState(
    new Date()
  );

  const [selectedDate, setSelectedDate] = useState(
    new Date()
  );

  /*
   * Sync calendar when localStorage changes.
   */
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        event.key === STORAGE_KEY &&
        event.newValue
      ) {
        try {
          setTaskList(JSON.parse(event.newValue));
        } catch (error) {
          console.error(
            'Unable to sync calendar tasks:',
            error
          );
        }
      }
    };

    window.addEventListener(
      'storage',
      handleStorageChange
    );

    return () => {
      window.removeEventListener(
        'storage',
        handleStorageChange
      );
    };
  }, []);

  /*
   * Calendar information.
   */
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return {
      daysInMonth,
      startingDayOfWeek
    };
  };

  /*
   * Navigate month.
   */
  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);

    newDate.setMonth(
      newDate.getMonth() + direction
    );

    setCurrentDate(newDate);
  };

  /*
   * Today.
   */
  const goToToday = () => {
    const today = new Date();

    setCurrentDate(today);
    setSelectedDate(today);
  };

  /*
   * Select date.
   */
  const selectDate = (date) => {
    setSelectedDate(date);
  };

  /*
   * Is today?
   */
  const isToday = (date) => {
    const today = new Date();

    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  /*
   * Is selected?
   */
  const isSelected = (date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  /*
   * Get tasks for a date.
   */
  const getTasksForDate = (date) => {
    const year = date.getFullYear();
    const month = String(
      date.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      date.getDate()
    ).padStart(2, '0');

    const dateString = `${year}-${month}-${day}`;

    return taskList.filter(
      (task) => task.dueDate === dateString
    );
  };

  const {
    daysInMonth,
    startingDayOfWeek
  } = getDaysInMonth(currentDate);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const dayNames = [
    'Sun',
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat'
  ];

  /*
   * Render calendar days.
   */
  const renderCalendarDays = () => {
    const days = [];

    /*
     * Empty cells before month starts.
     */
    for (
      let i = 0;
      i < startingDayOfWeek;
      i++
    ) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-24 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600"
        ></div>
      );
    }

    /*
     * Actual days.
     */
    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );

      const dayTasks =
        getTasksForDate(date);

      const hasTasks =
        dayTasks.length > 0;

      const today =
        isToday(date);

      const selected =
        isSelected(date);

      days.push(
        <div
          key={day}
          onClick={() =>
            selectDate(date)
          }
          className={`h-24 border border-slate-200 dark:border-slate-600 p-2 cursor-pointer transition-all ${
            today
              ? 'bg-primary/5 border-primary'
              : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700'
          } ${
            selected
              ? 'ring-2 ring-primary ring-inset'
              : ''
          }`}
        >

          {/* Date */}
          <div className="flex items-center justify-between mb-1">

            <span
              className={`text-sm font-medium ${
                today
                  ? 'text-primary'
                  : 'text-slate-900 dark:text-white'
              }`}
            >
              {day}
            </span>

            {today && (
              <Badge
                variant="primary"
                size="small"
              >
                Today
              </Badge>
            )}

          </div>

          {/* Tasks */}
          {hasTasks && (
            <div className="space-y-1">

              {dayTasks
                .slice(0, 2)
                .map((task) => (
                  <div
                    key={task.id}
                    className={`text-xs px-1.5 py-0.5 rounded truncate ${
                      task.priority === 'High'
                        ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        : task.priority === 'Medium'
                        ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                        : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                    }`}
                  >
                    {task.title}
                  </div>
                ))}

              {dayTasks.length > 2 && (
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  +{dayTasks.length - 2} more
                </div>
              )}

            </div>
          )}

        </div>
      );
    }

    return days;
  };

  /*
   * Selected date tasks.
   */
  const selectedDateTasks =
    getTasksForDate(selectedDate);

  /*
   * Upcoming deadlines.
   */
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingDeadlines = taskList
    .filter((task) => {
      const taskDate = new Date(
        `${task.dueDate}T00:00:00`
      );

      return (
        taskDate >= today &&
        task.status !== 'Completed'
      );
    })
    .sort(
      (a, b) =>
        new Date(`${a.dueDate}T00:00:00`) -
        new Date(`${b.dueDate}T00:00:00`)
    )
    .slice(0, 5);

  /*
   * Current month tasks.
   */
  const currentMonthTasks =
    taskList.filter((task) => {
      const taskDate = new Date(
        `${task.dueDate}T00:00:00`
      );

      return (
        taskDate.getMonth() ===
          currentDate.getMonth() &&
        taskDate.getFullYear() ===
          currentDate.getFullYear()
      );
    });

  const completedThisMonth =
    currentMonthTasks.filter(
      (task) =>
        task.status === 'Completed'
    ).length;

  const remainingThisMonth =
    currentMonthTasks.filter(
      (task) =>
        task.status !== 'Completed'
    ).length;

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Calendar
        </h1>

        <p className="text-slate-600 dark:text-slate-300">
          View and manage your tasks by date
        </p>

      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Calendar */}
        <div className="lg:col-span-2">

          <Card>

            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">

              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                {monthNames[
                  currentDate.getMonth()
                ]}{' '}
                {currentDate.getFullYear()}
              </h2>

              <div className="flex items-center space-x-2">

                <Button
                  variant="outline"
                  size="small"
                  onClick={() =>
                    navigateMonth(-1)
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </Button>

                <Button
                  variant="outline"
                  size="small"
                  onClick={goToToday}
                >
                  Today
                </Button>

                <Button
                  variant="outline"
                  size="small"
                  onClick={() =>
                    navigateMonth(1)
                  }
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Button>

              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0 border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden">

              {/* Day Headers */}
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="bg-slate-100 dark:bg-slate-700 px-2 py-3 text-center text-sm font-semibold text-slate-700 dark:text-slate-300 border-b border-r border-slate-200 dark:border-slate-600"
                >
                  {day}
                </div>
              ))}

              {/* Days */}
              {renderCalendarDays()}

            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">

              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-100 dark:bg-red-900 rounded"></div>

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  High Priority
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-100 dark:bg-amber-900 rounded"></div>

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Medium Priority
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-100 dark:bg-emerald-900 rounded"></div>

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Low Priority
                </span>
              </div>

            </div>

          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Selected Date */}
          <Card>

            <div className="flex items-center justify-between mb-4">

              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {selectedDate.toLocaleDateString(
                  'en-US',
                  {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                  }
                )}
              </h3>

              <Badge
                variant={
                  isToday(selectedDate)
                    ? 'primary'
                    : 'default'
                }
              >
                {isToday(selectedDate)
                  ? 'Today'
                  : 'Selected'}
              </Badge>

            </div>

            {selectedDateTasks.length > 0 ? (
              <div className="space-y-3">

                {selectedDateTasks.map(
                  (task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                    >

                      <div className="flex items-start justify-between mb-2">

                        <h4 className="font-medium text-slate-900 dark:text-white">
                          {task.title}
                        </h4>

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

                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between">

                        <Badge
                          variant="primary"
                          size="small"
                        >
                          {task.status}
                        </Badge>

                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {task.category}
                        </span>

                      </div>

                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">

                <svg
                  className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>

                <p>
                  No tasks scheduled for this date
                </p>

              </div>
            )}

          </Card>

          {/* Upcoming Deadlines */}
          <Card>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              Upcoming Deadlines
            </h3>

            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">

                {upcomingDeadlines.map(
                  (task) => (
                    <div
                      key={task.id}
                      className="flex items-start space-x-3 p-3 bg-slate-50 dark:bg-slate-700 rounded-lg"
                    >

                      <div
                        className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${
                          task.priority === 'High'
                            ? 'bg-danger'
                            : task.priority === 'Medium'
                            ? 'bg-warning'
                            : 'bg-success'
                        }`}
                      ></div>

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
                  )
                )}

              </div>
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <p>No upcoming deadlines</p>
              </div>
            )}

          </Card>

          {/* Quick Stats */}
          <Card>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              This Month
            </h3>

            <div className="space-y-3">

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Total Tasks
                </span>

                <span className="text-sm font-semibold text-slate-900 dark:text-white">
                  {currentMonthTasks.length}
                </span>

              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Completed
                </span>

                <span className="text-sm font-semibold text-success">
                  {completedThisMonth}
                </span>

              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">

                <span className="text-sm text-slate-600 dark:text-slate-300">
                  Remaining
                </span>

                <span className="text-sm font-semibold text-primary">
                  {remainingThisMonth}
                </span>

              </div>

            </div>

          </Card>

        </div>
      </div>
    </div>
  );
};

export default Calendar;