import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LiveClock = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      // Get current time in Lagos (West Africa Time)
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: 'Africa/Lagos',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      
      const timeString = new Intl.DateTimeFormat('en-US', options).format(new Date());
      setTime(timeString);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between">
      <h3 className="text-sm font-semibold text-brand-muted uppercase tracking-wider mb-2">Local Time</h3>
      <div className="mt-auto">
        <p className="text-xl md:text-2xl font-bold font-display text-brand-ink tracking-tight">
          GMT+1
        </p>
        <p className="text-lg md:text-xl text-brand-accent font-medium">
          {time || 'Loading...'}
        </p>
      </div>
    </div>
  );
};

export default LiveClock;
