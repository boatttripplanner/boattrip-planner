import React from 'react';

export const CrewMembersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    {/* Persona principal (capitán) */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    
    {/* Persona secundaria (tripulante) */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 7.5v.75a3 3 0 01-3 3h-1.5a3 3 0 01-3-3v-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H18.75c.621 0 1.125.504 1.125 1.125v.375m-7.5 0v.75a3 3 0 01-3 3h-1.5a3 3 0 01-3-3v-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H11.25c.621 0 1.125.504 1.125 1.125v.375m7.5 0v.75a3 3 0 01-3 3h-1.5a3 3 0 01-3-3v-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H18.75c.621 0 1.125.504 1.125 1.125v.375" />
    
    {/* Línea de agua/barco */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 18.75h18M3 21h18" />
  </svg>
); 