import React from 'react';

const AnimatedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <div className="absolute top-0 left-0 w-full h-full">
        {/* Large floating orb 1 */}
        <div
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
            top: '10%',
            left: '10%',
            animationDelay: '0s',
          }}
        />

        {/* Large floating orb 2 */}
        <div
          className="absolute w-[32rem] h-[32rem] rounded-full opacity-20 blur-3xl animate-float-medium"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)',
            top: '20%',
            right: '10%',
            animationDelay: '2s',
          }}
        />

        {/* Medium floating orb 3 */}
        <div
          className="absolute w-80 h-80 rounded-full opacity-15 blur-3xl animate-float-fast"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
            bottom: '15%',
            left: '20%',
            animationDelay: '1s',
          }}
        />

        {/* Medium floating orb 4 */}
        <div
          className="absolute w-72 h-72 rounded-full opacity-15 blur-3xl animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)',
            bottom: '20%',
            right: '15%',
            animationDelay: '3s',
          }}
        />

        {/* Small floating orb 5 */}
        <div
          className="absolute w-64 h-64 rounded-full opacity-10 blur-2xl animate-float-medium"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animationDelay: '1.5s',
          }}
        />

        {/* Small floating orb 6 */}
        <div
          className="absolute w-56 h-56 rounded-full opacity-10 blur-2xl animate-float-fast"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)',
            top: '60%',
            left: '70%',
            animationDelay: '2.5s',
          }}
        />
      </div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0 animate-grid-move"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Subtle wave animation */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-10">
        <svg
          className="absolute bottom-0 w-full h-full animate-wave"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C150,80 350,0 600,50 C850,100 1050,20 1200,50 L1200,120 L0,120 Z"
            fill="rgba(255,255,255,0.3)"
          />
        </svg>
        <svg
          className="absolute bottom-0 w-full h-full animate-wave-slow"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,70 C200,20 400,100 600,70 C800,40 1000,90 1200,70 L1200,120 L0,120 Z"
            fill="rgba(255,255,255,0.2)"
          />
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30 animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
