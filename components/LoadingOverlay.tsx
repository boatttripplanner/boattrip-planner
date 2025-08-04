import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingOverlayProps {
    message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
    return (
        <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-[70] no-print cursor-wait"
            role="dialog"
            aria-modal="true"
            aria-live="polite"
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
            </div>

            {/* Central loading container */}
            <div className="relative z-10 text-center p-8 rounded-2xl bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700/50 shadow-2xl backdrop-blur-md">
                {/* Horizontal line effect */}
                <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent transform -translate-y-1/2"></div>
                
                {/* Logo and spinner */}
                <div className="mb-6">
                    <LoadingSpinner size="md" />
                </div>
                
                {/* Loading message */}
                <div className="relative">
                    <p className="text-lg text-white text-center font-semibold animate-pulse">
                        {message}
                    </p>
                    
                    {/* Subtle dots animation */}
                    <div className="flex justify-center gap-1 mt-2">
                        <div className="w-1 h-1 bg-ocean-400 rounded-full animate-pulse"></div>
                        <div className="w-1 h-1 bg-sea-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-1 h-1 bg-sunset-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
