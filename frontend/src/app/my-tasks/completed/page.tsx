'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/Sidebar';
import { useRouter } from 'next/navigation';


interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'completed';
  startAt?: string;
  completedAt?: string;
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

const CompletedTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const router = useRouter();


  const [userName, setUserName] = useState<string>('User');
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);

  const fetchCompletedTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }
      const response = await axios.get<Task[]>(
        'http://localhost:3030/employee/tasks/completedTasks',
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const sorted = response.data.sort((a, b) => a.id - b.id);
      setTasks(sorted);
      setFilteredTasks(sorted);
    } catch (err) {
      setError('Failed to fetch completed tasks');
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
    fetchCompletedTasks();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    filterAndSearchTasks();
  }, [searchTerm, tasks]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filterAndSearchTasks = () => {
    let updatedTasks = [...tasks];
    if (searchTerm.trim() !== '') {
      const lowerSearch = searchTerm.toLowerCase();
      updatedTasks = updatedTasks.filter(task =>
        task.title.toLowerCase().includes(lowerSearch) ||
        (task.description?.toLowerCase().includes(lowerSearch) ?? false)
      );
    }
    setFilteredTasks(updatedTasks);
  };

  const handleDownload = async (fileName: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      // Fetch the file as a blob from the new backend download endpoint
      const response = await axios.get<Blob>(
        `http://localhost:3030/employee/tasks/download/${fileName}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
          withCredentials: true,
        }
      );

      // Create a blob URL for the file
      const url = window.URL.createObjectURL(response.data);

      // Create a temporary anchor element to trigger the download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download file');
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
              Completed Tasks
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

        <main className="p-6">
          {loading && <p className="text-blue-500">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}

          {!loading && !error && (
            <>
              {filteredTasks.length === 0 ? (
                <p className="text-gray-500">No completed tasks found.</p>
              ) : (
                <div className="w-full max-w-7xl">
                  <div className="overflow-auto h-[575px] rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-[#6C63FF] to-[#4A42E6] sticky top-0 z-10">
                        <tr>
                          {[ 
                            'S/N', 'Title', 'Description', 'Status',
                            'Start Date', 'Completed', 'Due Date', 'Attachments'
                          ].map((heading, idx) => (
                            <th key={idx} className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                              {heading}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTasks.map((task, index) => (
                          <tr key={task.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 max-w-xs">{task.description || '-'}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                {task.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.startAt ? new Date(task.startAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.completedAt ? new Date(task.completedAt).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {task.attachments && task.attachments.length > 0 ? (
                                <ul className="space-y-2">
                                  {task.attachments.map((file, idx) => (
                                    <li key={idx} className="flex items-center justify-between">
                                      <span className="truncate max-w-xs">{file}</span>
                                      <button
                                        onClick={() => handleDownload(file)}
                                        className="ml-4 flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs font-medium shadow-sm transition-all duration-200 transform hover:scale-105 cursor-pointer"
                                      >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                          />
                                        </svg>
                                        Download
                                      </button>

                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <span className="italic text-gray-400">No attachments</span>
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

export default CompletedTasksPage;
