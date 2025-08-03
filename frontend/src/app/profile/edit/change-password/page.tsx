'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../../../components/Sidebar';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import router from 'next/router';

const ChangePasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('User');

  useEffect(() => {
    const email = localStorage.getItem('userEmail');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Password and confirm password do not match');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await axios.post(
        'http://localhost:3030/employee/dashboard/change-password',
        { password, confirmPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setSuccess(typeof response.data === 'string' ? response.data : 'Password changed successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (typeof errorData === 'object' && errorData !== null) {
          setError(errorData.message || JSON.stringify(errorData));
        } else {
          setError(typeof errorData === 'string' ? errorData : 'Failed to change password');
        }
      } else {
        setError('Failed to change password');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={userEmail} />
      <main className="flex-grow flex justify-center items-start p-8">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Change Password</h1>

          {error && <p className="mb-4 text-red-600 font-medium">{error}</p>}
          {success && <p className="mb-4 text-green-600 font-medium">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                New Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition"
                required
              />
              <div
                className="absolute inset-y-0 right-3 top-[38px] flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-md px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black transition"
                required
              />
              <div
                className="absolute inset-y-0 right-3 top-[38px] flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
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
                  Changing...
                </span>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChangePasswordPage;
