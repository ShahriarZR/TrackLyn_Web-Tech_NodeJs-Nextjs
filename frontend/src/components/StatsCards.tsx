'use client';

import React from 'react';
import { FaTasks, FaSpinner, FaClock, FaCheckCircle } from 'react-icons/fa';

interface StatsCardsProps {
  totalTasks: number;
  inProgress: number;
  pending: number;
  completed: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({ totalTasks, inProgress, pending, completed }) => {
  const cards = [
    {
      title: 'Total Task',
      count: totalTasks,
      icon: <FaTasks size={24} />,
      gradient: 'linear-gradient(89deg, rgba(131, 132, 248, 0.77) 26.63%, rgba(131, 132, 248, 0.42) 98.84%)',
    },
    {
      title: 'In Progress',
      count: inProgress,
      icon: <FaSpinner size={24} />,
      gradient: 'linear-gradient(88deg, rgba(150, 201, 209, 0.81) 65.21%, rgba(173, 220, 227, 0.58) 106%)',
    },
    {
      title: 'Pending',
      count: pending,
      icon: <FaClock size={24} />,
      gradient: 'linear-gradient(87deg, rgba(251, 149, 141, 0.58) 64.21%, rgba(248, 176, 169, 0.43) 94.13%)',
    },
    {
      title: 'Completed',
      count: completed,
      icon: <FaCheckCircle size={24} />,
      gradient: 'linear-gradient(87deg, rgba(135, 236, 175, 0.73) 75.53%, rgba(135, 236, 175, 0.41) 96.78%)',
    },
  ];

  return (
    <div
      className="flex flex-wrap gap-4 mt-4"
      style={{ maxWidth: '739px', marginLeft: '4px' }}
    >
      {cards.map(({ title, count, icon, gradient }) => (
        <div
          key={title}
          className="flex items-center p-5 rounded-[29px] shadow-md text-black flex-1 min-w-[160px] transition-transform transition-shadow duration-300 hover:scale-105 hover:shadow-xl"
          style={{
            background: gradient,
            color: '#000',
          }}
        >
          <div className="p-3 bg-white bg-opacity-30 rounded-full mr-4">
            {icon}
          </div>
          <div>
            <p className="text-[14px] font-poppins text-[#7E7E7E]">{title}</p>
            <p className="text-2xl font-bold font-poppins text-black">{count.toString().padStart(2, '0')}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
