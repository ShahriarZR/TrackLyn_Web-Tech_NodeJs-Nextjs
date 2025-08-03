'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';

const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email') || '';
    setEmail(emailParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('http://localhost:3030/employee/verify-email', {
        email,
        otp,
      });
      setSuccess('Email verified successfully!');
      setEmail('');
      setOtp('');
      router.push('/');
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <section className="bg-white">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="" className="flex items-center mb-6 text-2xl font-semibold text-black">
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Tracklyn
        </a>
        <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-4">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
              Verify your email
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-white border border-gray-300 text-black rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="otp" className="block mb-2 text-sm font-medium text-black">
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  id="otp"
                  className="bg-white border border-gray-300 text-black rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                  placeholder="Enter OTP"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              {(error || success) && (
                <p className={`text-sm font-light mt-2 ${success ? 'text-green-600' : 'text-red-600'}`}>
                  {error || success}
                </p>
              )}
              <button
                type="submit"
                className="w-full text-black bg-white hover:bg-black hover:text-white focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyEmail;
