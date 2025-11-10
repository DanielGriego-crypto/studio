import * as React from 'react';

export const PawnIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 18a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    <path d="M12 13V7" />
    <path d="M12 7a2 2 0 100-4 2 2 0 000 4z" />
    <path d="M9 18h6" />
  </svg>
);

export const BishopIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
      <path d="M12 2a3 3 0 013 3v2a3 3 0 01-6 0V5a3 3 0 013-3z" />
      <path d="M14.5 14.5a2.5 2.5 0 10-5 0 2.5 2.5 0 005 0z" />
      <path d="M12 12V7" />
      <path d="M9 18h6" />
      <path d="M12 22a8 8 0 00-5.6-7.7" />
      <path d="M12 22a8 8 0 015.6-7.7" />
  </svg>
);

export const KnightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 18a2 2 0 00-2-2h-2V7a4 4 0 00-4-4H8" />
    <path d="M13 3a1 1 0 011 1v2.4a1 1 0 01-1.6.8L10 5" />
    <path d="M4 18h1" />
    <path d="M12 18h2" />
    <path d="M6 18h2" />
    <path d="M9 18a6 6 0 01-5-3 4 4 0 010-4 4.3 4.3 0 014-3h3" />
  </svg>
);
