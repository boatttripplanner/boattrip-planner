import React from 'react';

interface EnvironmentDebugProps {
  isVisible?: boolean;
}

const EnvironmentDebug: React.FC<EnvironmentDebugProps> = ({ isVisible = false }) => {
  if (!isVisible) return null;

  const environmentInfo = {
    nodeEnv: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    baseUrl: import.meta.env.BASE_URL,
    apiKeySet: !!import.meta.env.VITE_API_KEY,
    userAgent: navigator.userAgent,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height,
    },
    devicePixelRatio: window.devicePixelRatio,
    timestamp: new Date().toISOString(),
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Environment Debug</h3>
      <pre className="whitespace-pre-wrap overflow-auto">
        {JSON.stringify(environmentInfo, null, 2)}
      </pre>
    </div>
  );
};

export default EnvironmentDebug; 