'use client';

import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

interface Task {
  id: number;
  title: string;
  dueDate: string;
}

interface CalendarWidgetProps {
  token: string;
}

function CalendarWidget({ token }: CalendarWidgetProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [tasksForDate, setTasksForDate] = useState<Task[]>([]);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  const backendBaseUrl = 'http://localhost:3030';

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const res = await axios.get<Task[]>(`${backendBaseUrl}/employee/tasks/assignedTasks`, config);
        setTasks(res.data);
      } catch (error) {
        console.error('Failed to fetch tasks for calendar', error);
      }
    };
    fetchTasks();
  }, [token]);

  const formatDateToLocalISO = (date: Date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const tileContent = ({ date, view, children }: { date: Date; view: string; children?: React.ReactNode }) => {
    if (view === 'month') {
      const dateStr = formatDateToLocalISO(date);
      const hasTask = tasks.some((task) => task.dueDate.startsWith(dateStr));
      const tasksForThisDate = tasks.filter((task) => task.dueDate.startsWith(dateStr));
      const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
        if (tasksForThisDate.length > 0) {
          setSelectedDate(date);
          setTasksForDate(tasksForThisDate);
          const rect = (event.currentTarget as HTMLDivElement).getBoundingClientRect();
          setPopupPosition({ x: rect.left + window.scrollX, y: rect.bottom + window.scrollY });
        }
      };
      const handleMouseLeave = () => {
        setSelectedDate(null);
        setTasksForDate([]);
        setPopupPosition(null);
      };
      return (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{ cursor: hasTask ? 'pointer' : 'default', position: 'relative' }}
        >
          <div>{children}</div>
          {hasTask && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
              <div
                title={tasksForThisDate.map(task => task.title).join(', ')}
                style={{
                  height: '8px',
                  width: '8px',
                  backgroundColor: 'red',
                  borderRadius: '50%',
                }}
              />
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ marginTop: '20px', width: '350px', height: 'auto', flexShrink: 0, position: 'relative' }}>
      <div className="rounded-[18px] h-[auto] overflow-hidden flex items-center justify-center">
        <Calendar className="react-calendar w-full h-full" tileContent={tileContent} />
      </div>

      {selectedDate && popupPosition && (
        <div
          style={{
            position: 'absolute',
            top: popupPosition.y,
            left: popupPosition.x,
            marginTop: '8px',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            zIndex: 1000,
            width: '200px',
          }}
          onMouseEnter={() => setSelectedDate(selectedDate)}
          onMouseLeave={() => {
            setSelectedDate(null);
            setTasksForDate([]);
            setPopupPosition(null);
          }}
        >
          <h3 className="font-semibold mb-2 text-sm">Tasks on {selectedDate.toDateString()}</h3>
          {tasksForDate.length > 0 ? (
            <ul className="list-disc list-inside text-sm">
              {tasksForDate.map((task) => (
                <li key={task.id}>{task.title}</li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">No tasks due on this day.</p>
          )}
        </div>
      )}
    </div>
  );

}

export default CalendarWidget;
