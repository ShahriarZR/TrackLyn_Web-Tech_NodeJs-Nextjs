'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/Sidebar';
import router from 'next/router';

interface Employee {
  id: number;
  name: string;
  email: string;
  jobTitle?: string;
  phone?: string;
  address?: string;
}

const ProfileViewPage: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
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
        setEmployee(response.data);
      } catch (err) {
        setError('Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      setDeleteLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }
      await axios.delete('http://localhost:3030/employee/dashboard/deleteAcc', {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      alert('Your account has been deleted successfully.');
      localStorage.removeItem('token');
      router.push('/');
    } catch (err) {
      alert('Failed to delete account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={employee?.name || 'User'} />
      <main className="flex-grow flex justify-center items-center p-8">
        <div className="w-full max-w-xl bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Profile Overview</h1>

          {loading && (
            <div className="flex justify-center mb-6">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
            </div>
          )}

          {error && (
            <p className="text-red-600 font-medium bg-red-100 p-3 rounded mb-6 text-center">
              {error}
            </p>
          )}

          {!loading && !error && employee && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">Name</span>
                <span className="text-gray-900">{employee.name}</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">Email</span>
                <span className="text-gray-900">{employee.email}</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">Job Title</span>
                <span className="text-gray-900">{employee.jobTitle || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">Phone</span>
                <span className="text-gray-900">{employee.phone || 'N/A'}</span>
              </div>

              <div className="flex justify-between items-start border-b pb-2">
                <span className="font-semibold text-gray-700">Address</span>
                <span className="text-gray-900 text-right max-w-xs break-words">
                  {employee.address || 'N/A'}
                </span>
              </div>

              <div className="pt-6 text-center">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded shadow transition duration-300"
                >
                  {deleteLoading ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfileViewPage;
