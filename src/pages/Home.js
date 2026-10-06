import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';
import Badge from '../components/Badge';
import ProgressBar from '../components/ProgressBar';
import tasks from '../data/tasks';

const Home = () => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const pendingTasks = tasks.filter(task => task.status === 'Pending').length;
  const overdueTasks = tasks.filter(task => task.status === 'Overdue').length;

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="min-h-screen">
      {/* Section 1: Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-blue-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <span className="text-xl font-bold">Task Forge</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Organize Your Work.<br />
                Forge Your Success.
              </h1>
              
              <p className="text-lg text-blue-100 mb-8 max-w-lg">
                Transform your productivity with our intelligent task management dashboard. 
                Stay organized, focused, and ahead of your goals.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/tasks">
                  <Button variant="secondary" size="large">
                    Get Started
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button variant="outline" size="large" className="border-white text-white hover:bg-white hover:text-primary">
                    View Dashboard
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-4 -right-4 w-64 h-64 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="space-y-4">
                  {recentTasks.slice(0, 3).map((task) => (
                    <div key={task.id} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-white">{task.title}</span>
                        <Badge variant="warning" size="small">{task.priority}</Badge>
                      </div>
                      <ProgressBar progress={task.progress} size="small" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Productivity Overview */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Productivity Overview</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Track your progress and stay motivated with real-time statistics
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              icon="📊"
              value={totalTasks}
              label="Total Tasks"
              trend="+12%"
              trendUp={true}
              description="All time tasks"
            />
            <StatCard 
              icon="✅"
              value={completedTasks}
              label="Completed Tasks"
              trend="+8%"
              trendUp={true}
              description="Successfully done"
            />
            <StatCard 
              icon="⏳"
              value={pendingTasks}
              label="Pending Tasks"
              trend="-5%"
              trendUp={false}
              description="Awaiting action"
            />
            <StatCard 
              icon="⚠️"
              value={overdueTasks}
              label="Overdue Tasks"
              trend="+2%"
              trendUp={false}
              description="Need attention"
            />
          </div>
        </div>
      </section>

      {/* Section 3: Smart Task Management */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Smart Task Management</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Powerful features to help you manage your tasks efficiently
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hover={true} className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">➕</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Create Tasks</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Quickly add new tasks with all the details you need</p>
              <span className="text-primary text-sm font-medium">Learn more →</span>
            </Card>
            
            <Card hover={true} className="text-center">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Set Priorities</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Organize tasks by priority to focus on what matters</p>
              <span className="text-primary text-sm font-medium">Learn more →</span>
            </Card>
            
            <Card hover={true} className="text-center">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Track Progress</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Monitor your progress with visual indicators</p>
              <span className="text-primary text-sm font-medium">Learn more →</span>
            </Card>
            
            <Card hover={true} className="text-center">
              <div className="w-12 h-12 bg-danger/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Manage Deadlines</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Never miss a deadline with smart reminders</p>
              <span className="text-primary text-sm font-medium">Learn more →</span>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 4: Task Workflow */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Task Workflow</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Follow a simple yet effective workflow to manage your tasks
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {[
              { step: 'Create Task', icon: '📝' },
              { step: 'Assign Priority', icon: '🎯' },
              { step: 'Work on Task', icon: '⚡' },
              { step: 'Complete Task', icon: '✅' }
            ].map((item, index) => (
              <React.Fragment key={index}>
                <Card className="flex-1 text-center p-6 min-w-[200px]">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{item.icon}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">{item.step}</h3>
                </Card>
                {index < 3 && (
                  <div className="hidden md:flex items-center justify-center">
                    <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Recent Tasks */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Recent Tasks</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Stay on top of your latest tasks and activities
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link to="/tasks">
              <Button variant="primary">View All Tasks</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 6: Productivity Insights */}
      <section className="py-16 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Productivity Insights</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Understand your productivity patterns and optimize your workflow
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Weekly Productivity</h3>
              <div className="space-y-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="flex items-center space-x-4">
                    <span className="w-12 text-sm text-slate-600 dark:text-slate-300">{day}</span>
                    <div className="flex-1 bg-slate-100 rounded-full h-3">
                      <div 
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                        style={{ width: `${Math.random() * 60 + 40}%` }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{Math.floor(Math.random() * 8 + 4)} tasks</span>
                  </div>
                ))}
              </div>
            </Card>
            
            <Card>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Task Completion Rate</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Completed</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{Math.round((completedTasks / totalTasks) * 100)}%</span>
                  </div>
                  <ProgressBar progress={(completedTasks / totalTasks) * 100} color="success" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">In Progress</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{Math.round((tasks.filter(t => t.status === 'In Progress').length / totalTasks) * 100)}%</span>
                  </div>
                  <ProgressBar progress={(tasks.filter(t => t.status === 'In Progress').length / totalTasks) * 100} color="primary" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Pending</span>
                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{Math.round((pendingTasks / totalTasks) * 100)}%</span>
                  </div>
                  <ProgressBar progress={(pendingTasks / totalTasks) * 100} color="warning" />
                </div>
                
                <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-300">Productivity Score</span>
                    <span className="text-2xl font-bold text-primary">85/100</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 7: Why Task Forge */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Task Forge?</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Discover the benefits that make Task Forge the perfect choice for you
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {[
                { icon: '🎨', title: 'Simple Interface', desc: 'Clean and intuitive design for easy navigation' },
                { icon: '⚡', title: 'Fast Organization', desc: 'Quickly organize and categorize your tasks' },
                { icon: '🎯', title: 'Priority Management', desc: 'Set and track task priorities effectively' }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              {[
                { icon: '📅', title: 'Deadline Tracking', desc: 'Never miss important deadlines again' },
                { icon: '📊', title: 'Productivity Monitoring', desc: 'Track your progress with detailed insights' },
                { icon: '📱', title: 'Responsive Design', desc: 'Access your tasks from any device' }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-300">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 8: Call To Action */}
      <section className="py-20 bg-gradient-to-br from-primary via-blue-900 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Forge a More Productive Day?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have transformed their productivity with Task Forge. 
            Start managing your tasks smarter today.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/tasks">
              <Button variant="secondary" size="large">
                Start Managing Tasks
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="large" className="border-white text-white hover:bg-white hover:text-primary">
                Explore Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
