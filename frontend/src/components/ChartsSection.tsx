'use client';

import React, { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

interface ChartsSectionProps {
  totalTasks: number;
  inProgress: number;
  pending: number;
  monthlyData: { month: string; tasks: number }[];
  weeklyData: { week: string; tasks: number }[];
  sixMonthData: { month: string; tasks: number }[];
}

const COLORS = ['#6366F1', '#10B981', '#F59E0B']; // Purple, Green, Amber

const ChartsSection: React.FC<ChartsSectionProps> = ({
  totalTasks,
  inProgress,
  pending,
  monthlyData,
  weeklyData,
  sixMonthData,
}) => {
  const [view, setView] = useState<'Weekly' | 'Monthly' | '6 Month'>('6 Month');

  const dataMap = {
    Weekly: weeklyData,
    Monthly: monthlyData,
    '6 Month': sixMonthData,
  };

  const pieData = [
    { name: 'Total Task', value: totalTasks, color: COLORS[0] },
    { name: 'In Progress', value: inProgress, color: COLORS[1] },
    { name: 'Pending', value: pending, color: COLORS[2] },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-6">
      {/* Line Chart Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg flex-1 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-xl text-gray-800">Total Work Overview</h3>
          <div className="flex space-x-2">
            {['Weekly', 'Monthly', '6 Month'].map((option) => (
              <button
                key={option}
                onClick={() => setView(option as 'Weekly' | 'Monthly' | '6 Month')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${
                  view === option
                    ? 'bg-purple-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={dataMap[view]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={view === 'Weekly' ? 'week' : 'month'} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="tasks" stroke="#6366F1" strokeWidth={2} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart Card */}
      <div className="bg-white rounded-2xl p-6 shadow-lg flex-1 border border-gray-200">
        <h3 className="font-semibold text-xl text-gray-800 mb-4">Task Distribution</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={40}
              label
              paddingAngle={5}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend verticalAlign="bottom" height={36} />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartsSection;
