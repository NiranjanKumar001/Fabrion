// components/NetworkWarningToast.js
'use client';

import { useState, useEffect } from 'react';

export default function NetworkWarningToast() {
  const [showToast, setShowToast] = useState(false);
  const [networkStatus, setNetworkStatus] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId;

    const checkNetworkStatus = () => {
      if ('connection' in navigator) {
        const connection = navigator.connection;
        
        const effectiveType = connection.effectiveType || 'unknown';
        const downlink = connection.downlink || 0;
        const rtt = connection.rtt || 0;
        
        const isSlow = effectiveType.includes('2g') || 
                      downlink < 1 || 
                      rtt > 500;

        if (isSlow) {
          setNetworkStatus(`${effectiveType.toUpperCase()} (${downlink.toFixed(1)} Mbps)`);
          setShowToast(true);
          // Auto-dismiss after 8 seconds
          timeoutId = setTimeout(() => setShowToast(false), 8000);
        }

        // Listen for network changes
        connection.addEventListener('change', checkNetworkStatus);
        return () => {
          connection.removeEventListener('change', checkNetworkStatus);
          clearTimeout(timeoutId);
        };
      } else {
        // Fallback for browsers without the API
        const start = performance.now();
        fetch('https://httpbin.org/get', { cache: 'no-store' })
          .then(() => {
            const latency = performance.now() - start;
            if (latency > 1000) {
              setNetworkStatus(`High latency (${Math.round(latency)}ms)`);
              setShowToast(true);
              timeoutId = setTimeout(() => setShowToast(false), 8000);
            }
          })
          .catch(() => {
            setNetworkStatus('Network error');
            setShowToast(true);
            timeoutId = setTimeout(() => setShowToast(false), 8000);
          });
      }
    };

    checkNetworkStatus();
    return () => clearTimeout(timeoutId);
  }, []);

  if (!showToast) return null;

  return (
    <div className="fixed bottom-4 right-4 animate-fade-in">
      <div className="relative bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 pr-8 rounded-lg shadow-lg max-w-xs">
        <button
          onClick={() => setShowToast(false)}
          className="absolute top-3 right-3 text-yellow-500 hover:text-yellow-700 transition-colors"
          aria-label="Close warning"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        <div className="flex items-start">
          <svg className="h-6 w-6 text-yellow-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium">Slow Network Detected</p>
            <p className="text-sm mt-1">{networkStatus}</p>
            <p className="text-xs mt-2 text-yellow-600">
              Code generation may be slower. This warning will auto-close.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}