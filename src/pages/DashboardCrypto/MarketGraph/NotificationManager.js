import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TradeNotification from './TradeNotification';

const NotificationManager = () => {
  const [notifications, setNotifications] = useState([]);
  const latestOrderResult = useSelector((state) => state.accountType.latestOrderResult);
  const closedOrder = useSelector((state) => state.accountType.closedOrder);

  useEffect(() => {
    if (latestOrderResult && closedOrder) {
        console.log("Latest Order Result:", latestOrderResult);
console.log("Closed Order:", closedOrder);
      // Create notification from closed order data
      const notification = {
        id: Date.now(),
        result: latestOrderResult,
        symbol: closedOrder.symbol,
        stake: closedOrder.stake,
        payout: closedOrder.profit || closedOrder.payout,
        direction: closedOrder.direction,
        duration: closedOrder.expiry_seconds,
        timestamp: new Date().toISOString()
      };

      addNotification(notification);
    }
  }, [latestOrderResult, closedOrder]);

  const addNotification = (notification) => {
    setNotifications(prev => [...prev, notification]);
    
    // Limit to 3 notifications at a time
    if (notifications.length >= 3) {
      setNotifications(prev => prev.slice(1));
    }
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="notification-manager">
      {notifications.map((notification) => (
        <TradeNotification
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager;


