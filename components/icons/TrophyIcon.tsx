import React from 'react';

export const TrophyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 019 0zM18.375 12.739a6.002 6.002 0 01-1.183 3.563m-10.382-3.563a6.002 6.002 0 0111.565 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75h.008v.008H12v-.008z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.061A7.5 7.5 0 0112 4.5a7.5 7.5 0 017.5 10.561" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 17.25v3.375c0 .621.504 1.125 1.125 1.125h6.75c.621 0 1.125-.504 1.125-1.125v-3.375" />
  </svg>
);
