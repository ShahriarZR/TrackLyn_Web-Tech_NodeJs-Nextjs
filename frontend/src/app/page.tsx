'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import Modal from '@/components/Modal'; // Adjust path as needed

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [responseMsg, setResponseMsg] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>('');
  const [modalSuccess, setModalSuccess] = useState<boolean>(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      interface LoginResponse {
        access_token: string;
        message: string;
        error: string;
      }

      const response = await axios.post<LoginResponse>('http://localhost:3030/employee/login', {
        email,
        password,
      });

      const { access_token, message, error } = response.data;

      if (error) {
        setModalContent(error);
        setModalSuccess(false);
        setModalOpen(true);
      } else {
        localStorage.setItem('token', access_token);
        decodeAndStoreName(access_token);

        setModalContent(message);
        setModalSuccess(true);
        setModalOpen(true);

        // ✅ Only auto-close modal and navigate if login was successful
        setTimeout(() => {
          setModalOpen(false);
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Login failed';
      setModalContent(errorMsg);
      setModalSuccess(false);
      setModalOpen(true);
    }
  };

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      interface GoogleLoginResponse {
        access_token: string;
      }

      const response = await axios.post<GoogleLoginResponse>('http://localhost:3030/employee/google-login', {
        token: credentialResponse.credential,
      });

      const { access_token } = response.data;
      localStorage.setItem('token', access_token);
      decodeAndStoreName(access_token);

      setModalContent('Google Sign-In successful! Loading...');
      setModalSuccess(true);
      setModalOpen(true);

      setTimeout(() => {
        setModalOpen(false);
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      setModalContent(error.response?.data?.error || 'Google Sign-In failed');
      setModalSuccess(false);
      setModalOpen(true);
    }
  };

  const decodeAndStoreName = (access_token: string) => {
    try {
      const base64Url = access_token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const payload = JSON.parse(jsonPayload);
      if (payload.name) {
        localStorage.setItem('userName', payload.name);
      }
    } catch (e) {
      // Ignore decoding error
    }
  };

  return (
    <section className="bg-white">
      {/* Modal for response messages */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={modalSuccess ? 'Success' : 'Error'}>
        <div className="flex items-center justify-center">
          <span className={`text-base font-semibold ${modalSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {modalContent}
          </span>
          {modalSuccess && (
            <svg className="w-5 h-5 ml-2 animate-spin text-black" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          )}
        </div>
      </Modal>

      {/* Login Form */}
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-black">
          <img
            className="w-8 h-8 mr-2"
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
          />
          Tracklyn
        </a>
        <div className="w-full bg-white rounded-lg shadow-md md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl">
              Sign in to your account
            </h1>

            <form className="space-y-4 md:space-y-6" onSubmit={handleLogin}>
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-black">
                  Your email
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
              <div className="relative">
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">
                  Password
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-white border border-gray-300 text-black rounded-lg focus:ring-black focus:border-black block w-full p-2.5 pr-10"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  className="absolute inset-y-0 right-3 top-[38px] flex items-center cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-black bg-white hover:bg-black hover:text-white focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Sign in
              </button>

              <div className="text-center text-sm text-gray-500">or</div>

              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleLogin}
                  onError={() => {
                    setModalContent('Google Sign-In failed');
                    setModalSuccess(false);
                    setModalOpen(true);
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/createAccount');
                  }}
                  className="text-sm font-medium text-black hover:underline"
                >
                  Don’t have an account yet? Sign up
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
