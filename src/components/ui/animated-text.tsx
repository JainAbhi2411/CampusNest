import React, { useEffect, useState } from 'react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  type?: 'fade-up' | 'wave' | 'gradient' | 'glitch';
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  delay = 0,
  type = 'fade-up',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const words = text.split(' ');

  if (type === 'gradient') {
    return (
      <h1
        className={`${className} animate-gradient-text bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent`}
      >
        {text}
      </h1>
    );
  }

  if (type === 'glitch') {
    return (
      <h1 className={`${className} relative inline-block`}>
        <span className="relative z-10">{text}</span>
        <span
          className="absolute top-0 left-0 w-full h-full text-secondary opacity-70 animate-glitch-1"
          aria-hidden="true"
        >
          {text}
        </span>
        <span
          className="absolute top-0 left-0 w-full h-full text-accent opacity-70 animate-glitch-2"
          aria-hidden="true"
        >
          {text}
        </span>
      </h1>
    );
  }

  if (type === 'wave') {
    return (
      <h1 className={className}>
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block mr-2">
            {word.split('').map((char, charIndex) => (
              <span
                key={charIndex}
                className={`inline-block transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{
                  transitionDelay: `${(wordIndex * 50 + charIndex * 30)}ms`,
                  animation: isVisible ? `wave 2s ease-in-out ${(wordIndex * 50 + charIndex * 30)}ms infinite` : 'none',
                }}
              >
                {char}
              </span>
            ))}
          </span>
        ))}
      </h1>
    );
  }

  // Default: fade-up
  return (
    <h1 className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block mr-2 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{
            transitionDelay: `${index * 100}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </h1>
  );
};

export default AnimatedText;
