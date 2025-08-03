'use client';

import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  pageTitle: string;
}

const Topbar: React.FC<TopbarProps> = ({ pageTitle }) => {
  const [currentDate, setCurrentDate] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    setCurrentDate(now.toLocaleDateString(undefined, options));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1 border border-gray-300 rounded-md px-3 py-1 text-gray-600">
          <FaCalendarAlt />
          <span>{currentDate}</span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">{pageTitle}</h1>

        <button
          onClick={handleLogout}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition"
        >
          <FaSignOutAlt className="mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
