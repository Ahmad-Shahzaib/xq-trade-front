import React, { useEffect, useMemo, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";
import TimePicker from "react-time-picker";
import { setClickedSymbolData } from "../../../rtk/slices/tradingSlice/tradingSlice";
import { Button, Alert, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, FormGroup, Input, Label, Row, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { fetchMarketDataHistory } from "../../../rtk/slices/marketDataHistorySlice/marketDataHistorySlice";
import { addTrade, placeOrder, removeTrade } from "../../../rtk/slices/orderSlice/orderSlice";
import { clearLatestClosedOrder, clearLatestOrderResult, deductBalanceImmediately, listenForOrderCloseUpdates, refundBalance, updateSelectedAccountBalance } from "../../../rtk/slices/accountTypeSlice/accountTypeSlice";
import { isTypedArray } from "lodash";
import TimePickerModal from './TimePickerModal'
import { getSymbolDetails, symbolFullNames } from "./funtion";
import { placePendingOrder } from "../../../rtk/slices/pendingOrderSlice/pendingOrderSlice";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { token } from '../../../utils/config';
import { getAllSymbols } from "../../../rtk/slices/crm-slices/allSymbols/getAllSymbolsSlice";

import IndicatorsSettings from "./IndicatorsSettings";
import { toast, ToastContainer } from "react-toastify";
import socket from "../../../utils/socket";

function calculateRSI(data, period = 14) {
  let gains = 0, losses = 0;
  const rsi = [];

  for (let i = 1; i < data.length; i++) {
    const change = data[i].close - data[i - 1].close;
    if (change >= 0) gains += change;
    else losses -= change;

    if (i >= period) {
      const avgGain = gains / period;
      const avgLoss = losses / period;
      const rs = avgGain / (avgLoss || 1);
      const rsiValue = 100 - 100 / (1 + rs);
      rsi.push({ time: data[i].time, value: parseFloat(rsiValue.toFixed(2)) });

      const oldChange = data[i - period + 1].close - data[i - period].close;
      if (oldChange >= 0) gains -= oldChange;
      else losses += oldChange;
    }
  }

  return rsi;
}

function calculateMACD(data, fastPeriod = 12, slowPeriod = 26) {
  const fast = calculateEMA(data, fastPeriod);
  const slow = calculateEMA(data, slowPeriod);
  const macd = [];
  for (let i = 0; i < fast.length && i < slow.length; i++) {
    macd.push({ time: fast[i].time, value: parseFloat((fast[i].value - slow[i].value).toFixed(4)) });
  }
  return macd;
}

function calculateBB(data, period = 20) {
  const upper = [], lower = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const mean = slice.reduce((sum, d) => sum + d.close, 0) / period;
    const variance = slice.reduce((sum, d) => sum + Math.pow(d.close - mean, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    upper.push({ time: data[i].time, value: parseFloat((mean + 2 * stdDev).toFixed(4)) });
    lower.push({ time: data[i].time, value: parseFloat((mean - 2 * stdDev).toFixed(4)) });
  }
  return { upper, lower };
}


function calculateEMA(data, period = 14) {
  const ema = [];
  let k = 2 / (period + 1);
  let emaPrev;

  data.forEach((point, index) => {
    const price = point.close;
    if (index === 0) {
      emaPrev = price;
    } else {
      emaPrev = price * k + emaPrev * (1 - k);
    }

    ema.push({
      time: point.time,
      value: parseFloat(emaPrev.toFixed(4)),
    });
  });

  return ema;
}

function calculateATR(data, period = 14) {
  const atr = [];
  for (let i = 1; i < data.length; i++) {
    const currentHigh = data[i].high;
    const currentLow = data[i].low;
    const previousClose = data[i - 1].close;
    const trueRange = Math.max(
      currentHigh - currentLow,
      Math.abs(currentHigh - previousClose),
      Math.abs(currentLow - previousClose)
    );
    atr.push(trueRange);
  }

  const atrResult = [];
  for (let i = period - 1; i < atr.length; i++) {
    const sum = atr.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
    atrResult.push({ time: data[i + 1].time, value: sum / period });
  }
  return atrResult;
}
function calculateStochastic(data, period = 14) {
  const kLine = [];
  const dLine = [];

  for (let i = period - 1; i < data.length; i++) {
    const highSlice = data.slice(i - period + 1, i + 1).map(d => d.high);
    const lowSlice = data.slice(i - period + 1, i + 1).map(d => d.low);
    const highestHigh = Math.max(...highSlice);
    const lowestLow = Math.min(...lowSlice);
    const currentClose = data[i].close;
    const percentK = ((currentClose - lowestLow) / (highestHigh - lowestLow)) * 100;
    kLine.push({ time: data[i].time, value: percentK });

    if (kLine.length >= 3) {
      const last3K = kLine.slice(-3).map(p => p.value);
      const avgD = last3K.reduce((acc, val) => acc + val, 0) / 3;
      dLine.push({ time: data[i].time, value: avgD });
    }
  }

  return { kLine, dLine };
}
function calculateWMA(data, period = 14) {
  const wma = [];
  const denominator = (period * (period + 1)) / 2;
  for (let i = period - 1; i < data.length; i++) {
    let weightedSum = 0;
    for (let j = 0; j < period; j++) {
      weightedSum += data[i - j].close * (period - j);
    }
    wma.push({ time: data[i].time, value: weightedSum / denominator });
  }
  return wma;
}
function calculateVolume(data) { }
function calculateSMA(data, period = 14) {
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
    sma.push({ time: data[i].time, value: sum / period });
  }
  return sma;
}



export const seriesTypes = ['Candlestick', 'Area', 'Bar', 'Baseline', 'Histogram', 'Line'];
export const timeframes = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1h": 3600,
  "1D": 86400
};


const TradingViewChart2 = () => {
  const location = useLocation();
  const terminalPath = location.pathname === "/dashboard";

  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);

  const toggleModal = (val) => {
    setModal(!modal)
    setSelectedIndicator(val);
  };
  // const toggleModal2 = () => setModal(!modal);

  const chartContainerRef = useRef(null);
  const tooltipRef = useRef(null);
  const dispatch = useDispatch();
  const chartRef = useRef(null);

  const seriesRef = useRef(null);
  const lastCandleRef = useRef(null);
  const lastFetchRef = useRef(0);
  const visibleRangeRef = useRef(null);
  const markersRef = useRef([]);
  const orderTimersRef = useRef({});

  const [isMobile, setIsMobile] = useState(window.innerWidth < 520);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1m");
  const [selectedSeriesType, setSelectedSeriesType] = useState("Candlestick");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectDropdownOpen, setSelectDropdownOpen] = useState(false);
  const [seriesDropdownOpen, setSeriesDropdownOpen] = useState(false);
  const [bars, setbars] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [ohlcData, setOhlcData] = useState({ open: 0, high: 0, low: 0, close: 0, time: null, color: "#2DA479" });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipData, setTooltipData] = useState(null);
  const latestOrderResult = useSelector((state) => state.accountType.latestOrderResult);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [paymentAlertVisible, setPaymentAlertVisible] = useState(false);
  const [nullAccountAlertVisible, setNullAccountAlertVisible] = useState(false);
  const [timePickerModel, setTimePickerModel] = useState(false);
  const [open, setOpen] = useState(false);
  const [timePK, setTimePK] = useState("10:00");
  const [selectedOption, setSelectedOption] = useState(null);
  // const [orderSuccessAlert, setOrderSuccessAlert] = useState(false);

  const [orderSuccessAlertPending, setOrderSuccessAlertPending] = useState(false);

  // --- Indicator State and Refs ---
  const [indicatorDropdownOpen, setIndicatorDropdownOpen] = useState(false);
  const [activeIndicators, setActiveIndicators] = useState([]);
  const [emaPeriod, setEmaPeriod] = useState(14);
  const [smaPeriod, setSmaPeriod] = useState(14);
  const [wmaPeriod, setWmaPeriod] = useState(14);
  const [emaLineColor, setEmaLineColor] = useState();
  const [smaLineColor, setSmaLineColor] = useState();
  const [wmaLineColor, setWmaLineColor] = useState();
  const [bbPeriod, setBbPeriod] = useState(20);

  const storedAccount = localStorage.getItem("selectedAccount");
  const parsedAccount = JSON.parse(storedAccount);
  let tradeGroupName = parsedAccount?.trade_group_detail?.name || "";
  function handleSettings(val) {
     console.log('indicator settings changed', val);
    switch (val.indicatorName) {
     
      case 'EMA':
        setEmaPeriod(localStorage.setItem("emaPeriod", val.periodVal));
        setEmaLineColor(localStorage.setItem("emaLineColor", val.lineColor));
      case 'SMA':
        setSmaPeriod(localStorage.setItem("smaPeriod", val.periodVal));
        setSmaLineColor(localStorage.setItem("smaLineColor", val.lineColor));
      case 'WMA':
        setWmaPeriod(localStorage.setItem("wmaPeriod", val.periodVal));
        setWmaLineColor(localStorage.setItem("wmaLineColor", val.lineColor));
    }
  };




  const emaSeriesRef = useRef(null);
  const smaSeriesRef = useRef(null);
  const wmaSeriesRef = useRef(null);

  const bbUpperSeriesRef = useRef(null);
  const bbLowerSeriesRef = useRef(null);




  // --- Indicator Toggle Helper ---
  const toggleIndicator = (indicator) => {
    if (activeIndicators.includes(indicator)) {
      setActiveIndicators(prev => prev.filter(ind => ind !== indicator));
    } else {
      setActiveIndicators(prev => [...prev, indicator]);
    }
  };

  // --- Clear All Indicators ---
  const clearAllIndicators = () => {
    setActiveIndicators([]);
  };


  const [orderErrorAlertPending, setOrderErrorAlertPending] = useState(null);

  const [time, setTime] = useState(() => {
    return parseInt(localStorage.getItem("selectedTime"), 10) || 60;
  });

  const toggleTimePickerModel = () => {
    setTimePickerModel(!timePickerModel)
  };

  // const [seconds, setSeconds] = useState(60);
  const [showTimePicker, setShowTimePicker] = useState(false);


  const [price, setPrice] = useState(() => {
    return parseInt(localStorage.getItem("selectedPrice"), 10) || 100;
  });
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedSymbol = useSelector((state) => state.trading.clickedSymbolData) || "BTCUSD";
  const { selectedAccount } = useSelector((state) => state.accountType);
  const symbols = useSelector((state) => state.trading.symbols);
  const symbolNames = useSelector((state) => state.symbols.symbols);
  const layoutMode = useSelector((state) => state.Layout.layoutModeType);
  const { data, status } = useSelector((state) => state.marketDataHistory);
  const selectedSymbolBid = useSelector((state) => state.trading.clickedSymbolBid);
  const { tradeAccount } = useSelector((state) => state.tradeAccountsList)
  const orderFailedMessage = useSelector((state) => state.order.orderFailedMessage);
  // const  binaryResponse  = useSelector((state) => state.order.binaryResponse);
  const latestClosedOrder = useSelector(state => state.accountType.latestClosedOrder);

  const allSymbols = useSelector((state) => state.getAllSymbols.getAllSymbols);
  const [percentage, setPercentage] = useState([]);
  const [symbolPercentage, setSymbolPercentage] = useState(null);
  const [marketActive, setMarketActive] = useState([]);
  const [symbolMarketActive, setSymbolMarketActive] = useState(null);
  const [testResponse, setTestResponse] = useState(null);
  const handledOrderIdsRef = useRef(new Set());

  // console.log('symbols', symbols);
  // console.log('symbolNames', symbolNames);


  useEffect(() => {
    // Local cache to avoid reprocessing the same order
    // const handledOrderIdsRef = useRef(new Set());

    // Load from localStorage
    let storedOrders = JSON.parse(localStorage.getItem("activeTrades") || "[]");

    // Remove any duplicates by ID
    storedOrders = storedOrders.filter(
      (order, index, self) => index === self.findIndex(o => o.id.toString() === order.id.toString())
    );

    // Handle latestClosedOrder once
    if (latestClosedOrder && latestClosedOrder.id) {
      const orderId = latestClosedOrder.id.toString();
      const alreadyHandled = handledOrderIdsRef.current.has(orderId);
      const alreadyExists = storedOrders.some(o => o.id.toString() === orderId);

      if (!alreadyHandled && !alreadyExists) {
        const expiryTime = Date.now() + latestClosedOrder.duration * 1000;
        const remainingTime = Math.floor((expiryTime - Date.now()) / 1000);

        const newOrder = {
          id: orderId,
          symbol: latestClosedOrder.symbol,
          type: latestClosedOrder.direction === 'call' ? "BUY" : "SELL",
          price: latestClosedOrder.last_price,
          amount: latestClosedOrder.amount,
          initialPrice: symbols[latestClosedOrder.symbol]?.bid || latestClosedOrder.last_price,
          time: expiryTime,
          createdAt: Date.now(),
          remainingTime,
        };

        storedOrders.push(newOrder);
        dispatch(addTrade(newOrder));
        handledOrderIdsRef.current.add(orderId);
        dispatch(clearLatestClosedOrder()); // ✅ prevent reprocessing
      }
    }

    // Filter out expired orders
    const validOrders = storedOrders.map(order => {
      const remaining = Math.floor((order.time - Date.now()) / 1000);
      return {
        ...order,
        remainingTime: remaining > 0 ? remaining : 0
      };
    }).filter(order => order.remainingTime > 0);

    // Save and set state
    setActiveOrders(validOrders);
    localStorage.setItem("activeTrades", JSON.stringify(validOrders));

    validOrders.forEach(order => {
      const orderId = order.id;

      // Prevent duplicate timers
      if (!orderTimersRef.current[orderId]) {
        startOrderTimer(orderId, order.remainingTime);
      }

      // Remove after expiry
      setTimeout(() => {
        console.log(`⏰ Order ${orderId} expired and is removed`);

        setActiveOrders(prev => {
          const updated = prev.filter(o => o.id !== orderId);
          localStorage.setItem("activeTrades", JSON.stringify(updated));
          return updated;
        });

        dispatch(removeTrade(orderId));
        setOrderCount(prev => prev - 1);
      }, order.remainingTime * 1000);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latestClosedOrder]);
  // Include symbols so bid price is always available



  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      dispatch(getAllSymbols(storedToken));
    }
  }, [dispatch, token]);

  useEffect(() => {
    setPercentage(allSymbols);
    setMarketActive(allSymbols);
  }, [allSymbols]);

  useEffect(() => {
    if (percentage?.length && selectedSymbol) {
      const found = percentage?.find(p => p.symbol === selectedSymbol);
      setSymbolPercentage(found?.profit_percentage ?? 0);
    }

    if (marketActive?.length && selectedSymbol) {
      const marketFound = marketActive?.find(p => p.symbol === selectedSymbol);
      setSymbolMarketActive(marketFound?.isActive ?? false);
    }
  }, [percentage, selectedSymbol, marketActive]);

  // console.log('type of selected symbol market status', typeof(symbolMarketActive))


  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("activeIndicators")) || [];
    setActiveIndicators(stored);
    setEmaPeriod(Number(localStorage.getItem("emaPeriod")) || 14);
    const emaLineColor = localStorage.getItem("emaLineColor");
    if (emaLineColor) {
      setEmaLineColor(emaLineColor);
    }

    setSmaPeriod(Number(localStorage.getItem("smaPeriod")) || 14);
    const smaLineColor = localStorage.getItem("smaLineColor")
    if (smaLineColor) {

      setSmaLineColor(smaLineColor);
    }

    setWmaPeriod(Number(localStorage.getItem("wmaPeriod")) || 14);
    const wmaLineColor = localStorage.getItem("wmaLineColor")
    if (wmaLineColor) {
      setWmaLineColor(wmaLineColor);
    }
    setBbPeriod(Number(localStorage.getItem("bbPeriod")) || 20);

  }, []);



  const historyBarData = data?.data

  const mappedData = useMemo(() => {
    if (!historyBarData || !Array.isArray(historyBarData) || historyBarData.length === 0) return [];

    const seenTimes = new Set();
    const processedData = historyBarData
      .map(item => {

        const formattedTime = Math.floor(new Date(item.time).getTime() / 1000); // Convert to Unix timestamp

        return {
          time: formattedTime,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        }
      })
      .filter(item => {
        if (seenTimes.has(item.time)) return false;
        seenTimes.add(item.time);
        return true;
      })
      .sort((a, b) => a.time - b.time);

    // return processedData?.length > 0 ? processedData : [];
    return processedData.length > 0 ? processedData.slice(0, -1) : [];
  }, [data]);

  useEffect(() => {
    if (!chartRef.current || mappedData.length === 0) return;

    // Recalculate and update all active indicators
    activeIndicators.forEach((indicator) => {
      if (indicator === 'EMA' && emaSeriesRef.current) {
        const emaData = calculateEMA(mappedData, emaPeriod);
        emaSeriesRef.current.setData(emaData);
      }
      if (indicator === 'SMA' && smaSeriesRef.current) {
        const smaData = calculateSMA(mappedData, smaPeriod);
        smaSeriesRef.current.setData(smaData);
      }
      if (indicator === 'WMA' && wmaSeriesRef.current) {
        const wmaData = calculateWMA(mappedData, wmaPeriod);
        wmaSeriesRef.current.setData(wmaData);
      }
      if (indicator === 'BollingerBands') {
        const { upper, lower } = calculateBB(mappedData, bbPeriod);
        if (bbUpperSeriesRef.current) bbUpperSeriesRef.current.setData(upper);
        if (bbLowerSeriesRef.current) bbLowerSeriesRef.current.setData(lower);
      }

    });
  }, [lastCandleRef, mappedData, activeIndicators, emaPeriod, smaPeriod, wmaPeriod, bbPeriod]);

  useEffect(() => {
    localStorage.setItem("activeIndicators", JSON.stringify(activeIndicators));

  }, [
    activeIndicators,
    emaPeriod,
    emaLineColor,
    smaPeriod,
    smaLineColor,
    wmaPeriod,
    wmaLineColor,
    bbPeriod
  ]);

  const derivedSymbols = useMemo(() => {
    if (!symbolNames?.length) return null;
    const obj = {};
    symbolNames.forEach(name => {
      obj[name] = {}; // placeholder to mimic the shape
    });
    return obj;
  }, [symbolNames]);


  const filteredOptions = useMemo(() => {
    return derivedSymbols
      ? Object.keys(derivedSymbols)
        .filter(symbolKey => symbolKey.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(symbolKey => {
          const { icon, color } = getSymbolDetails(symbolKey);
          const percentObj = percentage?.find(p => p.symbol === symbolKey);

          return {
            value: symbolKey,
            icon,
            color,
            percent: percentObj?.profit_percentage ?? 0
          };
        })
      : [];
  }, [derivedSymbols, percentage, searchTerm]);

  const selected = selectedSymbol || 'BTCUSD';
  const { icon, color } = getSymbolDetails(selected);

  function getSymbolFullName(symbol) {
    return symbolFullNames[symbol.replace(".ex1", "")] || symbol;
  }

  const handleSelectChange = (selectedOption) => {
    if (!selectedOption) return;
    console.log('selected symbol options', selectedOption)
    const newSymbol = selectedOption.value;
    localStorage.setItem("selectedSymbol", newSymbol); // ← Save to localStorage

    // const fullName = getSymbolFullName(selectedOption.value);
    // document.getElementById("chart-title").innerText = fullName;

    setbars(100);
    visibleRangeRef.current = null;
    dispatch(setClickedSymbolData(newSymbol));

    // Clear existing chart data
    if (seriesRef.current) {
      seriesRef.current.setData([]);
    }

    // Reset last candle reference to prevent bridging between symbols
    lastCandleRef.current = null;

    socket.disconnect();                    // Close existing connection
    socket.symbols = [newSymbol];           // Set only the selected symbol
    socket.connect();

    if (selectedSeriesType !== "Line") {
      dispatch(fetchMarketDataHistory({ symbol: newSymbol, timeframe: 'M1', bars: 100 }));
    }

  };

  useEffect(() => {
    const savedSymbol = localStorage.getItem("selectedSymbol");
    if (savedSymbol) {
      dispatch(setClickedSymbolData(savedSymbol));
    }
  }, [dispatch]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSelectDropdown = () => setSelectDropdownOpen(!selectDropdownOpen);
  const toggleSeriesDropdown = () => setSeriesDropdownOpen(!seriesDropdownOpen);

  const formatTime = (totalSeconds) => {
    if (totalSeconds < 60) {
      return `${totalSeconds}sec`;
    } else if (totalSeconds < 3600) {
      const minutes = Math.floor(totalSeconds / 60);
      return `${minutes}min`;
    } else {
      const hours = Math.floor(totalSeconds / 3600);
      return `${hours}h`;
    }
  };

  // Function to save time to localStorage
  const saveTimeToLocalStorage = (newTime) => {
    localStorage.setItem("selectedTime", newTime);
  };

  // Function to save price to localStorage
  const savePriceToLocalStorage = (newPrice) => {
    localStorage.setItem("selectedPrice", newPrice);
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

  const handlePriceIncrease = () => {
    const newPrice = price + 1;
    setPrice(newPrice);
    savePriceToLocalStorage(newPrice);  // ✅ Save to localStorage
  };

  const handlePriceDecrease = () => {
    const newPrice = price > 1 ? price - 1 : 1;
    setPrice(newPrice);
    savePriceToLocalStorage(newPrice);  // ✅ Save to localStorage
  };

  const handleInputChange = (e) => {
    let value = e.target.value.replace(/[^0-9]/g, ""); // Allow only numbers
    const newPrice = value ? parseInt(value, 10) : 0;
    setPrice(newPrice);
    savePriceToLocalStorage(newPrice);  // ✅ Save to localStorage
  };

  const handleBlur = () => {
    if (price === "" || isNaN(price) || price < 1) {
      setPrice(1); // Reset to 1 if empty or invalid
    }
  };

  const handleScreenshot = () => {
    if (chartRef.current) {
      const canvas = chartRef.current.takeScreenshot();
      const link = document.createElement('a');
      link.download = `${selectedSymbol}-${selectedTimeframe}-${new Date().toISOString()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const createSeries = (chart, type) => {
    const isDarkMode = layoutMode === "dark";
    let decimalPlaces;
    if (!selectedSymbolBid || isNaN(selectedSymbolBid)) {
      decimalPlaces = 2
    }
    else {
      decimalPlaces = selectedSymbolBid?.toString().split('.')[1]?.length
    }

    const commonOptions = {
      upColor: "#28bd66",
      downColor: "#ff5765",
      wickUpColor: "#28bd66",
      wickDownColor: "#ff5765",
      priceFormat: {
        type: 'custom',
        minMove: Math.pow(10, -decimalPlaces),
        formatter: (price) => price.toFixed(decimalPlaces),
      },
    };

    switch (type) {
      case 'Candlestick':
        return chart.addCandlestickSeries({
          ...commonOptions,
          borderVisible: false,
        });
      case 'Area':
        return chart.addAreaSeries({
          lineColor: isDarkMode ? "#2962FF" : "#2962FF",
          topColor: isDarkMode ? "rgba(41, 98, 255, 0.3)" : "rgba(41, 98, 255, 0.3)",
          bottomColor: isDarkMode ? "rgba(41, 98, 255, 0)" : "rgba(41, 98, 255, 0)",
        });
      case 'Bar':
        return chart.addBarSeries(commonOptions);
      case 'Baseline':
        return chart.addBaselineSeries({
          baseValue: { type: 'price', price: 0 },
          topLineColor: "#26a69a",
          bottomLineColor: "#ef5350",
        });
      case 'Histogram':
        return chart.addHistogramSeries({
          color: "#26a69a",
          base: 0,
          priceFormat: {
            type: 'volume',
          },
          priceLineVisible: false,
          lastValueVisible: false,
        });
      case 'Line':
        return chart.addLineSeries({
          color: isDarkMode ? "#2962FF" : "#2962FF",
          lineWidth: 2,
        });
      default:
        return chart.addCandlestickSeries(commonOptions);
    }
  };

  const transformData = (data, type) => {
    if (!Array.isArray(data) || data.length === 0) return [];

    return data.map(candle => {
      switch (type) {
        case 'Candlestick':
        case 'Bar':
          return {
            time: candle.time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          };
        case 'Area':
        case 'Line':
        case 'Baseline':
          return {
            time: candle.time,
            value: candle.close,
          };
        case 'Histogram':
          const change = candle.close - candle.open;
          return {
            time: candle.time,
            value: Math.abs(change),
            color: change >= 0 ? "#26a69a" : "#ef5350",
          };
        default:
          return candle;
      }
    });
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handlePlaceOrder = async (type) => {

    if (!symbols) {
      toast.error("Market data not available.");
    }

    const storedAccount = localStorage.getItem("selectedAccount");
    const selectedAccountLocal = storedAccount ? JSON.parse(storedAccount) : null;

    if (!selectedAccount && tradeAccount?.data?.length <= 0 || selectedAccountLocal.balance == null) {
      setNullAccountAlertVisible(true)
      return
    }

    if (orderCount >= 10) {
      showToastMessage("Maximum order limit reached (10/10)");
      return;
    }

    if (selectedAccount?.balance < price) {
      setPaymentAlertVisible(true);
      return;
    }



    if (selectedSymbol && selectedAccount) {
      const orderPayload = {
        trade_account_id: selectedAccount?.id,
        symbol: selectedSymbol,
        stake: price,
        direction: type,
        expiry_seconds: time,
      };

      // 🔹 Deduct balance immediately
      dispatch(deductBalanceImmediately(price));

      // 🔹 Place order API call and pass `handleAddPointer` as callback
      dispatch(placeOrder({ orderPayload }))
        .then((response) => {
          if (response.meta.requestStatus === 'fulfilled') {
            setTestResponse(response?.payload?.testResponse)

            handleAddPointer(type, response?.payload?.testResponse);  // ✅ Start timer only on success
          } else {
            console.error("❌ Order API Failed:", response.error);
            dispatch(refundBalance(price)); // ✅ Refund if API fails
          }
        });
    }
  };

  const handlePlacePendingOrder = async (type) => {
    // console.log('selectedOption', selectedOption);

    let selectedOptionValue = selectedOption.type === "time" ? selectedOption.value : selectedOption.value

    let execution_Date = ""
    if (selectedOption.type === "time") {
      const [hours, minutes] = selectedOption.value.split(':');
      const now = new Date();
      const executionDate = new Date(Date.UTC(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        parseInt(hours),
        parseInt(minutes),
        0 // seconds
      ));

      // Get ISO format
      execution_Date = executionDate.toISOString();
    }

    const storedAccount = localStorage.getItem("selectedAccount");
    const selectedAccountLocal = storedAccount ? JSON.parse(storedAccount) : null;

    if ((!selectedAccount && tradeAccount?.data?.length <= 0) || selectedAccountLocal?.balance == null) {
      setNullAccountAlertVisible(true);
      return;
    }

    if (selectedAccount?.balance < price) {
      setPaymentAlertVisible(true);
      return;
    }

    const { bid } = symbols[selectedSymbol];

    if (selectedSymbol && selectedAccount) {

      let orderPayload;
      if (selectedOption.type === "time") {
        orderPayload = {
          trade_account_id: selectedAccount?.id,
          symbol: selectedSymbol,
          stake: price,
          direction: type,
          expiry_seconds: time,
          execution_time: execution_Date,
          order_type: "pending",
          order_place_at: selectedOptionValue,
          binary_response: {
            stake: price,
            strike_price: price,
            direction: type,
          }
        }
      } else if (selectedOption.type === "price") {
        orderPayload = {
          trade_account_id: selectedAccount?.id,
          symbol: selectedSymbol,
          stake: price,
          direction: type,
          expiry_seconds: time,
          trigger_price: selectedOptionValue,
          order_type: "pending",
          order_place_at: selectedOptionValue,
          binary_response: {
            stake: price,
            strike_price: price,
            direction: type,
          }
        }
      }
      console.log("selected option type", selectedOption.type)

      // 🔹 Place order API call first before deducting balance
      dispatch(placePendingOrder({ type: selectedOption?.type, orderPayload })).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          dispatch(deductBalanceImmediately(price)); // ✅ Deduct balance only if success
          setSelectedOption(null);
          setOrderSuccessAlertPending(true);
          setOrderErrorAlertPending(null);

          // ✅ Auto-hide after 3 seconds
          setTimeout(() => setOrderSuccessAlertPending(false), 3000);
        } else {
          console.error("❌ Order API Failed:", response.error);
          setSelectedOption(null);
          dispatch(refundBalance(price)); // ✅ Refund if API fails
          setOrderErrorAlertPending(response.error?.message || "Failed to place order!");

          // ✅ Auto-hide after 3 seconds
          setTimeout(() => setOrderErrorAlertPending(null), 3000);
        }
      });
    }
  };

  useEffect(() => {
    if (selectedAccount?.id) {
      dispatch(listenForOrderCloseUpdates(selectedAccount.id));
    }
  }, [selectedAccount, dispatch]);

  // useEffect(() => {
  //   if (!latestOrderResult) return; // ✅ Avoid running on initial mount if null


  //   setAlertVisible(true);

  //   const timer = setTimeout(() => {
  //     setAlertVisible(false);
  //     dispatch(clearLatestOrderResult()); // ✅ Reset latestOrderResult in Redux
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [latestOrderResult, dispatch]);




  useEffect(() => {
    if (!latestOrderResult) return;

    const newAlert = {
      id: Date.now(),
      result: latestOrderResult,
    };

    setAlerts(prev => [...prev, newAlert]);
    dispatch(clearLatestOrderResult());

    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
    }, 5000);
  }, [latestOrderResult, dispatch]);


  const getExpirySeconds = (placedTime, expiryTime) => {
    const placed = new Date(placedTime).getTime();
    const expiry = new Date(expiryTime).getTime();
    const diff = Math.floor((expiry - placed) / 1000);
    return diff > 0 ? diff : 0;
  };



  const handleAddPointer = (type, testResponse) => {
    if (orderCount >= 10) {
      showToastMessage("Maximum order limit reached (10/10)");
      return;
    }

    let orderType = null;
    if (type === 'put') {
      orderType = "SELL";
    } else if (type === 'call') {
      orderType = "BUY";
    }

    if (!chartRef.current || !seriesRef.current) return;

    const { bid } = symbols[selectedSymbol];
    const currentTime = Math.floor(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      new Date().getUTCHours(),
      new Date().getUTCMinutes(),
      new Date().getUTCSeconds()
    ) / 1000);

    const currentTimeGMT2 = currentTime + 25200;

    const timeframeSeconds = timeframes[selectedTimeframe];
    const alignedTime = Math.floor(currentTimeGMT2 / timeframeSeconds) * timeframeSeconds;

    // const orderId = Date.now().toString();
    const orderId = testResponse?.trade_id.toString(); // ✅ Use same ID for marker and order

    const expiryTime = time;


    const remainingTime = getExpirySeconds(testResponse?.placed_time, testResponse?.expiry_time);
    startOrderTimer(testResponse?.trade_id.toString(), remainingTime);


    const newMarker = {
      id: orderId,
      time: alignedTime,
      position: 'aboveBar',
      color: orderType === "SELL" ? 'red' : 'green',
      shape: orderType === "SELL" ? 'arrowDown' : 'arrowUp',
      text: `${orderType} ${testResponse?.strike_price}`,
    };

    // Add new marker to the array
    markersRef.current = [...markersRef.current, newMarker];

    // Update the chart with all markers
    seriesRef.current.setMarkers(markersRef.current);

    const placedAt = Date.now();
    const expiryTimestamp = placedAt + (expiryTime * 1000);  // actual expiry in ms
    const newOrder = {
      id: testResponse?.trade_id.toString(),
      symbol: testResponse?.symbol,
      type: testResponse?.direction === 'call' ? 'BUY' : 'SELL',
      price: testResponse?.strike_price,
      amount: testResponse?.stake,
      initialPrice: bid,
      time: expiryTimestamp,  // ✅ now an absolute time
      createdAt: placedAt,
      remainingTime: expiryTime,
      // createdAt: Date.now(),
    };

    // const newOrder = {
    //   id: orderId,
    //   symbol: selectedSymbol,
    //   type: orderType,
    //   price: bid,
    //   amount: price,
    //   initialPrice: bid,
    //   time: expiryTime,
    //   remainingTime: expiryTime,
    //   createdAt: Date.now(),
    // };


    dispatch(addTrade(newOrder));

    setActiveOrders(prev => [...prev, newOrder]);
    const updatedOrders = [...activeOrders, newOrder];
    localStorage.setItem("activeTrades", JSON.stringify(updatedOrders));
    setOrderCount(prev => prev + 1);

    // Start timer for this order
    startOrderTimer(orderId, expiryTime);

    showToastMessage(`${orderType} order placed at price: ${bid}`);

    return () => {
      // This is the callback that will be called when the API responds
      console.log("Order API callback executed");
    };
  };


  const startOrderTimer = (orderId, duration) => {
    if (orderTimersRef.current[orderId]) return; // already runni
    if (orderTimersRef.current[orderId]) {
      clearInterval(orderTimersRef.current[orderId]);
    }

    orderTimersRef.current[orderId] = setInterval(() => {
      setActiveOrders(prev => {
        const updatedOrders = prev.map(order => {
          if (order.id === orderId) {
            const newRemainingTime = order.remainingTime - 1;

            if (newRemainingTime <= 0) {
              clearInterval(orderTimersRef.current[orderId]);
              delete orderTimersRef.current[orderId];

              // Final result handling
              const currentBid = symbols[order.symbol]?.bid || 0;
              let result = "DRAW";
              if (order.type === "BUY") {
                result = currentBid > order.initialPrice ? "WIN" : (currentBid < order.initialPrice ? "LOSS" : "DRAW");
              } else {
                result = currentBid < order.initialPrice ? "WIN" : (currentBid > order.initialPrice ? "LOSS" : "DRAW");
              }

              removeMarker(orderId);
              showToastMessage(`Order ${order.type} completed: ${result}`);
              return null;
            }

            return { ...order, remainingTime: newRemainingTime };
          }
          return order;
        }).filter(Boolean);

        localStorage.setItem("activeTrades", JSON.stringify(updatedOrders));
        setOrderCount(updatedOrders.length);
        return updatedOrders;
      });
    }, 1000);
  };



  const removeMarker = (orderId) => {

    // Remove from markers array
    markersRef.current = markersRef.current.filter(marker => marker.id !== orderId);

    // Update chart
    if (seriesRef.current) {
      seriesRef.current.setMarkers(markersRef.current);
    }

    // Clear timer if exists
    if (orderTimersRef.current[orderId]) {
      clearInterval(orderTimersRef.current[orderId]);
      delete orderTimersRef.current[orderId];
    }
  };


  const handleSeriesTypeChange = (type) => {
    setSelectedSeriesType(type);
    if (selectedSeriesType !== "Line") {
      if (chartRef.current && seriesRef.current) {
        chartRef.current.removeSeries(seriesRef.current);
        seriesRef.current = createSeries(chartRef.current, type);

        if (selectedSymbol && mappedData.length > 0 && status === 'succeeded') {
          const transformedData = transformData(mappedData, type);
          seriesRef.current.setData(transformedData);
          // === Add EMA Indicator ===       
          // --- Remove all existing series before adding again ---
          if (emaSeriesRef.current) { chartRef.current.removeSeries(emaSeriesRef.current); emaSeriesRef.current = null; }
          if (smaSeriesRef.current) { chartRef.current.removeSeries(smaSeriesRef.current); smaSeriesRef.current = null; }
          if (wmaSeriesRef.current) { chartRef.current.removeSeries(wmaSeriesRef.current); wmaSeriesRef.current = null; }

          if (bbUpperSeriesRef.current) { chartRef.current.removeSeries(bbUpperSeriesRef.current); bbUpperSeriesRef.current = null; }
          if (bbLowerSeriesRef.current) { chartRef.current.removeSeries(bbLowerSeriesRef.current); bbLowerSeriesRef.current = null; }


          // --- Now Add Active Indicators '#FFA500'---
          activeIndicators.forEach(indicator => {
            if (indicator === 'EMA') {
              emaSeriesRef.current = chartRef.current.addLineSeries({ color: emaLineColor, lineWidth: 2 });
              const emaData = calculateEMA(mappedData, emaPeriod);
              emaSeriesRef.current.setData(emaData);
            }
            if (indicator === 'SMA') {
              smaSeriesRef.current = chartRef.current.addLineSeries({ color: smaLineColor, lineWidth: 2 });
              const smaData = calculateSMA(mappedData, smaPeriod);
              smaSeriesRef.current.setData(smaData);
            }
            if (indicator === 'WMA') {
              wmaSeriesRef.current = chartRef.current.addLineSeries({ color: wmaLineColor, lineWidth: 2 });
              const wmaData = calculateWMA(mappedData, wmaPeriod);
              wmaSeriesRef.current.setData(wmaData);
            }
            if (indicator === 'BollingerBands') {
              const { upper, lower } = calculateBB(mappedData, bbPeriod);
              bbUpperSeriesRef.current = chartRef.current.addLineSeries({ color: '#AAAAFF', lineWidth: 1 });
              bbLowerSeriesRef.current = chartRef.current.addLineSeries({ color: '#AAAAFF', lineWidth: 1 });
              bbUpperSeriesRef.current.setData(upper);
              bbLowerSeriesRef.current.setData(lower);
            }

          });


        }

        // Re-add all markers
        if (markersRef.current.length > 0) {
          seriesRef.current.setMarkers(markersRef.current);
        }

        if (lastCandleRef.current) {
          const transformedCandle = transformData([lastCandleRef.current], type)[0];
          seriesRef.current.update(transformedCandle);
        }
      }
    }

  };

  // const formatTooltipDate = (timestamp) => {
  //   const date = new Date(timestamp * 1000);
  //   return date.toLocaleString();
  // };

  const formatTooltipDate = (timestamp) => {
    return new Date(timestamp * 1000).toUTCString(); // Convert to UTC string
  };


  const updateTooltip = (param) => {
    if (!param.time || !param.point || !param.seriesData) {
      setTooltipVisible(false);
      return;
    }

    const coordinate = param.point;
    const data = param.seriesData.get(seriesRef.current);
    if (!data) {
      setTooltipVisible(false);
      return;
    }

    const tooltipContent = {
      time: formatTooltipDate(param.time),
      data: selectedSeriesType === 'Candlestick' || selectedSeriesType === 'Bar'
        ? {
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close,
        }
        : { value: data.value || data.close },
    };

    setTooltipData(tooltipContent);
    setTooltipPosition({
      x: coordinate.x,
      y: coordinate.y,
    });
    setTooltipVisible(true);
  };

  useEffect(() => {
    const storedOrders = localStorage.getItem("activeTrades");
    if (storedOrders) {
      let parsedOrders = JSON.parse(storedOrders);

      parsedOrders = parsedOrders.map(order => {
        const elapsed = Math.floor((Date.now() - order?.createdAt) / 1000);
        const remaining = Math.floor((order.time - Date.now()) / 1000);

        return {
          ...order,
          remainingTime: remaining > 0 ? remaining : 0
        };
      }).filter(order => order.remainingTime > 0);

      setActiveOrders(parsedOrders);

      parsedOrders.forEach(order => {
        startOrderTimer(order.id, order.remainingTime);
      });
    }
  }, []);



  useEffect(() => {
    localStorage.setItem("activeTrades", JSON.stringify(activeOrders));
  }, [activeOrders]);


  useEffect(() => {
    if (!chartRef.current || !seriesRef.current) return;

    const handleCrosshairMove = (param) => {
      updateTooltip(param);

      if (!param || !param.time || !param.seriesData || !param.seriesData.get(seriesRef.current)) {
        if (lastCandleRef.current) {
          setOhlcData({
            open: lastCandleRef.current.open || lastCandleRef.current.close,
            high: lastCandleRef.current.high || lastCandleRef.current.close,
            low: lastCandleRef.current.low || lastCandleRef.current.close,
            close: lastCandleRef.current.close,
            time: lastCandleRef.current.time,
            color: lastCandleRef.current.close >= lastCandleRef.current.open ? "#2DA479" : "#DC3A48"
          });
        }
        return;
      }

      const candle = param.seriesData.get(seriesRef.current);

      let ohlcUpdate;
      if (selectedSeriesType === "Candlestick" || selectedSeriesType === "Bar") {
        ohlcUpdate = {
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        };
      } else {
        ohlcUpdate = {
          open: candle.value,
          high: candle.value,
          low: candle.value,
          close: candle.value,
        };
      }

      setOhlcData({
        ...ohlcUpdate,
        time: param.time,
        color: candle.close >= candle.open ? "#2DA479" : "#DC3A48",
      });
    };

    chartRef.current.subscribeCrosshairMove(handleCrosshairMove);

    return () => {
      chartRef.current.unsubscribeCrosshairMove(handleCrosshairMove);
    };
  }, [seriesRef.current, selectedSeriesType]);

  useEffect(() => {
    if (!chartRef.current) return;

    const handleTimeRangeChange = () => {
      if (!seriesRef.current || mappedData.length === 0 || isLoading || selectedSeriesType === "Line") return;

      const invertedTF = selectedTimeframe.slice(-1).toUpperCase() + selectedTimeframe.slice(0, -1);

      const timeRange = chartRef.current.timeScale().getVisibleRange();
      if (!timeRange) return;

      visibleRangeRef.current = timeRange;

      const firstCandleTime = mappedData[0].time;
      const currentTime = Date.now() / 1000;

      if (
        timeRange.from <= firstCandleTime &&
        currentTime - lastFetchRef.current > 2 &&
        !isLoading
      ) {
        const nextDay = bars + 100;

        setIsLoading(true);
        lastFetchRef.current = currentTime;

        setbars(nextDay);
        dispatch(fetchMarketDataHistory({ symbol: selectedSymbol, timeframe: invertedTF, bars: nextDay }))
          .then(() => {
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
          });
      }
    };

    const timeScale = chartRef.current.timeScale();
    timeScale.subscribeVisibleTimeRangeChange(handleTimeRangeChange);

    return () => {
      timeScale.unsubscribeVisibleTimeRangeChange(handleTimeRangeChange);
    };
  }, [mappedData, bars, selectedSymbol, selectedSeriesType, dispatch, isLoading, selectedTimeframe]);

  useEffect(() => {



    if (!selectedSymbol) {
      dispatch(setClickedSymbolData("BTCUSD"));
      return;
    }
    const fullName = getSymbolFullName(selectedSymbol);
    // document.getElementById("chart-title").innerText = fullName;

    setIsLoading(true);
    setbars(100);
    lastFetchRef.current = Date.now() / 1000;

    if (selectedSeriesType !== "Line") {
      dispatch(fetchMarketDataHistory({ symbol: selectedSymbol, timeframe: 'M1', bars: 100 }))
        .then(() => {
          setIsLoading(false);
        })
        .catch(() => {
          setIsLoading(false);
        });
    }



  }, [selectedSymbol, selectedSeriesType, dispatch]);

  useEffect(() => {
    if (!status || status !== "succeeded" || !data || data.length === 0 || !seriesRef.current || selectedSeriesType === "Line") return;

    seriesRef.current.setData([]);

    if (status === "succeeded") {
      const transformedData = transformData(mappedData, selectedSeriesType);
      seriesRef.current.setData(transformedData);

      // --- Remove all existing series before adding again ---
      if (emaSeriesRef.current) { chartRef.current.removeSeries(emaSeriesRef.current); emaSeriesRef.current = null; }
      if (smaSeriesRef.current) { chartRef.current.removeSeries(smaSeriesRef.current); smaSeriesRef.current = null; }
      if (wmaSeriesRef.current) { chartRef.current.removeSeries(wmaSeriesRef.current); wmaSeriesRef.current = null; }

      if (bbUpperSeriesRef.current) { chartRef.current.removeSeries(bbUpperSeriesRef.current); bbUpperSeriesRef.current = null; }
      if (bbLowerSeriesRef.current) { chartRef.current.removeSeries(bbLowerSeriesRef.current); bbLowerSeriesRef.current = null; }


      // --- Now Add Active Indicators ---
      activeIndicators.forEach(indicator => {
        if (indicator === 'EMA') {
          emaSeriesRef.current = chartRef.current.addLineSeries({ color: emaLineColor, lineWidth: 2 });
          const emaData = calculateEMA(mappedData, emaPeriod);
          emaSeriesRef.current.setData(emaData);
        }
        if (indicator === 'SMA') {
          smaSeriesRef.current = chartRef.current.addLineSeries({ color: smaLineColor, lineWidth: 2 });
          const smaData = calculateSMA(mappedData, smaPeriod);
          smaSeriesRef.current.setData(smaData);
        }
        if (indicator === 'WMA') {
          wmaSeriesRef.current = chartRef.current.addLineSeries({ color: wmaLineColor, lineWidth: 2 });
          const wmaData = calculateWMA(mappedData, wmaPeriod);
          wmaSeriesRef.current.setData(wmaData);
        }
        if (indicator === 'BollingerBands') {
          const { upper, lower } = calculateBB(mappedData, bbPeriod);
          bbUpperSeriesRef.current = chartRef.current.addLineSeries({ color: '#AAAAFF', lineWidth: 1 });
          bbLowerSeriesRef.current = chartRef.current.addLineSeries({ color: '#AAAAFF', lineWidth: 1 });
          bbUpperSeriesRef.current.setData(upper);
          bbLowerSeriesRef.current.setData(lower);
        }

      });




      if (visibleRangeRef.current && bars > 1) {
        if (transformedData.length > 0) {
          chartRef.current.timeScale().setVisibleRange(visibleRangeRef.current);
        }
      } else {
        const dataLength = transformedData.length;
        if (dataLength > 0) {
          const lastIndex = dataLength - 1;
          const startIndex = Math.max(0, lastIndex - 100);

          // Prevent error when trying to set range
          if (transformedData[startIndex] && transformedData[lastIndex]) {
            chartRef.current.timeScale().setVisibleRange({
              from: transformedData[startIndex].time,
              to: transformedData[lastIndex].time,
            });
          }
        }
      }
    }
  }, [data, status, selectedSeriesType, bars, activeIndicators]);

  useEffect(() => {
    if (!status || status !== "succeeded" || !historyBarData || historyBarData.length === 0 || !seriesRef.current) return;

    if (selectedSeriesType === "Line") {
      seriesRef.current.setData([]);
    } else {



      seriesRef.current.setData([]); // Clear previous data
      const rawData = historyBarData.map(item => ({
        time: Math.floor(new Date(item.time).getTime() / 1000),
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
      }));
      const transformedData = transformData(rawData, selectedSeriesType);
      seriesRef.current.setData(transformedData);

      // --- Remove all existing series before adding again ---
      if (emaSeriesRef.current) { chartRef.current.removeSeries(emaSeriesRef.current); emaSeriesRef.current = null; }
      if (smaSeriesRef.current) { chartRef.current.removeSeries(smaSeriesRef.current); smaSeriesRef.current = null; }
      if (wmaSeriesRef.current) { chartRef.current.removeSeries(wmaSeriesRef.current); wmaSeriesRef.current = null; }

      if (bbUpperSeriesRef.current) { chartRef.current.removeSeries(bbUpperSeriesRef.current); bbUpperSeriesRef.current = null; }
      if (bbLowerSeriesRef.current) { chartRef.current.removeSeries(bbLowerSeriesRef.current); bbLowerSeriesRef.current = null; }


      // --- Now Add Active Indicators ---
      activeIndicators.forEach(indicator => {
        if (indicator === 'EMA') {
          emaSeriesRef.current = chartRef.current.addLineSeries({ color: emaLineColor, lineWidth: 2 });
          const emaData = calculateEMA(mappedData, emaPeriod);
          emaSeriesRef.current.setData(emaData);
        }
        if (indicator === 'SMA') {
          smaSeriesRef.current = chartRef.current.addLineSeries({ color: smaLineColor, lineWidth: 2 });
          const smaData = calculateSMA(mappedData, smaPeriod);
          smaSeriesRef.current.setData(smaData);
        }
        if (indicator === 'WMA') {
          wmaSeriesRef.current = chartRef.current.addLineSeries({ color: wmaLineColor, lineWidth: 2 });
          const wmaData = calculateWMA(mappedData, wmaPeriod);
          wmaSeriesRef.current.setData(wmaData);
        }
        if (indicator === 'BollingerBands') {
          const { upper, lower } = calculateBB(mappedData, bbPeriod);
          bbUpperSeriesRef.current = chartRef.current.addLineSeries({ color: '#AAAAFF', lineWidth: 1 });
          bbLowerSeriesRef.current = chartRef.current.addLineSeries({ color: '#AAAAFF', lineWidth: 1 });
          bbUpperSeriesRef.current.setData(upper);
          bbLowerSeriesRef.current.setData(lower);
        }

      });



    }

    // const transformedData = historyBarData.map(item => ({
    //   time: Math.floor(new Date(item.time).getTime() / 1000),
    //   open: item.open,
    //   high: item.high,
    //   low: item.low,
    //   close: item.close,
    // }));

    // seriesRef.current.setData(transformedData);

    // --- Remove all existing series before adding again ---
    if (emaSeriesRef.current) { chartRef.current.removeSeries(emaSeriesRef.current); emaSeriesRef.current = null; }
    if (smaSeriesRef.current) { chartRef.current.removeSeries(smaSeriesRef.current); smaSeriesRef.current = null; }
    if (wmaSeriesRef.current) { chartRef.current.removeSeries(wmaSeriesRef.current); wmaSeriesRef.current = null; }

    if (bbUpperSeriesRef.current) { chartRef.current.removeSeries(bbUpperSeriesRef.current); bbUpperSeriesRef.current = null; }
    if (bbLowerSeriesRef.current) { chartRef.current.removeSeries(bbLowerSeriesRef.current); bbLowerSeriesRef.current = null; }


    // --- Now Add Active Indicators ---
    activeIndicators.forEach(indicator => {
      if (indicator === 'EMA') {
        emaSeriesRef.current = chartRef.current.addLineSeries({ color: emaLineColor, lineWidth: 2 });
        const emaData = calculateEMA(mappedData, emaPeriod);
        emaSeriesRef.current.setData(emaData);
      }
      if (indicator === 'SMA') {
        smaSeriesRef.current = chartRef.current.addLineSeries({ color: smaLineColor, lineWidth: 2 });
        const smaData = calculateSMA(mappedData, smaPeriod);
        smaSeriesRef.current.setData(smaData);
      }
      if (indicator === 'WMA') {
        wmaSeriesRef.current = chartRef.current.addLineSeries({ color: wmaLineColor, lineWidth: 2 });
        const wmaData = calculateWMA(mappedData, wmaPeriod);
        wmaSeriesRef.current.setData(wmaData);
      }
      if (indicator === 'BollingerBands') {
        const { upper, lower } = calculateBB(mappedData, bbPeriod);
        bbUpperSeriesRef.current = chartRef.current.addLineSeries({ color: '#AAAAFF', lineWidth: 1 });
        bbLowerSeriesRef.current = chartRef.current.addLineSeries({ color: '#AAAAFF', lineWidth: 1 });
        bbUpperSeriesRef.current.setData(upper);
        bbLowerSeriesRef.current.setData(lower);
      }

    });



  }, [data, selectedSeriesType, status]);



  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 400,
      layout: {
        background: {
          type: "solid",
          color: layoutMode === "dark" ? "#010e1c" : "#ffffff",
        },
        textColor: layoutMode === "dark" ? "#ffffff" : "#000000",
      },
      grid: {
        vertLines: { color: layoutMode === "dark" ? "#131212" : "#eee" },
        horzLines: { color: layoutMode === "dark" ? "#131212" : "#eee" }
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1, // Adds space above the highest price
          bottom: 0.2, // Adds space below the lowest price
        },
        borderVisible: false,
        tickMarkFormatter: (price) => {
          // Format price with appropriate decimal places
          if (price >= 1000) {
            return price.toFixed(0);
          } else if (price >= 1) {
            return price.toFixed(2);
          } else {
            return price.toFixed(4);
          }
        },
        // Limit the number of price levels to maximum 10
        mode: 1, // Normal price scale mode
        autoScale: true,
        entireTextOnly: false,
        visible: true,
        drawTicks: true,
        alignLabels: true,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        rightOffset: 6,
        barSpacing: 12,
        minBarSpacing: 2,
        fixLeftEdge: false,
        // tickMarkFormatter: (time) => {
        //   return new Date(time * 1000).toUTCString(); // Ensure UTC in the footer
        // },
      },
      priceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
        minMove: 0.0001,
        autoScale: true,
        tickMarkFormatter: (price) => {
          // Format price with appropriate decimal places
          if (price >= 1000) {
            return price.toFixed(0);
          } else if (price >= 1) {
            return price.toFixed(2);
          } else {
            return price.toFixed(4);
          }
        },
        // Optimize price scale density
        mode: 1, // Normal price scale mode
        entireTextOnly: false,
        visible: true,
        drawTicks: true,
        alignLabels: true,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          width: 1,
          color: layoutMode === "dark" ? "#2e2e2e" : "#c1c1c1",
          style: 2,
        },
        horzLine: {
          width: 1,
          color: layoutMode === "dark" ? "#2e2e2e" : "#c1c1c1",
          style: 2,
        },
      },
    });

    seriesRef.current = createSeries(chartRef.current, selectedSeriesType);

    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,

        });
        // chartRef.current.timeScale().applyOptions({
        //   rightOffset: 12,
        // });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      chartRef.current.remove();
      chartRef.current = null;
    };
  }, [layoutMode]);

  useEffect(() => {
    if (!selectedSymbol || !symbols[selectedSymbol] || !chartRef.current) return;

    if (seriesRef.current) {
      try {
        chartRef.current.removeSeries(seriesRef.current);
      } catch (error) {
        console.error("Error removing series:", error);
      }
      seriesRef.current = null;
    }

    seriesRef.current = createSeries(chartRef.current, selectedSeriesType);
    lastCandleRef.current = null;

    if (selectedSeriesType !== "Line") {
      if (selectedSymbol && mappedData.length > 0) {
        const transformedData = transformData(mappedData, selectedSeriesType);
        seriesRef.current.setData(transformedData);

        // --- Remove all existing series before adding again ---
        if (emaSeriesRef.current) { chartRef.current.removeSeries(emaSeriesRef.current); emaSeriesRef.current = null; }
        if (smaSeriesRef.current) { chartRef.current.removeSeries(smaSeriesRef.current); smaSeriesRef.current = null; }
        if (wmaSeriesRef.current) { chartRef.current.removeSeries(wmaSeriesRef.current); wmaSeriesRef.current = null; }

        if (bbUpperSeriesRef.current) { chartRef.current.removeSeries(bbUpperSeriesRef.current); bbUpperSeriesRef.current = null; }
        if (bbLowerSeriesRef.current) { chartRef.current.removeSeries(bbLowerSeriesRef.current); bbLowerSeriesRef.current = null; }


        // --- Now Add Active Indicators ---
        activeIndicators.forEach(indicator => {
          if (indicator === 'EMA') {
            emaSeriesRef.current = chartRef.current.addLineSeries({ color: emaLineColor, lineWidth: 2 });
            const emaData = calculateEMA(mappedData, emaPeriod);
            emaSeriesRef.current.setData(emaData);
          }
          if (indicator === 'SMA') {
            smaSeriesRef.current = chartRef.current.addLineSeries({ color: smaLineColor, lineWidth: 2 });
            const smaData = calculateSMA(mappedData, smaPeriod);
            smaSeriesRef.current.setData(smaData);
          }
          if (indicator === 'WMA') {
            wmaSeriesRef.current = chartRef.current.addLineSeries({ color: wmaLineColor, lineWidth: 2 });
            const wmaData = calculateWMA(mappedData, wmaPeriod);
            wmaSeriesRef.current.setData(wmaData);
          }
          if (indicator === 'BollingerBands') {
            const { upper, lower } = calculateBB(mappedData, bbPeriod);
            bbUpperSeriesRef.current = chartRef.current.addLineSeries({ color: '#AAAAFF', lineWidth: 1 });
            bbLowerSeriesRef.current = chartRef.current.addLineSeries({ color: '#AAAAFF', lineWidth: 1 });
            bbUpperSeriesRef.current.setData(upper);
            bbLowerSeriesRef.current.setData(lower);
          }

        });



      }
    } else {
      // ✅ Add dummy initial data so the line can begin rendering
      const now = Math.floor(Date.now() / 1000);
      const bid = symbols[selectedSymbol]?.bid || 0;

      const dummyData = [
        { time: now - 3, value: bid },
        { time: now - 2, value: bid },
        { time: now - 1, value: bid },
      ];

      seriesRef.current.setData(dummyData);
    }



    // Re-add all markers after changing series
    if (markersRef.current.length > 0) {
      seriesRef.current.setMarkers(markersRef.current);
    }
  }, [selectedSymbol, selectedTimeframe, selectedSeriesType, mappedData]);


  //  const bid  = symbols[selectedSymbol];
  //  console.log(`bid of ${selectedSymbol} is ${bid}  at ${Date.now()}`)

  useEffect(() => {
    if (!selectedSymbol || !symbols[selectedSymbol] || !seriesRef.current || status === 'loading') return;

    const { bid } = symbols[selectedSymbol];
    //  console.log(`bid of ${selectedSymbol} is ${bid} at ${new Date().toLocaleTimeString()}`);

    const currentTime = Math.floor(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      new Date().getUTCHours(),
      new Date().getUTCMinutes(),
      new Date().getUTCSeconds()
    ) / 1000);

    // Convert to UTC+2 by adding 7200 seconds (2 hours)
    // const currentTimeGMT2 = currentTime + 21600; //6 hours
    const currentTimeGMT2 = currentTime + 25200; //7 hour

    const timeframeSeconds = timeframes[selectedTimeframe];
    const candleTime = Math.floor(currentTimeGMT2 / timeframeSeconds) * timeframeSeconds;

    let newCandle = { ...lastCandleRef.current };

    if (!lastCandleRef.current || lastCandleRef.current.time !== candleTime) {
      const lastClose = mappedData.length > 0 ? mappedData[mappedData.length - 1].close : bid;
      const lastHigh = mappedData.length > 0 ? mappedData[mappedData.length - 1].high : bid;

      newCandle = {
        time: candleTime,
        open: bid,
        high: bid,
        low: bid,
        close: bid,
      };
    } else {
      newCandle.high = Math.max(lastCandleRef.current.high, bid);
      newCandle.low = Math.min(lastCandleRef.current.low, bid);
      newCandle.close = bid;
    }

    if (mappedData.length > 0 && newCandle.time <= mappedData[mappedData.length - 1].time) {
      return; // Prevent duplicate timestamps
    }


    lastCandleRef.current = newCandle;

    setOhlcData((prev) => ({
      open: newCandle.open,
      high: newCandle.high,
      low: newCandle.low,
      close: newCandle.close,
      color: newCandle.close >= newCandle.open ? "#2DA479" : "#DC3A48",
    }));

    if (seriesRef.current && status === 'succeeded') {

      if (selectedSeriesType === "Line") {
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const bid = symbols[selectedSymbol]?.bid || 0;

        seriesRef.current.update({
          time: currentTimestamp,
          value: bid,
        });
      } else {
        const transformedCandle = transformData([newCandle], selectedSeriesType)[0];
        seriesRef.current.update(transformedCandle);
        // Update active indicators with the newCandle
        if (activeIndicators.includes('EMA') && emaSeriesRef.current) {
          const updatedEma = calculateEMA([...mappedData, newCandle], emaPeriod).pop(); // only latest point
          emaSeriesRef.current.update(updatedEma);
        }

        if (activeIndicators.includes('SMA') && smaSeriesRef.current) {
          const updatedSma = calculateSMA([...mappedData, newCandle], smaPeriod).pop();
          smaSeriesRef.current.update(updatedSma);
        }

        if (activeIndicators.includes('WMA') && wmaSeriesRef.current) {
          const updatedWma = calculateWMA([...mappedData, newCandle], wmaPeriod).pop();
          wmaSeriesRef.current.update(updatedWma);
        }

        if (activeIndicators.includes('BollingerBands') && bbUpperSeriesRef.current && bbLowerSeriesRef.current) {
          const { upper, lower } = calculateBB([...mappedData, newCandle], bbPeriod);
          bbUpperSeriesRef.current.update(upper[upper.length - 1]);
          bbLowerSeriesRef.current.update(lower[lower.length - 1]);
        }


      }




    }

    // Update active orders with current price
    if (activeOrders.length > 0) {
      setActiveOrders(prev =>
        prev.map(order => ({
          ...order,
          currentPrice: bid,
          priceDiff: bid - order.initialPrice
        }))
      );
    }





  }, [symbols, selectedSymbol, selectedTimeframe, selectedSeriesType, status]);

  // const formatTime = (seconds) => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  // };

  // Clean up all timers when component unmounts
  useEffect(() => {
    return () => {
      Object.keys(orderTimersRef.current).forEach(timerId => {
        clearInterval(orderTimersRef.current[timerId]);
      });
    };
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.timeScale().applyOptions({
        rightOffset: 6,  // Ensure rightOffset is applied on data update
        barSpacing: 12,
        minBarSpacing: 2,
        fixLeftEdge: false,
      });
    }
  }, [mappedData, selectedSymbol, selectedTimeframe, selectedSeriesType]);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 520);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  return (
    <div className="chart-wrapper" style={{
      backgroundColor: terminalPath ? "#010e1c" : "black"
    }}>
      {orderSuccessAlertPending && (
        <Alert
          style={{ zIndex: 9999, color: "#ffffff", position: 'absolute', width: '100%', backgroundColor: "darkgreen" }}
        >
          ✅ Order placed successfully!
        </Alert>
      )}

      {orderErrorAlertPending && (
        <Alert color="danger"
          style={{ zIndex: 9999, color: "#ffffff", position: 'absolute', width: '100%' }}
        >
          ❌ Order Rejected
        </Alert>
      )}
      {
        paymentAlertVisible && (
          <Alert
            isOpen={paymentAlertVisible}
            style={{ zIndex: 9999, backgroundColor: "#EF5350", color: "#ffffff", position: 'absolute', width: '100%' }}
            color="danger"
            toggle={() => setPaymentAlertVisible(false)}
          >
            Insufficient balance! Your balance is <strong>{selectedAccount?.balance}</strong>, but the required price is <strong>{price}</strong>.
          </Alert>
        )
      }

      {orderFailedMessage && (
        <Alert
          color="danger"
          style={{ zIndex: 9999, backgroundColor: "#EF5350", color: "#ffffff", position: 'absolute', width: '100%' }}
          toggle={() => dispatch({ type: 'order/clearOrderFailedMessage' })}
        >
          ❌ {orderFailedMessage}
        </Alert>
      )}

      {
        nullAccountAlertVisible && (
          <Alert
            isOpen={nullAccountAlertVisible}
            style={{ zIndex: 9999, backgroundColor: "#EF5350", color: "#ffffff", position: 'absolute', width: '100%' }}
            color="danger"
            toggle={() => setNullAccountAlertVisible(false)}
          >
            Please select or create and account first...!!
          </Alert>
        )
      }
      {/* 
      {alertVisible && (
        <Alert
          style={{ zIndex: 9999, backgroundColor: latestOrderResult === "win" ? "#26A69A" : "#EF5350", color: "#ffffff", position: 'absolute', width: '100%' }}
          color={latestOrderResult === "win" ? "success" : "danger"}
          toggle={() => setAlertVisible(false)}
        >
          Order Result: <strong>{String(latestOrderResult).toUpperCase()}</strong>
        </Alert>
      )} */}

      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        {alerts.map((alert, index) => (
          <Alert
            key={alert.id}
            style={{
              backgroundColor: alert.result === "win" ? "#26A69A" : "#EF5350",
              color: "#ffffff",
              marginBottom: '10px', // Add spacing to prevent overlap
              position: 'relative',
            }}
            color={alert.result === "win" ? "success" : "danger"}
            toggle={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
            className="trade-result-alert"
          >
            Order Result: <strong>{alert.result.toUpperCase()}</strong>
          </Alert>
        ))}
      </div>


      <div className="chart-topbar w-100 bg-dark d-flex align-items-center gap-2 p-2">

        <Dropdown isOpen={selectDropdownOpen} toggle={toggleSelectDropdown} className="symbol-select w-100">
          <DropdownToggle
            caret
            className="w-100 btn btn-outline-light d-flex align-items-center gap-2"
            style={{ backgroundColor: '#010e1c', borderColor: '#6c757d', height: '40px' }}
          >
            <i className={icon} style={{ fontSize: '20px', color }} />
            <span>{selected}</span>
          </DropdownToggle>

          <DropdownMenu className="w-100" style={{ backgroundColor: '#010e1c', maxHeight: '300px', overflowY: 'auto' }}>
            <div className="p-2">
              <div className="d-flex align-items-center gap-2 mb-2">
                <i className="ri-search-line" style={{ color: '#6c757d' }}></i>
                <Input
                  bsSize="sm"
                  placeholder="Search symbol"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    backgroundColor: '#010e1c',
                    color: '#fff',
                    borderColor: '#6c757d'
                  }}
                />
              </div>
            </div>
            {filteredOptions.length > 0 ? (
              filteredOptions.map(({ value, icon, color, percent }) => (
                <DropdownItem
                  key={value}
                  onClick={() => {
                    handleSelectChange({ value });
                    setDropdownOpen(false);
                    setSymbolPercentage(percent)
                  }}
                  active={value === selected}
                  className="d-flex align-items-center gap-2"
                  style={{
                    backgroundColor: value === selected ? '#010e1c' : '#010e1c',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  <i className={icon} style={{ fontSize: '20px', color }} />
                  <span className="d-flex justify-content-between align-items-center w-100">
                    {value}
                    <span className="badge text-secondary" style={{ fontSize: '13px', lineHeight: '13px', padding: '3px' }}>{percent}%</span>
                  </span>
                </DropdownItem>
              ))
            ) : (
              <DropdownItem disabled className="text-muted text-center">
                No matching symbols
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>

        {/* <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="btn btn-outline-light">
          <DropdownToggle tag="i" className="ri-hourglass-fill" style={{ cursor: 'pointer' }} />
          <DropdownMenu end>
            {Object.keys(timeframes).map((tf) => (
              <DropdownItem
                key={tf}
                onClick={() => {
                  const invertedTF = tf.slice(-1).toUpperCase() + tf.slice(0, -1);
                  setSelectedTimeframe(tf)
                  setbars(100)

                  if (seriesRef.current) {
                    seriesRef.current.setData([]);
                  }

                  dispatch(fetchMarketDataHistory({ symbol: selectedSymbol, timeframe: invertedTF, bars: bars }))
                }}
                className={selectedTimeframe === tf ? "active" : ""}
              >
                {tf}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <Dropdown isOpen={indicatorDropdownOpen} toggle={() => setIndicatorDropdownOpen(!indicatorDropdownOpen)} className="btn btn-outline-light">
          <DropdownToggle tag="i" className="ri-sliders-line" style={{ cursor: 'pointer' }}>
            Indicators
          </DropdownToggle>
          <DropdownMenu end style={{ backgroundColor: '#484948', border: '1px solid #6c757d' }}>
            <DropdownItem onClick={() => setActiveIndicator("EMA")} style={{ color: '#fff' }}>
              EMA
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        {activeIndicator === "EMA" && (
          <div className="d-flex align-items-center gap-2 ms-2">
            <label style={{ color: '#fff' }}>EMA Period:</label>
            <Input
              type="number"
              value={emaPeriod}
              onChange={(e) => setEmaPeriod(Number(e.target.value))}
              min={1}
              className="bg-dark text-white"
              style={{ width: "70px", border: "1px solid #ccc" }}
            />
          </div>
        )}

         */}

        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="btn btn-outline-light p-0 border-0">
          <DropdownToggle className="btn btn-outline-light">
            <i className="ri-hourglass-fill" />
          </DropdownToggle>

          <DropdownMenu
            end
            style={{ backgroundColor: '#010e1c', border: '1px solid #6c757d' }}
          >
            {Object.keys(timeframes).map((tf) => (
              <DropdownItem
                key={tf}
                onClick={() => {
                  const invertedTF = tf.slice(-1).toUpperCase() + tf.slice(0, -1);
                  setSelectedTimeframe(tf);
                  setbars(100);

                  if (seriesRef.current) {
                    seriesRef.current.setData([]);
                  }

                  dispatch(fetchMarketDataHistory({ symbol: selectedSymbol, timeframe: invertedTF, bars }));
                }}
                style={{
                  color: selectedTimeframe === tf ? '#FFFFFF' : '#fff',
                  // color: '#fff',
                  cursor: 'pointer',
                }}
                className="custom-dropdown-item "
              >
                {tf} {selectedTimeframe === tf && (<i className="ri-check-line text-success"></i>)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>


        <Dropdown isOpen={seriesDropdownOpen} toggle={toggleSeriesDropdown} className="btn btn-outline-light p-0 border-0">
          {/* <DropdownToggle tag="i" className="ri-line-chart-line" style={{ cursor: 'pointer' }} /> */}
          <DropdownToggle className="btn btn-outline-light">
            <i className="ri-line-chart-line" />
          </DropdownToggle>
          <DropdownMenu end
            style={{ backgroundColor: '#010e1c', border: '1px solid #6c757d' }}
          >
            {seriesTypes?.map((type) => (
              <DropdownItem
                key={type}
                onClick={() => handleSeriesTypeChange(type)}
                // className={selectedSeriesType === type ? "active" : ""}
                style={{
                  color: selectedSeriesType === type ? '#FFFFFF' : '#fff',
                  // color: '#fff',
                  cursor: 'pointer',
                }}
              >
                {type} {selectedSeriesType === type && (<i className="ri-check-line text-success"></i>)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>



        {/* <button
          onClick={handleScreenshot}
          className="btn btn-outline-light p-2"
          title="Take Screenshot"
        >
          <i className="ri-camera-fill"></i>
        </button> */}

        <button
          onClick={() => {
            chartRef.current.timeScale().scrollToRealTime();
          }}
          className="btn btn-outline-light p-2 px-3"
          title="Go to realtime"
        >
          <i className="ri-rfid-line"></i>
        </button>


        {/* <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "10px" }}> */}
        <Dropdown isOpen={indicatorDropdownOpen} toggle={() => setIndicatorDropdownOpen(!indicatorDropdownOpen)} className="btn btn-outline-light p-0 border-0">
          {/* <DropdownToggle tag="i" className="ri-router-line" style={{ cursor: 'pointer' }} /> */}
          <DropdownToggle className="btn btn-outline-light">
            <i className="ri-router-line" />
          </DropdownToggle>
          <DropdownMenu style={{ backgroundColor: "#010e1c", borderColor: "#6c757d" }}>
            <DropdownItem onClick={() => toggleModal('EMA')}
              style={{ color: activeIndicators.includes('EMA') ? '#FFFFFF' : '#fff' }} className="d-flex align-items-center justify-content-between">
              EMA  {activeIndicators.includes('EMA') && <i className="ri-check-line text-success"></i>}
            </DropdownItem>
            <DropdownItem onClick={() => toggleModal('SMA')}
              style={{ color: activeIndicators.includes('SMA') ? '#FFFFFF' : '#fff' }}
              className="d-flex align-items-center justify-content-between">
              SMA {activeIndicators.includes('SMA') && <i className="ri-check-line text-success"></i>}
            </DropdownItem>
            <DropdownItem onClick={() => toggleModal('WMA')}
              style={{ color: activeIndicators.includes('WMA') ? '#FFFFFF' : '#fff' }}
              className="d-flex align-items-center justify-content-between">
              WMA {activeIndicators.includes('WMA') && <i className="ri-check-line text-success"></i>}
            </DropdownItem>
            <DropdownItem onClick={() => toggleIndicator('BollingerBands')}
              style={{ color: activeIndicators.includes('BollingerBands') ? '#FFFFFF' : '#fff' }}
              className="d-flex align-items-center justify-content-between">
              Bollinger Bands {activeIndicators.includes('BollingerBands') && <i className="ri-check-line text-success"></i>}
            </DropdownItem>
            {/* <DropdownItem onClick={() => toggleIndicator('RSI')} style={{ color: '#fff' }}>RSI</DropdownItem>
              <DropdownItem onClick={() => toggleIndicator('MACD')} style={{ color: '#fff' }}>MACD</DropdownItem>
              <DropdownItem onClick={() => toggleIndicator('Volume')} style={{ color: '#fff' }}>Volume Bars</DropdownItem>
              <DropdownItem onClick={() => toggleIndicator('ATR')} style={{ color: '#fff' }}>ATR</DropdownItem>
              <DropdownItem onClick={() => toggleIndicator('Stochastic')} style={{ color: '#fff' }}>Stochastic Oscillator</DropdownItem> */}
            <DropdownItem divider />
            <DropdownItem onClick={clearAllIndicators} style={{ color: 'red' }}>Clear All Indicators</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/* </div> */}
        <Modal isOpen={modal} toggle={toggleModal} className='invoice-modal' >
          <ModalBody>
            <IndicatorsSettings indicatorName={selectedIndicator} onInputChange={handleSettings}  />
          </ModalBody>
          <ModalFooter>
            {/* <Button color="default" onClick={() => toggleModal()}>{t('Close')}</Button> */}
            {/* <Button color="secondary" onClick={() => {toggleIndicator("EMA")}}>{t('Remove')}</Button> */}
            <Button color="success" onClick={() => { toggleIndicator(selectedIndicator); toggleModal() }}>{t('Apply')}</Button>
          </ModalFooter>
        </Modal>
      </div>


      {activeOrders?.length > 0 && (
        <div className="active-orders-panel position-absolute"
          style={{
            top: '85px',
            left: '10px',
            zIndex: 9,
            backgroundColor: layoutMode === "dark" ? 'rgba(90,90,90,0.8)' : 'rgba(255,255,255,0.8)',
            // backgroundColor: layoutMode === "dark" ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.8)',
            border: `1px solid ${layoutMode === "dark" ? '#333' : '#ddd'}`,
            borderRadius: '4px',
            padding: '8px',
            maxHeight: '300px',
            overflowY: 'auto',
            color: layoutMode === "dark" ? '#fff' : '#000'
          }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="m-0">Active Orders ({orderCount}/10)</h6>
          </div>
          {activeOrders.map(order => (
            <div key={order.id} className="order-item mb-1 p-1"
              style={{
                borderBottom: `1px solid ${layoutMode === "dark" ? '#444' : '#eee'}`,
                display: 'flex',
                justifyContent: 'space-between'
              }}>
              <div>
                <span className={`badge ${order.type === 'BUY' ? 'bg-success' : 'bg-danger'} me-1`}>
                  {order.type}
                </span>
                <span>{order.price}</span>
              </div>
              <div>
                <span className="badge bg-secondary">{formatTime(order.remainingTime)}</span>
                <button
                  className="btn btn-sm btn-link text-danger p-0 ms-2"
                  onClick={() => {
                    removeMarker(order.id);
                    setActiveOrders(prev => prev.filter(o => o.id !== order.id));
                    setOrderCount(prev => prev - 1);
                  }}
                  style={{ fontSize: '14px' }}
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div ref={chartContainerRef} className="chart-container" style={{ position: 'relative' }}>
        {tooltipVisible && tooltipData && (
          <div
            ref={tooltipRef}
            style={{
              position: 'absolute',
              left: `${tooltipPosition.x + 15}px`,
              top: `${tooltipPosition.y}px`,
              backgroundColor: layoutMode === "dark" ? 'rgba(26, 29, 33, 0.9)' : 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${layoutMode === "dark" ? '#4a4a4a' : '#c1c1c1'}`,
              padding: '8px',
              borderRadius: '4px',
              pointerEvents: 'none', zIndex: 10,
              color: layoutMode === "dark" ? '#ffffff' : '#000000',
              fontSize: '12px',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <div style={{ marginBottom: '4px' }}>{tooltipData.time}</div>
            {selectedSeriesType === 'Candlestick' || selectedSeriesType === 'Bar' ? (
              <>
                <div style={{ color: '#2DA479' }}>Open: {tooltipData.data.open}</div>
                <div style={{ color: '#2DA479' }}>High: {tooltipData.data.high}</div>
                <div style={{ color: '#DC3A48' }}>Low: {tooltipData.data.low}</div>
                <div style={{ color: tooltipData.data.close >= tooltipData.data.open ? '#2DA479' : '#DC3A48' }}>
                  Close: {tooltipData.data.close}
                </div>
              </>
            ) : (
              <div style={{ color: '#2962FF' }}>Value: {tooltipData.data.value}</div>
            )}
          </div>
        )}
      </div>

      <div className="binary-trade-container mt-0 p-1" style={{
        backgroundColor: terminalPath ? "#010e1c" : "black"
      }}>
        {/* {selectedOption && (
          <div className="selected-info d-flex justify-content-center align-items-center p-2 mb-2">
            <span className="text-white">
              {selectedOption.type === "time" ? `Time: ${selectedOption.value}` : `Price: ${selectedOption.value}`}
            </span>

          </div>
        )} */}

        <Row>
          <Col xs={6} className="pe-1 timer-col">
            <FormGroup className="incremental-frm timer-frm d-flex align-items-center gap-point-1 mb-0">
              <Button className="border-0 col-01" onClick={handleDecrement} style={{ backgroundColor: "#262a2f", borderRadius: "5px 0px 0px 5px" }}>-</Button>

              <Label className="d-md-inline-block d-none fw-bold" style={{ marginBottom: "-45px", marginLeft: '5px', position: 'relative', zIndex: 9999, }} >{t("Duration")}</Label>

              <Input
                type="text"
                value={formatTime(time)}
                onClick={() => setShowTimePicker(true)}
                readOnly
                className="time-picker-input text-center text-white col-02 position-relative"
                style={{
                  backgroundColor: terminalPath ? "#262a2f" : "#000",
                  border: '1px solid #262a2f',
                  borderRadius: "0px", padding: "0.37rem 0.9rem", fontSize: "1rem"
                }}
              />

              {showTimePicker && (
                <div className="position-absolute  mt-1 z-1" style={{ top: "-6px", left: "15px", width: '95%' }}>
                  <Input
                    type="time"
                    value={getCurrentTime()}
                    onChange={handleTimeChange}
                    onBlur={() => setShowTimePicker(false)}
                    max="23:59"
                    autoFocus
                    className="w-100"
                  />
                </div>
              )}
              <Button className="border-0 col-03" onClick={handleIncrement} style={{ backgroundColor: "#262a2f", borderRadius: "0px 5px 5px 0px" }}>+</Button>
            </FormGroup>
          </Col>
          <Col xs={6} className="ps-0 price-col">
            <FormGroup className="incremental-frm d-flex align-items-center gap-point-1 mb-1">
              <Button className="border-0 col-01" onClick={handlePriceDecrease} style={{ backgroundColor: "#262a2f", borderRadius: "5px 0px 0px 5px" }}>-</Button>

              <Label className="d-md-inline-block d-none fw-bold" style={{ marginBottom: "-45px", marginLeft: '5px', position: 'relative', zIndex: 9999, }} >{t("Amount")}</Label>

              <Input
                type="text"
                value={`$${price}`}
                onChange={handleInputChange}
                onBlur={handleBlur} // Ensures the price is valid on blur
                className="price-picker-input text-center border-0 text-white col-02"
                style={{ borderRadius: "0px", padding: "0.37rem 0.9rem", fontSize: "1rem" }}
              />
              <Button className="border-0 col-03" onClick={handlePriceIncrease} style={{ backgroundColor: "#262a2f", borderRadius: "0px 5px 5px 0px" }}>+</Button>
            </FormGroup>
          </Col>
        </Row>
        {
          symbolMarketActive && (
            <Row className="justify-content-between align-items- mb-md-1 mb-5 binary-bs">
              <Col xs={5} className="pe-0 b-col-1">
                <Button
                  size="lg"
                  color="danger"
                  className="d-flex justify-content-between align-items-center gap-1 w-100 text-dark fw-bold buy-b-btn"
                  style={
                    selectedOption && isMobile
                      ? { fontSize: "14px", paddingInline: "5px" }
                      : {}
                  }
                  onClick={() =>
                    selectedOption
                      ? handlePlacePendingOrder("put")
                      : handlePlaceOrder("put")
                  }
                  disabled={orderCount >= 10 || !symbolMarketActive}
                >
                  {selectedOption ? t("Pending Sell") : t("Sell")} <i className="ri-arrow-down-fill"></i>
                </Button>

              </Col>

              <Col xs={2} style={{ padding: '0px 3px' }} className="b-col-2">
                {selectedOption ? (
                  <div onClick={() => setSelectedOption(null)}
                    className="text-center w-100 fw-bold binary-time-ico cursor-pointer"
                    style={{ paddingBlock: "0.39rem", backgroundColor: "#262a2f", borderRadius: "5px" }}>
                    <i className="ri-close-fill" style={{ fontSize: "24px" }}></i>

                  </div>
                ) : (
                  <div onClick={toggleTimePickerModel} className="text-center w-100 fw-bold binary-time-ico cursor-pointer"
                    style={{ paddingBlock: "0.39rem", backgroundColor: "#262a2f", borderRadius: "5px" }}>
                    <i className="ri-time-fill" style={{ fontSize: "24px" }}></i>
                  </div>
                )}
              </Col>


              <Col xs={5} className="ps-0 b-col-3">
                <Button
                  size="lg"
                  color="success"
                  className={`d-flex justify-content-between align-items-center gap-1 w-100 text-dark fw-bold sell-b-btn`}
                  style={
                    selectedOption && isMobile
                      ? { fontSize: "14px", paddingInline: "5px" }
                      : {}
                  }
                  onClick={() =>
                    selectedOption
                      ? handlePlacePendingOrder("call")
                      : handlePlaceOrder("call")
                  }
                  disabled={orderCount >= 10 || !symbolMarketActive}
                >
                  {selectedOption ? t("Pending Buy") : t("Buy")} <i className="ri-arrow-up-fill"></i>
                </Button>

              </Col>
            </Row>
          )
        }



        {
          !symbolMarketActive && (
            <div className="text-center text-danger mt-2 fw-bold" style={{ fontSize: '24px' }}>
              <i className="ri-error-warning-fill"></i> Market is Closed for this Symbol.
            </div>
          )
        }
        {
          symbolMarketActive && (
            <h3 className="d-none d-md-block" style={{ color: 'white', padding: '10px', borderRadius: '5px', fontSize: '16px' }}>{t("Profit")}: + {(symbolPercentage * price) / 100}</h3>
          )
        }
      </div>

      <TimePickerModal
        isOpen={timePickerModel}
        toggle={toggleTimePickerModel}
        onSelectionChange={setSelectedOption}  // Pass callback
      />
      <ToastContainer autoClose />

    </div>
  );
};

export default TradingViewChart2;