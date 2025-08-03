'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface WorkingStatusProps {
  completionPercentage: number; // 0 to 100
}

const COLORS = ['#10B981', '#E5E7EB']; // Green for completed, Gray for remaining

const WorkingStatus: React.FC<WorkingStatusProps> = ({ completionPercentage }) => {
  const data = [
    { name: 'Completed', value: completionPercentage },
    { name: 'Remaining', value: 100 - completionPercentage },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg w-72 h-72 flex flex-col items-center justify-center border border-gray-200">
      <h3 className="font-semibold text-xl text-gray-800 mb-4">Working Status</h3>
      <ResponsiveContainer width={160} height={160}>
        <PieChart>
          <Pie
            data={data}
            innerRadius={60}
            outerRadius={80}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            stroke="none"
            isAnimationActive
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <p className="text-3xl font-bold mt-4 text-gray-900">{completionPercentage}%</p>
      <p className="text-gray-500 text-sm">Task Completed</p>
    </div>
  );
};

export default WorkingStatus;
