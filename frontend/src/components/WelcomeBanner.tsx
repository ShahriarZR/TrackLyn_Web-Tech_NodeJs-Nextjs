'use client';

import React from 'react';

interface WelcomeBannerProps {
  userName: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ userName }) => {
  return (
    <div
      className="bg-white rounded-[18px] flex items-center justify-between relative overflow-hidden shadow"
      style={{
        width: '739px',
        height: '188px',
        padding: '18px',
        flexShrink: 0,
      }}
    >
      {/* Text Section */}
      <div className="z-10">
        <p className="text-[#7E7E7E] text-[19.6px] font-normal font-poppins">Welcome</p>
        <h2 className="text-2xl font-bold text-black font-poppins">{userName}</h2>
      </div>

      {/* Image Section */}
      <div className="relative w-[260px] h-[190px] flex-shrink-0">
        {/* Rotated background element */}
        <img
          src="/svg/Group 300.svg"
          alt="Background Decoration"
          className="absolute object-contain"
          style={{
            width: '54.202px',
            height: '55.503px',
            transform: 'rotate(-8.289deg)',
            top: '10px',
            left: '10px',
          }}
        />

        {/* Main illustration */}
        <img
          src="/svg/task-management.png"
          alt="Task Management Illustration"
          className="absolute object-contain"
          style={{
            width: '260.35px',
            height: '189.924px',
            top: '0',
            left: '0',
          }}
        />

        {/* Bottom wave/decoration */}
        <img
          src="/svg/Path 734.svg"
          alt="Wave Decoration"
          className="absolute object-contain"
          style={{
            width: '40px',
            height: '18px',
            bottom: '-10px',
            right: '10px',
          }}
        />
      </div>
    </div>
  );
};

export default WelcomeBanner;
