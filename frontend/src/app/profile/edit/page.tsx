'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import axios from 'axios';
import Sidebar from '../../../components/Sidebar';
import Modal from '../../../components/Modal';
import router from 'next/router';

interface Employee {
  id: number;
  name: string;
  email: string;
  jobTitle?: string;
  phone?: string;
  address?: string;
}

const ProfileEditPage: React.FC = () => {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    jobTitle: '',
    phone: '',
    address: '',
  });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');

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
        setFormData({
          name: response.data.name || '',
          jobTitle: response.data.jobTitle || '',
          phone: response.data.phone || '',
          address: response.data.address || '',
        });
      } catch (err) {
        setError('Failed to fetch profile data');
        setModalTitle('Error');
        setIsModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (error) {
      setModalTitle('Error');
      setIsModalOpen(true);
    } else if (success) {
      setModalTitle('Success');
      setIsModalOpen(true);
    }
  }, [error, success]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:3030/employee/dashboard/updateInfo', formData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      localStorage.setItem('userName', formData.name);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userName={employee?.name || 'User'} />
      <main className="flex-grow flex justify-center items-start p-8">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Edit Profile</h1>

          {loading && (
            <div className="flex justify-center mb-6">
              <svg
                className="animate-spin h-10 w-10 text-blue-600"
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

          {!loading && !error && employee && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={employee?.email || ''}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 bg-gray-100 cursor-not-allowed text-black"
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="jobTitle" className="block text-gray-700 font-semibold mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  id="jobTitle"
                  name="jobTitle"
                  value={formData.jobTitle}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 bg-gray-100 cursor-not-allowed text-black"
                  readOnly
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-gray-700 font-semibold mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-black"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-gray-700 font-semibold mb-2">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none text-black"
                  rows={4}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </form>

          )}

          <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
            <p className={modalTitle === 'Error' ? 'text-red-600' : 'text-green-700'}>{error || success}</p>
          </Modal>
        </div>
      </main>
    </div>
  );
};

export default ProfileEditPage;
