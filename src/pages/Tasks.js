import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import TaskCard from '../components/TaskCard';
import Button from '../components/Button';
import Modal from '../components/Modal';
import EmptyState from '../components/EmptyState';
import tasks from '../data/tasks';

/*
 * =========================================================
 * USER-SPECIFIC TASK STORAGE
 * =========================================================
 */

const OLD_STORAGE_KEY = 'task-forge-tasks';

const getCurrentUserEmail = () => {
  const email = localStorage.getItem('userEmail');

  if (!email) {
    return null;
  }

  return email.trim().toLowerCase();
};

const getUserStorageKey = () => {
  const email = getCurrentUserEmail();

  if (!email) {
    return null;
  }

  return `task-forge-tasks-${email}`;
};

/*
 * =========================================================
 * GET STORED TASKS
 * =========================================================
 */

const getStoredTasks = () => {
  try {
    const userEmail = getCurrentUserEmail();

    /*
     * No logged-in user
     * Do not use a common task storage.
     */

    if (!userEmail) {
      return [];
    }

    const userStorageKey =
      `task-forge-tasks-${userEmail}`;

    /*
     * Check user-specific tasks first.
     */

    const storedUserTasks =
      localStorage.getItem(userStorageKey);

    if (storedUserTasks) {
      const parsedTasks = JSON.parse(
        storedUserTasks
      );

      if (Array.isArray(parsedTasks)) {
        return parsedTasks;
      }
    }

    /*
     * =====================================================
     * OLD TASK MIGRATION
     * =====================================================
     *
     * Earlier version used:
     *
     * task-forge-tasks
     *
     * Move that old data to the currently logged-in user
     * only once.
     */

    const oldStoredTasks =
      localStorage.getItem(OLD_STORAGE_KEY);

    if (oldStoredTasks) {
      const parsedOldTasks =
        JSON.parse(oldStoredTasks);

      if (Array.isArray(parsedOldTasks)) {

        localStorage.setItem(
          userStorageKey,
          JSON.stringify(parsedOldTasks)
        );

        /*
         * Remove old shared storage.
         *
         * This is important because another user
         * should NOT receive the old user's tasks.
         */

        localStorage.removeItem(
          OLD_STORAGE_KEY
        );

        return parsedOldTasks;
      }
    }

    /*
     * =====================================================
     * FIRST TIME USER
     * =====================================================
     *
     * Give default demo tasks.
     */

    const defaultTasks = Array.isArray(tasks)
      ? tasks
      : [];

    localStorage.setItem(
      userStorageKey,
      JSON.stringify(defaultTasks)
    );

    return defaultTasks;

  } catch (error) {

    console.error(
      'Unable to load tasks from localStorage:',
      error
    );

    return Array.isArray(tasks)
      ? tasks
      : [];
  }
};

/*
 * =========================================================
 * SAVE USER TASKS
 * =========================================================
 */

const saveTasks = (taskList) => {
  try {
    const userStorageKey =
      getUserStorageKey();

    /*
     * Never save tasks without a logged-in user.
     */

    if (!userStorageKey) {
      console.warn(
        'No logged-in user. Tasks were not saved.'
      );

      return;
    }

    localStorage.setItem(
      userStorageKey,
      JSON.stringify(taskList)
    );

  } catch (error) {

    console.error(
      'Unable to save tasks to localStorage:',
      error
    );
  }
};

/*
 * =========================================================
 * TASKS COMPONENT
 * =========================================================
 */

