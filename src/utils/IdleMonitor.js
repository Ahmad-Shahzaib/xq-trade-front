import React, { useEffect, useRef } from 'react';

const IdleMonitor = ({ onIdle }) => {
  const idleRef = useRef(0); // Tracks idle time

  useEffect(() => {
    const idleInterval = setInterval(timerIncrement, 1000); // Check every second

    function timerIncrement() {
      idleRef.current += 1;
      if (idleRef.current > 59) {
        // Trigger idle action after 60 seconds of inactivity
        onIdle();
        clearInterval(idleInterval); // Stop monitoring after triggering idle
      }
    }

    function resetIdleRef() {
      idleRef.current = 0; // Reset idle timer
    }

    // Listen for mousemove and keypress events to reset idle timer
    document.body.addEventListener('mousemove', resetIdleRef);
    document.body.addEventListener('keypress', resetIdleRef);

    // Clean up listeners and interval when component unmounts
    return () => {
      document.body.removeEventListener('mousemove', resetIdleRef);
      document.body.removeEventListener('keypress', resetIdleRef);
      clearInterval(idleInterval);
    };
  }, [onIdle]);

  return null;
};

export default IdleMonitor;
