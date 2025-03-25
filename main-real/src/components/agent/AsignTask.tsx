// pages/tasks.tsx
'use client';

import { useState, useEffect } from 'react';
import { tasks, Task } from '../../libs/tasks';

export default function TaskPage() {
  const [taskList, setTaskList] = useState<Task[]>(tasks);
  const [reminders, setReminders] = useState<string[]>([]);

  // AI-like reminder system
  useEffect(() => {
    const checkPendingTasks = () => {
      const pendingReminders = taskList
        .filter(task => task.status === 'Pending')
        .map(task => `Task Pending: "${task.title}" - Due: ${task.dueDate}`);
      
      setReminders(pendingReminders);
    };

    checkPendingTasks();
    const interval = setInterval(checkPendingTasks, 3600000); // Check every hour
    return () => clearInterval(interval);
  }, [taskList]);

  const markTaskComplete = (taskId: number) => {
    setTaskList(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: 'Completed' as const } : task
      )
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Task Management</h1>

      {/* Task List Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Task</th>
              <th className="border p-2">Assigned By</th>
              <th className="border p-2">Due Date</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {taskList.map(task => (
              <tr key={task.id}>
                <td className="border p-2">{task.title}</td>
                <td className="border p-2">{task.assignedBy}</td>
                <td className="border p-2">{task.dueDate}</td>
                <td className="border p-2">{task.status}</td>
                <td className="border p-2">
                  {task.status === 'Pending' && (
                    <button
                      onClick={() => markTaskComplete(task.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* AI-Generated Reminders */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Reminders</h2>
        {reminders.length > 0 ? (
          <ul className="list-disc pl-5">
            {reminders.map((reminder, index) => (
              <li key={index} className="text-red-600">{reminder}</li>
            ))}
          </ul>
        ) : (
          <p>No pending tasks!</p>
        )}
      </div>

      {/* Tasks Assigned by TC */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Tasks Assigned by TC</h2>
        <ul className="list-disc pl-5">
          {taskList
            .filter(task => task.assignedBy === 'TC')
            .map(task => (
              <li key={task.id}>
                {task.title} - {task.status} (Due: {task.dueDate})
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}