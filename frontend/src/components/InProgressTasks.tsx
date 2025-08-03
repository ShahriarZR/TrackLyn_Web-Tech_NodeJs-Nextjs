'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Modal from './Modal'; // adjust the path if needed

interface Task {
  id: number;
  title: string;
  description?: string;
  status?: string;
  dueDate: string | null;
  startAt?: string | null;
  completedAt?: string | null;
  [key: string]: any; // to allow other fields dynamically
}

interface InProgressTasksProps {
  tasks?: Task[];
}

const formatDate = (dateStr: string | null | undefined) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleDateString(); // more readable format
};

const InProgressTasks: React.FC<InProgressTasksProps> = ({ tasks: propTasks }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (propTasks && propTasks.length > 0) {
      setTasks(propTasks);
      setLoading(false);
      return;
    }

    const fetchInProgressTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3030/employee/tasks/taskDates', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = response.data as any[];

        // Map tasks with all fields
        const tasksWithDetails = data.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          dueDate: task.dueDate || null,
          startAt: task.startAt || null,
          completedAt: task.completedAt || null,
          // include other fields if needed
        }));

        setTasks(tasksWithDetails);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
        setLoading(false);
      }
    };

    fetchInProgressTasks();
  }, [propTasks]);

  if (loading) return <div className="text-gray-600">Loading tasks...</div>;
  if (error) return <div className="text-red-600">Error loading tasks: {error}</div>;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6 text-gray-800">In Progress Tasks</h3>
      <div className="flex flex-wrap gap-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            onClick={() => setSelectedTask(task)}
            className="group bg-white rounded-xl p-5 border border-gray-200 shadow-sm transition-all duration-300 transform hover:shadow-xl hover:scale-105 hover:border-purple-500 hover:bg-gradient-to-b hover:from-purple-50 hover:to-white w-[230px] flex-shrink-0 cursor-pointer"
            title={task.title}
          >
            <h4 className="font-semibold text-gray-900 mb-3 truncate group-hover:text-purple-600 transition-colors duration-200">
              {task.title}
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed space-y-1">
              <span className="font-medium text-gray-700">Start:</span>{' '}
              <span>{formatDate(task.startAt)}</span>
              <br />
              <span className="font-medium text-gray-700">Due:</span>{' '}
              <span>{formatDate(task.dueDate)}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Modal to show full task info */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title="Task Details"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <h4 className="text-md font-semibold text-gray-700">Title</h4>
              <p className="text-gray-900">{selectedTask.title}</p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700">Description</h4>
              <p className="text-gray-900">{selectedTask.description || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700">Status</h4>
              <p className="text-gray-900">{selectedTask.status || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700">Start Date</h4>
              <p className="text-gray-900">{formatDate(selectedTask.startAt)}</p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700">Due Date</h4>
              <p className="text-gray-900">{formatDate(selectedTask.dueDate)}</p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-700">Completed Date</h4>
              <p className="text-gray-900">{formatDate(selectedTask.completedAt)}</p>
            </div>
            {/* Add other fields if needed */}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InProgressTasks;
