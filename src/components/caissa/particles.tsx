'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const Particles = ({
  className,
  quantity = 30,
}: {
  className?: string;
  quantity?: number;
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 -z-10 overflow-hidden',
        className
      )}
    >
      {Array.from({ length: quantity }).map((_, i) => {
        const size = Math.random() * 2.5 + 1;
        const animationDuration = Math.random() * 20 + 20;
        const animationDelay = Math.random() * -40;
        const x = Math.random() * 100;
        const y = Math.random() * 100;

        return (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-primary to-accent opacity-0"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${x}%`,
              top: `${y}%`,
              animation: `float ${animationDuration}s ease-in-out infinite`,
              animationDelay: `${animationDelay}s`,
            }}
          />
        );
      })}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(20vh);
            opacity: 0;
          }
          10%, 90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-20vh);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Particles;
