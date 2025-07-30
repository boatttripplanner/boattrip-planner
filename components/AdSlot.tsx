import React, { useEffect, useState } from 'react';

interface AdSlotProps {
  slotId: string;
  adClientId: string;
  className?: string;
  style?: React.CSSProperties;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdSlot: React.FC<AdSlotProps> = ({ slotId, adClientId, className, style }) => {
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    // Only load ads in production and when AdSense is available
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'development') {
      console.log('AdSense disabled in development mode');
      return;
    }

    // Check if AdSense script is loaded
    if (!window.adsbygoogle) {
      console.warn('AdSense script not loaded');
      setAdError(true);
      return;
    }

    try {
      // Push the ad with error handling
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      setAdLoaded(true);
    } catch (e) {
      console.error('Error loading AdSense ad:', e);
      setAdError(true);
    }
  }, [slotId, adClientId]);

  // Don't render ad slot in development or if there's an error
  if (process.env.NODE_ENV === 'development' || adError) {
    return (
      <div className={`ad-placeholder ${className || ''}`} style={style}>
        <div className="text-center p-4 text-gray-500 text-sm">
          {process.env.NODE_ENV === 'development' 
            ? 'Ad Slot (Development Mode)' 
            : 'Ad temporarily unavailable'}
        </div>
      </div>
    );
  }

  return (
    <div className={`adsense-ad-container ${className || ''}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClientId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
};

export default AdSlot;