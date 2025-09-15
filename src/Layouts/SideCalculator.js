import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Button, FormGroup, Label, Input, Alert } from 'reactstrap';
import TimePickerModal from '../pages/DashboardCrypto/MarketGraph/TimePickerModal';
import CustomHeaderModal from "./CustomHeaderModal";
import trading from "../assets/images/chartbg.png"
import { GiBackwardTime } from "react-icons/gi";
import { AiOutlineDollar } from "react-icons/ai";
import { useTranslation } from "react-i18next";



const SideCalculator = ({ handlePlacePendingOrder, handlePlaceOrder, symbolMarketActive,
  handlePriceIncrease, handlePriceDecrease,
  handleInputChange,
  price, setPrice,
  setShowAmountCalculator,
  showAmountCalculator,
  amount = 100,
  setAmount,
  time = 60,
  setTime,
  selectedSymbol,
  selectedOption,
  setSelectedOption,
  symbolPercentage,
  showTimePicker,
  setShowTimePicker,
  timePickerModel,
  setTimePickerModel
}) => {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ pair: '', forecast: '', amount: '' });
  const [buy, setBuy] = useState(true);
  const { t } = useTranslation();



  const [alerts, setAlerts] = useState([]);

  // Refs for the modals
  const timePickerRef = useRef(null);
  const amountCalculatorRef = useRef(null);

  // Ensure only one of the modals (amount or time) is open at a time
  const handleShowTimePicker = (show) => {
    if (show) setShowAmountCalculator(false);
    setShowTimePicker(show);
  };
  const handleShowAmountCalculator = (show) => {
    if (show) setShowTimePicker(false);
    setShowAmountCalculator(show);
  };
  const toggleTimePickerModel = () => {
    setTimePickerModel(!timePickerModel)
  };

  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, '0');
    const s = String(secs % 60).padStart(2, '0');
    return `00:${m}:${s}`;
  };

  const saveTimeToLocalStorage = (newTime) => {
    localStorage.setItem("selectedTime", newTime);
  };

  const handleDecrement = () => {
    let decrement = 5; // Default 5 seconds decrement
    if (time > 3600) { // More than 1 hour
      decrement = 3600; // 1 hour decrement
    } else if (time > 60) { // More than 1 minute
      decrement = 60; // 1 minute decrement
    } else if (time === 60) { // Exactly 1 minute
      decrement = 15; // Decrement to 5 seconds
    }
    else if (time === 45) { // Exactly 1 minute
      decrement = 5; // Decrement to 5 seconds
    }
    const newValue = Math.max(5, time - decrement);
    setTime(newValue);
    saveTimeToLocalStorage(newValue);
  };
  const handleTimeChange = (e) => {
    const timeValue = e.target.value;
    if (timeValue) {
      const [hours, minutes] = timeValue.split(':').map(Number);
      const totalSeconds = (hours * 3600) + (minutes * 60);
      if (totalSeconds <= 86400) { // 24 hours in seconds
        setTime(totalSeconds);
      }
    }
  };

  const getCurrentTime = () => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };


  const handleIncrement = () => {
    let increment = 5; // Default 5 seconds increment
    if (time >= 3600) { // More than 1 hour
      increment = 3600; // 1 hour increment
    } else if (time >= 60) { // More than 1 minute
      increment = 60; // 1 minute increment
    }
    const newValue = time + increment;
    if (newValue <= 86400) { // 24 hours in seconds
      setTime(newValue);
      saveTimeToLocalStorage(newValue);
    }
  };

  const handleIncrease = () => {
    setTime((prev) => {
      let prevValue = Number(prev); // Ensure prev is always a number

      if (prevValue < 1) {
        return prevValue >= 0.45 ? 1 : Number((prevValue + 0.05).toFixed(2)); // Keep as a number
      } else {
        return prevValue + 1; // Normal increment in minutes
      }
    });
  };

  const handleDecrease = () => {
    setTime((prev) => {
      if (prev > 1) {
        return prev - 1; // Normal decrease in minutes
      } else if (prev === 1) {
        return 0.45; // Switch to decimal format (0.45 instead of 45 seconds)
      } else {
        return prev > 0.05 ? (prev - 0.05).toFixed(2) : 0.05; // Decrease by 0.05, but never below 0.05
      }
    });
  };



  const handleBlur = () => {
    if (price === "" || isNaN(price) || price < 1) {
      setPrice(1); // Reset to 1 if empty or invalid
    }
  };


  // Helper to auto-remove alert after 4 seconds
  const addAlert = (alert) => {
    setAlerts(prev => [...prev, alert]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(a => a.id !== alert.id));
    }, 4000);
  };

  const handleBuy = () => {
    addAlert({ id: Date.now(), type: 'success', message: 'Buy order placed!' });
  };
  const handleSell = () => {
    addAlert({ id: Date.now(), type: 'danger', message: 'Sell order placed!' });
  };

  // Responsive: detect mobile
  const isMobile = window.innerWidth <= 768;

  React.useEffect(() => {
    if (isCustomModalOpen) {
      const timer = setTimeout(() => setIsCustomModalOpen(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isCustomModalOpen]);

  // Close time picker when clicking outside (using ref)
  useEffect(() => {
    if (!showTimePicker) return;
    function handleClickOutside(event) {
      if (timePickerRef.current && !timePickerRef.current.contains(event.target)) {
        setShowTimePicker(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showTimePicker]);

  // Close amount calculator when clicking outside (using ref)
  useEffect(() => {
    if (!showAmountCalculator) return;
    function handleClickOutside(event) {
      if (amountCalculatorRef.current && !amountCalculatorRef.current.contains(event.target)) {
        setShowAmountCalculator(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAmountCalculator, setShowAmountCalculator]);

  return (
    <>
      <CustomHeaderModal
        isOpen={isCustomModalOpen}
        toggle={() => setIsCustomModalOpen(false)}
        pair={selectedSymbol}
        forecast={modalData.forecast}
        amount={modalData.amount}
        buy={buy}
      />

      {/* Alerts moved outside the main trading-calculator div */}
      {alerts.length > 0 && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 2000, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
          {alerts.map(alert => (
            <Alert
              key={alert.id}
              color={alert.type}
              className={`alert-custom ${alert.type === 'success' ? 'alert-success-custom' : 'alert-danger-custom'}`}
              toggle={() => setAlerts(alerts.filter(a => a.id !== alert.id))}
              style={{ marginTop: 16, minWidth: 300, maxWidth: 400, pointerEvents: 'auto' }}
            >
              {alert.message}
            </Alert>
          ))}
        </div>
      )}
      <style>{`
        .trading-calculator {
          width: 256px;
          background: linear-gradient(180deg, #1C0A25);
          color: white;
          align-items: center;
          justify-content: center;
          padding:10px 24px;
          border-radius: 12px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
          font-family: 'Courier New', monospace;
        }

        /* Hide all except time, amount, buy, sell on mobile */
        @media (max-width: 768px) {
          .trading-header,
          .date-btn {
            display: none !important;
          }
          /* Ensure time-amount-wrapper is visible on mobile */
          .time-amount-wrapper {
            display: flex !important;
          }
          /* Ensure TIME and AMOUNT controls are visible */
          .control-group {
            display: flex !important;
          }
          /* Hide everything except time, amount, buy/sell, and profit section */
          .trading-calculator > :not(.time-amount-wrapper):not(.buy-sell-wrapper):not([data-mobile-visible="profit-section"]) {
            display: none !important;
          }
          .time-amount-wrapper {
            margin-bottom: 0 !important;
          }
          .trading-calculator {
          background: "transparent" !important;
          backdrop-filter: blur(20px) !important;
            padding: 8px !important;
            width: 100% !important;
            min-width: 0 !important;
            box-shadow: none !important;
            border-radius: 20px !important;
            background: transparent !important;
            backdrop-filter: blur(10px) !important;
            margin: 0 !important;
            gap:0 !important;
            border: 1px solid #d114ab  !important;
          }
          .time-amount-wrapper {
            flex-direction: row !important;
            gap: 8px !important;
            width: 100% !important;
          }
          .time-amount-wrapper > div {
            flex: 1 1 0;
            margin-bottom: 0 !important;
          }
          .section-label {
          
            margin-bottom: 1px !important;  
            font-size: 11px !important;
            letter-spacing: 0.5px !important;
          }
          .control-group {
            margin-bottom: 0 !important;
            padding: 6px 4px !important;
            border-radius: 6px !important;
            box-shadow: none !important;
            min-width: 0 !important;
          }
          .control-btn {
            height: 12px !important;
            width: 12px !important;
            font-size: 14px !important;
            padding: 0 !important;
            min-width: 0 !important;
            margin: 0 2px !important;
            padding-left: 14px !important;
            padding-right: 14px !important;
          }
          .control-input {
            font-size: 18px !important;
            margin: 0 4px !important;
            padding: 0 !important;
            min-width: 0 !important;
          }
          .amount-display, .time-display {
            font-size: 18px !important;
          }
          .buy-sell-wrapper {
            flex-direction: column !important;
            gap: 8px !important;
            width: 100% !important;
            // margin-top: 8px !important;
          }
          .buy-sell-wrapper .action-btn {
            flex: 1 1 0;
            padding: 5px 0 !important;
            font-size: 13px !important;
            border-radius: 20px !important;
            min-width: 0 !important;
            box-shadow: none !important;
          }
          .buy-btn {
            background-color: #00e600 !important;
            color: #fff !important;
            font-size: 15px !important;
            padding: 5px 0 !important;
            border-radius: 20px !important;
          }
          .sell-btn {
            background-color: #ff3333 !important;
            color: #fff !important;
            font-size: 15px !important;
            padding: 5px 0 !important;
            border-radius: 20px !important;
          }
        }

        .trading-header {
          text-align: center;
          font-size: 14px;
          font-weight: bold;
          letter-spacing: 2px;
          // margin-bottom: 32px;
          color: #c4b5fd;
        }

        .section-label {
          text-align: center;
          font-size: 12px;
          color: white;
          margin-bottom: 8px;
          letter-spacing: 1px;
          position: relative;
          z-index: 9999;
          margin-left: 5px;
        }

        .control-group {
          background: transparent;
          box-shadow: 0 0 10px rgba(124, 58, 237, 0.2);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-input {
          background: transparent !important;
          border: none !important;
          color: white !important;
          text-align: center;
          font-size: 24px !important;
          font-weight: bold;
          padding: 0 !important;
          flex: 1;
          margin: 0 16px;
        }

        .control-input:focus {
          box-shadow: none !important;
          outline: none !important;
        }

        .control-btn {
          height: 27px;
          width: 15px;
          background: #db2777 !important;
          border: none !important;
          border-radius: 50% !important;
          color: white !important;
          font-weight: bold !important;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 19px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-btn:hover {
          background: #ec4899 !important;
          transform: scale(1.05);
        }

        .control-btn:active {
          transform: scale(0.95);
        }

        .date-btn {
          width: 100%;
          background: linear-gradient(90deg,  #c41a6b, #390452);
          border: none !important;
          color: white !important;
          font-weight: bold !important;
          padding: 8px 12px !important;
          border-radius: 20px !important;
          // margin-bottom: 16px;
          font-size: 14px;
          letter-spacing: 1px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .date-btn:hover {
          background: linear-gradient(90deg,  #ff007a, #9b00e6);
          transform: translateY(-1px);
        }
        .date-btns:hover {
           background: red;
          transform: translateY(-1px);
          cursor: pointer;
        }

        .action-btn {
          width: 100%;
          border: none !important;
          font-weight: bold !important;
          padding: 16px !important;
          border-radius: 999px !important;
          font-size: 14px !important;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          // gap: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        }

        .buy-btn {
          background-color: #00cc00;
          color: white !important;
          border-radius: 999px !important;
          font-size: 14px !important;
          font-weight: bold !important;
          padding: 4px 20px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          // gap: 5px;
        }

         .buy-btn::before {
  content: "↑";
  font-size: 28px;
  margin-right: 8px;
  display: inline-block;
  transform: rotate(45deg);
  background-color: rgba(0, 0, 0, 0.25); /* Darker transparent background */
  padding: 3px;
  border-radius: 50%; /* Full circle */
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 20px;
}



        .buy-btn:hover {
          background-color: #00e600;
          transform: translateY(-2px) scale(1.03);
        }

        .sell-btn {
          background-color: #ff0000;
          color: white !important;
          border-radius: 999px !important;
          font-size: 14px !important;
          font-weight: bold !important;
          padding: 4px 20px !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }

       .sell-btn::before {
  content: "↓";
  font-size: 28px;
  margin-right: 8px;
  display: inline-block;
  transform: rotate(318deg); /* Arrow pointing bottom-right */
  background-color: rgba(0, 0, 0, 0.25); /* Darker transparent background */
  padding:3px;
  border-radius: 50%; /* Full circle */
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 20px;
}


        .sell-btn:hover {
          background-color: #ff3333;
          transform: translateY(-2px) scale(1.03);
        }

        .action-btn:active {
          transform: translateY(0);
        }

        .time-picker-overlay {
          position: absolute;
          top: -6px;
          left: 15px;
          width: 95%;
          z-index: 1000;
        }

        .time-picker-input {
          background: rgba(255, 255, 255, 0.1) !important;
          border: 1px solid #7c3aed !important;
          color: white !important;
          border-radius: 20px !important;
          // padding-right: 16px !important;
          // padding-left: 16px !important;
          height: 40px !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          font-size: large !important;
        }

        .alert-custom {
          color: #fff !important;
          border: none !important;
          font-weight: bold !important;
          text-align: center !important;
          margin-bottom: 10px !important;
          border-radius: 8px !important;
        }

        .alert-success-custom {
          background-color: #16a34a !important;
        }

        .alert-danger-custom {
          background-color: #dc2626 !important;
        }

        .time-display {
          color: #f472b6 !important;
        }

        .amount-display {
          color: white !important;
        }

        .trading-calculator {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-center;
          height: 100v%;
          margin-left: 30px;
        }

        .time-amount-wrapper {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .buy-sell-wrapper {
          display: flex;
          flex-direction: column;
          width: 100%;
          gap: 5px;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          .trading-calculator {
            padding: 16px;
            width: 100%;
            margin:0;
            // top: 47px;
          }

          .trading-header {
            margin-bottom: 16px;
          }

          .control-group {
            margin-bottom: 12px;
            // padding: 12px;
          }

          .trading-calculator > div {
            // margin-bottom: 12px;
          }

          .time-amount-wrapper {
            flex-direction: row;
            gap: 12px;
          }

          .time-amount-wrapper > div {
            flex: 1;
            margin-bottom: 0px !important;
          }

          .section-label {
            margin-bottom: 2px;
          }

          .date-btn {
            margin-bottom: 12px;
          }

          .action-btn {
            padding: 0px !important;
            font-size: 12px !important;
          }

          .buy-sell-wrapper {
            flex-direction: row !important;
            gap: 8px !important;
          }

          .buy-sell-wrapper .action-btn {
            flex: 1;
            height: 38px !important;
          }
        }

        

        .custom-time-calculator-overlay {
          position: absolute;
          left: -320px;
          top: 0;
          z-index: 2000;
          display: flex;
          align-items: flex-start;
          justify-content: flex-end;
          width: 320px;
          height: 320px;
          pointer-events: auto;
        }

        .custom-time-calculator {
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.7);
          padding: 24px 18px 18px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 260px;
          min-height: 260px;
          border: 1.5px solid #a21caf;
        }
           .custom-time-calculators {
          border-radius: 18px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.7);
          padding: 24px 18px 18px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 260px;
          min-height: 260px;
          border: 1.5px solid #a21caf;
        }
        @media (max-width: 768px) {
          .custom-time-calculator {
            left: 50% !important;
            top: -30px !important;
            transform: translate(-50%, -50%) !important;
            position: fixed !important;
            min-width: 320px !important;
            min-height: 320px !important;
            z-index: 4000 !important;
          }
        }
          @media (max-width: 768px) {
          .custom-time-calculators {
            left: 50% !important;
            top: 45px !important;
            transform: translate(-50%, -50%) !important;
            position: fixed !important;
            min-width: 320px !important;
            min-height: 320px !important;
            z-index: 4000 !important;
          }
        }
        }

        .calc-row {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 12px;
          gap: 12px;
        }

        .calc-btn {
          background: linear-gradient(90deg, #ff007a, #9b00e6);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          font-size: 22px;
          font-weight: bold;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          transition: background 0.2s, transform 0.2s;
        }

        .calc-btn:hover {
          background: linear-gradient(90deg, #ff4fa3, #b266ff);
          transform: scale(1.08);
        }

        .calc-time {
          color: #fff;
          font-size: 32px;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          margin: 0 2px;
        }

        .calc-shortcuts {
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
          margin-bottom: 8px;
        }

        .calc-shortcut-btn {
          background: transparent;
          color: white;
          border: 1px solid #a21caf;
          border-radius: 8px;
          font-size: 13px;
          font-weight: bold;
          padding: 4px 10px;
          margin: 2px;
          transition: background 0.2s, color 0.2s;
          padding-left: 12px;
          padding-right: 12px;
          width: auto
        }

        .calc-shortcut-btn:hover {
          background: #a21caf;
          color: #fff;
        }

        .calc-close-btn {
          margin-top: 10px;
          background: #db2777;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: bold;
          padding: 6px 18px;
          transition: background 0.2s;
        }

        .calc-close-btn:hover {
          background: #a21caf;
        }
      `}</style>
      <div>
        <div className="trading-calculator" style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', marginRight: '20px',
          gap: '10px',
          height: isMobile ? '100%' : '89vh',
        }}>
          {/* Desktop: show all. Mobile: only time, amount, buy/sell */}
          {!isMobile && (
            <div className="trading-header" style={{ padding: "2px" }}>{t("TRADES")}</div>
          )}
          <div className="time-amount-wrapper">
            <div style={{ marginBottom: 2, flex: 1 }}>
              <div className="control-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: "74px" }}>
                <div className="section-label " style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}>{t("TIME")}</div>
                {
                  isMobile ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <Input
                        type="text"
                        className="time-picker-input"
                        style={{
                          width: '100%',
                          paddingRight: 48, // space for the icon
                          borderRadius: 9999,
                          background: 'linear-gradient(to right, #1f1f2e, #1f1f2e)', // replace with actual background if needed
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textAlign: 'center',

                        }}
                        value={formatTime(time)}
                        onClick={() => handleShowTimePicker(true)}
                        readOnly
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '50%',
                          right: 4,
                          transform: 'translateY(-50%)',
                          background: 'linear-gradient(135deg, #ec4899, #8b5cf6)', // gradient for circle
                          borderRadius: '50%',
                          padding: 4,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <div
                          style={{
                            background: 'radial-gradient(circle at top right, #ff00c8, #a200ff)',
                            width: '27px',
                            height: '27px',
                            borderRadius: '50%',
                            color: '#fff',
                            fontSize: '27px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 10px rgba(255, 0, 200, 0.4)',
                          }}
                        >
                          <GiBackwardTime />
                        </div>

                      </span>
                    </div>
                  ) : (
                    <Input
                      type="text"
                      className="time-picker-input"
                      value={formatTime(time)}
                      onClick={() => handleShowTimePicker(true)}
                      readOnly
                    />
                  )
                }



                {showTimePicker && (
                  <div
                    ref={timePickerRef}
                    style={{
                      position: 'fixed',
                      top: isMobile ? '-80%' : 0,
                      left: isMobile ? '50%' : 280,
                      transform: isMobile ? 'translate(-50%, -50%)' : undefined,
                      width: isMobile ? 'auto' : '100vw',
                      height: isMobile ? 'auto' : '100vh',
                      zIndex: 3000,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() => handleShowTimePicker(false)}
                  >
                    <div className="custom-time-calculator" style={{
                      minWidth: 120,
                      background: isMobile ? "transparent " : 'tranasparent',
                      backdropFilter: 'blur(30px)',
                      minHeight: 130,
                      borderRadius: 18,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                      padding: 12,
                      zIndex: 4010,
                      backdropFilter: isMobile ? 'blur(3px)' : 'blur(8px)',
                      WebkitBackdropFilter: isMobile ? 'blur(3px)' : 'blur(8px)',
                      border: '2px solid rgb(63 9 68)', borderRadius: 18,

                    }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleShowTimePicker(false)}
                        style={{
                          position: 'absolute',
                          top: -3,
                          right: 6,
                          background: 'transparent',
                          border: 'none',
                          color: '#f472b6',
                          fontSize: 22,
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          zIndex: 10
                        }}
                        aria-label="Close"
                      >
                        ×
                      </button>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 10,
                        marginTop: 10,
                      }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32 }}>
                          <Button className="calc-btn" style={{
                            background: 'linear-gradient(90deg, #c41a6b, #390452)',
                            height: 20,
                            padding: '2px 32px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            color: '#fff',
                            fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                          }} onClick={() => setTime(time + 60)}>+</Button>
                          <Button className="calc-btn" style={{
                            background: 'linear-gradient(90deg, #c41a6b, #390452)',
                            height: 20,
                            padding: '2px 38px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            color: '#fff',
                            fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                          }} onClick={() => setTime(time + 300)}>+</Button>
                          <Button className="calc-btn" style={{
                            background: 'linear-gradient(90deg, #c41a6b, #390452)',
                            height: 20,
                            padding: '2px 38px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            color: '#fff',
                            fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                          }} onClick={() => setTime(time + 3600)}>+</Button>
                        </div>
                        <div style={{
                          display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', position: 'relative',
                          width: '100%'
                        }}>
                          <span className="calc-time" style={{ fontSize: 32, width: 56, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>{String(Math.floor(time / 3600)).padStart(2, '0')}</span>
                          <span style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 56,
                            width: 16,
                            fontWeight: 'bold',
                            color: '#fff',
                            fontSize: 32,
                            margin: '0 0',
                          }}>
                            <span style={{ lineHeight: 1, fontSize: 32 }}>:</span>
                          </span>
                          <span className="calc-time" style={{ fontSize: 32, width: 56, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>{String(Math.floor((time % 3600) / 60)).padStart(2, '0')}</span>
                          <span style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 56,
                            width: 16,
                            fontWeight: 'bold',
                            color: '#fff',
                            fontSize: 32,
                            margin: '0 0',
                          }}>
                            <span style={{ lineHeight: 1, fontSize: 32 }}>:</span>
                          </span>
                          <span className="calc-time" style={{ fontSize: 32, width: 56, textAlign: 'center', color: '#fff', fontWeight: 'bold' }}>{String(time % 60).padStart(2, '0')}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 32, marginTop: 0 }}>
                          <Button className="calc-btn" style={{
                            background: 'linear-gradient(90deg, #c41a6b, #390452)',
                            height: 20,
                            padding: '2px 38px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            color: '#fff',
                            fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                          }} onClick={() => setTime(Math.max(0, time - 60))}>-</Button>
                          <Button className="calc-btn" style={{
                            background: 'linear-gradient(90deg, #c41a6b, #390452)',
                            height: 20,
                            padding: '2px 38px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            color: '#fff',
                            fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                          }} onClick={() => setTime(Math.max(0, time - 300))}>-</Button>
                          <Button className="calc-btn" style={{
                            background: 'linear-gradient(90deg, #c41a6b, #390452)',
                            height: 20,
                            padding: '2px 38px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            color: '#fff',
                            fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                          }} onClick={() => setTime(Math.max(0, time - 3600))}>-</Button>
                        </div>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 10, marginBottom: 10, width: '100%' }}>
                        <Button className="calc-shortcut-btn" style={{ background: 'transparent', color: 'white', border: '1px solid #a21caf' }} onClick={() => setTime(5)}>S5</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'transparent', color: 'white', border: '1px solid #a21caf' }} onClick={() => setTime(15)}>S15</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'transparent', color: 'white', border: '1px solid #a21caf' }} onClick={() => setTime(30)}>S30</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'transparent', color: 'white', border: '1px solid #a21caf' }} onClick={() => setTime(60)}>M1</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'transparent', color: 'white', border: '1px solid #a21caf' }} onClick={() => setTime(180)}>M3</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'transparent', color: 'white', border: '1px solid #a21caf' }} onClick={() => setTime(300)}>M5</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'transparent', color: 'white', border: '1px solid #a21caf' }} onClick={() => setTime(1800)}>M30</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'transparent', color: 'white', border: '1px solid #a21caf' }} onClick={() => setTime(3600)}>H1</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'transparent', color: 'white', border: '1px solid #a21caf' }} onClick={() => setTime(14400)}>H4</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                {/* Hide + and - buttons for time control on mobile view */}
                {!isMobile && (
                  <>
                    <div className="date-btns" onClick={handleDecrement} style={{
                      background: 'linear-gradient(90deg, #c41a6b, #390452)',
                      padding: '2px 38px',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      color: '#fff',
                      fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                    }}>
                      -
                    </div>
                    <div
                      className="date-btns"
                      onClick={handleIncrement} style={{
                        background: 'linear-gradient(90deg, #c41a6b, #390452)',
                        padding: '2px 38px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        color: '#fff',
                        fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                      }}>
                      +
                    </div>
                  </>
                )}
              </div>
            </div>
            <div style={{ marginBottom: 24, flex: 1 }}>

              <div className="control-group" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: "76px", }}>
                <div className="section-label"
                  style={{ fontSize: '12px', fontWeight: 'bold', color: '#fff' }}
                >{t("AMOUNT")}</div>
                {/* <Button  className="control-btn">-</Button> */}
                {
                  isMobile ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                      <Input
                        type="text"
                        value={`${price}$`}
                        readOnly
                        className="time-picker-input"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        onClick={() => handleShowAmountCalculator(true)}
                        style={{
                          paddingRight: 48, // space for the icon
                          borderRadius: 9999,
                          background: 'linear-gradient(to right, #1f1f2e, #1f1f2e)',
                          color: '#fff',
                          textAlign: 'center',


                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '50%',
                          right: -7,
                          transform: 'translateY(-50%)',
                          // background: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                          borderRadius: '50%',
                          padding: 10,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',

                        }}
                      >
                        <div
                          style={{
                            background: 'radial-gradient(circle at top right, #ff00c8, #a200ff)',
                            width: '33px',
                            height: '33px',
                            borderRadius: '50%',
                            color: '#fff',
                            fontSize: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 0 8px rgba(255, 0, 200, 0.4)',
                          }}
                        >
                          <AiOutlineDollar />
                        </div>
                      </span>
                    </div>
                  ) : (
                    <Input
                      type="text"
                      value={`${price}$`}
                      readOnly
                      className="time-picker-input"
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      onClick={() => handleShowAmountCalculator(true)}
                      style={{
                        borderRadius: 9999,
                        background: 'linear-gradient(to right, #1f1f2e, #1f1f2e)',
                        color: '#fff',
                        textAlign: 'center'
                      }}
                    />
                  )

                }
                {showAmountCalculator && (
                  <div ref={amountCalculatorRef}
                    style={{
                      position: 'fixed',
                      top: isMobile ? '-120%' : 0,
                      left: isMobile ? '50%' : 240,
                      transform: isMobile ? 'translate(-50%, -50%)' : undefined,
                      width: isMobile ? 'auto' : '100vw',
                      height: isMobile ? 'auto' : '100vh',
                      zIndex: 3000,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    onClick={() =>
                      handleShowAmountCalculator(false)

                    }
                  >
                    <div className="custom-time-calculators" style={{
                      minWidth: 320, minHeight: 320,
                      // backgroundImage: isMobile ? `url(${trading}) ` : 'none',
                      backgroundColor: isMobile ? 'transparent' : 'transparent',
                      backdropFilter: 'blur(20px)',
                      // opacity: isMobile ? 1 : .9,
                      border: '2px solid rgb(63 9 68)', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.7)', padding: 6, position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleShowAmountCalculator(false)}
                        style={{
                          position: 'absolute',
                          top: 0,
                          right: 14,
                          background: 'transparent',
                          border: 'none',
                          color: '#f472b6',
                          fontSize: 26,
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          zIndex: 10
                        }}
                        aria-label="Close"
                      >
                        ×
                      </button>
                      <div style={{
                        display: 'flex', alignItems: 'center', marginBottom: 12, borderRadius: 10, padding: 8, gap: 8,
                      }}>
                        <div style={{
                          color: '#fff', fontSize: 28, fontFamily: 'Courier New, monospace', fontWeight: 'bold', minWidth: 180, textAlign: 'center',
                          background: 'transparent', padding: '8px 16px', borderRadius: 10, border: '1px solid #a21caf',
                          flex: 1
                        }}>${amount}</div>
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8
                        }} >
                          <Button className="calc-btn" style={{
                            padding: '2px 2px',
                            height: 20,
                            fontSize: 18,
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }} onClick={() => setAmount(amount * 2)}>
                            *
                          </Button>
                          <Button className="calc-btn" style={{
                            padding: '2px 2px',
                            height: 20,
                            fontSize: 18,
                            borderRadius: '10px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }} onClick={() => setAmount(Math.floor(amount / 2))}>÷</Button>
                        </div>

                        <span style={{ color: '#fff', fontSize: 22, fontFamily: 'Courier New, monospace', fontWeight: 'bold', minWidth: 30, textAlign: 'center' }}>{2}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'row', gap: 10, marginBottom: 10, width: 260, justifyContent: 'center' }}>
                        <Button className="calc-shortcut-btn" style={{ background: 'linear-gradient(90deg, #ff007a, #9b00e6)', color: '#fff', border: 'none', minWidth: 50 }} onClick={() => setAmount(5)}>$5</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'linear-gradient(90deg, #ff007a, #9b00e6)', color: '#fff', border: 'none', minWidth: 50 }} onClick={() => setAmount(8)}>$8</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'linear-gradient(90deg, #ff007a, #9b00e6)', color: '#fff', border: 'none', minWidth: 50 }} onClick={() => setAmount(58)}>$58</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'linear-gradient(90deg, #ff007a, #9b00e6)', color: '#fff', border: 'none', minWidth: 50 }} onClick={() => setAmount(10000)}>MAX</Button>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 8, width: 260 }}>
                        {[7, 8, 9, 4, 5, 6, 1, 2, 3].map((num) => (
                          <Button key={num} className="calc-shortcut-btn" style={{ background: 'rgba(0,0,0,0.12)', color: '#fff', border: '1px solid #a21caf', fontSize: 18, minWidth: 50 }} onClick={() => setAmount(Number(String(amount) === '0' ? String(num) : String(amount) + String(num)))}>{num}</Button>
                        ))}
                        <Button className="calc-shortcut-btn" style={{ background: 'rgba(0,0,0,0.12)', color: '#fff', border: '1px solid #a21caf', fontSize: 18, minWidth: 50 }} onClick={() => setAmount(Number(String(amount) + '0'))}>0</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'rgba(0,0,0,0.12)', color: '#fff', border: '1px solid #a21caf', fontSize: 18, minWidth: 50 }} onClick={() => setAmount(Number(String(amount) + '.'))}>.</Button>
                        <Button className="calc-shortcut-btn" style={{ background: 'rgba(0,0,0,0.12)', color: '#fff', border: '1px solid #a21caf', fontSize: 18, minWidth: 50 }} onClick={() => setAmount(Math.floor(amount / 10))}>DEL</Button>
                      </div>
                    </div>
                  </div>
                )}
                {/* <Button onClick={handlePriceIncrease} className="control-btn">+</Button> */}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                {/* Hide + and - buttons for amount control on mobile view */}
                {!isMobile && (
                  <>
                    <div className="date-btns" onClick={handlePriceDecrease} style={{
                      background: 'linear-gradient(90deg, #c41a6b, #390452)',
                      padding: '2px 38px',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      color: '#fff',
                      fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                    }}>
                      -
                    </div>
                    <div className="date-btns" onClick={handlePriceIncrease} style={{
                      background: 'linear-gradient(90deg, #c41a6b, #390452)',
                      padding: '2px 38px',
                      borderRadius: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      color: '#fff',
                      fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4
                    }}>
                      +
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Only show date-btn on desktop */}

          {selectedOption ? (
            <div onClick={() => setSelectedOption(null)}
              className="text-center w-100 fw-bold binary-time-ico cursor-pointer"
              style={{
                paddingBlock: "0.39rem", backgroundColor:
                  "rgba(255, 0, 122, 0.8)"
                , borderRadius: "5px"
              }}>
              <i className="ri-close-fill" style={{ fontSize: "24px" }}></i>

            </div>
          ) : (
            <>
              {!isMobile && (
                <Button className="date-btn" onClick={toggleTimePickerModel}>{t("BY TIME & DATE")}</Button>
              )}
            </>

          )}
          {/* profite section */}
          <div data-mobile-visible="profit-section" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#271330ff',
            borderRadius: 9999,
            padding: '12px 8px',
            color: '#fff',
            fontFamily: 'sans-serif',
            fontSize: 10,
            width: '100%',
            maxWidth: 365
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ opacity: 0.7 }}>{t("PAYOUT")}</div>

              <div style={{ fontWeight: 'normal' }}>${(symbolPercentage * price) / 100 + amount}</div>
            </div>
            <div style={{ color: '#22c55e', fontWeight: 'bold', fontSize: 18 }}>
              +{symbolPercentage}%
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ opacity: 0.7 }}>{t("PROFIT")}</div>
              <div style={{ fontWeight: 'normal' }}>${(symbolPercentage * price) / 100}</div>
            </div>
          </div>


          <div className="buy-sell-wrapper">
            {symbolMarketActive ? (
              <>
                <button
                  className="action-btn buy-btn"
                  onClick={() => {
                    setBuy(true);
                    selectedOption && setSelectedOption(null);
                    let currentPair = symbolMarketActive?.symbol || '';
                    if (symbolMarketActive && symbolMarketActive.symbol) {
                      currentPair = symbolMarketActive.symbol;
                    }
                    setModalData({
                      pair: currentPair,
                      forecast: 'BUY',
                      amount: `${amount}$`,
                    });
                    setIsCustomModalOpen(true);
                    setBuy(true);
                    if (selectedOption) {
                      handlePlacePendingOrder("call");
                    } else {
                      handlePlaceOrder("call");
                    }
                  }}
                  disabled={
                    // orderCount >= 10 ||
                    !symbolMarketActive
                  }
                >
                  {
                    selectedOption ? t("BUY(Pending)") : t("BUY")
                  }
                </button>
                <div>
                  {
                    isMobile && (
                      <div onClick={toggleTimePickerModel} className="text-center w-10 fw-bold binary-time-ico cursor-pointer"
                        style={{ borderRadius: "5px" }}>
                        <i className="ri-time-fill" style={{ fontSize: "24px" }}></i>
                      </div>
                    )
                  }
                </div>
                <button className="action-btn sell-btn" onClick={() => {
                  setBuy(false);
                  selectedOption && setSelectedOption(null);
                  let currentPair = symbolMarketActive?.symbol || '';
                  if (symbolMarketActive && symbolMarketActive.symbol) {
                    currentPair = symbolMarketActive.symbol;
                  }
                  setModalData({
                    pair: currentPair,
                    forecast: 'SELL',
                    amount: `${amount}$`,
                  });
                  setIsCustomModalOpen(true);
                  if (selectedOption) {
                    handlePlacePendingOrder("put");
                  } else {
                    handlePlaceOrder("put");
                  }
                }}
                  disabled={
                    // orderCount >= 10 
                    // ||
                    !symbolMarketActive}>
                  {
                    selectedOption ? t("SELL(Pending)") : t("SELL")

                  }
                </button>
                {/* <h3 className="d-none d-md-block" style={{ color: 'white', padding: '10px', borderRadius: '5px', fontSize: '16px' }}>{t("Profit")}: + {(symbolPercentage * price) / 100}</h3> */}
              </>
            ) : (
              <div className="text-center text-danger mt-2 fw-bold" style={{ fontSize: '24px' }}>
                <i className="ri-error-warning-fill"></i> Market is Closed for this Symbol.
              </div>
            )}
          </div>
        </div>

        <TimePickerModal isOpen={timePickerModel}
          toggle={toggleTimePickerModel}
          onSelectionChange={setSelectedOption} />

      </div >
    </>
  );
};

export default SideCalculator;