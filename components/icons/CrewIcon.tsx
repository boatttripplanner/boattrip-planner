import React from 'react';

export const CrewIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-label="Icono de Tripulación" {...props}>
    {/* Barco base */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 17.25h16.5M2.25 17.25h19.5M2.25 13.5l3.879-3.879a3.375 3.375 0 014.772 0l2.098 2.098a3.375 3.375 0 004.771 0l3.88-3.879M2.25 9.75h19.5" />
    
    {/* Mástil */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v12.75" />
    
    {/* Personas en el barco - representadas como círculos pequeños */}
    <circle cx="8" cy="15" r="1.5" stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx="12" cy="15" r="1.5" stroke="currentColor" strokeWidth={1.5} fill="none" />
    <circle cx="16" cy="15" r="1.5" stroke="currentColor" strokeWidth={1.5} fill="none" />
    
    {/* Vela triangular */}
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5L15 9L12 13.5L9 9Z" />
  </svg>
); 