'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

import Sidebar from '@/components/Sidebar';
import WelcomeBanner from '@/components/WelcomeBanner';
import StatsCards from '@/components/StatsCards';
import CalendarWidget from '@/components/CalendarWidget';
import ChartsSection from '@/components/ChartsSection';
import InProgressTasks from '@/components/InProgressTasks';
import WorkingStatus from '@/components/WorkingStatus';
import Modal from '@/components/Modal';

interface Task {
  id: number;
  title: string;
  status: string;
  dueDate: string;
  progress?: number;
  startAt?: string | null;
  completedAt?: string | null;
}

interface JwtPayload {
  employee_id?: number;
  id?: number | string;
  user_id?: number | string;
  sub?: number | string;
}

const DashboardPage: React.FC = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Employee Name');
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>(undefined);

  const [totalTasks, setTotalTasks] = useState<number>(0);
  const [inProgress, setInProgress] = useState<number>(0);
  const [pending, setPending] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);

  const [monthlyData, setMonthlyData] = useState<{ month: string; tasks: number }[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ week: string; tasks: number }[]>([]);
  const [sixMonthData, setSixMonthData] = useState<{ month: string; tasks: number }[]>([]);

  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
const [modalMessage, setModalMessage] = useState('');

  const backendBaseUrl = 'http://localhost:3030';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }
    
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) setUserName(storedUserName);

    let decoded: JwtPayload;
    try {
      decoded = jwtDecode<JwtPayload>(token);
    } catch {
      router.push('/');
      return;
    }

    const employeeId = decoded.employee_id || decoded.id || decoded.user_id || decoded.sub;
    if (!employeeId) {
      router.push('/');
      return;
    }

    const fetchUserInfo = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const res = await axios.get(`${backendBaseUrl}/employee/${employeeId}`, config);
        const data = res.data as { name?: string; avatarUrl?: string };
        if (!storedUserName) setUserName(data.name || 'Employee Name');
        setUserAvatarUrl(data.avatarUrl);
      } catch { }
    };

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [totalRes, inProgressRes, pendingRes, completedRes, monthlyRes, weeklyRes, sixMonthRes, inProgressTasksRes] = await Promise.all([
          axios.get(`${backendBaseUrl}/employee/tasks/assignedTasks`, config),
          axios.get(`${backendBaseUrl}/employee/tasks/inProgressTasks`, config),
          axios.get(`${backendBaseUrl}/employee/tasks/pendingTasks`, config),
          axios.get(`${backendBaseUrl}/employee/tasks/completedTasks`, config),
          axios.get(`${backendBaseUrl}/employee/tasks/monthlyTaskCount`, config),
          axios.get(`${backendBaseUrl}/employee/tasks/weeklyTaskCount`, config),
          axios.get(`${backendBaseUrl}/employee/tasks/sixMonthTaskCount`, config),
          axios.get(`${backendBaseUrl}/employee/tasks/taskDates`, config),
        ]);

        setTotalTasks((totalRes.data as Task[]).length);
        setInProgress((inProgressRes.data as Task[]).length);
        setPending((pendingRes.data as Task[]).length);
        setCompleted((completedRes.data as Task[]).length);
        setMonthlyData(monthlyRes.data as { month: string; tasks: number }[]);
        setWeeklyData(weeklyRes.data as { week: string; tasks: number }[]);
        setSixMonthData(sixMonthRes.data as { month: string; tasks: number }[]);
        setInProgressTasks(inProgressTasksRes.data as Task[]);
        setLoading(false);
      } catch (err: any) {
        setModalMessage(err.response?.data?.message || 'Failed to fetch dashboard data');
    setModalOpen(true);
    setLoading(false);
      }
    };

    fetchUserInfo();
    fetchDashboardData();
  }, [router]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="flex min-h-screen bg-[#F6F4FB]">
      <div className="w-[260px] h-screen fixed z-10">
        <Sidebar userName={userName} userAvatarUrl={userAvatarUrl} />
      </div>
      <div className="flex flex-col flex-grow ml-[260px] max-h-screen overflow-y-auto">
        <div className={`sticky top-0 z-30 bg-white/90 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between px-6 gap-4 transition-shadow duration-500 border-b border-gray-200 ${scrolled ? 'py-3 shadow-lg' : 'py-6 shadow-sm'
          } rounded-b-md`}
        >
          {/* Left side: title and date */}
          <div>
            <h1
              className={`text-gray-900 font-poppins transition-all duration-300 ${scrolled ? 'text-xl font-semibold' : 'text-3xl font-extrabold'
                }`}
            >
              Dashboard
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


        <main className="p-6 space-y-6">
          <div className="flex flex-col xl:flex-row xl:items-start gap-6">
            <div className="flex flex-col space-y-6">
              <WelcomeBanner userName={userName} />
              <StatsCards
                totalTasks={totalTasks}
                inProgress={inProgress}
                pending={pending}
                completed={completed}
              />
            </div>
            <CalendarWidget token={localStorage.getItem('token') || ''} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 h-full">
              <ChartsSection
                totalTasks={totalTasks}
                inProgress={inProgress}
                pending={pending}
                monthlyData={monthlyData}
                weeklyData={weeklyData}
                sixMonthData={sixMonthData}
              />
            </div>
            <div className="h-full flex flex-col justify-center">
              <WorkingStatus
                completionPercentage={totalTasks === 0 ? 0 : Math.round((completed / totalTasks) * 100)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <InProgressTasks tasks={inProgressTasks.slice(0, 5).map(task => ({
                ...task,
                progress: task.progress ?? 0,
                startAt: task.startAt ?? null,
                completedAt: task.completedAt ?? null
              }))} />
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
