'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/Sidebar';
import { useRouter } from 'next/navigation';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
  attachments?: string[];
}

interface Employee {
  id: number;
  name: string;
  email: string;
  jobTitle?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

const DueTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [uploadingTaskId, setUploadingTaskId] = useState<number | null>(null);
  const [updatingStatusTaskId, setUpdatingStatusTaskId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const router = useRouter();


  const [userName, setUserName] = useState<string>('User');
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);

  const fetchDueTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }
      const response = await axios.get<Task[]>('http://localhost:3030/employee/tasks/overdueTasks', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const sorted = response.data.sort((a, b) => a.id - b.id);
      setTasks(sorted);
      setFilteredTasks(sorted);
    } catch (err) {
      setError('Failed to fetch due tasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }
      const response = await axios.get<Employee>('http://localhost:3030/employee/dashboard/accInfo', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setUserName(response.data.name);
      if (response.data.avatarUrl) {
        setUserAvatarUrl(response.data.avatarUrl);
      }
    } catch (err) {
      // Fail silently or handle error if needed
    }
  };

  useEffect(() => {
    fetchDueTasks();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredTasks(tasks);
    } else {
      const lowerSearch = searchTerm.toLowerCase();
      setFilteredTasks(
        tasks.filter(
          (task) =>
            task.title.toLowerCase().includes(lowerSearch) ||
            (task.description?.toLowerCase().includes(lowerSearch) ?? false)
        )
      );
    }
  }, [searchTerm, tasks]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateTaskStatus = async (taskId: number, newStatus: 'in_progress' | 'completed') => {
    try {
      setUpdatingStatusTaskId(taskId);
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3030/employee/tasks/updateStatus/${taskId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      await fetchDueTasks();
    } catch (err) {
      alert('Failed to update task status');
    } finally {
      setUpdatingStatusTaskId(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, taskId: number) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }
    formData.append('taskId', taskId.toString());

    try {
      setUploadingTaskId(taskId);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      await axios.post('http://localhost:3030/employee/tasks/uploadAttachments', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      await fetchDueTasks();
    } catch (err) {
      alert('File upload failed');
    } finally {
      setUploadingTaskId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F6F4FB]">
      {/* Sidebar */}
      <div className="w-[260px] h-screen fixed z-10">
        <Sidebar userName={userName} userAvatarUrl={userAvatarUrl} />
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-grow ml-[260px] max-h-screen overflow-y-auto">
        {/* Topbar */}
        <div className={`sticky top-0 z-30 bg-white/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between px-6 gap-4 transition-shadow duration-500 border-b border-gray-200 ${scrolled ? 'py-3 shadow-lg' : 'py-6 shadow-sm'
          } rounded-b-md`}
        >
          {/* Left side: title and date */}
          <div>
            <h1
              className={`text-gray-900 font-poppins transition-all duration-300 ${scrolled ? 'text-xl font-semibold' : 'text-3xl font-extrabold'
                }`}
            >
              Overdue Tasks
            </h1>
            <p className="text-sm text-gray-500 mt-1 tracking-wide">
              {new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Right side: search + logout */}
          <div className="flex items-center gap-4 mt-4 md:mt-0 w-full md:w-auto">
            {/* Search Field */}
            <div className="relative w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-indigo-700 placeholder-indigo-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                localStorage.removeItem('token');
                router.push('/');
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg text-sm font-semibold shadow-md transition-transform active:scale-95"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>



        {/* Main Content */}
        <main className="p-6">
          {loading && <p className="text-blue-500">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <>
              {filteredTasks.length === 0 ? (
                <p className="text-gray-500">No overdue tasks found.</p>
              ) : (
                <div className="w-full max-w-7xl">
                  <div className="overflow-auto h-[575px] rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-[#6C63FF] to-[#4A42E6] sticky top-0 z-10">
                        <tr>
                          {[
                            'S/N',
                            'Title',
                            'Description',
                            'Status',
                            'Due Date',
                            'Attachments',
                            'Action',
                          ].map((heading, idx) => (
                            <th
                              key={idx}
                              className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider"
                            >
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTasks.map((task, index) => (
                          <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{task.description || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap capitalize text-sm text-gray-700">{task.status}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 space-y-1">
                              {task.status === 'pending' && (
                                <p className="text-yellow-600 italic">Start the task to upload files.</p>
                              )}
                              {(task.status === 'in_progress' || task.status === 'completed') &&
                                (task.attachments ?? []).length > 0 ? (
                                <ul className="list-disc pl-4">
                                  {(task.attachments ?? []).map((file, idx) => (
                                    <li key={idx}>
                                      <a
                                        href={`http://localhost:3030/uploads/${file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                      >
                                        {file}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              ) : null}
                              {task.status === 'in_progress' && (
                                <>
                                  <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleFileUpload(e, task.id)}
                                    className="block text-sm mt-1"
                                  />
                                  {uploadingTaskId === task.id && <p className="text-blue-500">Uploading...</p>}
                                </>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {task.status === 'pending' && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                                  disabled={updatingStatusTaskId === task.id}
                                >
                                  {updatingStatusTaskId === task.id ? 'Updating...' : 'Start'}
                                </button>
                              )}
                              {task.status === 'in_progress' && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'completed')}
                                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                  disabled={updatingStatusTaskId === task.id}
                                >
                                  {updatingStatusTaskId === task.id ? 'Updating...' : 'Complete'}
                                </button>
                              )}
                              {task.status === 'completed' && (
                                <span className="text-green-700 font-semibold">Done</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default DueTasksPage;
