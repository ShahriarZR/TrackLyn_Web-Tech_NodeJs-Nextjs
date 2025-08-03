'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Index() {
  const [currentFAQ, setCurrentFAQ] = useState(0);
  const [showFAQAnswer, setShowFAQAnswer] = useState(false);
  const router = useRouter();

  const faqs = [
    {
      question: 'Is Tracklyn suitable for both individuals and teams?',
      answer:
        'Absolutely! Tracklyn is designed to be flexible. Whether you\'re a solo professional managing personal projects or part of a team coordinating tasks across departments, Tracklyn adapts to your workflow with collaborative features, role-based access, and intuitive task management tools.',
    },
  ];

  const features = [
    {
      title: 'Task Creation & Management',
      description: 'Effortlessly create and manage tasks.',
      bg: 'bg-tracklyn-mint',
    },
    {
      title: 'Priority & Deadlines',
      description: 'Set priorities and deadlines for your tasks.',
      bg: 'bg-tracklyn-teal',
    },
    {
      title: 'Subtasks & Collaboration',
      description: 'Work together with your team on tasks.',
      bg: 'bg-tracklyn-dark-teal',
    },
    {
      title: 'Calendar View',
      description: 'Visualize your tasks in a calendar format.',
      bg: 'bg-tracklyn-cyan',
    },
    {
      title: 'Role-Based Access',
      description: 'Control access based on user roles.',
      bg: 'bg-tracklyn-teal-light',
    },
    {
      title: 'Notifications',
      description: 'Stay updated with real-time notifications.',
      bg: 'bg-tracklyn-dark-blue',
    },
  ];

  const whyFeatures = [
    {
      title: 'Real-time collaboration',
      description: 'Instantly collaborate with your team and see updates as they happen.',
      bg: 'bg-tracklyn-primary',
    },
    {
      title: 'Cross-device sync',
      description: 'Access your tasks seamlessly from desktop, tablet, or mobile—anytime, anywhere.',
      bg: 'bg-tracklyn-primary',
    },
    {
      title: 'Minimal Learning Curve',
      description: 'Get started in minutes with an intuitive, user-friendly interface.',
      bg: 'bg-tracklyn-primary',
    },
    {
      title: 'High Security & Data Protection',
      description: 'Your data stays safe with end-to-end encryption and secure access control.',
      bg: 'bg-tracklyn-primary',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-inter text-black">
      {/* Header */}
      <header className="h-16 shadow-md bg-white fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <h1 className="text-2xl font-bold text-tracklyn-dark-green tracking-wide">TRACKLYN</h1>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="hover:text-tracklyn-dark-green transition">Home</a>
            <a href="#" className="hover:text-tracklyn-dark-green transition">Contact Us</a>
            <button
              onClick={() => router.push('/')}
              className="bg-white text-black hover:bg-black hover:text-white border border-black px-5 py-2 rounded-lg shadow transition-all"
            >
              Sign in / Sign up
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-20 bg-gradient-to-br from-tracklyn-blue via-tracklyn-light-blue to-white px-6 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-wide mb-6">"Organize Smarter. Work Better. Live Freely."</h2>
          <p className="text-lg md:text-xl text-black/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the next generation of task management with real-time collaboration,
            smart reminders, and seamless organization—across all your devices.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-tracklyn-primary text-black px-6 py-2 rounded-xl shadow hover:shadow-lg transition">Start Managing Tasks</button>
            <button className="bg-tracklyn-light-blue text-black px-6 py-2 rounded-xl shadow hover:shadow-lg transition">Explore Features</button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 tracking-wide">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`rounded-2xl p-6 ${feature.bg} shadow-md hover:shadow-xl transition`}>
                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-black/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Tracklyn */}
      <section className="px-6 py-16 bg-tracklyn-blue-light">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Why Tracklyn?</h2>
          <p className="text-lg text-black/80 max-w-3xl mx-auto leading-relaxed mb-12">
            Tracklyn simplifies task management with intuitive tools, real-time collaboration,
            and flexible access—empowering individuals and teams to stay focused, aligned, and ahead of schedule.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyFeatures.map((feature, index) => (
              <div key={index} className={`rounded-2xl p-6 ${feature.bg} shadow-md hover:shadow-xl transition`}>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-black/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="border rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => setShowFAQAnswer(!showFAQAnswer)}
              className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium bg-gray-50 hover:bg-gray-100 transition"
            >
              {faqs[currentFAQ].question}
              {showFAQAnswer ? <ChevronUp /> : <ChevronDown />}
            </button>
            {showFAQAnswer && (
              <div className="px-6 py-4 text-gray-700 transition-opacity duration-300">
                {faqs[currentFAQ].answer}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-16 bg-tracklyn-teal text-center text-black">
        <h2 className="text-3xl font-bold mb-6 max-w-3xl mx-auto">
          Discover how you can effortlessly plan, track, and collaborate on tasks with Tracklyn.
        </h2>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button className="bg-white text-black px-6 py-2 rounded-xl shadow hover:shadow-lg transition">Sign up now</button>
          <button className="bg-white text-black px-6 py-2 rounded-xl shadow hover:shadow-lg transition">Try a demo</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-tracklyn-blue text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl font-semibold mb-2">Tracklyn</h3>
            <p className="text-sm">Smarter task management for teams and individuals.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm">
              <li><a href="#" className="hover:text-tracklyn-mint">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-tracklyn-mint">Terms</a></li>
              <li><a href="#" className="hover:text-tracklyn-mint">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-4">
              {/* Icons here */}
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <div className="w-8 h-8 bg-white rounded-full"></div>
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
        <p className="text-center text-sm mt-6">@2025 Tracklyn. All rights reserved.</p>
      </footer>

      {/* Scroll To Top */}
      <div className="fixed bottom-5 right-5">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-md hover:bg-white hover:shadow-lg transition"
        >
          <ArrowUp className="w-5 h-5 text-black" />
        </button>
      </div>
    </div>
  );
}
