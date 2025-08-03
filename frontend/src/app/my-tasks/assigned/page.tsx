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

const AssignedTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [uploadingTaskId, setUploadingTaskId] = useState<number | null>(null);
  const [updatingStatusTaskId, setUpdatingStatusTaskId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const router = useRouter();


  const [userName, setUserName] = useState<string>('User');
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);

  const fetchAssignedTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');

        return;
      }
      const response = await axios.get<Task[]>('http://localhost:3030/employee/tasks/assignedTasks', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      const sorted = response.data.sort((a, b) => a.id - b.id);
      setTasks(sorted);
      setFilteredTasks(sorted);
    } catch (err) {
      setError('Failed to fetch assigned tasks');
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
    fetchAssignedTasks();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    filterAndSearchTasks();
  }, [searchTerm, statusFilter, tasks]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filterAndSearchTasks = () => {
    let updatedTasks = [...tasks];

    if (statusFilter !== 'all') {
      updatedTasks = updatedTasks.filter(task => task.status === statusFilter);
    }

    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      updatedTasks = updatedTasks.filter(task =>
        task.title.toLowerCase().includes(lowerSearch) ||
        (task.description?.toLowerCase().includes(lowerSearch) ?? false)
      );
    }

    setFilteredTasks(updatedTasks);
  };

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
      await fetchAssignedTasks();
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

      await fetchAssignedTasks();
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
        {/* Topbar: Same layout as Dashboard */}
        <div
          className={`sticky top-0 z-30 bg-white/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between px-6 gap-4 transition-shadow duration-500 border-b border-gray-200 ${scrolled ? 'py-3 shadow-lg' : 'py-6 shadow-sm'
            } rounded-b-md`}
        >
          {/* Title + Date */}
          <div>
            <h1
              className={`text-gray-900 font-poppins transition-all duration-300 ${scrolled ? 'text-xl font-semibold' : 'text-3xl font-extrabold'
                }`}
            >
              Assigned Tasks
            </h1>
            <p className="text-sm text-gray-500 mt-1 tracking-wide">
              {new Date().toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>

          {/* Controls Group (Search, Filter, Logout) */}
          <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
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

            {/* Filter Field */}
            <div className="relative w-full md:w-48">
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
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <select
                className="appearance-none block w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-indigo-700"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <svg
                  className="h-5 w-5 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
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




        <main className="p-6">

          {loading && <p className="text-blue-500">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <>
              {filteredTasks.length === 0 ? (
                <p className="text-gray-500">No tasks match your criteria.</p>
              ) : (
                <div className="w-full max-w-7xl">
                  <div className="overflow-auto h-[575px] rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-[#6C63FF] to-[#4A42E6] sticky top-0 z-10">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                            S/N
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                            Due Date
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                            Attachments
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTasks.map((task, index) => (
                          <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {task.title}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">
                              {task.description || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${task.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-green-100 text-green-800'}`}>
                                {task.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500 space-y-1">
                              {task.status === 'pending' && (
                                <p className="text-yellow-600 italic">Start the task to upload files.</p>
                              )}

                              {(task.status === 'in_progress' || task.status === 'completed') &&
                                Array.isArray(task.attachments) &&
                                task.attachments.length > 0 && (
                                  <ul className="list-disc pl-4 mb-2 space-y-1">
                                    {task.attachments.map((file, idx) => (
                                      <li key={idx}>
                                        <a
                                          href={`http://localhost:3030/uploads/${file}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                                        >
                                          {file}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                )}

                              {task.status === 'in_progress' && (
                                <>
                                  <input
                                    type="file"
                                    multiple
                                    onChange={(e) => handleFileUpload(e, task.id)}
                                    className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                  />
                                  {uploadingTaskId === task.id && (
                                    <p className="text-blue-500 text-xs mt-1">Uploading...</p>
                                  )}
                                </>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {task.status === 'pending' && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'in_progress')}
                                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                                  disabled={updatingStatusTaskId === task.id}
                                >
                                  {updatingStatusTaskId === task.id ? 'Starting...' : 'Start Task'}
                                </button>
                              )}
                              {task.status === 'in_progress' && (
                                <button
                                  onClick={() => updateTaskStatus(task.id, 'completed')}
                                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                                  disabled={updatingStatusTaskId === task.id}
                                >
                                  {updatingStatusTaskId === task.id ? 'Completing...' : 'Complete'}
                                </button>
                              )}
                              {task.status === 'completed' && (
                                <span className="text-green-700 font-semibold flex items-center">
                                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  Completed
                                </span>
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

export default AssignedTasksPage;