const Tasks = () => {

  const [taskList, setTaskList] = useState(
    () => getStoredTasks()
  );

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingTask, setEditingTask] =
    useState(null);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('All');

  const [priorityFilter, setPriorityFilter] =
    useState('All');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Pending',
    dueDate: '',
    category: 'Work',
    progress: 0
  });

  /*
   * =======================================================
   * SAVE TASKS WHEN TASK LIST CHANGES
   * =======================================================
   */

  useEffect(() => {
    saveTasks(taskList);
  }, [taskList]);

  /*
   * =======================================================
   * LISTEN FOR TASK CHANGES FROM ANOTHER TAB
   * =======================================================
   */

  useEffect(() => {

    const currentUserEmail =
      getCurrentUserEmail();

    if (!currentUserEmail) {
      return;
    }

    const userStorageKey =
      `task-forge-tasks-${currentUserEmail}`;

    const handleStorageChange = (event) => {

      if (
        event.key === userStorageKey &&
        event.newValue
      ) {
        try {

          const updatedTasks =
            JSON.parse(event.newValue);

          if (Array.isArray(updatedTasks)) {
            setTaskList(updatedTasks);
          }

        } catch (error) {

          console.error(
            'Unable to sync tasks:',
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
   * =======================================================
   * FILL FORM WHEN EDITING
   * =======================================================
   */

  useEffect(() => {

    if (editingTask) {

      setFormData({
        title: editingTask.title || '',
        description:
          editingTask.description || '',
        priority:
          editingTask.priority || 'Medium',
        status:
          editingTask.status || 'Pending',
        dueDate:
          editingTask.dueDate || '',
        category:
          editingTask.category || 'Work',
        progress:
          editingTask.progress ?? 0
      });

    } else {

      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Pending',
        dueDate: '',
        category: 'Work',
        progress: 0
      });

    }

  }, [editingTask, isModalOpen]);

  /*
   * =======================================================
   * FILTER TASKS
   * =======================================================
   */

  const filteredTasks = taskList.filter((task) => {

    const search =
      searchQuery.toLowerCase();

    const matchesSearch =
      task.title
        ?.toLowerCase()
        .includes(search) ||
      task.description
        ?.toLowerCase()
        .includes(search);

    const matchesStatus =
      statusFilter === 'All' ||
      task.status === statusFilter;

    const matchesPriority =
      priorityFilter === 'All' ||
      task.priority === priorityFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  /*
   * =======================================================
   * OPEN ADD TASK MODAL
   * =======================================================
   */

  const handleAddTask = () => {

    setEditingTask(null);
    setIsModalOpen(true);
  };

  /*
   * =======================================================
   * OPEN EDIT TASK MODAL
   * =======================================================
   */

  const handleEditTask = (taskId) => {

    const task =
      taskList.find(
        (task) => task.id === taskId
      );

    if (task) {

      setEditingTask(task);
      setIsModalOpen(true);
    }
  };

  /*
   * =======================================================
   * DELETE TASK
   * =======================================================
   */

  const handleDeleteTask = (taskId) => {

    const shouldDelete =
      window.confirm(
        'Are you sure you want to delete this task?'
      );

    if (!shouldDelete) {
      return;
    }

    setTaskList((previousTasks) => {

      const updatedTasks =
        previousTasks.filter(
          (task) => task.id !== taskId
        );

      /*
       * Save immediately.
       */

      saveTasks(updatedTasks);

      return updatedTasks;
    });
  };

  /*
   * =======================================================
   * COMPLETE TASK
   * =======================================================
   */

  const handleCompleteTask = (taskId) => {

    setTaskList((previousTasks) => {

      const updatedTasks =
        previousTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status: 'Completed',
                progress: 100
              }
            : task
        );

      /*
       * Save immediately.
       */

      saveTasks(updatedTasks);

      return updatedTasks;
    });
  };

  /*
   * =======================================================
   * ADD OR UPDATE TASK
   * =======================================================
   */

  const handleFormSubmit = (e) => {

    e.preventDefault();

    const cleanFormData = {
      ...formData,
      progress: Number(formData.progress)
    };

    /*
     * UPDATE EXISTING TASK
     */

    if (editingTask) {

      setTaskList((previousTasks) => {

        const updatedTasks =
          previousTasks.map((task) =>
            task.id === editingTask.id
              ? {
                  ...task,
                  ...cleanFormData
                }
              : task
          );

        saveTasks(updatedTasks);

        return updatedTasks;
      });

    } else {

      /*
       * CREATE NEW TASK
       */

      const newTask = {
        id: Date.now(),
        ...cleanFormData,
        createdAt:
          new Date().toISOString()
      };

      setTaskList((previousTasks) => {

        const updatedTasks = [
          ...previousTasks,
          newTask
        ];

        saveTasks(updatedTasks);

        return updatedTasks;
      });
    }

    setIsModalOpen(false);
    setEditingTask(null);
  };

  /*
   * =======================================================
   * HANDLE FORM INPUT
   * =======================================================
   */

  const handleInputChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value
    }));
  };

  /*
   * =======================================================
   * CLOSE MODAL
   * =======================================================
   */

  const closeModal = () => {

    setIsModalOpen(false);
    setEditingTask(null);
  };

  /*
   * =======================================================
   * UI
   * =======================================================
   */

  return (
    <div className="p-6">

      {/* Header */}

      <div className="mb-6">

        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          My Tasks
        </h1>

        <p className="text-slate-600 dark:text-slate-300">
          Manage and organize your tasks efficiently
        </p>

      </div>

      {/* Filters and Search */}

      <Card className="mb-6">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex flex-col sm:flex-row gap-3 flex-1">

            {/* Search */}

            <div className="relative flex-1">

              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />

              <svg
                className="absolute left-3 top-2.5 w-5 h-5 text-slate-400 dark:text-slate-500"
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

            {/* Status Filter */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >

              <option value="All">
                All Status
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="In Progress">
                In Progress
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Overdue">
                Overdue
              </option>

            </select>

            {/* Priority Filter */}

            <select
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value
                )
              }
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >

              <option value="All">
                All Priority
              </option>

              <option value="High">
                High
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Low">
                Low
              </option>

            </select>

          </div>

          <Button
            variant="primary"
            onClick={handleAddTask}
          >
            + Add Task
          </Button>

        </div>

      </Card>

      {/* Task Stats */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

        <Card className="text-center p-4">

          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {taskList.length}
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-300">
            Total
          </div>

        </Card>

        <Card className="text-center p-4">

          <div className="text-2xl font-bold text-success">
            {
              taskList.filter(
                (t) =>
                  t.status ===
                  'Completed'
              ).length
            }
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-300">
            Completed
          </div>

        </Card>

        <Card className="text-center p-4">

          <div className="text-2xl font-bold text-primary">
            {
              taskList.filter(
                (t) =>
                  t.status ===
                  'In Progress'
              ).length
            }
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-300">
            In Progress
          </div>

        </Card>

        <Card className="text-center p-4">

          <div className="text-2xl font-bold text-warning">
            {
              taskList.filter(
                (t) =>
                  t.status ===
                  'Pending'
              ).length
            }
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-300">
            Pending
          </div>

        </Card>

      </div>

      {/* Task List */}

      {filteredTasks.length > 0 ? (

        <div className="space-y-4">

          {filteredTasks.map((task) => (

            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onComplete={handleCompleteTask}
            />

          ))}

        </div>

      ) : (

        <Card>

          <EmptyState
            icon={
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />

              </svg>
            }

            title="No tasks found"

            description={
              searchQuery ||
              statusFilter !== 'All' ||
              priorityFilter !== 'All'
                ? 'Try adjusting your filters or search terms'
                : 'Get started by creating your first task'
            }

            action={
              <Button
                variant="primary"
                onClick={handleAddTask}
              >
                Create Your First Task
              </Button>
            }

          />

        </Card>

      )}

      {/* Add/Edit Task Modal */}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={
          editingTask
            ? 'Edit Task'
            : 'Add New Task'
        }
        size="large"
      >

        <form
          onSubmit={handleFormSubmit}
          className="space-y-4"
        >

          {/* Title */}

          <div>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Task Title *
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter task title"
            />

          </div>

          {/* Description */}

          <div>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter task description"
            />

          </div>

          {/* Priority + Status */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>

              <select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>

            </div>

            <div>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Overdue">
                  Overdue
                </option>

              </select>

            </div>

          </div>

          {/* Date + Category */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>

              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />

            </div>

            <div>

              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >

                <option value="Work">
                  Work
                </option>

                <option value="Development">
                  Development
                </option>

                <option value="Learning">
                  Learning
                </option>

                <option value="Personal">
                  Personal
                </option>

                <option value="Career">
                  Career
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="Research">
                  Research
                </option>

              </select>

            </div>

          </div>

          {/* Progress */}

          <div>

            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Progress: {formData.progress}%
            </label>

            <input
              type="range"
              name="progress"
              value={formData.progress}
              onChange={handleInputChange}
              min="0"
              max="100"
              className="w-full"
            />

          </div>

          {/* Buttons */}

          <div className="flex justify-end space-x-3 pt-4">

            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
            >
              {
                editingTask
                  ? 'Update Task'
                  : 'Create Task'
              }
            </Button>

          </div>

        </form>

      </Modal>

    </div>
  );
};

export default Tasks;