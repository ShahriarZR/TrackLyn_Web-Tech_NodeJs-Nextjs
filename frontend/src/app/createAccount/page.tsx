'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const CreateAccount: React.FC = () => {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:3030/employee/registration', {
        name,
        email,
        phone,
        address,
        password,
      });
      setSuccess('Account created successfully!');
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setPassword('');
      router.push(`/verifyEmail?email=${encodeURIComponent(email)}`);
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
              Create your account
            </h1>
            <form className="space-y-4 md:space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-black">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="bg-white border border-gray-300 text-black rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                  placeholder="Your name"
                  required
                  minLength={3}
                  pattern="[A-Za-z ]+"
                  title="Name should contain only alphabets and spaces and be at least 3 characters"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
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
                <label htmlFor="phone" className="block mb-2 text-sm font-medium text-black">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="bg-white border border-gray-300 text-black rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                  placeholder="01XXXXXXXXX"
                  required
                  //pattern="01[3-9]\\d{9}"
                  title="Enter a valid phone number starting with 01 followed by 3-9 and 9 digits"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="address" className="block mb-2 text-sm font-medium text-black">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="bg-white border border-gray-300 text-black rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                  placeholder="Your address"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-black">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-white border border-gray-300 text-black rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                  required
                  //pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*])[A-Za-z\\d!@#$%^&*]{8,}$"
                  title="Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character (!@#$%^&*), and be 8+ characters long"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push('/');
                  }}
                  className="text-sm font-medium text-black hover:underline"
                >
                  Already have an account? Sign in
                </a>
              </div>
              <button
                type="submit"
                className="w-full text-black bg-white hover:bg-black hover:text-white focus:ring-4 focus:outline-none focus:ring-black font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Register
              </button>
              {(error || success) && (
                <p className={`text-sm font-light mt-2 ${success ? 'text-green-600' : 'text-red-600'}`}>
                  {error || success}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateAccount;
