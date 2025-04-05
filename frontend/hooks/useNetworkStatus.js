// hooks/useNetworkStatus.js
'use client';

import { useState, useEffect } from 'react';

const useNetworkStatus = () => {
  const [isSlowConnection, setIsSlowConnection] = useState(false);
  const [networkInfo, setNetworkInfo] = useState('Checking network...');
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId;

    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      const updateStatus = () => {
        const effectiveType = connection.effectiveType || 'unknown';
        const downlink = connection.downlink || 0;
        const rtt = connection.rtt || 0;
        
        const slow = effectiveType.includes('2g') || 
                     downlink < 1 || 
                     rtt > 500;
        
        setIsSlowConnection(slow);
        setNetworkInfo(`${effectiveType.toUpperCase()} (${downlink} Mbps)`);

        // Auto-show warning when connection becomes slow
        if (slow) {
          setShowWarning(true);
          // Auto-dismiss after 10 seconds
          timeoutId = setTimeout(() => setShowWarning(false), 10000);
        } else {
          setShowWarning(false);
        }
      };
      
      updateStatus();
      connection.addEventListener('change', updateStatus);
      
      return () => {
        connection.removeEventListener('change', updateStatus);
        clearTimeout(timeoutId);
      };
    } else {
      setNetworkInfo('Network: Unknown');
    }
  }, []);

  const dismissWarning = () => {
    setShowWarning(false);
  };

  return { 
    isSlowConnection, 
    networkInfo,
    showWarning,
    dismissWarning
  };
};

export default useNetworkStatus;