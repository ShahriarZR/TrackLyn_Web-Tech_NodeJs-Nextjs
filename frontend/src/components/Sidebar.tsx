'use client';

import React, { useState } from 'react';
import {
  FaTasks,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  userName: string;
  userAvatarUrl?: string;
}

interface MenuItem {
  title: string;
  icon?: React.ReactNode;
  link?: string;
  alert?: boolean;
  subItems?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: <MdDashboard size={20} />,
    link: '/dashboard',
  },
  {
    title: 'My Tasks',
    icon: <FaTasks size={20} />,
    subItems: [
      { title: 'Assigned To Me', icon: <FaClipboardList size={16} />, link: '/my-tasks/assigned' },
      { title: 'Overdue Tasks', icon: <FaClock size={16} />, link: '/my-tasks/due', alert: true },
      { title: 'Completed Tasks', icon: <FaCheckCircle size={16} />, link: '/my-tasks/completed' },
    ],
  },
  {
    title: 'Profile',
    icon: <FaUserCircle size={20} />,
    subItems: [
      { title: 'View Profile', link: '/profile/view' },
      { title: 'Edit Profile', link: '/profile/edit' },
      { title: 'Change Password', link: '/profile/edit/change-password' },
    ],
  },
];

const Sidebar: React.FC<SidebarProps> = ({ userName, userAvatarUrl }) => {
  const [expandedMenu, setExpandedMenu] = useState<string>('');

  const toggleMenu = (title: string) => {
    setExpandedMenu(expandedMenu === title ? '' : title);
  };

  return (
    <aside className="w-64 h-screen bg-white/90 backdrop-blur-md shadow-md border-r border-gray-200 p-4 flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-8">
        {userAvatarUrl ? (
          <img src={userAvatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full object-cover shadow" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {userName.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="font-semibold text-lg text-gray-800 truncate">{userName}</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 flex-grow">
        {menuItems.map((item) => (
          <div key={item.title} onMouseEnter={() => toggleMenu(item.title)} onMouseLeave={() => toggleMenu('')}>
            {item.subItems ? (
              <>
                <div
                  className="cursor-pointer flex items-center justify-between px-3 py-2 rounded-lg hover:bg-indigo-50 group transition-all duration-200"
                >
                  <div className="flex items-center space-x-3 text-gray-700 group-hover:text-indigo-600 font-medium">
                    <span className="text-indigo-500">{item.icon}</span>
                    <span>{item.title}</span>
                  </div>
                  {expandedMenu === item.title ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                <AnimatePresence>
                  {expandedMenu === item.title && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-6 py-1 flex flex-col space-y-1"
                    >
                      {item.subItems.map((sub) => (
                        <a
                          key={sub.title}
                          href={sub.link}
                          className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm transition-colors duration-200 ${
                            sub.alert
                              ? 'text-red-600 font-semibold'
                              : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                          }`}
                        >
                          {sub.icon && <span className="text-indigo-400">{sub.icon}</span>}
                          <span>{sub.title}</span>
                        </a>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <a
                href={item.link}
                className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-200 font-medium"
              >
                <span className="text-indigo-500">{item.icon}</span>
                <span>{item.title}</span>
              </a>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
