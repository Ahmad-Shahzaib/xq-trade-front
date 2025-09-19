import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
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
import { fetchSymbols } from "../../../rtk/slices/fetchSymbolsSlice/fetchSymbolsSlice";
import SideCalculator from "../../../Layouts/SideCalculator";
import { useFavoriteCurrencies } from '../../../context/FavoriteCurrenciesContext';
import IndicatorsSettings from "./IndicatorsSettings";
import { toast, ToastContainer } from "react-toastify";
import socket from "../../../utils/socket";
import trading from "../../../assets/images/chartbg.png"
import CustomHeaderModal from "../../../Layouts/CustomHeaderModal";
import TimeFrame from "../../../assets/images/Time Frames Icon.png";
import chartType from "../../../assets/images/Chart Types Icon.png";
import MeterRange from "../../../assets/images/Indicators icon.png";
import NotificationManager from "./NotificationManager";

function calculateRSI(data, period = 14) {
  let gains = 0, losses = 0;
  const rsi = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i] && data[i].close !== undefined && data[i].close !== null && !isNaN(data[i].close) &&
      data[i - 1] && data[i - 1].close !== undefined && data[i - 1].close !== null && !isNaN(data[i - 1].close)) {
      const change = data[i].close - data[i - 1].close;
      if (change >= 0) gains += change;
      else losses -= change;

      if (i >= period) {
        const avgGain = gains / period;
        const avgLoss = losses / period;
        const rs = avgGain / (avgLoss || 1);
        const rsiValue = 100 - 100 / (1 + rs);
        if (!isNaN(rsiValue)) {
          rsi.push({ time: data[i].time, value: parseFloat(rsiValue.toFixed(2)) });
        }

        if (data[i - period + 1] && data[i - period + 1].close !== undefined && data[i - period + 1].close !== null && !isNaN(data[i - period + 1].close) &&
          data[i - period] && data[i - period].close !== undefined && data[i - period].close !== null && !isNaN(data[i - period].close)) {
          const oldChange = data[i - period + 1].close - data[i - period].close;
          if (oldChange >= 0) gains -= oldChange;
          else losses += oldChange;
        }
      }
    }
  }

  return rsi;
}

function calculateMACD(data, fastPeriod = 12, slowPeriod = 26, signalPeriod = 9, macdColor = '#2196F3', signalColor = '#FF9800', histogramColor = '#9C27B0') {
  const fast = calculateEMA(data, fastPeriod);
  const slow = calculateEMA(data, slowPeriod);
  const macdLine = [];

  // Calculate MACD line
  for (let i = 0; i < fast.length && i < slow.length; i++) {
    // Add null/undefined checks for array elements and their properties
    if (fast[i] && slow[i] && typeof fast[i].value === 'number' && typeof slow[i].value === 'number' &&
      !isNaN(fast[i].value) && !isNaN(slow[i].value)) {
      const macdValue = fast[i].value - slow[i].value;
      if (!isNaN(macdValue)) {
        macdLine.push({ time: fast[i].time, value: parseFloat(macdValue.toFixed(4)) });
      }
    }
  }

  // Calculate Signal line (EMA of MACD line)
  const signalLine = calculateEMA(macdLine, signalPeriod);

  // Calculate Histogram (MACD - Signal)
  const histogram = [];
  for (let i = 0; i < macdLine.length && i < signalLine.length; i++) {
    // Add null/undefined checks for array elements and their properties
    if (macdLine[i] && signalLine[i] && typeof macdLine[i].value === 'number' && typeof signalLine[i].value === 'number' &&
      !isNaN(macdLine[i].value) && !isNaN(signalLine[i].value)) {
      const histValue = macdLine[i].value - signalLine[i].value;
      if (!isNaN(histValue)) {
        histogram.push({
          time: macdLine[i].time,
          value: parseFloat(histValue.toFixed(4)),
          color: histValue >= 0 ? histogramColor : histogramColor
        });
      }
    }
  }

  return {
    macdLine: macdLine.map(item => ({ ...item, color: macdColor })),
    signalLine: signalLine.map(item => ({ ...item, color: signalColor })),
    histogram: histogram
  };
}

function calculateBB(data, period = 20) {
  const upper = [], middle = [], lower = [];
  for (let i = period - 1; i < data.length; i++) {
    const slice = data.slice(i - period + 1, i + 1);
    const validSlice = slice.filter(d => d && d.close !== undefined && d.close !== null && !isNaN(d.close));

    if (validSlice.length >= period) {
      const mean = validSlice.reduce((sum, d) => sum + d.close, 0) / validSlice.length;
      const variance = validSlice.reduce((sum, d) => sum + Math.pow(d.close - mean, 2), 0) / validSlice.length;
      const stdDev = Math.sqrt(variance);

      if (!isNaN(mean) && !isNaN(stdDev)) {
        upper.push({ time: data[i].time, value: parseFloat((mean + 2 * stdDev).toFixed(4)) });
        middle.push({ time: data[i].time, value: parseFloat(mean.toFixed(4)) });
        lower.push({ time: data[i].time, value: parseFloat((mean - 2 * stdDev).toFixed(4)) });
      }
    }
  }
  return { upper, middle, lower };
}


function calculateEMA(data, period = 14) {
  const ema = [];
  let k = 2 / (period + 1);
  let emaPrev;

  data.forEach((point, index) => {
    // Add null/undefined checks for price data
    if (!point || typeof point.close !== 'number' || isNaN(point.close)) {
      return; // Skip invalid data points
    }

    const price = point.close;
    if (index === 0) {
      emaPrev = price;
    } else {
      emaPrev = price * k + emaPrev * (1 - k);
    }

    // Add null check for emaPrev before calling toFixed
    if (emaPrev !== null && emaPrev !== undefined && !isNaN(emaPrev)) {
      ema.push({
        time: point.time,
        value: parseFloat(emaPrev.toFixed(4)),
      });
    }
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


function calculateDonchianChannel(data, period = 20) {
  // Donchian Channel indicator
  // Upper line: Highest high over the period
  // Lower line: Lowest low over the period  
  // Middle line: Average of upper and lower lines

  const upper = [];
  const middle = [];
  const lower = [];

  for (let i = period - 1; i < data.length; i++) {
    // Get the slice of data for the current period
    const periodData = data.slice(i - period + 1, i + 1);

    // Find highest high and lowest low in the period
    let highestHigh = periodData[0].high;
    let lowestLow = periodData[0].low;

    for (let j = 1; j < periodData.length; j++) {
      if (periodData[j].high > highestHigh) {
        highestHigh = periodData[j].high;
      }
      if (periodData[j].low < lowestLow) {
        lowestLow = periodData[j].low;
      }
    }

    const middleValue = (highestHigh + lowestLow) / 2;

    upper.push({ time: data[i].time, value: parseFloat(highestHigh.toFixed(4)) });
    middle.push({ time: data[i].time, value: parseFloat(middleValue.toFixed(4)) });
    lower.push({ time: data[i].time, value: parseFloat(lowestLow.toFixed(4)) });
  }

  return { upper, middle, lower };
}


function calculateIchimoku(data, tenkanPeriod = 9, kijunPeriod = 26, senkouBPeriod = 52) {
  if (data.length < Math.max(tenkanPeriod, kijunPeriod, senkouBPeriod)) {
    return { tenkanSen: [], kijunSen: [], chikouSpan: [], senkouSpanA: [], senkouSpanB: [] };
  }

  const tenkanSen = [];
  const kijunSen = [];
  const chikouSpan = [];
  const senkouSpanA = [];
  const senkouSpanB = [];

  // Calculate Tenkan Sen (Conversion Line)
  for (let i = tenkanPeriod - 1; i < data.length; i++) {
    const slice = data.slice(i - tenkanPeriod + 1, i + 1);
    const highest = Math.max(...slice.map(d => d.high));
    const lowest = Math.min(...slice.map(d => d.low));
    const tenkanValue = (highest + lowest) / 2;
    tenkanSen.push({ time: data[i].time, value: parseFloat(tenkanValue.toFixed(4)) });
  }

  // Calculate Kijun Sen (Base Line)
  for (let i = kijunPeriod - 1; i < data.length; i++) {
    const slice = data.slice(i - kijunPeriod + 1, i + 1);
    const highest = Math.max(...slice.map(d => d.high));
    const lowest = Math.min(...slice.map(d => d.low));
    const kijunValue = (highest + lowest) / 2;
    kijunSen.push({ time: data[i].time, value: parseFloat(kijunValue.toFixed(4)) });
  }

  // Calculate Chikou Span (Lagging Span) - Current close shifted back 26 periods
  for (let i = kijunPeriod; i < data.length; i++) {
    chikouSpan.push({ time: data[i - kijunPeriod].time, value: parseFloat(data[i].close.toFixed(4)) });
  }

  // Calculate Senkou Span A (Leading Span A) - Average of Tenkan and Kijun shifted forward 26 periods
  for (let i = 0; i < tenkanSen.length && i < kijunSen.length; i++) {
    if (i + kijunPeriod < data.length) {
      const senkouAValue = (tenkanSen[i].value + kijunSen[i].value) / 2;
      senkouSpanA.push({ time: data[i + kijunPeriod].time, value: parseFloat(senkouAValue.toFixed(4)) });
    }
  }

  // Calculate Senkou Span B (Leading Span B) - 52-period high-low average shifted forward 26 periods
  for (let i = senkouBPeriod - 1; i < data.length; i++) {
    const slice = data.slice(i - senkouBPeriod + 1, i + 1);
    const highest = Math.max(...slice.map(d => d.high));
    const lowest = Math.min(...slice.map(d => d.low));
    const senkouBValue = (highest + lowest) / 2;
    if (i + kijunPeriod < data.length) {
      senkouSpanB.push({ time: data[i + kijunPeriod].time, value: parseFloat(senkouBValue.toFixed(4)) });
    }
  }

  return { tenkanSen, kijunSen, chikouSpan, senkouSpanA, senkouSpanB };
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
function calculateVolume(data, volumeColor1 = '#26a69a', volumeColor2 = '#ef5350') {
  if (!data || data.length === 0) return [];

  const volume = [];

  // Helper function to add opacity to hex color
  const addOpacity = (hexColor, opacity = 0.5) => {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  for (let i = 0; i < data.length; i++) {
    const current = data[i];

    // Calculate price range (high - low) as a measure of volatility
    const priceRange = current.high - current.low;

    // Calculate price change from previous candle
    let priceChange = 0;
    if (i > 0) {
      priceChange = Math.abs(current.close - data[i - 1].close);
    }

    // Base volume calculation using price range and change
    let baseVolume = (priceRange + priceChange) * current.close * 1000;

    // Add some randomness to make it more realistic
    const randomFactor = 0.5 + Math.random();
    baseVolume *= randomFactor;

    // Normalize volume to reasonable range (1000 - 100000)
    const normalizedVolume = Math.max(1000, Math.min(100000, Math.round(baseVolume)));

    // Use Color 1 for up candles, Color 2 for down candles with 50% opacity
    const isUp = current.close >= current.open;
    const color = addOpacity(isUp ? volumeColor1 : volumeColor2, 0.5);

    volume.push({
      time: current.time,
      value: normalizedVolume,
      color: color
    });
  }

  return volume;
}
function calculateSMA(data, period = 14) {
  const sma = [];
  for (let i = period - 1; i < data.length; i++) {
    const sum = data.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val.close, 0);
    sma.push({ time: data[i].time, value: sum / period });
  }
  return sma;
}

function calculateAlligator(data, jawColor = '#0000FF', teethColor = '#FF0000', lipsColor = '#00FF00', jawPeriod = 13, jawShift = 8, teethPeriod = 8, teethShift = 5, lipsPeriod = 5, lipsShift = 3) {
  // Alligator indicator with three smoothed moving averages
  // Jaw: jawPeriod-period SMMA shifted jawShift bars into the future
  // Teeth: teethPeriod-period SMMA shifted teethShift bars into the future  
  // Lips: lipsPeriod-period SMMA shifted lipsShift bars into the future

  function calculateSMMA(data, period) {
    const smma = [];
    let sum = 0;

    // Calculate initial SMA for first value
    for (let i = 0; i < period && i < data.length; i++) {
      if (data[i] && data[i].close !== undefined && data[i].close !== null && !isNaN(data[i].close)) {
        sum += data[i].close;
      }
    }

    if (data.length >= period) {
      smma.push(sum / period);

      // Calculate SMMA for remaining values
      for (let i = period; i < data.length; i++) {
        if (data[i] && data[i].close !== undefined && data[i].close !== null && !isNaN(data[i].close)) {
          const prevSmma = smma[smma.length - 1];
          const newSmma = (prevSmma * (period - 1) + data[i].close) / period;
          smma.push(newSmma);
        }
      }
    }

    return smma;
  }

  const jawSmma = calculateSMMA(data, jawPeriod);
  const teethSmma = calculateSMMA(data, teethPeriod);
  const lipsSmma = calculateSMMA(data, lipsPeriod);

  const jaw = [];
  const teeth = [];
  const lips = [];

  // Create data points with proper shifts
  for (let i = 0; i < data.length; i++) {
    // Jaw (jawPeriod-period, shift jawShift)
    if (i >= (jawPeriod - 1) && jawSmma[i - (jawPeriod - 1)] !== undefined && jawSmma[i - (jawPeriod - 1)] !== null && !isNaN(jawSmma[i - (jawPeriod - 1)])) {
      jaw.push({
        time: data[i].time,
        value: parseFloat(jawSmma[i - (jawPeriod - 1)].toFixed(4))
      });
    }

    // Teeth (teethPeriod-period, shift teethShift)
    if (i >= (teethPeriod - 1) && teethSmma[i - (teethPeriod - 1)] !== undefined && teethSmma[i - (teethPeriod - 1)] !== null && !isNaN(teethSmma[i - (teethPeriod - 1)])) {
      teeth.push({
        time: data[i].time,
        value: parseFloat(teethSmma[i - (teethPeriod - 1)].toFixed(4))
      });
    }

    // Lips (lipsPeriod-period, shift lipsShift)
    if (i >= (lipsPeriod - 1) && lipsSmma[i - (lipsPeriod - 1)] !== undefined && lipsSmma[i - (lipsPeriod - 1)] !== null && !isNaN(lipsSmma[i - (lipsPeriod - 1)])) {
      lips.push({
        time: data[i].time,
        value: parseFloat(lipsSmma[i - (lipsPeriod - 1)].toFixed(4))
      });
    }
  }

  return { jaw, teeth, lips };
}

function calculateZigZag(data, deviation = 5, depth = 12, backStep = 3) {
  if (data.length < Math.max(depth, 10)) return [];

  const zigzag = [];
  let lastHigh = null;
  let lastLow = null;
  let trend = null; // 'up' or 'down'

  // Use a smaller depth for more responsive zigzag
  const actualDepth = Math.min(depth, Math.floor(data.length / 10));

  for (let i = actualDepth; i < data.length - actualDepth; i++) {
    const current = data[i];

    // Check if current point is a local high
    let isLocalHigh = true;
    let isLocalLow = true;

    for (let j = Math.max(0, i - actualDepth); j <= Math.min(data.length - 1, i + actualDepth); j++) {
      if (j !== i) {
        if (data[j].high > current.high) isLocalHigh = false;
        if (data[j].low < current.low) isLocalLow = false;
      }
    }

    if (isLocalHigh) {
      if (!lastHigh || current.high > lastHigh.value) {
        lastHigh = { time: current.time, value: current.high, index: i };
      }
    }

    if (isLocalLow) {
      if (!lastLow || current.low < lastLow.value) {
        lastLow = { time: current.time, value: current.low, index: i };
      }
    }

    // Add zigzag points based on trend changes
    if (lastHigh && lastLow) {
      const highLowDiff = Math.abs((lastHigh.value - lastLow.value) / Math.min(lastHigh.value, lastLow.value)) * 100;

      if (highLowDiff >= deviation) {
        if (trend === null) {
          // Initialize trend
          if (lastHigh.index < lastLow.index) {
            zigzag.push({ time: lastHigh.time, value: lastHigh.value });
            zigzag.push({ time: lastLow.time, value: lastLow.value });
            trend = 'down';
          } else {
            zigzag.push({ time: lastLow.time, value: lastLow.value });
            zigzag.push({ time: lastHigh.time, value: lastHigh.value });
            trend = 'up';
          }
        } else if (trend === 'up' && lastLow.index > (zigzag[zigzag.length - 1]?.time || 0)) {
          zigzag.push({ time: lastLow.time, value: lastLow.value });
          trend = 'down';
          lastHigh = null;
        } else if (trend === 'down' && lastHigh.index > (zigzag[zigzag.length - 1]?.time || 0)) {
          zigzag.push({ time: lastHigh.time, value: lastHigh.value });
          trend = 'up';
          lastLow = null;
        }
      }
    }
  }

  // Ensure we have at least a few points for visibility
  if (zigzag.length < 2 && data.length > 20) {
    // Fallback: create simple high-low zigzag
    const step = Math.floor(data.length / 6);
    for (let i = 0; i < data.length; i += step) {
      if (i < data.length) {
        const point = data[i];
        zigzag.push({ time: point.time, value: (point.high + point.low) / 2 });
      }
    }
  }

  return zigzag;
}

function calculateParabolicSAR(data, step = 0.02) {
  if (data.length < 2) return [];

  const sar = [];
  let af = step; // Acceleration Factor
  let ep = data[0].high; // Extreme Point
  let sarValue = data[0].low;
  let isUpTrend = true;

  sar.push({ time: data[0].time, value: sarValue });

  for (let i = 1; i < data.length; i++) {
    const current = data[i];
    const previous = data[i - 1];

    if (isUpTrend) {
      // Calculate SAR for uptrend
      sarValue = sarValue + af * (ep - sarValue);

      // SAR should not be above the low of current or previous period
      sarValue = Math.min(sarValue, current.low, previous.low);

      // Check for trend reversal
      if (current.low <= sarValue) {
        isUpTrend = false;
        sarValue = ep; // SAR becomes the previous EP
        ep = current.low; // New EP is current low
        af = step; // Reset AF
      } else {
        // Update EP and AF for continuing uptrend
        if (current.high > ep) {
          ep = current.high;
          af = Math.min(af + step, 0.2);
        }
      }
    } else {
      // Calculate SAR for downtrend
      sarValue = sarValue + af * (ep - sarValue);

      // SAR should not be below the high of current or previous period
      sarValue = Math.max(sarValue, current.high, previous.high);

      // Check for trend reversal
      if (current.high >= sarValue) {
        isUpTrend = true;
        sarValue = ep; // SAR becomes the previous EP
        ep = current.high; // New EP is current high
        af = step; // Reset AF
      } else {
        // Update EP and AF for continuing downtrend
        if (current.low < ep) {
          ep = current.low;
          af = Math.min(af + step, 0.2);
        }
      }
    }

    sar.push({ time: current.time, value: sarValue });
  }

  return sar;
}




export const seriesTypes = ['Candlestick', 'Area', 'Bar', 'Baseline', 'Histogram', 'Line'];
export const timeframes = {
  // "5s": 5,
  // "10s": 10,
  // "15s": 15,
  // "30s": 30,
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1h": 3600,
  "1D": 86400
};

export const symbolCategory = [
  'Crypto',
  'Forex',
  'Indices',
  'Stocks',
  'Commodities']


const TradingViewChart2 = () => {

  const [selectedCategory, setSelectedCategory] = useState('Category'); // default label
  const [activeTab, setActiveTab] = useState('CURRENCIES'); // Add this line
  
  // Initialize favorites hook early to avoid initialization errors
  const { addFavorite, favorites, isFavorite, removeFavorite } = useFavoriteCurrencies();
  
  const [volumeColor1, setVolumeColor1] = useState(() => {
    const stored = localStorage.getItem('volumeColor1');
    return stored ? stored : '#26a69a';
  });

  const [volumeColor, setVolumeColor] = useState('#26a69a');
  const [zigzagDeviation, setZigzagDeviation] = useState(5);
  const [zigzagDepth, setZigzagDepth] = useState(12);
  const [zigzagBackStep, setZigzagBackStep] = useState(3);
  const [rsiPeriod, setRsiPeriod] = useState(14);
  const [selectedIndicatorForSettings, setSelectedIndicatorForSettings] = useState(null);

  const [zigzagLineColor, setZigzagLineColor] = useState();
  const [rsiLineColor, setRsiLineColor] = useState();
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
  const isChartMountedRef = useRef(false);


  const seriesRef = useRef(null);
  const lastCandleRef = useRef(null);
  const lastFetchRef = useRef(0);
  const visibleRangeRef = useRef(null);
  const markersRef = useRef([]);
  const orderTimersRef = useRef({});
  // Track timeouts that will hide restored custom markers after their remaining time
  const markerHideTimersRef = useRef({});
  
  // Throttle variables for marker position updates
  let updateMarkerThrottle = false;
  let scrollThrottle = false;

  const [isMobile, setIsMobile] = useState(window.innerWidth < 520);
  const [selectedTimeframe, setSelectedTimeframe] = useState("1m");
  const [selectedSeriesType, setSelectedSeriesType] = useState("Candlestick");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectDropdownOpen, setSelectDropdownOpen] = useState(false);
  const [seriesDropdownOpen, setSeriesDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [bars, setbars] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [ohlcData, setOhlcData] = useState({ open: 0, high: 0, low: 0, close: 0, time: null, color: "#2DA479" });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipData, setTooltipData] = useState(null);
  const latestOrderResult = useSelector((state) => state.accountType.latestOrderResult);
  const latestClosedOrder = useSelector((state) => state.accountType.latestClosedOrder);
  const closedOrder = useSelector((state) => state.accountType.closedOrder);
  const [indicatorSettingsModal, setIndicatorSettingsModal] = useState(false);

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
  const [bbPeriod, setBbPeriod] = useState(20);
  const [emaLineColor, setEmaLineColor] = useState();
  const [smaLineColor, setSmaLineColor] = useState();
  const [wmaLineColor, setWmaLineColor] = useState();
  const [bbLineColor, setBbLineColor] = useState();
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  const [tempCounter, setTempCounter] = useState(1);
  const tempIdRef = useRef(1);
  const generateTempId = () => `temp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;


  // const [bbPeriod, setBbPeriod] = useState(20);

  const storedAccount = localStorage.getItem("selectedAccount");
  const parsedAccount = JSON.parse(storedAccount);
  let tradeGroupName = parsedAccount?.trade_group_detail?.name || "";


  const [volumeColor2, setVolumeColor2] = useState(() => {
    const stored = localStorage.getItem('volumeColor2');
    return stored ? stored : '#ef5350';
  });
  const [alligatorJawColor, setAlligatorJawColor] = useState(() => {
    const stored = localStorage.getItem('alligatorJawColor');
    return stored ? stored : '#0000FF';
  });
  const [alligatorTeethColor, setAlligatorTeethColor] = useState(() => {
    const stored = localStorage.getItem('alligatorTeethColor');
    return stored ? stored : '#FF0000';
  });
  const [alligatorLipsColor, setAlligatorLipsColor] = useState(() => {
    const stored = localStorage.getItem('alligatorLipsColor');
    return stored ? stored : '#00FF00';
  });
  const [alligatorJawPeriod, setAlligatorJawPeriod] = useState(() => {
    const stored = localStorage.getItem('alligatorJawPeriod');
    return stored ? parseInt(stored) : 13;
  });
  const [alligatorJawShift, setAlligatorJawShift] = useState(() => {
    const stored = localStorage.getItem('alligatorJawShift');
    return stored ? parseInt(stored) : 8;
  });
  const [alligatorTeethPeriod, setAlligatorTeethPeriod] = useState(() => {
    const stored = localStorage.getItem('alligatorTeethPeriod');
    return stored ? parseInt(stored) : 8;
  });
  const [alligatorTeethShift, setAlligatorTeethShift] = useState(() => {
    const stored = localStorage.getItem('alligatorTeethShift');
    return stored ? parseInt(stored) : 5;
  });
  const [alligatorLipsPeriod, setAlligatorLipsPeriod] = useState(() => {
    const stored = localStorage.getItem('alligatorLipsPeriod');
    return stored ? parseInt(stored) : 5;
  });
  const [alligatorLipsShift, setAlligatorLipsShift] = useState(() => {
    const stored = localStorage.getItem('alligatorLipsShift');
    return stored ? parseInt(stored) : 3;
  });
  const [parabolicStep, setParabolicStep] = useState(() => {
    const stored = localStorage.getItem('parabolicStep');
    return stored ? parseFloat(stored) : 0.02;
  });


  const [parabolicLineColor, setParabolicLineColor] = useState(() => {
    const stored = localStorage.getItem('parabolicLineColor');
    return stored ? stored : '#FF6600';
  });
  const [ichimokuKijunColor, setIchimokuKijunColor] = useState(() => {
    const stored = localStorage.getItem('ichimokuKijunColor');
    return stored ? stored : '#4ECDC4';
  });
  // Donchian Channel state variables
  const [donchianPeriod, setDonchianPeriod] = useState(() => {
    const stored = localStorage.getItem('donchianPeriod');
    return stored ? parseInt(stored) : 20;
  });
  const [donchianUpperColor, setDonchianUpperColor] = useState(() => {
    const stored = localStorage.getItem('donchianUpperColor');
    return stored ? stored : '#FF6B6B';
  });
  const [donchianMiddleColor, setDonchianMiddleColor] = useState(() => {
    const stored = localStorage.getItem('donchianMiddleColor');
    return stored ? stored : '#4ECDC4';
  });
  const [donchianLowerColor, setDonchianLowerColor] = useState(() => {
    const stored = localStorage.getItem('donchianLowerColor');
    return stored ? stored : '#45B7D1';
  });
  const [donchianFillColor, setDonchianFillColor] = useState(() => {
    const stored = localStorage.getItem('donchianFillColor');
    return stored ? stored : 'rgba(255, 107, 107, 0.1)';
  });

  // Ichimoku Cloud state variables
  const [ichimokuTenkanPeriod, setIchimokuTenkanPeriod] = useState(() => {
    const stored = localStorage.getItem('ichimokuTenkanPeriod');
    return stored ? parseInt(stored) : 9;
  });
  const [ichimokuKijunPeriod, setIchimokuKijunPeriod] = useState(() => {
    const stored = localStorage.getItem('ichimokuKijunPeriod');
    return stored ? parseInt(stored) : 26;
  });
  const [ichimokuSenkouBPeriod, setIchimokuSenkouBPeriod] = useState(() => {
    const stored = localStorage.getItem('ichimokuSenkouBPeriod');
    return stored ? parseInt(stored) : 52;
  });
  const [ichimokuTenkanColor, setIchimokuTenkanColor] = useState(() => {
    const stored = localStorage.getItem('ichimokuTenkanColor');
    return stored ? stored : '#FF6B6B';
  });

  const [ichimokuChikouColor, setIchimokuChikouColor] = useState(() => {
    const stored = localStorage.getItem('ichimokuChikouColor');
    return stored ? stored : '#45B7D1';
  });
  const [ichimokuSenkouAColor, setIchimokuSenkouAColor] = useState(() => {
    const stored = localStorage.getItem('ichimokuSenkouAColor');
    return stored ? stored : '#9B59B6';
  });
  const [ichimokuSenkouBColor, setIchimokuSenkouBColor] = useState(() => {
    const stored = localStorage.getItem('ichimokuSenkouBColor');
    return stored ? stored : '#E67E22';
  });
  const [ichimokuFillColor, setIchimokuFillColor] = useState(() => {
    const stored = localStorage.getItem('ichimokuFillColor');
    return stored ? stored : 'rgba(155, 89, 182, 0.1)';
  });
  const [ichimokuShowFill, setIchimokuShowFill] = useState(() => {
    const stored = localStorage.getItem('ichimokuShowFill');
    return stored ? JSON.parse(stored) : true;
  });

  // MACD settings
  const [macdFastPeriod, setMacdFastPeriod] = useState(() => {
    const stored = localStorage.getItem('macdFastPeriod');
    return stored ? parseInt(stored) : 12;
  });
  const [macdSlowPeriod, setMacdSlowPeriod] = useState(() => {
    const stored = localStorage.getItem('macdSlowPeriod');
    return stored ? parseInt(stored) : 26;
  });
  const [macdSignalPeriod, setMacdSignalPeriod] = useState(() => {
    const stored = localStorage.getItem('macdSignalPeriod');
    return stored ? parseInt(stored) : 9;
  });
  const [macdLineColor, setMacdLineColor] = useState(() => {
    const stored = localStorage.getItem('macdLineColor');
    return stored ? stored : '#2196F3';
  });
  const [macdSignalColor, setMacdSignalColor] = useState(() => {
    const stored = localStorage.getItem('macdSignalColor');
    return stored ? stored : '#FF9800';
  });
  const [macdHistogramColor, setMacdHistogramColor] = useState(() => {
    const stored = localStorage.getItem('macdHistogramColor');
    return stored ? stored : '#9C27B0';
  });
  const [showMacdLine, setShowMacdLine] = useState(() => {
    const stored = localStorage.getItem('macdShowMacdLine');
    return stored ? JSON.parse(stored) : true;
  });
  const [showSignalLine, setShowSignalLine] = useState(() => {
    const stored = localStorage.getItem('macdShowSignalLine');
    return stored ? JSON.parse(stored) : true;
  });
  const [showHistogramLine, setShowHistogramLine] = useState(() => {
    const stored = localStorage.getItem('macdShowHistogramLine');
    return stored ? JSON.parse(stored) : true;
  });





  const handleSettings = (val) => {

    switch (val.indicatorName) {
      case 'EMA':
        localStorage.setItem("emaPeriod", val.periodVal)
        setEmaPeriod(val.periodVal);
        localStorage.setItem("emaLineColor", val.lineColor)
        setEmaLineColor(val.lineColor);
        break;
      case 'SMA':
        localStorage.setItem("smaPeriod", val.periodVal)
        setSmaPeriod(val.periodVal);
        localStorage.setItem("smaLineColor", val.lineColor)
        setSmaLineColor(val.lineColor);

        break;
      case 'WMA':
        localStorage.setItem("wmaPeriod", val.periodVal)
        setWmaPeriod(val.periodVal);
        localStorage.setItem("wmaLineColor", val.lineColor)
        setWmaLineColor(val.lineColor);

        break;
      case 'BB':
        localStorage.setItem("bbPeriod", val.periodVal)
        setBbPeriod(val.periodVal);
        localStorage.setItem("bbLineColor", val.lineColor)
        setBbLineColor(val.lineColor);

        break;
      case 'ZigZag':
        localStorage.setItem("zigzagDeviation", val.deviationVal || val.periodVal)
        setZigzagDeviation(val.deviationVal || val.periodVal);
        localStorage.setItem("zigzagDepth", val.depthVal || 12)
        setZigzagDepth(val.depthVal || 12);
        localStorage.setItem("zigzagBackStep", val.backStepVal || 3)
        setZigzagBackStep(val.backStepVal || 3);
        localStorage.setItem("zigzagLineColor", val.lineColor)
        setZigzagLineColor(val.lineColor);

        break;
      case 'RSI':
        localStorage.setItem("rsiPeriod", val.periodVal)
        setRsiPeriod(val.periodVal);
        localStorage.setItem("rsiLineColor", val.lineColor)
        setRsiLineColor(val.lineColor);

        break;
      case 'Volume':
        if (val.volumeColor1) {
          localStorage.setItem("volumeColor1", val.volumeColor1);
          setVolumeColor1(val.volumeColor1);
        }
        if (val.volumeColor2) {
          localStorage.setItem("volumeColor2", val.volumeColor2);
          setVolumeColor2(val.volumeColor2);
        }
        // Keep backward compatibility
        if (val.lineColor) {
          localStorage.setItem("volumeColor", val.lineColor);
          setVolumeColor(val.lineColor);
        }
        break;
      case 'Alligator':
        if (val.jawColor) {
          localStorage.setItem("alligatorJawColor", val.jawColor);
          setAlligatorJawColor(val.jawColor);
        }
        if (val.teethColor) {
          localStorage.setItem("alligatorTeethColor", val.teethColor);
          setAlligatorTeethColor(val.teethColor);
        }
        if (val.lipsColor) {
          localStorage.setItem("alligatorLipsColor", val.lipsColor);
          setAlligatorLipsColor(val.lipsColor);
        }
        if (val.jawPeriod) {
          localStorage.setItem("alligatorJawPeriod", val.jawPeriod);
          setAlligatorJawPeriod(val.jawPeriod);
        }
        if (val.jawShift) {
          localStorage.setItem("alligatorJawShift", val.jawShift);
          setAlligatorJawShift(val.jawShift);
        }
        if (val.teethPeriod) {
          localStorage.setItem("alligatorTeethPeriod", val.teethPeriod);
          setAlligatorTeethPeriod(val.teethPeriod);
        }
        if (val.teethShift) {
          localStorage.setItem("alligatorTeethShift", val.teethShift);
          setAlligatorTeethShift(val.teethShift);
        }
        if (val.lipsPeriod) {
          localStorage.setItem("alligatorLipsPeriod", val.lipsPeriod);
          setAlligatorLipsPeriod(val.lipsPeriod);
        }
        if (val.lipsShift) {
          localStorage.setItem("alligatorLipsShift", val.lipsShift);
          setAlligatorLipsShift(val.lipsShift);
        }
        break;
      case 'Parabolic':
        if (val.stepVal) {
          localStorage.setItem("parabolicStep", val.stepVal);
          setParabolicStep(val.stepVal);
        }

        if (val.lineColor) {
          localStorage.setItem("parabolicLineColor", val.lineColor);
          setParabolicLineColor(val.lineColor);
        }
        break;
      case 'MACD':
        if (val.macdFastPeriod) {
          localStorage.setItem("macdFastPeriod", val.macdFastPeriod);
          setMacdFastPeriod(val.macdFastPeriod);
        }
        if (val.macdSlowPeriod) {
          localStorage.setItem("macdSlowPeriod", val.macdSlowPeriod);
          setMacdSlowPeriod(val.macdSlowPeriod);
        }
        if (val.macdSignalPeriod) {
          localStorage.setItem("macdSignalPeriod", val.macdSignalPeriod);
          setMacdSignalPeriod(val.macdSignalPeriod);
        }
        if (val.macdLineColor) {
          localStorage.setItem("macdLineColor", val.macdLineColor);
          setMacdLineColor(val.macdLineColor);
        }
        if (val.macdSignalColor) {
          localStorage.setItem("macdSignalColor", val.macdSignalColor);
          setMacdSignalColor(val.macdSignalColor);
        }
        if (val.macdHistogramColor) {
          localStorage.setItem("macdHistogramColor", val.macdHistogramColor);
          setMacdHistogramColor(val.macdHistogramColor);
        }
        if (val.showMacdLine !== undefined) {
          localStorage.setItem("macdShowMacdLine", JSON.stringify(val.showMacdLine));
          setShowMacdLine(val.showMacdLine);
        }
        if (val.showSignalLine !== undefined) {
          localStorage.setItem("macdShowSignalLine", JSON.stringify(val.showSignalLine));
          setShowSignalLine(val.showSignalLine);
        }
        if (val.showHistogramLine !== undefined) {
          localStorage.setItem("macdShowHistogramLine", JSON.stringify(val.showHistogramLine));
          setShowHistogramLine(val.showHistogramLine);
        }
        break;
      case 'donchianchannel':
        if (val.donchianPeriod) {
          localStorage.setItem("donchianPeriod", val.donchianPeriod);
          setDonchianPeriod(val.donchianPeriod);
        }
        if (val.donchianUpperColor) {
          localStorage.setItem("donchianUpperColor", val.donchianUpperColor);
          setDonchianUpperColor(val.donchianUpperColor);
        }
        if (val.donchianMiddleColor) {
          localStorage.setItem("donchianMiddleColor", val.donchianMiddleColor);
          setDonchianMiddleColor(val.donchianMiddleColor);
        }
        if (val.donchianLowerColor) {
          localStorage.setItem("donchianLowerColor", val.donchianLowerColor);
          setDonchianLowerColor(val.donchianLowerColor);
        }
        if (val.donchianFillColor) {
          localStorage.setItem("donchianFillColor", val.donchianFillColor);
          setDonchianFillColor(val.donchianFillColor);
        }
        break;
      case 'IchimokuCloud':
        if (val.ichimokuTenkanPeriod) {
          localStorage.setItem("ichimokuTenkanPeriod", val.ichimokuTenkanPeriod);
          setIchimokuTenkanPeriod(val.ichimokuTenkanPeriod);
        }
        if (val.ichimokuKijunPeriod) {
          localStorage.setItem("ichimokuKijunPeriod", val.ichimokuKijunPeriod);
          setIchimokuKijunPeriod(val.ichimokuKijunPeriod);
        }
        if (val.ichimokuSenkouBPeriod) {
          localStorage.setItem("ichimokuSenkouBPeriod", val.ichimokuSenkouBPeriod);
          setIchimokuSenkouBPeriod(val.ichimokuSenkouBPeriod);
        }
        if (val.ichimokuTenkanColor) {
          localStorage.setItem("ichimokuTenkanColor", val.ichimokuTenkanColor);
          setIchimokuTenkanColor(val.ichimokuTenkanColor);
        }
        if (val.ichimokuKijunColor) {
          localStorage.setItem("ichimokuKijunColor", val.ichimokuKijunColor);
          setIchimokuKijunColor(val.ichimokuKijunColor);
        }
        if (val.ichimokuChikouColor) {
          localStorage.setItem("ichimokuChikouColor", val.ichimokuChikouColor);
          setIchimokuChikouColor(val.ichimokuChikouColor);
        }
        if (val.ichimokuSenkouAColor) {
          localStorage.setItem("ichimokuSenkouAColor", val.ichimokuSenkouAColor);
          setIchimokuSenkouAColor(val.ichimokuSenkouAColor);
        }
        if (val.ichimokuSenkouBColor) {
          localStorage.setItem("ichimokuSenkouBColor", val.ichimokuSenkouBColor);
          setIchimokuSenkouBColor(val.ichimokuSenkouBColor);
        }
        if (val.ichimokuFillColor) {
          localStorage.setItem("ichimokuFillColor", val.ichimokuFillColor);
          setIchimokuFillColor(val.ichimokuFillColor);
        }
        if (val.ichimokuShowFill !== undefined) {
          localStorage.setItem("ichimokuShowFill", JSON.stringify(val.ichimokuShowFill));
          setIchimokuShowFill(val.ichimokuShowFill);
        }
        break;
      default:
        break;
    }
  };



  const emaSeriesRef = useRef(null);
  const smaSeriesRef = useRef(null);
  const wmaSeriesRef = useRef(null);
  const zigzagSeriesRef = useRef(null);
  const rsiSeriesRef = useRef(null);
  const rsiOverBoughtLineRef = useRef(null);
  const rsiCenterLineRef = useRef(null);
  const rsiOverSoldLineRef = useRef(null);
  const volumeSeriesRef = useRef(null);

  const bbUpperSeriesRef = useRef(null);
  const bbMiddleSeriesRef = useRef(null);
  const bbLowerSeriesRef = useRef(null);

  const alligatorJawSeriesRef = useRef(null);
  const alligatorTeethSeriesRef = useRef(null);
  const alligatorLipsSeriesRef = useRef(null);
  const parabolicSeriesRef = useRef(null);

  // MACD series refs
  const macdSeriesRef = useRef(null);
  const macdSignalSeriesRef = useRef(null);
  const macdHistogramSeriesRef = useRef(null);

  // Donchian Channel series refs
  const donchianUpperSeriesRef = useRef(null);
  const donchianMiddleSeriesRef = useRef(null);
  const donchianLowerSeriesRef = useRef(null);
  const donchianFillSeriesRef = useRef(null);

  // Ichimoku Cloud series refs
  const ichimokuTenkanSeriesRef = useRef(null);
  const ichimokuKijunSeriesRef = useRef(null);
  const ichimokuChikouSeriesRef = useRef(null);
  const ichimokuSenkouASeriesRef = useRef(null);
  const ichimokuSenkouBSeriesRef = useRef(null);
  const ichimokuFillSeriesRef = useRef(null);


  // --- Indicator Toggle Helper ---
  const toggleIndicator = (indicator) => {
    console.log("Apply", indicator);
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
  const [showAmountCalculator, setShowAmountCalculator] = useState(false);

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

  const allSymbols = useSelector((state) => state.getAllSymbols.getAllSymbols);
  const [percentage, setPercentage] = useState([]);
  const [tradeIcon, setTradeIcon] = useState([]);
  const [symbolPercentage, setSymbolPercentage] = useState(null);
  const [symbolIcon, setSymbolIcon] = useState(null);
  const [marketActive, setMarketActive] = useState([]);
  const [symbolMarketActive, setSymbolMarketActive] = useState(null);
  const [testResponse, setTestResponse] = useState(null);
  const handledOrderIdsRef = useRef(new Set());
  const [amount, setAmount] = useState(100);
  const priceLinesSeriesRef = useRef({});

  // console.log('closedOrder', closedOrder);
  // console.log('allSymbols', allSymbols);


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
      dispatch(fetchSymbols()); // Fetch symbol names for the dropdown
    }
  }, [dispatch, token]);

  useEffect(() => {
    setPercentage(allSymbols);
    setMarketActive(allSymbols);
    setTradeIcon(allSymbols)
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
    if (tradeIcon?.length && selectedSymbol) {
      const iconFound = tradeIcon?.find(p => p.symbol === selectedSymbol);
      setSymbolIcon(iconFound?.iconPath ?? "");
    }

  }, [percentage, selectedSymbol, marketActive, tradeIcon]);

  // console.log('type of selected symbol market status', typeof(symbolMarketActive))



  const editIndicators = () => {

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
    const bbLineColor = localStorage.getItem("bbLineColor")
    if (bbLineColor) {
      setBbLineColor(bbLineColor);
    }

    // ZigZag parameters
    setZigzagDeviation(Number(localStorage.getItem("zigzagDeviation")) || 5);
    setZigzagDepth(Number(localStorage.getItem("zigzagDepth")) || 12);
    setZigzagBackStep(Number(localStorage.getItem("zigzagBackStep")) || 3);
    const zigzagLineColor = localStorage.getItem("zigzagLineColor");
    if (zigzagLineColor) {
      setZigzagLineColor(zigzagLineColor);
    }

    // RSI parameters
    setRsiPeriod(Number(localStorage.getItem("rsiPeriod")) || 14);
    const rsiLineColor = localStorage.getItem("rsiLineColor");
    if (rsiLineColor) {
      setRsiLineColor(rsiLineColor);
    }

    // Volume parameters
    const volumeColor = localStorage.getItem("volumeColor");
    if (volumeColor) {
      setVolumeColor(volumeColor);
    }

    // Parabolic SAR parameters
    setParabolicStep(Number(localStorage.getItem("parabolicStep")) || 0.02);
    const parabolicLineColor = localStorage.getItem("parabolicLineColor");
    if (parabolicLineColor) {
      setParabolicLineColor(parabolicLineColor);
    }

    // MACD parameters
    setMacdFastPeriod(Number(localStorage.getItem("macdFastPeriod")) || 12);
    setMacdSlowPeriod(Number(localStorage.getItem("macdSlowPeriod")) || 26);
    setMacdSignalPeriod(Number(localStorage.getItem("macdSignalPeriod")) || 9);
    const macdLineColor = localStorage.getItem("macdLineColor");
    if (macdLineColor) {
      setMacdLineColor(macdLineColor);
    }
    const macdSignalColor = localStorage.getItem("macdSignalColor");
    if (macdSignalColor) {
      setMacdSignalColor(macdSignalColor);
    }
    const macdHistogramColor = localStorage.getItem("macdHistogramColor");
    if (macdHistogramColor) {
      setMacdHistogramColor(macdHistogramColor);
    }
  }
  useEffect(() => {
    editIndicators();

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
      if (indicator === 'BB') {
        const { upper, middle, lower } = calculateBB(mappedData, bbPeriod);
        if (bbUpperSeriesRef.current) bbUpperSeriesRef.current.setData(upper);
        if (bbMiddleSeriesRef.current) bbMiddleSeriesRef.current.setData(middle);
        if (bbLowerSeriesRef.current) bbLowerSeriesRef.current.setData(lower);
      }
      if (indicator === 'ZigZag' && zigzagSeriesRef.current) {
        const zigzagData = calculateZigZag(mappedData, zigzagDeviation, zigzagDepth, zigzagBackStep);
        console.log('ZigZag update data points:', zigzagData.length, zigzagData);
        if (zigzagData.length > 0) {
          zigzagSeriesRef.current.setData(zigzagData);
        }
      }
      if (indicator === 'RSI' && rsiSeriesRef.current) {
        const rsiData = calculateRSI(mappedData, rsiPeriod);
        rsiSeriesRef.current.setData(rsiData);
      }
      if (indicator === 'Volume' && volumeSeriesRef.current) {
        const volumeData = calculateVolume(mappedData, volumeColor1, volumeColor2);
        volumeSeriesRef.current.setData(volumeData);
      }

    });
  }, [lastCandleRef, mappedData, activeIndicators, emaPeriod, smaPeriod, wmaPeriod, bbPeriod, zigzagDeviation, zigzagDepth, rsiPeriod, volumeColor1, volumeColor2]);


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
    bbPeriod,
    bbLineColor,
    zigzagDeviation,
    zigzagDepth,
    zigzagLineColor,
    rsiPeriod,
    rsiLineColor,
    volumeColor,
    alligatorJawColor,
    alligatorTeethColor,
    alligatorLipsColor,
    alligatorJawPeriod,
    alligatorJawShift,
    alligatorTeethPeriod,
    alligatorTeethShift,
    alligatorLipsPeriod,
    alligatorLipsShift
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
          // const { icon, color } = getSymbolDetails(symbolKey);
          const percentObj = percentage?.find(p => p.symbol === symbolKey);
          const iconObj = tradeIcon?.find(p => p.symbol === symbolKey);
          const symbolObj = allSymbols?.find(s => s.symbol === symbolKey);

          return {
            value: symbolKey,
            icon: iconObj?.iconPath ?? "",
            // color,
            percent: percentObj?.profit_percentage ?? 0,
            category: symbolObj?.category ?? "Other",

          };
        })
        .filter(symbol => {
          // Filter by active tab category
          if (activeTab === 'FAVORITES') {
            return favorites.includes(symbol.value);
          }
          return symbol.category.toUpperCase() === activeTab;
        })
      : [];
  }, [derivedSymbols, percentage, searchTerm, allSymbols, activeTab, favorites]);

  // Since we're filtering by activeTab, we don't need to group anymore
  // Just use filteredOptions directly for the current category
  const groupedSymbols = useMemo(() => {
    if (activeTab === 'FAVORITES') {
      return { 'Favorites': filteredOptions };
    }
    const categoryName = activeTab.charAt(0) + activeTab.slice(1).toLowerCase();
    return { [categoryName]: filteredOptions };
  }, [filteredOptions, activeTab]);

  const selected = selectedSymbol || 'BTCUSD';
  const selectedSymbolIcon = useMemo(() => {
    const key = selectedSymbol || 'BTCUSD';
    const iconObj = tradeIcon?.find(item => item.symbol === key);
    return iconObj?.iconPath || '';
  }, [selectedSymbol, tradeIcon]);

  // const { icon, color } = getSymbolDetails(selected);

  function getSymbolFullName(symbol) {
    return symbolFullNames[symbol.replace(".ex1", "")] || symbol;
  }

  const handleSelectChange = (selectedOption) => {
    if (!selectedOption) return;
    // console.log('selected symbol options', selectedOption)
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

    // ✅ Clear all custom markers immediately to prevent showing wrong symbol markers
    console.log(`🧹 Symbol changed to ${newSymbol} - clearing all markers`);
    clearAllCustomMarkers();

    // Debug marker state after clearing
    setTimeout(() => {
      debugMarkerState();
    }, 100);

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
  const toggleCategory = () => setCategoryDropdownOpen(!categoryDropdownOpen);

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
    console.log('price input change', e.target.value);
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


  const closeIndicatorSettings = () => {
    setIndicatorSettingsModal(false);
    setSelectedIndicatorForSettings(null);
  };


  const openIndicatorSettings = (indicator) => {
    setSelectedIndicatorForSettings(indicator);
    setIndicatorSettingsModal(true);
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
      upColor: "#00cc01",
      downColor: "#ff0000",
      wickUpColor: "#00cc01",
      wickDownColor: "#ff0000",
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
          bottomLineColor: "#FF0000",
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
            color: change >= 0 ? "#26a69a" : "#FF0000",
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
    if (!symbols) return toast.error("Market data not available.");

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

    const bid = symbols[selectedSymbol]?.bid || 0;

    const orderPayload = {
      trade_account_id: selectedAccount?.id,
      symbol: selectedSymbol,
      stake: price,
      direction: type,
      expiry_seconds: time,
    };

    dispatch(deductBalanceImmediately(price));

    // Step 1: Create a TEMP ID and add pointer immediately
    const tempId = generateTempId();
    const now = Date.now();
    const placed_at = new Date(now).toISOString();
    const expiry_at = new Date(now + time * 1000).toISOString();

    const tempResponse = {
      direction: type,
      placed_time: placed_at,
      expiry_time: expiry_at,
      strike_price: price,
      stake: price,
      symbol: selectedSymbol,
    };

    // 🔥 Immediately place temp marker and order
    handleAddPointer(type, tempResponse, tempId, true);

    // Step 2: Dispatch actual API call
    dispatch(placeOrder({ orderPayload })).then((response) => {
      if (response.meta.requestStatus === 'fulfilled') {
        const realId = response.payload.primaryResponse.data.id.toString();
        const real = response.payload.testResponse;

        const placedTime = new Date(real.placed_time).getTime();
        const expiryTime = new Date(real.expiry_time).getTime();
        updateChartMarkers();
        // ✅ Replace temp custom marker with real marker
        removeCustomMarker(`marker-${tempId}`);

        // ✅ Calculate the current candle time using the helper function
        const candleTime = calculateCandleTime();

        const finalMarkerOptions = {
          content: `${real.direction === 'call' ? '' : ''}$${real.stake}`,
          type: real.direction === 'call' ? 'BUY' : 'SELL',
          id: `marker-${realId}`,
          markerType: 'betting-win',
          customClass: `${real.direction === 'call' ? 'buy' : 'sell'}-order confirmed`,
          tooltip: `${real.direction === 'call' ? 'BUY' : 'SELL'} Order: $${real.stake} | Candle: ${new Date(candleTime * 1000).toISOString()}`,
          animate: true,
          drawPriceLine: true,
          lineWidth: 2,
          lineStyle: 1
        };

        if (chartRef.current && seriesRef.current) {
          // Use the order's strike price (if available) so the marker sticks to the entry price
          const markerPrice = (real && (real.strike_price !== undefined && real.strike_price !== null)) ? real.strike_price : bid;
          addCustomMarker(
            chartRef.current,
            seriesRef.current,
            candleTime, // Use candleTime instead of currentTime
            markerPrice,
            finalMarkerOptions
          );
        }

        // ✅ Replace temp order with real order
        setActiveOrders(prev => {
          const updated = prev.map(order =>
            order.id === tempId
              ? {
                ...order,
                id: realId,
                createdAt: placedTime,
                time: expiryTime,
                remainingTime: getExpirySeconds(real.placed_time, real.expiry_time),
              }
              : order
          );
          localStorage.setItem("activeTrades", JSON.stringify(updated));
          return updated;
        });

        dispatch(addTrade({
          id: realId,
          symbol: real.symbol,
          type: real.direction === 'call' ? 'BUY' : 'SELL',
          price: real.strike_price,
          amount: real.stake,
          initialPrice: bid,
          time: expiryTime,
          createdAt: placedTime,
          remainingTime: getExpirySeconds(real.placed_time, real.expiry_time),
        }));

        startOrderTimer(realId, getExpirySeconds(real.placed_time, real.expiry_time));
      } else {
        updateChartMarkers();
        // ❌ Cleanup if API fails
        removeCustomMarker(`marker-${tempId}`);

        setActiveOrders(prev => {
          const filtered = prev.filter(o => o.id !== tempId);
          localStorage.setItem("activeTrades", JSON.stringify(filtered));
          return filtered;
        });

        dispatch(refundBalance(price));
      }
    });
  };




  const handlePlacePendingOrder = async (type) => {
    // console.log('selectedOption', selectedOption);
    console.log('selectedOption type', selectedOption?.type);

    let selectedOptionValue = selectedOption?.type === "time" ? selectedOption?.value : selectedOption?.value

    let execution_Date = ""
    if (selectedOption?.type === "time") {
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
      if (selectedOption?.type === "time") {
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
      } else if (selectedOption?.type === "price") {
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
      // console.log("selected option type", selectedOption.type)

      // 🔹 Place order API call first before deducting balance
      dispatch(placePendingOrder({ type: selectedOption?.type, orderPayload })).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          dispatch(deductBalanceImmediately(price)); // ✅ Deduct balance only if success
          setSelectedOption(null);
          // setOrderSuccessAlertPending(true);
          setOrderErrorAlertPending(null);

          // ✅ Auto-hide after 3 seconds
          // setTimeout(() => setOrderSuccessAlertPending(false), 3000);
        } else {
          console.error("❌ Order API Failed:", response.error);
          setSelectedOption(null);
          dispatch(refundBalance(price)); // ✅ Refund if API fails
          setOrderErrorAlertPending(response.error?.message || "Failed to place order!");

          // ✅ Auto-hide after 3 seconds
          setTimeout(() => setOrderErrorAlertPending(null), 3000);
        }
      });

      setOrderSuccessAlertPending(true);
      setTimeout(() => setOrderSuccessAlertPending(false), 3000);

    }
  };

  useEffect(() => {
    if (selectedAccount?.id) {
      dispatch(listenForOrderCloseUpdates(selectedAccount.id));
    }
  }, [selectedAccount, dispatch]);




  useEffect(() => {
    console.log("Latest Order Result or Closed Order changed:", { latestOrderResult, closedOrder });
    if (latestOrderResult && closedOrder) {
      const notification = {
        id: Date.now(),
        result: latestOrderResult,
        symbol: closedOrder.symbol,
        stake: closedOrder.stake,
        payout: closedOrder.profit ?? closedOrder?.win_amount,
        direction: closedOrder.direction,
        duration: closedOrder.expiry_seconds,
        timestamp: new Date().toISOString()
      };
      console.log("Notification:", notification);
      setAlerts(prev => [...prev, notification]);
      dispatch(clearLatestOrderResult());
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== notification.id));
      }, 5000);
    }
  }, [latestOrderResult, closedOrder, dispatch]);


  const getExpirySeconds = (placedTime, expiryTime) => {
    const placed = new Date(placedTime).getTime();
    const expiry = new Date(expiryTime).getTime();
    const diff = Math.floor((expiry - placed) / 1000);
    return diff > 0 ? diff : 0;
  };

  // Helper function to calculate candle time aligned with chart's timeframe
  const calculateCandleTime = useCallback((timestamp = null) => {
    const targetDate = timestamp ? new Date(timestamp) : new Date();

    const utcTime = Math.floor(Date.UTC(
      targetDate.getUTCFullYear(),
      targetDate.getUTCMonth(),
      targetDate.getUTCDate(),
      targetDate.getUTCHours(),
      targetDate.getUTCMinutes(),
      targetDate.getUTCSeconds()
    ) / 1000);

    // Convert to UTC+7 (same as chart) by adding 25200 seconds (7 hours)
    const gmtPlusSevenTime = utcTime + 25200;
    const timeframeSeconds = timeframes[selectedTimeframe];
    const candleTime = Math.floor(gmtPlusSevenTime / timeframeSeconds) * timeframeSeconds;

    return candleTime;
  }, [selectedTimeframe]);

  // console.log("alerts", alerts);


  // console.log("All current markers:", markersRef.current);



  const handleAddPointer = (type, testResponse, orderId, isTemporary = false) => {
    if (!isChartMountedRef.current) {
      console.warn("Chart is not mounted. Skipping marker addition.");
      return;
    }

    // ✅ Only create visual marker if the order is for the currently selected symbol
    if (testResponse.symbol !== selectedSymbol) {
      console.log(`🚫 Skipping marker creation for ${testResponse.symbol} - current symbol is ${selectedSymbol}`);
      // Still create the order in state but don't show marker visually
      const orderType = type === 'call' ? 'BUY' : 'SELL';
      const bid = symbols[testResponse.symbol]?.bid || 0;
      const placedAt = new Date(testResponse.placed_time).getTime() - 7 * 3600 * 1000; // Adjust for UTC+7
      const expiryAt = new Date(testResponse.expiry_time).getTime();
      const remainingTime = getExpirySeconds(testResponse.placed_time, testResponse.expiry_time);

      const newOrder = {
        id: orderId,
        symbol: testResponse.symbol,
        type: orderType,
        price: testResponse.stake,
        amount: testResponse.stake,
        initialPrice: bid,
        time: expiryAt,
        createdAt: placedAt,
        remainingTime,
      };

      setActiveOrders(prev => {
        const existsIndex = prev.findIndex(o => o.id === orderId);
        let updated;
        if (existsIndex !== -1) {
          updated = [...prev];
          updated[existsIndex] = newOrder;
        } else {
          updated = [...prev, newOrder];
        }
        localStorage.setItem("activeTrades", JSON.stringify(updated));
        setOrderCount(updated.length);
        return updated;
      });

      if (!isTemporary) {
        startOrderTimer(orderId, remainingTime);
      }
      return;
    }

    console.log('🎯 Adding pointer for order:', { type, orderId, isTemporary, symbol: testResponse.symbol });

    const orderType = type === 'call' ? 'BUY' : 'SELL';
    const bid = symbols[selectedSymbol]?.bid || 0;

    const placedAt = new Date(testResponse.placed_time).getTime();
    const expiryAt = new Date(testResponse.expiry_time).getTime();
    const remainingTime = getExpirySeconds(testResponse.placed_time, testResponse.expiry_time);

    // ✅ Calculate the current candle time using the helper function
    const candleTime = calculateCandleTime();

    console.log('Marker placement:', {
      candleTime,
      selectedTimeframe,
      timeframeSeconds: timeframes[selectedTimeframe]
    });

    // ✅ 1. Create custom marker immediately - use aligned candle time and current price
    if (chartRef.current && seriesRef.current) {
      const markerOptions = {
        content: `${orderType === 'BUY' ? '' : ''}$${testResponse.stake}`,
        type: orderType,
        id: `marker-${orderId}`,
        markerType: 'betting-win',
        customClass: `${orderType.toLowerCase()}-order ${isTemporary ? 'temp' : 'confirmed'}`,
        tooltip: `${orderType} Order: $${testResponse.stake} | ${isTemporary ? 'Temporary' : 'Confirmed'} | Candle: ${new Date(candleTime * 1000).toISOString()}`,
        animate: true,
        drawPriceLine: true,
        lineWidth: 2,
        lineStyle: 1
      };

      // Use aligned candle time so marker appears on the current candle
      // addCustomMarker(
      //   chartRef.current,
      //   seriesRef.current,
      //   candleTime, // Use candleTime instead of currentTime
      //   bid,
      //   markerOptions
      // );

    }

    // ✅ 2. Update or insert order
    const newOrder = {
      id: orderId,
      symbol: testResponse.symbol,
      type: orderType,
      price: testResponse.stake,
      amount: testResponse.stake,
      initialPrice: bid,
      time: expiryAt,
      createdAt: placedAt,
      remainingTime,
    };

    setActiveOrders(prev => {
      const existsIndex = prev.findIndex(o => o.id === orderId);

      let updated;
      if (existsIndex !== -1) {
        updated = [...prev];
        updated[existsIndex] = newOrder;
      } else {
        updated = [...prev, newOrder];
      }
      localStorage.setItem("activeTrades", JSON.stringify(updated));
      setOrderCount(updated.length);
      return updated;
    });

    if (!isTemporary) {
      // Start the countdown timer
      startOrderTimer(orderId, remainingTime);

      // ✅ Also set up a direct timeout as backup for marker removal
      setTimeout(() => {
        console.log(`⏰ Direct timeout expired - ensuring marker ${orderId} is removed`);
        removeMarker(orderId);
      }, remainingTime * 1000);
    }

    showToastMessage(`${orderType} order placed at price: ${bid}`);
  };



  const updateChartMarkers = () => {
    try {
      if (
        !isChartMountedRef.current ||
        !seriesRef.current ||
        !seriesRef.current.setMarkers
      ) return;

      const sorted = [...markersRef.current].sort((a, b) => a.time - b.time);
      seriesRef.current.setMarkers(sorted);

    } catch (error) {
      if (error?.message?.includes("disposed")) {
        console.warn("Chart disposed — skipping marker update.");
      } else {
        console.error("Marker update error:", error);
      }
    }
  };

  useEffect(() => {
    isChartMountedRef.current = true;
    return () => {
      isChartMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    isChartMountedRef.current = true;
    return () => {
      isChartMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    updateChartMarkers();
  }, [activeOrders, selectedSymbol, mappedData]);


  const startOrderTimer = (orderId, duration) => {
    console.log(`⏰ Starting order timer for ${orderId} with ${duration} seconds remaining`);

    if (duration <= 0) {
      console.log(`⏰ Order ${orderId} already expired - removing immediately`);
      removeMarker(orderId); // remove expired marker
      setActiveOrders(prev => {
        const updated = prev.filter(o => o.id !== orderId);
        localStorage.setItem("activeTrades", JSON.stringify(updated));
        return updated;
      });
      return;
    }

    // Clear existing timer if any
    if (orderTimersRef.current[orderId]) {
      clearInterval(orderTimersRef.current[orderId]);
    }

    // Set up countdown timer that ticks every second
    orderTimersRef.current[orderId] = setInterval(() => {
      setActiveOrders(prev => {
        const updatedOrders = prev.map(order => {
          if (order.id === orderId) {
            const newRemainingTime = order.remainingTime - 1;

            if (newRemainingTime <= 0) {
              console.log(`⏰ Order ${orderId} timer reached 0 - removing marker and calculating result`);
              clearInterval(orderTimersRef.current[orderId]);
              delete orderTimersRef.current[orderId];

              // Calculate final result
              const currentBid = symbols[order.symbol]?.bid || 0;
              let result = "DRAW";
              if (order.type === "BUY") {
                result = currentBid > order.initialPrice ? "WIN" : (currentBid < order.initialPrice ? "LOSS" : "DRAW");
              } else {
                result = currentBid < order.initialPrice ? "WIN" : (currentBid > order.initialPrice ? "LOSS" : "DRAW");
              }

              // Remove marker and show completion message
              removeMarker(orderId);
              showToastMessage(`Order ${order.type} completed: ${result}`);
              return null; // Remove from state
            }

            // Update remaining time
            return { ...order, remainingTime: newRemainingTime };
          }
          return order;
        }).filter(Boolean);

        // Update localStorage with new remaining times
        localStorage.setItem("activeTrades", JSON.stringify(updatedOrders));
        setOrderCount(updatedOrders.length);
        return updatedOrders;
      });
    }, 1000); // Update every second
  };




  const removeMarker = (orderId) => {
    console.log("🧼 Removing marker and horizontal line:", orderId);

    // Clear any scheduled hide timeout for this marker
    try {
      if (markerHideTimersRef.current && markerHideTimersRef.current[orderId]) {
        clearTimeout(markerHideTimersRef.current[orderId]);
        delete markerHideTimersRef.current[orderId];
        console.log(`✅ Cleared hide timeout for marker ${orderId}`);
      }
    } catch (e) {
      console.warn('Failed to clear marker hide timeout for', orderId, e);
    }

    // 1. Remove custom marker (which will also remove its horizontal line)
    removeCustomMarker(`marker-${orderId}`);
    console.log(`✅ Removed custom marker for order ${orderId}`);

    // 2. Clear countdown timer
    if (orderTimersRef.current[orderId]) {
      clearInterval(orderTimersRef.current[orderId]);
      delete orderTimersRef.current[orderId];
      console.log(`✅ Cleared countdown timer for order ${orderId}`);
    }

    // 3. Remove from activeOrders state AND localStorage
    setActiveOrders(prev => {
      const updated = prev.filter(order => order.id !== orderId);
      setOrderCount(updated.length);
      localStorage.setItem("activeTrades", JSON.stringify(updated));
      console.log(`✅ Removed order ${orderId} from state and localStorage`);
      return updated;
    });

    // 4. Ensure direct cleanup in localStorage (fallback)
    const stored = JSON.parse(localStorage.getItem("activeTrades") || "[]");
    const filtered = stored.filter(order => order.id !== orderId);
    localStorage.setItem("activeTrades", JSON.stringify(filtered));

    // 5. Remove from orderMarkers if used
    const localMarkers = JSON.parse(localStorage.getItem("orderMarkers") || "{}");
    if (localMarkers[orderId]) {
      delete localMarkers[orderId];
      localStorage.setItem("orderMarkers", JSON.stringify(localMarkers));
    }

  };

  // ✅ Helper function to remove markers that don't belong to current symbol
  const removeMarkersForOtherSymbols = (currentSymbol) => {

    const storedOrders = JSON.parse(localStorage.getItem("activeTrades") || "[]");
    const otherSymbolOrders = storedOrders.filter(order => order.symbol !== currentSymbol);

    otherSymbolOrders.forEach(order => {
      const markerId = `marker-${order.id}`;
      const existingMarker = customMarkersRef.current.find(m => m.id === markerId);
      if (existingMarker) {
        removeCustomMarker(markerId);
      }
    });
  };

  // 🐛 Debug function to check current marker state
  const debugMarkerState = () => {
    const activeOrders = JSON.parse(localStorage.getItem('activeTrades') || '[]');
    const visibleMarkers = customMarkersRef.current;

    console.log('=== MARKER DEBUG STATE ===');
    console.log(`Current Symbol: ${selectedSymbol}`);
    console.log(`Active Orders Total: ${activeOrders.length}`);
    console.log(`Visible Markers in Memory: ${visibleMarkers.length}`);

    activeOrders.forEach(order => {
      const markerExists = customMarkersRef.current.find(m => m.id === `marker-${order.id}`);
      const shouldShow = order.symbol === selectedSymbol;
      console.log(`Order ${order.id} (${order.symbol}): Memory=${!!markerExists}, Should Show=${shouldShow}`);
    });

    console.log('========================');
  };

  // Make debug function globally accessible
  useEffect(() => {
    window.debugMarkerState = debugMarkerState;
    return () => {
      delete window.debugMarkerState;
    };
  }, [selectedSymbol]);

  // Custom marker management system
  const customMarkersRef = useRef([]);
  // Keep track of any created price lines so we can remove them later
  const customPriceLinesRef = useRef({});
  const markerContainerRef = useRef(null);

  // Initialize marker container
  useEffect(() => {
    if (!markerContainerRef.current && chartContainerRef.current) {
      const container = document.createElement('div');
      container.id = 'custom-markers-container';
      container.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
        overflow: visible;
      `;
      chartContainerRef.current.appendChild(container);
      markerContainerRef.current = container;
      console.log('✅ Marker container initialized');
    }

    return () => {
      if (markerContainerRef.current && markerContainerRef.current.parentNode) {
        markerContainerRef.current.remove();
        markerContainerRef.current = null;
        console.log('🧹 Marker container removed');
      }
    };
  }, []);

  // Custom marker creation function with full styling capabilities
  // ...existing code...
  const addCustomMarker = useCallback((chart, series, time, price, options = {}) => {
    if (!markerContainerRef.current || !isChartMountedRef.current) {
      console.warn("Chart or marker container not available");
      return null;
    }


    const {
      content = '',
      type = 'BUY', // 'BUY' or 'SELL'
      id = `marker-${Date.now()}`,
      customClass = '',
      styles = {},
      icon = null,
      backgroundImage = null,
      animate = true,
      tooltip = '',
      onClick = null,
      markerType = 'default' // Add markerType option
    } = options;

    // Create marker element
    const marker = document.createElement('div');
    marker.id = id;
    marker.className = `custom-trading-marker ${customClass} ${type.toLowerCase()}-marker`;

    // Set content based on marker type
    if (markerType === 'betting-win') {
      const borderColor = type === 'BUY' ? '#16a34a' : '#ef4444';
      const backgroundColor = type === 'BUY' ? '#16a34a' : '#ef4444';

      const arrowHtml = type === 'BUY'
        ? `<!-- Arrow (pointing up) -->\n          <div style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 10px solid ${borderColor};"></div>`
        : `<!-- Arrow (pointing down) -->\n          <div style="position: absolute; bottom: -10px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 10px solid ${borderColor};"></div>`;

      marker.innerHTML = `
      <div class="betting-win-container" style="
        background: ${backgroundColor};
        color: white;
        border-radius: 25px;
        padding: 2px 18px;
        display: flex;  
        align-items: center;
        gap: 8px;
        position: relative;
        min-width: fit-content;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        border: 2px solid white;
      ">
        <span style="
          color: white;
          font-size: 14px;
          font-weight: bold;
          white-space: nowrap;
        ">
          ${content}
        </span>
        ${arrowHtml}
      </div>
    `;
    } else if (icon) {
      marker.innerHTML = `<img src="${icon}" alt="marker" class="marker-icon" />`;
    } else if (backgroundImage) {
      marker.innerHTML = `<div class="marker-bg-image" style="background-image: url('${backgroundImage}')"></div>`;
    } else {
      marker.innerHTML = content;
    }

    // Apply default and custom styles
    let defaultStyles;

    // Start markers hidden to avoid briefly showing in the wrong place
    // while the chart/timeScale is still initializing. We'll reveal and
    // animate them only after positioning succeeds.
    if (markerType === 'betting-win') {
      defaultStyles = {
        position: 'absolute',
        transform: 'translate(-50%, -120%)', // Position above candle
        pointerEvents: 'all',
        cursor: onClick ? 'pointer' : 'default',
        zIndex: 1000,
        transition: animate ? 'all 0.3s ease' : 'none',
        display: 'none', // hidden until positioned
        ...styles
      };
    } else {
      defaultStyles = {
        position: 'absolute',
        padding: '4px 8px',
        borderRadius: '8px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: '#fff',
        background: type === 'BUY'
          ? 'linear-gradient(135deg, #00cc01, #00aa01)'
          : 'linear-gradient(135deg, #ff4444, #cc0000)',
        border: '2px solid #fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        transform: 'translate(-50%, -120%)', // Position above candle
        pointerEvents: 'all',
        cursor: onClick ? 'pointer' : 'default',
        zIndex: 1000,
        minWidth: '24px',
        minHeight: '24px',
        display: 'none', // hidden until positioned
        alignItems: 'center',
        justifyContent: 'center',
        transition: animate ? 'all 0.3s ease' : 'none',
        ...styles
      };
    }

    Object.assign(marker.style, defaultStyles);

    // Add tooltip
    if (tooltip) {
      marker.title = tooltip;
    }

    // Add click handler
    if (onClick) {
      marker.addEventListener('click', (e) => {
        e.stopPropagation();
        onClick(id, { time, price, type });
      });
    }

    // Position marker function with retry logic so restored markers wait for
    // the chart/timeScale to be ready instead of immediately falling back.
    let _positionAttempts = 0;
    const _maxPositionAttempts = 30; // ~3 seconds when using 100ms retries
    const updateMarkerPosition = () => {
      try {
        _positionAttempts += 1;

        if (!chart || !series) {
          // schedule retry
          if (_positionAttempts <= _maxPositionAttempts) {
            setTimeout(updateMarkerPosition, 100);
          }
          return;
        }

        const priceCoord = series.priceToCoordinate(price);
        const timeCoord = chart.timeScale().timeToCoordinate(time);


        if (priceCoord !== null && timeCoord !== null) {
          // Get chart container bounds to constrain marker position
          const chartBounds = chartContainerRef.current ? chartContainerRef.current.getBoundingClientRect() : null;
          let constrainedX = timeCoord;
          let constrainedY = priceCoord;
          
          if (chartBounds && chartContainerRef.current) {
            const containerWidth = chartContainerRef.current.clientWidth;
            const containerHeight = chartContainerRef.current.clientHeight;
            const markerWidth = 24; // Approximate marker width
            const markerHeight = 24; // Approximate marker height
            
            // Constrain X position within chart bounds
            constrainedX = Math.max(markerWidth / 2, Math.min(timeCoord, containerWidth - markerWidth / 2));
            
            // Constrain Y position within chart bounds
            constrainedY = Math.max(markerHeight, Math.min(priceCoord, containerHeight - markerHeight / 2));
          }
          
          marker.style.left = `${constrainedX}px`;
          marker.style.top = `${constrainedY}px`;
          // Reveal with entrance animation only when coordinates are ready
          marker.style.display = 'flex';
          marker.style.opacity = '0';
          if (animate) {
            marker.style.transform = 'translate(-50%, -100%) scale(0)';
            requestAnimationFrame(() => {
              marker.style.transform = 'translate(-50%, -100%) scale(1)';
              marker.style.opacity = '1';
            });
          } else {
            marker.style.opacity = '1';
          }
          // success - reset attempts counter
          _positionAttempts = 0;
          return;
        }

        // If coordinates are not ready yet, keep the marker hidden and retry a few times
        if (_positionAttempts <= _maxPositionAttempts) {
          marker.style.display = 'none';
          setTimeout(updateMarkerPosition, 100);
          return;
        }

        // Last-resort fallback: place marker within visible area (center-ish)
        try {
          const visible = chart.timeScale().getVisibleRange();
          let fallbackX = 100;
          if (visible) {
            const target = time < visible.from ? visible.from : (time > visible.to ? visible.to : time);
            const tc = chart.timeScale().timeToCoordinate(target);
            if (tc !== null) fallbackX = tc;
          } else if (chart && chartContainerRef && chartContainerRef.current) {
            fallbackX = Math.floor(chartContainerRef.current.clientWidth / 2);
          }

          const fallbackY = (chartContainerRef && chartContainerRef.current)
            ? Math.floor(chartContainerRef.current.clientHeight / 2)
            : 100;

          marker.style.left = `${fallbackX}px`;
          marker.style.top = `${fallbackY}px`;
          marker.style.display = 'flex';
          marker.style.opacity = '0';
          if (animate) {
            marker.style.transform = 'translate(-50%, -100%) scale(0)';
            requestAnimationFrame(() => {
              marker.style.transform = 'translate(-50%, -100%) scale(1)';
              marker.style.opacity = '1';
            });
          } else {
            marker.style.opacity = '1';
          }
        } catch (e) {
          // final fallback
          marker.style.left = '100px';
          marker.style.top = '100px';
          marker.style.display = 'flex';
          marker.style.opacity = '1';
        }
      } catch (error) {
        if (_positionAttempts <= _maxPositionAttempts) {
          setTimeout(updateMarkerPosition, 100);
        } else {
          marker.style.left = '100px';
          marker.style.top = '100px';
          marker.style.display = 'flex';
          marker.style.opacity = '1';
        }
      }
    };

    // Initial positioning
    updateMarkerPosition();

    // Add to container
    markerContainerRef.current.appendChild(marker);

    // Store marker reference (DOM-managed)
    const markerData = {
      id,
      element: marker,
      time,
      price,
      type,
      updatePosition: updateMarkerPosition
    };
    customMarkersRef.current.push(markerData);

    // Always create a horizontal price line linked to this marker for buy/sell orders
    try {
      const shouldDrawLine = options.drawPriceLine || markerType === 'betting-win' || type === 'BUY' || type === 'SELL';
      if (shouldDrawLine && series && typeof series.createPriceLine === 'function') {
        const priceLineOptions = {
          price: price,
          color: type === 'BUY' ? '#00cc01' : '#ff0000', // Green for BUY, Red for SELL
          lineWidth: options.lineWidth || 2,
          lineStyle: options.lineStyle !== undefined ? options.lineStyle : 1, // Solid line
          axisLabelVisible: options.axisLabelVisible !== undefined ? options.axisLabelVisible : true,
          title: options.title || `${type} ${content}` || id,

        };

        const priceLine = series.createPriceLine(priceLineOptions);
        if (priceLine) {
          markerData.priceLine = priceLine;
          customPriceLinesRef.current[id] = priceLine;

          // Store the price line in marker data for proper cleanup
        }
      }
    } catch (err) {
      console.warn('Failed to create price line for marker', err);
    }

    // Add entrance animation
    if (animate) {
      marker.style.transform = 'translate(-50%, -100%) scale(0)';
      requestAnimationFrame(() => {
        marker.style.transform = 'translate(-50%, -100%) scale(1)';
      });
    }

    return markerData;
  }, []);
  // ...existing

  // Update all custom marker positions
  const updateCustomMarkerPositions = useCallback(() => {
    if (!chartRef.current || !seriesRef.current) return;

    customMarkersRef.current.forEach(markerData => {
      if (markerData.updatePosition) {
        try {
          // Check if marker is still visible in the current time range
          const visibleRange = chartRef.current.timeScale().getVisibleRange();
          const markerTime = markerData.time;
          
          if (visibleRange && markerTime) {
            const isInVisibleRange = markerTime >= visibleRange.from && markerTime <= visibleRange.to;
            
            if (isInVisibleRange) {
              // Marker should be visible, update its position
              markerData.updatePosition();
              if (markerData.element) {
                markerData.element.style.visibility = 'visible';
              }
            } else {
              // Marker is outside visible range, hide it but don't remove
              if (markerData.element) {
                markerData.element.style.visibility = 'hidden';
              }
            }
          } else {
            // Fallback: always try to update position if no visible range info
            markerData.updatePosition();
          }
        } catch (error) {
          // Handle disposed chart error gracefully
          if (!error?.message?.includes("disposed")) {
            console.warn('Error updating marker position:', error);
          }
        }
      }
    });

    // Force a chart redraw to ensure everything is in sync
    if (chartRef.current && typeof chartRef.current.timeScale === 'function') {
      try {
        chartRef.current.timeScale().applyOptions({});
      } catch (error) {
        // Ignore errors on disposed chart
      }
    }
  }, []);

  // Remove custom marker
  const removeCustomMarker = useCallback((markerId) => {
    const markerIndex = customMarkersRef.current.findIndex(m => m.id === markerId);

    // If marker exists in our DOM-managed list, remove it and any attached priceLine
    if (markerIndex !== -1) {
      const markerData = customMarkersRef.current[markerIndex];

      // Remove linked price line if exists (marker-attached)
      try {
        if (markerData && markerData.priceLine && seriesRef.current && typeof seriesRef.current.removePriceLine === 'function') {
          seriesRef.current.removePriceLine(markerData.priceLine);
        }
      } catch (err) {
        console.warn('Failed to remove marker-attached price line for marker', markerId, err);
      }

      // Remove DOM element with a short animation
      if (markerData.element) {
        markerData.element.style.transform = 'translate(-50%, -100%) scale(0)';
        markerData.element.style.opacity = '0';

        setTimeout(() => {
          if (markerData.element && markerData.element.parentNode) {
            markerData.element.remove();
          }
        }, 300);
      }

      customMarkersRef.current.splice(markerIndex, 1);
    }

    // Also ensure any orphaned price lines stored separately are removed
    try {
      if (customPriceLinesRef.current && customPriceLinesRef.current[markerId] && seriesRef.current && typeof seriesRef.current.removePriceLine === 'function') {
        const orphanLine = customPriceLinesRef.current[markerId];
        try {
          seriesRef.current.removePriceLine(orphanLine);
        } catch (e) { /* ignore */ }
        delete customPriceLinesRef.current[markerId];
      }
    } catch (err) {
      console.warn('Failed to remove orphaned price line for marker', markerId, err);
    }
  }, []);

  // Clear all custom markers
  const clearAllCustomMarkers = useCallback(() => {
    // Remove DOM elements and their associated price lines
    customMarkersRef.current.forEach(markerData => {
      if (markerData.element && markerData.element.parentNode) {
        markerData.element.remove();
      }
      // Remove any attached price lines
      try {
        if (markerData && markerData.priceLine && seriesRef.current && typeof seriesRef.current.removePriceLine === 'function') {
          seriesRef.current.removePriceLine(markerData.priceLine);
        }
      } catch (err) {
        console.warn('Failed to remove price line during clearAll', err);
      }
    });
    customMarkersRef.current = [];

    // Remove any remaining orphaned price lines stored in the map
    try {
      if (customPriceLinesRef.current && seriesRef.current && typeof seriesRef.current.removePriceLine === 'function') {
        Object.keys(customPriceLinesRef.current).forEach(key => {
          try {
            seriesRef.current.removePriceLine(customPriceLinesRef.current[key]);
          } catch (e) { /* ignore */ }
        });
      }
    } catch (err) {
      console.warn('Failed to remove orphaned price lines during clearAll', err);
    }
    // Clear price lines map
    customPriceLinesRef.current = {};
  }, []);

  // Update marker positions when chart changes
  useEffect(() => {
    if (!chartRef.current) return;

    const handleVisibleTimeRangeChange = () => {
      updateCustomMarkerPositions();
      // Also update on any chart scale changes
      requestAnimationFrame(() => {
        updateCustomMarkerPositions();
      });
    };

    const handleCrosshairMove = () => {
      // Throttle marker updates to improve performance
      if (!updateMarkerThrottle) {
        updateMarkerThrottle = true;
        requestAnimationFrame(() => {
          updateCustomMarkerPositions();
          updateMarkerThrottle = false;
        });
      }
    };

    // Add more event listeners for better marker tracking
    const handleScroll = () => {
      // Throttle scroll updates to prevent excessive calls
      if (!scrollThrottle) {
        scrollThrottle = true;
        requestAnimationFrame(() => {
          updateCustomMarkerPositions();
          scrollThrottle = false;
        });
      }
    };
    const handleResize = () => {
      setTimeout(() => updateCustomMarkerPositions(), 100);
    };

    const timeScale = chartRef.current.timeScale();
    timeScale.subscribeVisibleTimeRangeChange(handleVisibleTimeRangeChange);
    chartRef.current.subscribeCrosshairMove(handleCrosshairMove);

    // Listen to chart scroll events
    const chartElement = chartContainerRef.current;
    if (chartElement) {
      chartElement.addEventListener('wheel', handleScroll, { passive: true });
      chartElement.addEventListener('touchmove', handleScroll, { passive: true });
      chartElement.addEventListener('mousemove', handleScroll, { passive: true });
    }

    // Listen to window resize
    window.addEventListener('resize', handleResize);

    return () => {
      if (chartRef.current && timeScale) {
        timeScale.unsubscribeVisibleTimeRangeChange(handleVisibleTimeRangeChange);
        chartRef.current.unsubscribeCrosshairMove(handleCrosshairMove);
      }

      if (chartElement) {
        chartElement.removeEventListener('wheel', handleScroll);
        chartElement.removeEventListener('touchmove', handleScroll);
        chartElement.removeEventListener('mousemove', handleScroll);
      }

      window.removeEventListener('resize', handleResize);
    };
  }, [updateCustomMarkerPositions]);

  // Continuous marker position updates for smooth movement
  useEffect(() => {
    let animationFrameId;

    const continuousUpdate = () => {
      if (customMarkersRef.current.length > 0) {
        updateCustomMarkerPositions();
      }
      animationFrameId = requestAnimationFrame(continuousUpdate);
    };

    // Start continuous updates when markers exist
    if (customMarkersRef.current.length > 0) {
      animationFrameId = requestAnimationFrame(continuousUpdate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [updateCustomMarkerPositions, activeOrders.length]);

  // Add custom CSS for markers
  useEffect(() => {
    const styleId = 'custom-trading-markers-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .custom-trading-marker {
          position: absolute;
          user-select: none;
          transition: all 0.3s ease;
        }
        
        .custom-trading-marker:hover {
          transform: translate(-50%, -100%) scale(1.1) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4) !important;
        }
        
        .buy-marker {
          // background: linear-gradient(135deg, #00cc01, #00aa01) !important;
        }
        
        .sell-marker {
          // background: linear-gradient(135deg, #ff4444, #cc0000) !important;
        }
        
        .marker-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }
        
        .marker-bg-image {
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          border-radius: inherit;
        }
        
        .custom-trading-marker.pulse {
          animation: pulseMarker 2s infinite;
        }
        
        @keyframes pulseMarker {
          0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7); }
          70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
        }
        
        .custom-trading-marker.diamond {
          transform: translate(-50%, -100%) rotate(45deg);
          border-radius: 4px;
        }
        
        .custom-trading-marker.diamond:hover {
          transform: translate(-50%, -100%) rotate(45deg) scale(1.1);
        }
        
        .custom-trading-marker.circle {
          border-radius: 50%;
          width: 30px;
          height: 30px;
        }
        
        .custom-trading-marker.arrow-up::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 8px solid currentColor;
        }
        
        .custom-trading-marker.arrow-down::after {
          content: '';
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 8px solid currentColor;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Demo function to showcase different marker styles
  const addDemoMarkers = useCallback(() => {
    if (!chartRef.current || !seriesRef.current || !symbols[selectedSymbol]) return;


    // ✅ Calculate the current candle time using the helper function
    const candleTime = calculateCandleTime();

    const bid = symbols[selectedSymbol]?.bid || 0;


    // Simple demo marker aligned to current candle
    const demoMarker = {
      options: {
        content: '+$100.00',
        type: 'BUY',
        id: 'demo-marker-1',
        markerType: 'betting-win',
        tooltip: `Demo BUY marker - Testing visibility | Candle: ${new Date(candleTime * 1000).toISOString()}`
      },
      time: candleTime, // Use candleTime instead of currentTime
      price: bid
    };


    const result = addCustomMarker(
      chartRef.current,
      seriesRef.current,
      demoMarker.time,
      demoMarker.price,
      demoMarker.options
    );


    // Auto-remove demo marker after 10 seconds
    setTimeout(() => {
      removeCustomMarker('demo-marker-1');
    }, 10000);
  }, [selectedSymbol, selectedTimeframe, symbols, addCustomMarker, removeCustomMarker, calculateCandleTime]);

  // Keep a single horizontal line id for quick toggle
  const quickPriceLineIdRef = useRef('quick-price-line');

  const toggleQuickPriceLine = () => {
    if (!chartRef.current || !seriesRef.current || !symbols[selectedSymbol]) return;
    const id = quickPriceLineIdRef.current;
    const existing = customMarkersRef.current.find(m => m.id === id);
    const bid = symbols[selectedSymbol]?.bid || 0;
    const currentTime = Math.floor(Date.now() / 1000);

    if (existing) {
      removeCustomMarker(id);
    } else {
      addCustomMarker(chartRef.current, seriesRef.current, currentTime, bid, {
        content: `$${bid.toFixed(2)}`,
        type: 'BUY',
        id,
        markerType: 'betting-win',
        drawPriceLine: true,
        animate: true,
        tooltip: 'Quick horizontal price line',
      });
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
          if (zigzagSeriesRef.current) { chartRef.current.removeSeries(zigzagSeriesRef.current); zigzagSeriesRef.current = null; }
          if (rsiSeriesRef.current) { chartRef.current.removeSeries(rsiSeriesRef.current); rsiSeriesRef.current = null; }
          if (rsiOverBoughtLineRef.current) { chartRef.current.removeSeries(rsiOverBoughtLineRef.current); rsiOverBoughtLineRef.current = null; }
          if (rsiCenterLineRef.current) { chartRef.current.removeSeries(rsiCenterLineRef.current); rsiCenterLineRef.current = null; }
          if (rsiOverSoldLineRef.current) { chartRef.current.removeSeries(rsiOverSoldLineRef.current); rsiOverSoldLineRef.current = null; }

          if (bbUpperSeriesRef.current) { chartRef.current.removeSeries(bbUpperSeriesRef.current); bbUpperSeriesRef.current = null; }
          if (bbLowerSeriesRef.current) { chartRef.current.removeSeries(bbLowerSeriesRef.current); bbLowerSeriesRef.current = null; }
          if (volumeSeriesRef.current) { chartRef.current.removeSeries(volumeSeriesRef.current); volumeSeriesRef.current = null; }
          if (alligatorJawSeriesRef.current) { chartRef.current.removeSeries(alligatorJawSeriesRef.current); alligatorJawSeriesRef.current = null; }
          if (alligatorTeethSeriesRef.current) { chartRef.current.removeSeries(alligatorTeethSeriesRef.current); alligatorTeethSeriesRef.current = null; }
          if (alligatorLipsSeriesRef.current) { chartRef.current.removeSeries(alligatorLipsSeriesRef.current); alligatorLipsSeriesRef.current = null; }
          if (macdSeriesRef.current) { chartRef.current.removeSeries(macdSeriesRef.current); macdSeriesRef.current = null; }
          if (macdSignalSeriesRef.current) { chartRef.current.removeSeries(macdSignalSeriesRef.current); macdSignalSeriesRef.current = null; }
          if (macdHistogramSeriesRef.current) { chartRef.current.removeSeries(macdHistogramSeriesRef.current); macdHistogramSeriesRef.current = null; }


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
            if (indicator === 'BB') {
              const { upper, middle, lower } = calculateBB(mappedData, bbPeriod);
              bbUpperSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1 });
              bbMiddleSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1, lineStyle: 2 });
              bbLowerSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1 });
              bbUpperSeriesRef.current.setData(upper);
              bbMiddleSeriesRef.current.setData(middle);
              bbLowerSeriesRef.current.setData(lower);
            }
            if (indicator === 'ZigZag') {
              zigzagSeriesRef.current = chartRef.current.addLineSeries({
                color: zigzagLineColor,
                lineWidth: 3 // Thicker line for better visibility
              });

              const zigzagData = calculateZigZag(mappedData, zigzagDeviation, zigzagDepth, zigzagBackStep);
              if (zigzagData.length > 0) {
                zigzagSeriesRef.current.setData(zigzagData);
              }
            }
            if (indicator === 'Alligator') {
              const { jaw, teeth, lips } = calculateAlligator(mappedData, alligatorJawColor, alligatorTeethColor, alligatorLipsColor, alligatorJawPeriod, alligatorJawShift, alligatorTeethPeriod, alligatorTeethShift, alligatorLipsPeriod, alligatorLipsShift);
              alligatorJawSeriesRef.current = chartRef.current.addLineSeries({ color: alligatorJawColor, lineWidth: 2 });
              alligatorTeethSeriesRef.current = chartRef.current.addLineSeries({ color: alligatorTeethColor, lineWidth: 2 });
              alligatorLipsSeriesRef.current = chartRef.current.addLineSeries({ color: alligatorLipsColor, lineWidth: 2 });
              alligatorJawSeriesRef.current.setData(jaw);
              alligatorTeethSeriesRef.current.setData(teeth);
              alligatorLipsSeriesRef.current.setData(lips);
            }

          });


        }

        // Re-add all markers
        if (markersRef.current.length > 0) {
          // seriesRef.current.setMarkers(markersRef.current);
          const sorted = [...markersRef.current].sort((a, b) => a.time - b.time);
          seriesRef.current.setMarkers(sorted);

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

      // ✅ Clean up expired orders and calculate precise remaining times
      parsedOrders = parsedOrders.map(order => {
        const elapsed = Math.floor((Date.now() - order?.createdAt) / 1000);
        const remaining = Math.floor((order.time - Date.now()) / 1000);

        return {
          ...order,
          remainingTime: remaining > 0 ? remaining : 0
        };
      }).filter(order => {
        if (order.remainingTime <= 0) {
          console.log(`🧹 Cleaning up expired order ${order.id} on component mount`);
          return false;
        }
        return true;
      });

      setActiveOrders(parsedOrders);
      // ✅ Recreate timers for each active order and ensure they expire correctly
      parsedOrders.forEach(order => {
        if (!orderTimersRef.current[order.id]) {
          startOrderTimer(order.id, order.remainingTime);

          // ✅ Also set up direct timeout for guaranteed removal
          setTimeout(() => {
            console.log(`⏰ Direct initial timeout expired - ensuring order ${order.id} is removed`);
            removeMarker(order.id);
          }, order.remainingTime * 1000);
        }
      });

      // parsedOrders.forEach(order => {
      //   startOrderTimer(order.id, order.remainingTime);
      // });

      // Disable legacy markers - only use custom markers
      // parsedOrders.forEach(order => {
      //   const markerExists = markersRef.current.some(m => m.id === order.id);
      //   if (!markerExists) {
      //     const placedTime = Math.floor(new Date(order.createdAt).getTime() / 1000);
      //     const timeframeSeconds = timeframes[selectedTimeframe];
      //     const alignedTime = Math.floor(placedTime / timeframeSeconds) * timeframeSeconds;

      //     const marker = {
      //       id: order.id,
      //       time: alignedTime,
      //       position: 'aboveBar',
      //       color: order.type === "SELL" ? 'red' : 'green',
      //       shape: order.type === "SELL" ? 'arrowDown' : 'arrowUp',
      //       text: `${order.stake}`,
      //     };

      //     markersRef.current.push(marker);
      //   }
      // });
      // const sortedMarkers = [...markersRef.current].sort((a, b) => a.time - b.time);
      // seriesRef.current?.setMarkers(sortedMarkers);

      // Clear legacy markers
      markersRef.current = [];
      seriesRef.current?.setMarkers([]);

    }
  }, []);
  // ✅ MAIN FIX: This useEffect ensures custom markers persist across symbol/route changes
  // When user switches symbols, we restore visual markers for that specific symbol based on stored orders
  useEffect(() => {
    // Wait for chart to be mounted before restoring markers
    if (!isChartMountedRef.current || !chartRef.current || !seriesRef.current) {
      return;
    }

    // ✅ First, clear all existing custom markers to prevent showing markers from other symbols
    clearAllCustomMarkers();

    // ✅ Also remove any markers that might belong to other symbols
    removeMarkersForOtherSymbols(selectedSymbol);

    const storedOrders = JSON.parse(localStorage.getItem("activeTrades") || "[]");

    const validOrders = storedOrders
      .map(order => ({
        ...order,
        remainingTime: Math.floor((order.time - Date.now()) / 1000),
      }))
      .filter(order => order.remainingTime > 0);

    // ✅ Load markers for the selectedSymbol - but now restore visual markers
    const relevantOrders = validOrders.filter(order => order.symbol === selectedSymbol);
    const otherSymbolOrders = validOrders.filter(order => order.symbol !== selectedSymbol);


    // ✅ Now recreate visual DOM markers when symbol changes to ensure they persist
    relevantOrders.forEach(order => {
      // Ensure the per-second order timer is running for this restored order
      try {
        if (!orderTimersRef.current[order.id]) {
          startOrderTimer(order.id, order.remainingTime);

          // ✅ Set up guaranteed removal after exact remaining time
          setTimeout(() => {
            console.log(`⏰ Guaranteed removal timeout expired for restored order ${order.id}`);
            removeMarker(order.id);
          }, order.remainingTime * 1000);
        }
      } catch (err) {
        console.warn('Failed to start order timer for restored order', order.id, err);
      }

      // ✅ Recreate the visual custom marker for this order
      try {
        if (symbols[order.symbol]) {
          const placedTime = Math.floor(order.createdAt / 1000);
          const timeframeSeconds = timeframes[selectedTimeframe];
          const alignedTime = Math.floor(placedTime / timeframeSeconds) * timeframeSeconds;
          // Use the stored initialPrice (strike price when order was placed) so restored markers
          // remain fixed at the original trade price instead of following the live bid.
          const currentPriceFromSymbols = symbols[order.symbol]?.bid;
          const markerPrice = (order.initialPrice !== undefined && order.initialPrice !== null)
            ? order.initialPrice
            : (order.price !== undefined && order.price !== null)
              ? order.price
              : (currentPriceFromSymbols || 0);

          // Check if marker already exists to avoid duplicates
          const existingMarker = customMarkersRef.current.find(m => m.id === `marker-${order.id}`);
          if (!existingMarker) {
            const markerOptions = {
              content: `$${order.amount}`,
              type: order.type,
              id: `marker-${order.id}`,
              markerType: 'betting-win',
              customClass: `${order.type.toLowerCase()}-order confirmed`,
              tooltip: `${order.type} Order: $${order.amount} | Remaining: ${formatTime(order.remainingTime)}`,
              animate: false, // No animation for restored markers
              drawPriceLine: true,
              lineWidth: 2,
              lineStyle: 1
            };

            addCustomMarker(
              chartRef.current,
              seriesRef.current,
              alignedTime,
              markerPrice,
              markerOptions
            );
          }
        }
      } catch (err) {
        console.warn('Failed to recreate custom marker for restored order', order.id, err);
      }

      // ✅ Ensure proper timer setup for marker removal after exact duration
      try {
        // Clear any existing timeout to prevent duplicates
        if (markerHideTimersRef.current[order.id]) {
          clearTimeout(markerHideTimersRef.current[order.id]);
          delete markerHideTimersRef.current[order.id];
        }

        // Set up automatic removal after remaining time expires
        if (order.remainingTime && order.remainingTime > 0) {
          markerHideTimersRef.current[order.id] = setTimeout(() => {
            removeMarker(order.id);
          }, order.remainingTime * 1000);
        }
      } catch (err) {
        console.warn('Failed to schedule hide timeout for restored order', order.id, err);
      }
    });

    // Clear any existing legacy markers
    markersRef.current = [];
    seriesRef.current?.setMarkers([]);

    // Force marker position update after symbol/timeframe change with additional delay
    setTimeout(() => {
      updateCustomMarkerPositions();
    }, 300);

    // Additional update after chart data loads
    setTimeout(() => {
      updateCustomMarkerPositions();
    }, 1000);
  }, [selectedSymbol, selectedTimeframe, clearAllCustomMarkers, symbols, addCustomMarker, updateCustomMarkerPositions]);







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
            color: lastCandleRef.current.close >= lastCandleRef.current.open ? "#2DA479" : "#FF0000"
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
        color: candle.close >= candle.open ? "#2DA479" : "#FF0000",
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

      // Update marker positions when visible range changes
      updateCustomMarkerPositions();

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
            // Update markers after data fetch
            setTimeout(() => updateCustomMarkerPositions(), 200);
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

    // Store current visible range before any updates
    const currentRange = chartRef.current?.timeScale().getVisibleRange();

    const transformedData = transformData(mappedData, selectedSeriesType);
    seriesRef.current.setData(transformedData);

    // --- Remove all existing series before adding again ---
    if (emaSeriesRef.current) { chartRef.current.removeSeries(emaSeriesRef.current); emaSeriesRef.current = null; }
    if (smaSeriesRef.current) { chartRef.current.removeSeries(smaSeriesRef.current); smaSeriesRef.current = null; }
    if (wmaSeriesRef.current) { chartRef.current.removeSeries(wmaSeriesRef.current); wmaSeriesRef.current = null; }
    if (zigzagSeriesRef.current) { chartRef.current.removeSeries(zigzagSeriesRef.current); zigzagSeriesRef.current = null; }
    if (rsiSeriesRef.current) {
      try {
        chartRef.current.removeSeries(rsiSeriesRef.current);
      } catch (error) {
        console.error("Error removing RSI series:", error);
      }
      rsiSeriesRef.current = null;
    }
    // Remove RSI reference lines
    if (rsiOverBoughtLineRef.current) {
      try {
        chartRef.current.removeSeries(rsiOverBoughtLineRef.current);
      } catch (error) {
        console.error("Error removing RSI overbought line:", error);
      }
      rsiOverBoughtLineRef.current = null;
    }
    if (rsiCenterLineRef.current) {
      try {
        chartRef.current.removeSeries(rsiCenterLineRef.current);
      } catch (error) {
        console.error("Error removing RSI center line:", error);
      }
      rsiCenterLineRef.current = null;
    }
    if (rsiOverSoldLineRef.current) {
      try {
        chartRef.current.removeSeries(rsiOverSoldLineRef.current);
      } catch (error) {
        console.error("Error removing RSI oversold line:", error);
      }
      rsiOverSoldLineRef.current = null;
    }
    if (bbUpperSeriesRef.current) { chartRef.current.removeSeries(bbUpperSeriesRef.current); bbUpperSeriesRef.current = null; }
    if (bbMiddleSeriesRef.current) { chartRef.current.removeSeries(bbMiddleSeriesRef.current); bbMiddleSeriesRef.current = null; }
    if (bbLowerSeriesRef.current) { chartRef.current.removeSeries(bbLowerSeriesRef.current); bbLowerSeriesRef.current = null; }
    if (volumeSeriesRef.current) { chartRef.current.removeSeries(volumeSeriesRef.current); volumeSeriesRef.current = null; }
    if (volumeSeriesRef.current) { chartRef.current.removeSeries(volumeSeriesRef.current); volumeSeriesRef.current = null; }
    if (alligatorJawSeriesRef.current) { chartRef.current.removeSeries(alligatorJawSeriesRef.current); alligatorJawSeriesRef.current = null; }
    if (alligatorTeethSeriesRef.current) { chartRef.current.removeSeries(alligatorTeethSeriesRef.current); alligatorTeethSeriesRef.current = null; }
    if (alligatorLipsSeriesRef.current) { chartRef.current.removeSeries(alligatorLipsSeriesRef.current); alligatorLipsSeriesRef.current = null; }
    if (donchianUpperSeriesRef.current) { chartRef.current.removeSeries(donchianUpperSeriesRef.current); donchianUpperSeriesRef.current = null; }
    if (donchianMiddleSeriesRef.current) { chartRef.current.removeSeries(donchianMiddleSeriesRef.current); donchianMiddleSeriesRef.current = null; }
    if (donchianLowerSeriesRef.current) { chartRef.current.removeSeries(donchianLowerSeriesRef.current); donchianLowerSeriesRef.current = null; }
    if (donchianFillSeriesRef.current) { chartRef.current.removeSeries(donchianFillSeriesRef.current); donchianFillSeriesRef.current = null; }
    if (parabolicSeriesRef.current) { chartRef.current.removeSeries(parabolicSeriesRef.current); parabolicSeriesRef.current = null; }
    if (macdSeriesRef.current) { chartRef.current.removeSeries(macdSeriesRef.current); macdSeriesRef.current = null; }
    if (macdSignalSeriesRef.current) { chartRef.current.removeSeries(macdSignalSeriesRef.current); macdSignalSeriesRef.current = null; }
    if (macdHistogramSeriesRef.current) { chartRef.current.removeSeries(macdHistogramSeriesRef.current); macdHistogramSeriesRef.current = null; }
    if (donchianUpperSeriesRef.current) { chartRef.current.removeSeries(donchianUpperSeriesRef.current); donchianUpperSeriesRef.current = null; }
    if (donchianMiddleSeriesRef.current) { chartRef.current.removeSeries(donchianMiddleSeriesRef.current); donchianMiddleSeriesRef.current = null; }
    if (donchianLowerSeriesRef.current) { chartRef.current.removeSeries(donchianLowerSeriesRef.current); donchianLowerSeriesRef.current = null; }
    if (donchianFillSeriesRef.current) { chartRef.current.removeSeries(donchianFillSeriesRef.current); donchianFillSeriesRef.current = null; }
    if (ichimokuTenkanSeriesRef.current) { chartRef.current.removeSeries(ichimokuTenkanSeriesRef.current); ichimokuTenkanSeriesRef.current = null; }
    if (ichimokuKijunSeriesRef.current) { chartRef.current.removeSeries(ichimokuKijunSeriesRef.current); ichimokuKijunSeriesRef.current = null; }
    if (ichimokuChikouSeriesRef.current) { chartRef.current.removeSeries(ichimokuChikouSeriesRef.current); ichimokuChikouSeriesRef.current = null; }
    if (ichimokuSenkouASeriesRef.current) { chartRef.current.removeSeries(ichimokuSenkouASeriesRef.current); ichimokuSenkouASeriesRef.current = null; }
    if (ichimokuSenkouBSeriesRef.current) { chartRef.current.removeSeries(ichimokuSenkouBSeriesRef.current); ichimokuSenkouBSeriesRef.current = null; }
    if (ichimokuFillSeriesRef.current) { chartRef.current.removeSeries(ichimokuFillSeriesRef.current); ichimokuFillSeriesRef.current = null; }

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
      if (indicator === 'BB') {
        const { upper, middle, lower } = calculateBB(mappedData, bbPeriod);
        bbUpperSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1 });
        bbMiddleSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1, lineStyle: 2 });
        bbLowerSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1 });
        bbUpperSeriesRef.current.setData(upper);
        bbMiddleSeriesRef.current.setData(middle);
        bbLowerSeriesRef.current.setData(lower);
      }
      if (indicator === 'DonchianChannel') {
        const { upper, middle, lower } = calculateDonchianChannel(mappedData, donchianPeriod);
        donchianUpperSeriesRef.current = chartRef.current.addLineSeries({ color: donchianUpperColor, lineWidth: 2 });
        donchianMiddleSeriesRef.current = chartRef.current.addLineSeries({ color: donchianMiddleColor, lineWidth: 1, lineStyle: 2 });
        donchianLowerSeriesRef.current = chartRef.current.addLineSeries({ color: donchianLowerColor, lineWidth: 2 });

        donchianUpperSeriesRef.current.setData(upper);
        donchianMiddleSeriesRef.current.setData(middle);
        donchianLowerSeriesRef.current.setData(lower);

        // Create fill area using area series with upper line data
        donchianFillSeriesRef.current = chartRef.current.addAreaSeries({
          topColor: donchianFillColor.includes('rgba') ? donchianFillColor.replace(/[\d\.]+\)$/, '0.2)') : donchianFillColor + '33',
          bottomColor: donchianFillColor.includes('rgba') ? donchianFillColor.replace(/[\d\.]+\)$/, '0.05)') : donchianFillColor + '0D',
          lineColor: 'transparent',
          lineWidth: 0
        });

        // Use upper line data for the fill area
        donchianFillSeriesRef.current.setData(upper);
      }
      if (indicator === 'Alligator') {
        const { jaw, teeth, lips } = calculateAlligator(mappedData, alligatorJawColor, alligatorTeethColor, alligatorLipsColor, alligatorJawPeriod, alligatorJawShift, alligatorTeethPeriod, alligatorTeethShift, alligatorLipsPeriod, alligatorLipsShift);
        alligatorJawSeriesRef.current = chartRef.current.addLineSeries({ color: alligatorJawColor, lineWidth: 2 });
        alligatorTeethSeriesRef.current = chartRef.current.addLineSeries({ color: alligatorTeethColor, lineWidth: 2 });
        alligatorLipsSeriesRef.current = chartRef.current.addLineSeries({ color: alligatorLipsColor, lineWidth: 2 });
        alligatorJawSeriesRef.current.setData(jaw);
        alligatorTeethSeriesRef.current.setData(teeth);
        alligatorLipsSeriesRef.current.setData(lips);
      }

      if (indicator === 'ZigZag') {
        // Create ZigZag series with separate price scale for better visibility
        zigzagSeriesRef.current = chartRef.current.addLineSeries({
          color: zigzagLineColor,
          lineWidth: 3, // Thicker line for better visibility
        });

        const zigzagData = calculateZigZag(mappedData, zigzagDeviation, zigzagDepth, zigzagBackStep);
        console.log('ZigZag data points:', zigzagData.length, zigzagData);
        if (zigzagData.length > 0) {
          zigzagSeriesRef.current.setData(zigzagData);
        }
      }
      if (indicator === 'RSI') {
        // Create RSI series on main chart with separate price scale
        rsiSeriesRef.current = chartRef.current.addLineSeries({
          color: rsiLineColor,
          lineWidth: 2,
          priceFormat: {
            type: 'price',
            precision: 2,
            minMove: 0.01,
          },
          priceScaleId: 'rsi', // Use separate price scale for RSI
        });

        // Configure RSI price scale (0-100 range)
        chartRef.current.priceScale('rsi').applyOptions({
          scaleMargins: {
            top: 0.8, // Push RSI to bottom 20% of chart (reduced height)
            bottom: 0.0,
          },
          autoScale: false,
          mode: 0,
          invertScale: false,
          alignLabels: true,
          borderVisible: false,
          visible: true,
          ticksVisible: false,
          minimumWidth: 50,
          entireTextOnly: false,
        });

        // Add RSI reference lines at 30, 50, and 70
        rsiOverBoughtLineRef.current = chartRef.current.addLineSeries({
          color: 'rgba(255, 0, 0, 0.5)',
          lineWidth: 1,
          lineStyle: 2, // Dashed line
          priceScaleId: 'rsi',
          lastValueVisible: false,
          priceLineVisible: false,
        });

        rsiCenterLineRef.current = chartRef.current.addLineSeries({
          color: 'rgba(128, 128, 128, 0.5)',
          lineWidth: 1,
          lineStyle: 2, // Dashed line
          priceScaleId: 'rsi',
          lastValueVisible: false,
          priceLineVisible: false,
        });

        rsiOverSoldLineRef.current = chartRef.current.addLineSeries({
          color: 'rgba(0, 255, 0, 0.5)',
          lineWidth: 1,
          lineStyle: 2, // Dashed line
          priceScaleId: 'rsi',
          lastValueVisible: false,
          priceLineVisible: false,
        });

        // Set reference line data
        const timeData70 = mappedData.map(item => ({ time: item.time, value: 70 }));
        const timeData50 = mappedData.map(item => ({ time: item.time, value: 50 }));
        const timeData30 = mappedData.map(item => ({ time: item.time, value: 30 }));
        rsiOverBoughtLineRef.current.setData(timeData70);
        rsiCenterLineRef.current.setData(timeData50);
        rsiOverSoldLineRef.current.setData(timeData30);

        const rsiData = calculateRSI(mappedData, rsiPeriod);
        rsiSeriesRef.current.setData(rsiData);

        try {
          // Add horizontal reference lines at 30 and 70
          rsiSeriesRef.current.createPriceLine({
            price: 70,
            color: layoutMode === "dark" ? "#ff6b6b" : "#e74c3c",
            lineWidth: 1,
            lineStyle: 2, // Dashed line
            axisLabelVisible: true,
            title: "Overbought (70)",
          });

          rsiSeriesRef.current.createPriceLine({
            price: 30,
            color: layoutMode === "dark" ? "#4ecdc4" : "#2ecc71",
            lineWidth: 1,
            lineStyle: 2, // Dashed line
            axisLabelVisible: true,
            title: "Oversold (30)",
          });
        } catch (error) {
          console.error('Error creating RSI reference lines:', error);
        }
      }
      if (indicator === 'Volume') {
        // Create Volume series on separate pane with histogram
        volumeSeriesRef.current = chartRef.current.addHistogramSeries({
          color: volumeColor,
          priceFormat: {
            type: 'volume',
          },
          priceScaleId: 'volume', // Use separate price scale for Volume
          priceLineVisible: false,
          lastValueVisible: false,
        });

        // Configure Volume price scale
        chartRef.current.priceScale('volume').applyOptions({
          scaleMargins: {
            top: 0.8, // Push Volume to bottom 20% of chart (same as RSI)
            bottom: 0.0,
          },
          autoScale: true,
          mode: 0,
          invertScale: false,
          alignLabels: true,
          borderVisible: false,
          visible: true,
          ticksVisible: false,
        });

        const volumeData = calculateVolume(mappedData, volumeColor1, volumeColor2);
        volumeSeriesRef.current.setData(volumeData);
      }
      if (indicator === 'parabolic') {
        parabolicSeriesRef.current = chartRef.current.addLineSeries({
          color: parabolicLineColor,
          lineWidth: 0, // Hide the line
          pointMarkersVisible: true, // Show dots
          pointMarkersRadius: 3 // Dot size
        });
        const parabolicData = calculateParabolicSAR(mappedData, parabolicStep);
        parabolicSeriesRef.current.setData(parabolicData);
      }
      if (indicator === 'MACD') {
        // Create MACD series on separate pane based on visibility settings
        if (showMacdLine) {
          macdSeriesRef.current = chartRef.current.addLineSeries({
            color: macdLineColor,
            lineWidth: 2,
            priceFormat: {
              type: 'price',
              precision: 4,
              minMove: 0.0001,
            },
            priceScaleId: 'macd', // Use separate price scale for MACD
          });
        }

        if (showSignalLine) {
          macdSignalSeriesRef.current = chartRef.current.addLineSeries({
            color: macdSignalColor,
            lineWidth: 2,
            priceFormat: {
              type: 'price',
              precision: 4,
              minMove: 0.0001,
            },
            priceScaleId: 'macd',
          });
        }

        if (showHistogramLine) {
          macdHistogramSeriesRef.current = chartRef.current.addHistogramSeries({
            color: macdHistogramColor,
            priceFormat: {
              type: 'price',
              precision: 4,
              minMove: 0.0001,
            },
            priceScaleId: 'macd',
            priceLineVisible: false,
            lastValueVisible: false,
          });
        }

        // Configure MACD price scale (positioned above RSI if both are active)
        const isRsiActive = activeIndicators.includes('RSI');
        chartRef.current.priceScale('macd').applyOptions({
          scaleMargins: {
            top: isRsiActive ? 0.6 : 0.8, // Position above RSI if RSI is active
            bottom: isRsiActive ? 0.2 : 0.0, // Leave space for RSI below if active
          },
          autoScale: true,
          mode: 0,
          invertScale: false,
          alignLabels: true,
          borderVisible: false,
          visible: true,
          ticksVisible: false,
        });

        const { macdLine, signalLine, histogram } = calculateMACD(mappedData, macdFastPeriod, macdSlowPeriod, macdSignalPeriod, macdLineColor, macdSignalColor, macdHistogramColor);
        if (showMacdLine && macdSeriesRef.current) {
          macdSeriesRef.current.setData(macdLine);
        }
        if (showSignalLine && macdSignalSeriesRef.current) {
          macdSignalSeriesRef.current.setData(signalLine);
        }
        if (showHistogramLine && macdHistogramSeriesRef.current) {
          macdHistogramSeriesRef.current.setData(histogram);
        }
      }
      if (indicator === 'IchimokuCloud') {
        const { tenkanSen, kijunSen, chikouSpan, senkouSpanA, senkouSpanB } = calculateIchimoku(mappedData, ichimokuTenkanPeriod, ichimokuKijunPeriod, ichimokuSenkouBPeriod);

        // Create Tenkan Sen (Conversion Line)
        ichimokuTenkanSeriesRef.current = chartRef.current.addLineSeries({
          color: ichimokuTenkanColor,
          lineWidth: 1
        });
        ichimokuTenkanSeriesRef.current.setData(tenkanSen);

        // Create Kijun Sen (Base Line)
        ichimokuKijunSeriesRef.current = chartRef.current.addLineSeries({
          color: ichimokuKijunColor,
          lineWidth: 1
        });
        ichimokuKijunSeriesRef.current.setData(kijunSen);

        // Create Chikou Span (Lagging Span)
        ichimokuChikouSeriesRef.current = chartRef.current.addLineSeries({
          color: ichimokuChikouColor,
          lineWidth: 1
        });
        ichimokuChikouSeriesRef.current.setData(chikouSpan);

        // Create Senkou Span A (Leading Span A)
        ichimokuSenkouASeriesRef.current = chartRef.current.addLineSeries({
          color: ichimokuSenkouAColor,
          lineWidth: 1
        });
        ichimokuSenkouASeriesRef.current.setData(senkouSpanA);

        // Create Senkou Span B (Leading Span B)
        ichimokuSenkouBSeriesRef.current = chartRef.current.addLineSeries({
          color: ichimokuSenkouBColor,
          lineWidth: 1
        });
        ichimokuSenkouBSeriesRef.current.setData(senkouSpanB);

        // Create fill area between Senkou Span A and B (Kumo/Cloud) if enabled
        if (ichimokuShowFill) {
          ichimokuFillSeriesRef.current = chartRef.current.addAreaSeries({
            topColor: ichimokuFillColor.includes('rgba') ? ichimokuFillColor.replace(/[\d\.]+\)$/, '0.2)') : ichimokuFillColor + '33',
            bottomColor: ichimokuFillColor.includes('rgba') ? ichimokuFillColor.replace(/[\d\.]+\)$/, '0.05)') : ichimokuFillColor + '0D',
            lineColor: 'transparent',
            lineWidth: 0
          });

          // Use Senkou Span A data for the fill area
          ichimokuFillSeriesRef.current.setData(senkouSpanA);
        }
      }
    });

    // Restore the visible range based on autoScrollEnabled state
    if (!autoScrollEnabled && currentRange) {
      // Use setTimeout to ensure restoration happens after data is fully loaded
      setTimeout(() => {
        try {
          chartRef.current.timeScale().setVisibleRange(currentRange);
        } catch (error) {
          console.error("Error setting visible range:", error);
        }
      }, 0);
    } else {
      // Default behavior - show most recent data
      const dataLength = transformedData.length;
      if (dataLength > 0) {
        const lastIndex = dataLength - 1;
        const startIndex = Math.max(0, lastIndex - 100);
        if (transformedData[startIndex] && transformedData[lastIndex]) {
          chartRef.current.timeScale().setVisibleRange({
            from: transformedData[startIndex].time,
            to: transformedData[lastIndex].time,
          });
        }
      }
    }

    // ✅ Trigger marker restoration after data loads successfully
    setTimeout(() => {
      updateCustomMarkerPositions();
      console.log('🔄 Data loaded - triggering marker position update');
    }, 100);
  }, [data, status, selectedSeriesType, bars, activeIndicators, autoScrollEnabled, mappedData,
    alligatorJawColor, alligatorTeethColor, alligatorLipsColor,
    alligatorJawPeriod, alligatorJawShift, alligatorTeethPeriod, alligatorTeethShift,
    alligatorLipsPeriod, alligatorLipsShift,
    emaLineColor, emaPeriod, smaLineColor, smaPeriod, wmaLineColor, wmaPeriod,
    bbLineColor, bbPeriod, zigzagLineColor, zigzagDeviation, zigzagDepth, zigzagBackStep,
    rsiLineColor, rsiPeriod, volumeColor, volumeColor1, volumeColor2,
    parabolicLineColor, parabolicStep,
    ichimokuTenkanPeriod, ichimokuKijunPeriod, ichimokuSenkouBPeriod,
    ichimokuTenkanColor, ichimokuKijunColor, ichimokuChikouColor,
    ichimokuSenkouAColor, ichimokuSenkouBColor, ichimokuFillColor, ichimokuShowFill]);

  const updatePriceLines = useCallback(() => {
    if (!lastCandleRef.current) return;
    Object.keys(priceLinesSeriesRef.current).forEach(markerId => {
      const { series, startTime, price } = priceLinesSeriesRef.current[markerId];
      if (series) {
        series.setData([
          { time: startTime, value: price },
          { time: lastCandleRef.current.time, value: price }
        ]);
      }
    });
  }, []);


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
        if (indicator === 'BB') {
          const { upper, lower } = calculateBB(mappedData, bbPeriod);
          bbUpperSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1 });
          bbLowerSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1 });
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
      if (indicator === 'BB') {
        const { upper, lower } = calculateBB(mappedData, bbPeriod);
        bbUpperSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1 });
        bbLowerSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1 });
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
      border: '2px solid red !important',
      layout: {
        background: {
          type: "solid",
          color: "transparent", // Make chart background transparent for bg image
          border: '2px solid red !important',

        },
        textColor: layoutMode === "dark" ? "#ffffff" : "#000000",
      },
      grid: {
        vertLines: { color: layoutMode === "dark" ? "#343030ff" : "#eee", visible: false },
        horzLines: { color: layoutMode === "dark" ? "#393636ff" : "#eee", visible: false },
        border: '2px solid red !important',

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
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
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

    // ✅ Ensure no legacy markers are displayed - only custom markers
    markersRef.current = [];
    seriesRef.current.setMarkers([]);

    const resizeObserver = new ResizeObserver(() => {
      if (chartContainerRef.current && chartRef.current) {
        console.log("Resizing chart to container dimensions");
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
          height: chartContainerRef.current.clientHeight,
          // border:'2px solid red',

        });
        // chartRef.current.timeScale().applyOptions({
        //   rightOffset: 12,
        // });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    // Set up interval for marker position updates
    const markerUpdateInterval = setInterval(() => {
      if (customMarkersRef.current.length > 0) {
        updateCustomMarkerPositions();
      }
    }, 100); // Update every 100ms for smooth movement

    // Mark chart as ready after a short delay to ensure everything is initialized
    setTimeout(() => {
      isChartMountedRef.current = true;
      console.log('✅ Chart fully initialized and ready for markers');
    }, 100);

    return () => {
      isChartMountedRef.current = false;
      resizeObserver.disconnect();
      clearInterval(markerUpdateInterval);
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
          if (indicator === 'BB') {
            const { upper, lower } = calculateBB(mappedData, bbPeriod);
            bbUpperSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1 });
            bbLowerSeriesRef.current = chartRef.current.addLineSeries({ color: bbLineColor, lineWidth: 1 });
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



    // Don't re-add legacy markers - only custom markers will be used
    // if (markersRef.current.length > 0) {
    //   const sorted = [...markersRef.current].sort((a, b) => a.time - b.time);
    //   seriesRef.current.setMarkers(sorted);
    // }
  }, [selectedSymbol, selectedTimeframe, selectedSeriesType, mappedData]);


  //  const bid  = symbols[selectedSymbol];
  //  console.log(`bid of ${selectedSymbol} is ${bid}  at ${Date.now()}`)

  useEffect(() => {
    if (!selectedSymbol || !symbols[selectedSymbol] || !seriesRef.current) return;

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

    // let newCandle = { ...lastCandleRef.current };
    let newCandle



    // if (!lastCandleRef.current || lastCandleRef.current.time !== candleTime) {
    //   const lastClose = mappedData.length > 0 ? mappedData[mappedData.length - 1].close : bid;



    //   newCandle = {
    //     time: candleTime,
    //     open: bid,
    //     high: bid,
    //     low: bid,
    //     close: bid,
    //   };
    // } else {
    //   newCandle.high = Math.max(lastCandleRef.current.high, bid);
    //   newCandle.low = Math.min(lastCandleRef.current.low, bid);
    //   newCandle.close = bid;
    // }

    if (!lastCandleRef.current) {
      const lastClose = mappedData.length > 0 ? mappedData[mappedData.length - 1].close : bid;

      newCandle = {
        time: candleTime,
        open: lastClose,      // ✅ ONLY first candle gets this
        high: bid,
        low: bid,
        close: bid,
      };
    }

    // New candle timeframe (but NOT first ever) — start fresh from bid
    else if (lastCandleRef.current.time !== candleTime) {
      newCandle = {
        time: candleTime,
        open: bid,
        high: bid,
        low: bid,
        close: bid,
      };
    }

    // Same candle timeframe — just update values
    else {
      newCandle = {
        ...lastCandleRef.current,
        high: Math.max(lastCandleRef.current.high, bid),
        low: Math.min(lastCandleRef.current.low, bid),
        close: bid,
      };
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
      color: newCandle.close >= newCandle.open ? "#2DA479" : "#FF0000",
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

        if (activeIndicators.includes('BB') && bbUpperSeriesRef.current && bbLowerSeriesRef.current) {
          const { upper, lower } = calculateBB([...mappedData, newCandle], bbPeriod);
          bbUpperSeriesRef.current.update(upper[upper.length - 1]);
          bbLowerSeriesRef.current.update(lower[lower.length - 1]);
        }

        // Update marker positions after candle update
        requestAnimationFrame(() => {
          updateCustomMarkerPositions();
        });
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





  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.timeScale()?.applyOptions({
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
      console.log("Window resized:", window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  useEffect(() => {
    return () => {
      Object.values(orderTimersRef.current).forEach(clearInterval);
      orderTimersRef.current = {};
      // Clear all custom markers on cleanup
      clearAllCustomMarkers();
      // Clear any scheduled hide timeouts for restored markers
      try {
        Object.values(markerHideTimersRef.current || {}).forEach((to) => clearTimeout(to));
        markerHideTimersRef.current = {};
      } catch (e) {
        console.warn('Failed to clear marker hide timers on unmount', e);
      }
      // Clear any pending animation frames
      if (window.requestAnimationFrame) {
        let id = window.requestAnimationFrame(() => { });
        while (id--) {
          window.cancelAnimationFrame(id);
        }
      }
    };
  }, [clearAllCustomMarkers]);

  useEffect(() => {
    if (!closedOrder?.id) return;

    // Get all active trades from localStorage
    const trades = JSON.parse(localStorage.getItem("activeTrades") || "[]");

    // Check if this closed order exists
    const updatedTrades = trades.filter(order => order.id.toString() !== closedOrder.id.toString());

    // Update localStorage if order was removed
    if (updatedTrades.length !== trades.length) {
      localStorage.setItem("activeTrades", JSON.stringify(updatedTrades));
    }

    // Update state
    setActiveOrders(updatedTrades);
    setOrderCount(updatedTrades.length);

    // Remove marker
    removeMarker(closedOrder.id);

  }, [closedOrder]);



  // Add custom CSS for hover effect for dropdown list items
  // Place this inside your component, not as a top-level import or statement
  useEffect(() => {
    const styleId = 'custom-hover-dropdown-item-style';
    if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .custom-hover-dropdown-item:hover {
          background-color: #c41a6b !important;
          color: #fff !important;
        }
        .custom-hover-dropdown-item:hover * {
          color: #fff !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // Handler to add currently selected symbol to favorites when FAVORITES tab is clicked
  const handleFavoritesTabClick = () => {
    setActiveTab('FAVORITES');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        width: '100%',
        // gap: '10px',
        position: 'relative',
        minHeight: isMobile ? '100vh' : undefined,
        paddingBottom: isMobile ? '80px' : undefined,
        backgroundImage: `url(${trading})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        borderRadius: '20px',
        marginBottom: '15px',
        overflow: 'hidden',
        border: '2px solid red !important', // Add this line to set the border
      }}
    >
      <div className="chart-wrapper" style={{
        width: '100%',
      }}>
        {/* {orderSuccessAlertPending && (
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
        )} */}
        {
          paymentAlertVisible && (
            <Alert
              isOpen={paymentAlertVisible}
              style={{ zIndex: 9999, backgroundColor: "#EF5350", color: "#ffffff", position: 'relative', width: '100%' }}
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
            <>
              <CustomHeaderModal
                color={alert.result === "win" ? "#26A69A" : "#EF5350"}
                key={alert.id}
                order={false}
                buy={
                  alert.result === "win"
                    ? true
                    : false
                }
                pair={alert.symbol}
                forecast={
                  alert.result === "win"
                    ? "Win"
                    : "Loss"
                }
                isOpen={true}
                amount={alert.payout}
                finalResult={alert.result == "win" ? true : false}
                title={
                  // Ensure alert.result is converted to a string before calling toUpperCase
                  `Order Result: ${String(alert.result ?? '').toUpperCase()}`
                }

                toggle={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
              />

            </>
          ))}
        </div>

        {/* Notification System */}
        {/* <NotificationManager /> */}

        <div className="chart-topbar   d-flex align-items-center gap-2 p-2"
          style={{

            position: isMobile ? "relative" : "absolute",
            zIndex: isMobile ? "30000" : ""
          }}

        >


          <Dropdown isOpen={selectDropdownOpen} toggle={toggleSelectDropdown} className="symbol-select w-100">
            <DropdownToggle
              caret
              className="w-100 btn d-flex align-items-center gap-2"
              style={{ backgroundColor: '#160318', borderColor: '#160318', height: '40px' }}
            >
              <img src={selectedSymbolIcon} alt="icon images" width={30} height={30} />
              <span>{selected}</span>
            </DropdownToggle>

            <DropdownMenu
              className="responsive-dropdown-menu"
              style={{
                overflowY: 'auto',
                border: 'none',
                boxShadow: 'none',
                backgroundColor: 'transparent',
                backdropFilter: 'blur(18px)',
                zIndex: 20000,
                position: 'absolute',
                left: 0,
                right: 0
              }}
            >
              <div className="dropdown-container" style={{
                display: 'flex',
                minWidth: 420,
                minHeight: 320,
                borderRadius: 12,
                overflow: 'hidden',
                border: '1px solid rgb(68, 25, 65)',
              }}>
                {/* Desktop Left Sidebar Tabs */}
                <div className="desktop-sidebar" style={{
                  width: 200,
                  borderRight: '1px solid #2a1a3a',
                  display: 'flex',
                  flexDirection: 'column',
                  paddingTop: 10
                }}>
                  <div
                    onClick={() => setActiveTab('CURRENCIES')}
                    style={{
                      padding: '8px 12px',
                      color: '#fff',
                      fontWeight: 600,
                      background: activeTab === 'CURRENCIES' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                      borderRadius: 8,
                      margin: '0 8px 8px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 11,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      width: '93%',
                      border: '1px solid rgb(77, 74, 74)',
                    }}>
                    {activeTab !== 'CURRENCIES' && (
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '21%',
                        background: '#c41a6b',
                        borderRadius: '8px 0 0 8px',
                        zIndex: 0,
                      }}></span>
                    )}
                    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                      <i className="ri-money-dollar-circle-line" style={{ background: activeTab === 'CURRENCIES' ? '#c41a6b' : 'transparent', color: '#fff', fontSize: 16, borderRadius: 6, padding: 2 }}></i>
                      CURRENCIES
                    </span>
                  </div>
                  <div
                    onClick={() => setActiveTab('CRYPTOCURRENCIES')}
                    style={{
                      padding: '8px 12px',
                      color: '#fff',
                      fontWeight: 500,
                      background: activeTab === 'CRYPTOCURRENCIES' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                      borderRadius: 8,
                      margin: '0 8px 8px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 11,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      width: '93%',
                      border: '1px solid rgb(77, 74, 74)',
                    }}>
                    {activeTab !== 'CRYPTOCURRENCIES' && (
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '21%',
                        background: '#c41a6b',
                        borderRadius: '8px 0 0 8px',
                        zIndex: 0,
                      }}></span>
                    )}
                    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                      <i className="ri-bit-coin-line" style={{ background: activeTab === 'CRYPTOCURRENCIES' ? '#c41a6b' : 'transparent', color: '#fff', fontSize: 16, borderRadius: 6, padding: 2 }}></i>
                      CRYPTO
                    </span>
                  </div>
                  <div
                    onClick={() => setActiveTab('COMMODITIES')}
                    style={{
                      padding: '8px 12px',
                      color: '#fff',
                      fontWeight: 500,
                      background: activeTab === 'COMMODITIES' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                      borderRadius: 8,
                      margin: '0 8px 8px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 11,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      width: '93%',
                      border: '1px solid rgb(77, 74, 74)',
                    }}>
                    {activeTab !== 'COMMODITIES' && (
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '21%',
                        background: '#c41a6b',
                        borderRadius: '8px 0 0 8px',
                        zIndex: 0,
                      }}></span>
                    )}
                    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                      <i className="ri-bar-chart-2-line" style={{ background: activeTab === 'COMMODITIES' ? '#c41a6b' : 'transparent', color: '#fff', fontSize: 16, borderRadius: 6, padding: 2 }}></i>
                      COMMODITIES
                    </span>
                  </div>
                  <div
                    onClick={() => setActiveTab('STOCKS')}
                    style={{
                      padding: '8px 12px',
                      color: '#fff',
                      fontWeight: 500,
                      background: activeTab === 'STOCKS' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                      borderRadius: 8,
                      margin: '0 8px 8px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 11,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      width: '93%',
                      border: '1px solid rgb(77, 74, 74)',
                    }}>
                    {activeTab !== 'STOCKS' && (
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '21%',
                        background: '#c41a6b',
                        borderRadius: '8px 0 0 8px',
                        zIndex: 0,
                      }}></span>
                    )}
                    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                      <i className="ri-stack-line" style={{ background: activeTab === 'STOCKS' ? '#c41a6b' : 'transparent', color: '#fff', fontSize: 16, borderRadius: 6, padding: 2 }}></i>
                      STOCKS
                    </span>
                  </div>
                  <div
                    onClick={() => setActiveTab('INDICES')}
                    style={{
                      padding: '8px 12px',
                      color: '#fff',
                      fontWeight: 500,
                      background: activeTab === 'INDICES' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                      borderRadius: 8,
                      margin: '0 8px 8px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 11,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      width: '93%',
                      border: '1px solid rgb(77, 74, 74)',
                    }}>
                    {activeTab !== 'INDICES' && (
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '21%',
                        background: '#c41a6b',
                        borderRadius: '8px 0 0 8px',
                        zIndex: 0,
                      }}></span>
                    )}
                    <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                      <i className="ri-line-chart-line" style={{ background: activeTab === 'INDICES' ? '#c41a6b' : 'transparent', color: '#fff', fontSize: 16, borderRadius: 6, padding: 2 }}></i>
                      INDICES
                    </span>
                  </div>
                  <div
                    onClick={handleFavoritesTabClick}
                    style={{
                      padding: '8px 12px',
                      color: '#fff',
                      fontWeight: 500,
                      background: activeTab === 'FAVORITES' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                      borderRadius: 8,
                      margin: '0 8px 8px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      fontSize: 11,
                      cursor: 'pointer',
                      position: 'relative',
                      overflow: 'hidden',
                      width: '93%',
                      border: '1px solid rgb(77, 74, 74)',
                    }}>
                    {activeTab !== 'FAVORITES' && (
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '21%',
                        background: '#c41a6b',
                        borderRadius: '8px 0 0 8px',
                        zIndex: 0,
                      }}></span>
                    )}
                    <span onClick={handleFavoritesTabClick} style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
                      <i className="ri-star-line" style={{ background: activeTab === 'FAVORITES' ? '#c41a6b' : 'transparent', color: '#fff', fontSize: 16, borderRadius: 6, padding: 2 }}></i>
                      FAVORITES
                    </span>
                  </div>
                </div>

                {/* Right Panel: Search + List */}
                <div className="right-panel" style={{
                  flex: 1,
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  minWidth: 326,
                  height: '434px',
                }}>
                  {/* Mobile Icon Tabs */}
                  <div className="mobile-icon-tabs" style={{
                    display: 'none',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginBottom: 16,
                    paddingBottom: 12,
                    borderBottom: '1px solid #2a1a3a',
                  }}>
                    <div
                      onClick={() => setActiveTab('CURRENCIES')}
                      style={{
                        padding: '8px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: activeTab === 'CURRENCIES' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                        border: '1px solid rgb(77, 74, 74)',
                      }}>
                      <i className="ri-money-dollar-circle-line" style={{ color: '#fff', fontSize: 18 }}></i>
                    </div>
                    <div
                      onClick={() => setActiveTab('CRYPTOCURRENCIES')}
                      style={{
                        padding: '8px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: activeTab === 'CRYPTOCURRENCIES' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                        border: '1px solid rgb(77, 74, 74)',
                      }}>
                      <i className="ri-bit-coin-line" style={{ color: '#fff', fontSize: 18 }}></i>
                    </div>
                    <div
                      onClick={() => setActiveTab('COMMODITIES')}
                      style={{
                        padding: '8px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: activeTab === 'COMMODITIES' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                        border: '1px solid rgb(77, 74, 74)',
                      }}>
                      <i className="ri-bar-chart-2-line" style={{ color: '#fff', fontSize: 18 }}></i>
                    </div>
                    <div
                      onClick={() => setActiveTab('STOCKS')}
                      style={{
                        padding: '8px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: activeTab === 'STOCKS' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                        border: '1px solid rgb(77, 74, 74)',
                      }}>
                      <i className="ri-stack-line" style={{ color: '#fff', fontSize: 18 }}></i>
                    </div>
                    <div
                      onClick={() => setActiveTab('INDICES')}
                      style={{
                        padding: '8px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: activeTab === 'INDICES' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                        border: '1px solid rgb(77, 74, 74)',
                      }}>
                      <i className="ri-line-chart-line" style={{ color: '#fff', fontSize: 18 }}></i>
                    </div>
                    <div
                      onClick={() => setActiveTab('FAVORITES')}
                      style={{
                        padding: '8px',
                        borderRadius: 8,
                        cursor: 'pointer',
                        background: activeTab === 'FAVORITES' ? 'linear-gradient(90deg, #c41a6b, #390452)' : 'transparent',
                        border: '1px solid rgb(77, 74, 74)',
                      }}>
                      <i className="ri-star-line" style={{ color: '#fff', fontSize: 18 }}></i>
                    </div>
                  </div>

                  {/* Search Input */}
                  <div className="d-flex align-items-center gap-2 mb-2" style={{ marginBottom: 16 }}>
                    <div style={{ position: 'relative', width: '100%' }}>
                      <Input
                        bsSize="sm"
                        placeholder="SEARCH"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          backgroundColor: '#2a1a3a',
                          color: '#8b5fbf',
                          borderColor: '#2a1a3a',
                          borderRadius: 8,
                          paddingLeft: 34,
                          height: 36,
                          fontSize: 12,
                          fontWeight: 500
                        }}
                      />
                      <i
                        className="ri-search-line"
                        style={{
                          color: '#8b5fbf',
                          position: 'absolute',
                          left: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: 16,
                          pointerEvents: 'none'
                        }}
                      ></i>
                    </div>
                  </div>

                  {/* List */}
                  <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    maxHeight: 334,
                    paddingRight: 4
                  }}>
                    {activeTab === 'FAVORITES' ? (
                      favorites.length > 0 ? (
                        favorites.map((fav) => {
                          // If fav is a string, find the full symbol object from filteredOptions or all options
                          let symbolObj = fav;
                          if (typeof fav === 'string') {
                            symbolObj = filteredOptions.find(opt => opt.value === fav) || { value: fav };
                          }
                          const { value, icon, percent } = symbolObj;
                          return (
                            <DropdownItem
                              key={value}
                              onClick={() => {
                                handleSelectChange({ value });
                                setDropdownOpen(false);
                                setSymbolPercentage(percent);
                                setSymbolIcon(icon);
                              }}
                              active={value === selected}
                              className="d-flex align-items-center gap-2 custom-hover-dropdown-item"
                              style={{
                                backgroundColor: 'transparent',
                                color: '#fff',
                                cursor: 'pointer',
                                borderRadius: 8,
                                marginBottom: '5px',
                                marginTop: '5px',
                                padding: '8px 10px',
                                fontWeight: 400,
                                fontSize: 12,
                              }}
                              tabIndex={0}
                              onFocus={e => e.currentTarget.style.backgroundColor = '#4f1044'}
                              onBlur={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4f1044'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 5,
                                width: '100%'
                              }}>
                                <i className="ri-star-fill" style={{
                                  color: '#F5C60D',
                                  fontSize: 18,
                                  cursor: 'pointer',
                                  marginRight: 4
                                }}></i>
                                {icon && (
                                  <img
                                    src={icon}
                                    alt="icon images"
                                    width={25}
                                    height={25}
                                    style={{ borderRadius: 50 }}
                                    onClick={e => {
                                      e.stopPropagation();
                                      handleSelectChange({ value });
                                      setDropdownOpen(false);
                                      setSymbolPercentage(percent);
                                      setSymbolIcon(icon);
                                    }}
                                  />
                                )}
                                <span
                                  onClick={() => {
                                    handleSelectChange({ value });
                                    setDropdownOpen(false);
                                    setSymbolPercentage(percent);
                                    setSymbolIcon(icon);
                                  }}
                                  style={{ flex: 1, color: '#fff' }}
                                >{value}</span>
                                {percent !== undefined && (
                                  <span
                                    onClick={() => {
                                      handleSelectChange({ value });
                                      setDropdownOpen(false);
                                      setSymbolPercentage(percent);
                                      setSymbolIcon(icon);
                                    }}
                                    style={{
                                      fontSize: '11px',
                                      color: '#fff',
                                      fontWeight: 500
                                    }}
                                  >{percent}%</span>
                                )}
                              </div>
                            </DropdownItem>
                          );
                        })
                      ) : (
                        <DropdownItem disabled className="text-muted text-center">
                          No favorites yet
                        </DropdownItem>
                      )
                    ) : (
                      Object.keys(groupedSymbols).length > 0 ? (
                        Object.entries(groupedSymbols).map(([category, symbols]) => (
                          <div key={category}>
                            {/* Category Header */}
                            <DropdownItem disabled className="text-muted" style={{
                              backgroundColor: '#2a1f3d',
                              color: '#c41a6b',
                              fontWeight: 'bold',
                              fontSize: '12px',
                              padding: '8px 10px',
                              marginTop: '5px',
                              marginBottom: '2px'
                            }}>
                              {category}
                            </DropdownItem>
                            {/* Category Symbols */}
                            {symbols.map(({ value, icon, color, percent }) => (
                              <DropdownItem
                                key={value}
                                active={value === selected}
                                className="d-flex align-items-center gap-2 custom-hover-dropdown-item"
                                style={{
                                  backgroundColor: 'transparent',
                                  color: '#fff',
                                  cursor: 'pointer',
                                  borderRadius: 8,
                                  marginBottom: '2px',
                                  marginTop: '2px',
                                  padding: '6px 15px',
                                  fontWeight: 400,
                                  fontSize: 12,
                                }}
                                tabIndex={0}
                                onFocus={e => e.currentTarget.style.backgroundColor = '#4f1044'}
                                onBlur={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4f1044'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                              >
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 5,
                                  width: '100%'
                                }}>
                                  <i
                                    className={isFavorite(value) ? "ri-star-fill" : "ri-star-line"}
                                    style={{
                                      color: '#F5C60D',
                                      fontSize: 16,
                                      cursor: 'pointer',
                                      marginRight: 4
                                    }}
                                    title={isFavorite(value) ? "Remove from favorites" : "Add to favorites"}
                                    onClick={e => {
                                      e.stopPropagation();
                                      if (isFavorite(value)) {
                                        removeFavorite(value);
                                      } else {
                                        addFavorite(value);
                                      }
                                    }}
                                  />
                                  <img onClick={() => {
                                    handleSelectChange({ value });
                                    setDropdownOpen(false);
                                    setSymbolPercentage(percent);
                                    setSymbolIcon(icon);
                                  }} src={icon} alt="icon images" width={22} height={22} style={{ borderRadius: 50 }} />
                                  <span onClick={() => {
                                    handleSelectChange({ value });
                                    setDropdownOpen(false);
                                    setSymbolPercentage(percent);
                                    setSymbolIcon(icon);
                                  }} style={{ flex: 1, color: '#fff' }}>{value}</span>
                                  <span onClick={() => {
                                    handleSelectChange({ value });
                                    setDropdownOpen(false);
                                    setSymbolPercentage(percent);
                                    setSymbolIcon(icon);
                                  }} style={{
                                    fontSize: '10px',
                                    color: '#fff',
                                    fontWeight: 500
                                  }}>{percent}%</span>
                                </div>
                              </DropdownItem>
                            ))}
                          </div>
                        ))
                      ) : (
                        <DropdownItem disabled className="text-muted text-center">
                          No matching symbols
                        </DropdownItem>
                      )
                    )}
                  </div>
                </div>

              </div>
            </DropdownMenu>
          </Dropdown>

          <style>{`
  /* Mobile responsive styles */
  @media (max-width: 768px) {
    .responsive-dropdown-menu .dropdown-container {
      flex-direction: column !important;
      min-width: 100% !important;
      width: 100% !important;
    }
    
    .desktop-sidebar {
      display: none !important;
    }
    
    .mobile-icon-tabs {
      display: flex !important;
      z-index: 30000 !important;
    }
    
    .right-panel {
      min-width: 361px !important;
      padding: 16px !important;
    }
  }
  
  @media (max-width: 480px) {
    .responsive-dropdown-menu .dropdown-container {
      min-height: 400px !important;
    }
    
    .mobile-icon-tabs {
      gap: 8px !important;
    }
    
    .mobile-icon-tabs > div {
      flex: 1 !important;
      text-align: center !important;
    }
  }
`}</style>

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
            <DropdownToggle
              className="btn btn-outline-light"
              style={{
                background: dropdownOpen ? 'linear-gradient(90deg, #c41a6b, #390452)' : '#160318',
                border: '1px solid #160318',
              }}
            >
              <img src={TimeFrame} className="" style={{
                fontSize: '2rem', height: '26px',
                width: '36px'
              }} />
            </DropdownToggle>

            <DropdownMenu
              end
              style={{ backgroundColor: 'transparent', backdropFilter: 'blur(20px)', border: '1px solid #420633ff' }}
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

                    // Update markers after timeframe change
                    setTimeout(() => {
                      updateCustomMarkerPositions();
                    }, 500);
                  }}
                  style={{
                    color: selectedTimeframe === tf ? 'white' : '#fff',
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


          <Dropdown isOpen={seriesDropdownOpen} toggle={toggleSeriesDropdown} className="btn  p-0 border-0">
            {/* <DropdownToggle tag="i" className="ri-line-chart-line" style={{ cursor: 'pointer' }} /> */}
            <DropdownToggle
              className="btn "
              style={{
                background: seriesDropdownOpen ? 'linear-gradient(90deg, #c41a6b, #390452)' : '#160318',
                border: '1px solid #160318', padding: "6px"
              }}
            >
              <img src={chartType} className="" style={{
                fontSize: '2rem', height: '26px',
                width: '36px'
              }} />
            </DropdownToggle>
            <DropdownMenu end
              style={{ backgroundColor: 'transparent', backdropFilter: 'blur(20px)', border: '1px solid #420633ff', zIndex: 20000, position: 'absolute', left: 0, right: 0 }}

            >
              {seriesTypes?.map((type) => (
                <DropdownItem
                  key={type}
                  onClick={() => handleSeriesTypeChange(type)}
                  // className={selectedSeriesType === type ? "active" : ""}
                  style={{
                    color: selectedSeriesType === type ? '#fff' : '#fff',
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
            className="btn p-2 px-3"
            title="Go to realtime"
            style={{ backgroundColor: "#160318", border: "1px solid #160318" }}

          >
            <i className="ri-rfid-line"></i>
          </button>




          {/* Demo Markers Button - For testing alignment */}

          {/* <button
            onClick={addDemoMarkers}
            className="btn p-2 px-3"
            title="Test Marker Alignment"
            style={{ backgroundColor: "#160318", border: "1px solid #160318" }}
          >
            <i className="ri-map-pin-line"></i>
          </button> */}


          {/* Quick horizontal price line toggle 
             <button
            onClick={toggleQuickPriceLine}
            className="btn p-2 px-3"
            title="Toggle horizontal price line"
            style={{ backgroundColor: "#160318", border: "1px solid #160318" }}
          >
            <i className="ri-subtract-line" />
          </button>
            
            
            */}

          <Dropdown isOpen={indicatorDropdownOpen} toggle={() => setIndicatorDropdownOpen(!indicatorDropdownOpen)} className="btn btn-outline-light p-0 border-0">
            {/* <DropdownToggle tag="i" className="ri-router-line" style={{ cursor: 'pointer' }} /> */}
            <DropdownToggle className="btn btn-outline-light" style={{
                background: indicatorDropdownOpen ? 'linear-gradient(90deg, #c41a6b, #390452)' : '#160318',
                border: '1px solid #160318', padding: "6px"
              }}>
              <i className="ri-router-line" />
            </DropdownToggle>
            <DropdownMenu style={{
              backgroundColor: "transparent",
              backdropFilter: "blur(20px)",
              borderColor: "#6c757d"
            }}>
              <DropdownItem onClick={() => toggleModal('EMA')}
                style={{
                  color: activeIndicators.includes('EMA') ? '#fff' : '#fff',
                  background: "transparent",
                  backdropFilter: "blur(20px)",
                }} className="d-flex align-items-center justify-content-between">
                EMA  {activeIndicators.includes('EMA') && <i className="ri-check-line text-success"></i>}
              </DropdownItem>
              <DropdownItem onClick={() => toggleModal('SMA')}
                style={{ color: activeIndicators.includes('SMA') ? '#fff' : '#fff' }}
                className="d-flex align-items-center justify-content-between">
                SMA {activeIndicators.includes('SMA') && <i className="ri-check-line text-success"></i>}
              </DropdownItem>
              <DropdownItem onClick={() => toggleModal('WMA')}
                style={{ color: activeIndicators.includes('WMA') ? '#fff' : '#fff' }}
                className="d-flex align-items-center justify-content-between">
                WMA {activeIndicators.includes('WMA') && <i className="ri-check-line text-success"></i>}
              </DropdownItem>
              <DropdownItem onClick={() => toggleModal('ZigZag')}
                style={{ color: activeIndicators.includes('ZigZag') ? '#fff' : '#fff' }}
                className="d-flex align-items-center justify-content-between">
                ZigZag {activeIndicators.includes('ZigZag') && <i className="ri-check-line text-success"></i>}
              </DropdownItem>
              <DropdownItem onClick={() => toggleModal('Alligator')}
                style={{ color: activeIndicators.includes('Alligator') ? '#fff' : '#fff' }}
                className="d-flex align-items-center justify-content-between">
                Alligator {activeIndicators.includes('Alligator') && <i className="ri-check-line text-success"></i>}
              </DropdownItem>
              <DropdownItem onClick={() => toggleModal('parabolic')}
                style={{ color: activeIndicators.includes('parabolic') ? '#fff' : '#fff' }}
                className="d-flex align-items-center justify-content-between">
                Parabolic SAR {activeIndicators.includes('parabolic') && <i className="ri-check-line text-success"></i>}
              </DropdownItem>
              <DropdownItem onClick={() => toggleModal('BB')}
                style={{ color: activeIndicators.includes('BB') ? '#fff' : '#fff' }}
                className="d-flex align-items-center justify-content-between">
                Bollinger Band {activeIndicators.includes('BB') && <i className="ri-check-line text-success"></i>}
              </DropdownItem>
              {/* <DropdownItem onClick={() => toggleModal('DonchianChannel')}
                style={{ color: activeIndicators.includes('DonchianChannel') ? '#fff' : '#fff' }}
                className="d-flex align-items-center justify-content-between">
                Donchian Channel {activeIndicators.includes('DonchianChannel') && <i className="ri-check-line text-success"></i>}
              </DropdownItem> */}
              <DropdownItem onClick={() => toggleModal('IchimokuCloud')}
                style={{ color: activeIndicators.includes('IchimokuCloud') ? '#fff' : '#fff' }}
                className="d-flex align-items-center justify-content-between">
                Ichimoku Cloud {activeIndicators.includes('IchimokuCloud') && <i className="ri-check-line text-success"></i>}
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={() => toggleModal('RSI')}
                style={{ color: activeIndicators.includes('RSI') ? '#fff' : '#fff' }}
                className="d-flex align-items-center justify-content-between">
                RSI {activeIndicators.includes('RSI') && <i className="ri-check-line text-success"></i>}
              </DropdownItem>
              <DropdownItem onClick={() => toggleModal('MACD')}
                style={{ color: activeIndicators.includes('MACD') ? '#fff' : '#fff' }}
                className="d-flex align-items-center justify-content-between">
                MACD {activeIndicators.includes('MACD') && <i className="ri-check-line text-success"></i>}
              </DropdownItem>
              {/* <DropdownItem onClick={() => toggleModal('Volume')}
                style={{ color: activeIndicators.includes('Volume') ? '#fff' : '#fff' }}
                className="d-flex align-items-center justify-content-between">
                Volume {activeIndicators.includes('Volume') && <i className="ri-check-line text-success"></i>}
              </DropdownItem> */}
              <DropdownItem divider />
              <DropdownItem onClick={clearAllIndicators} >Clear All Indicators</DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Modal style={{
            top: isMobile ? '80px' : '',
          }} isOpen={modal} toggle={toggleModal} className='invoice-modal' backdrop="static" keyboard={false}>
            <ModalBody style={{
              background: "transparent",
              backdropFilter: "blur(15px)",
              height: isMobile ? '250px' : 'auto',
              overflowY: isMobile ? 'scroll' : 'hidden'
            }}>
              <IndicatorsSettings onInputChange={handleSettings} indicatorName={selectedIndicator} />
            </ModalBody>
            <ModalFooter style={{
              background: "transparent",
              backdropFilter: "blur(15px)",

            }} >
              <Button color="default" onClick={() => toggleModal()}>{t('Close')}</Button>
              <Button color="default" style={{ border: "1px solid white" }} onClick={() => { editIndicators(); toggleIndicator(selectedIndicator); toggleModal(); }}>
                {activeIndicators.includes(selectedIndicator) ? t('Hide') : t('Apply')}
              </Button>
              {/* <Button color="success" onClick={() => { editIndicators(); toggleIndicator(selectedIndicator); toggleModal(); }}>{t('Apply')}</Button> */}
            </ModalFooter>
          </Modal>
        </div>


        <Modal isOpen={indicatorSettingsModal} toggle={closeIndicatorSettings} className='invoice-modal' backdrop="static" keyboard={false} style={{
          top: isMobile ? '80px' : '',
        }}>
          <ModalHeader toggle={closeIndicatorSettings}>
            {selectedIndicatorForSettings} Settings for {selectedSymbol}
          </ModalHeader>
          <ModalBody style={{
            background: "transparent",
            backdropFilter: "blur(15px)",
            height: isMobile ? '250px' : 'auto',
            overflowY: isMobile ? 'scroll' : 'hidden'
          }}>
            <IndicatorsSettings onInputChange={handleSettings} indicatorName={selectedIndicatorForSettings} />
          </ModalBody>
          <ModalFooter style={{
            background: "transparent",
            backdropFilter: "blur(15px)",
          }}>
            <Button color="default" onClick={closeIndicatorSettings}>{t('Close')}</Button>
            <Button color="default" style={{ border: "1px solid white" }} onClick={() => { editIndicators(); closeIndicatorSettings(); }}>{t('Apply')}</Button>
          </ModalFooter>
        </Modal>

        {/* Active Indicators Panel for Current Symbol */}
        {false && (
          <div className="active-indicators-panel position-absolute"
            style={{
              top: '85px',
              right: '10px',
              zIndex: 9,
              backgroundColor: layoutMode === "dark" ? 'rgba(90,90,90,0.9)' : 'rgba(255,255,255,0.9)',
              border: `1px solid ${layoutMode === "dark" ? '#333' : '#ddd'}`,
              borderRadius: '4px',
              padding: '8px',
              maxHeight: '200px',
              overflowY: 'auto',
              color: layoutMode === "dark" ? '#fff' : '#000',
              minWidth: '200px'
            }}>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h6 className="m-0">Indicators - {selectedSymbol}</h6>
            </div>
            {activeIndicators.map(indicator => (
              <div key={indicator} className="indicator-item mb-1 p-1 d-flex justify-content-between align-items-center"
                style={{
                  backgroundColor: layoutMode === "dark" ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                  borderRadius: '3px',
                  fontSize: '12px'
                }}>
                <span>{indicator}</span>
                <div>
                  <button
                    className="btn btn-sm btn-outline-primary me-1"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    onClick={() => openIndicatorSettings(indicator)}
                    title={`Settings for ${indicator}`}
                  >
                    <i className="ri-settings-3-line"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    style={{ padding: '2px 6px', fontSize: '10px' }}
                    onClick={() => toggleIndicator(indicator)}
                    title={`Remove ${indicator}`}
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* {activeOrders?.length > 0 && (
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
      )} */}

        {/* add overlay if showTimePicker */}
        {
          isMobile && (showTimePicker || showAmountCalculator || timePickerModel) && (
            <div className="time-picker-overlay"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10000,
              }}
              onClick={() => { setShowTimePicker(false); setShowAmountCalculator(false); setTimePickerModel(false); }}
            />
          )
        }

        <div ref={chartContainerRef}
          className="chart-container"

          style={{
            position: 'relative',
            height: '50%',
            width: '100%',
            overflow: 'visible'
          }}>

          {/* Debug info for development */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '5px',
            borderRadius: '3px',
            fontSize: '10px',
            zIndex: 10000,
            pointerEvents: 'none'
          }}>

          </div>


          {tooltipVisible && tooltipData && (
            <div
              ref={tooltipRef}
              style={{
                position: 'absolute',
                left: '20px',
                bottom: '35px',
                background: "transparent",
                backdropFilter: "blur(10px)",
                // border: '1px solid #4a4a4a',
                padding: '8px',
                borderRadius: '12px',
                pointerEvents: 'none',
                zIndex: 10,
                color: '#ffffff',
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
              }}
            >
              <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>
                {tooltipData.time} {tooltipData.data.close >= tooltipData.data.open && <span style={{ color: '#2DA479', marginLeft: '4px' }}>✓</span>}
              </div>
              {selectedSeriesType === 'Candlestick' || selectedSeriesType === 'Bar' ? (
                <>
                  <div style={{ color: 'white' }}>Open: {tooltipData.data.open}</div>
                  <div style={{ color: 'white' }}>High: {tooltipData.data.high}</div>
                  <div style={{ color: 'white' }}>Low: {tooltipData.data.low}</div>
                  <div style={{ color: tooltipData.data.close >= tooltipData.data.open ? 'white' : 'white' }}>
                    Close: {tooltipData.data.close} {tooltipData.data.close >= tooltipData.data.open && <span style={{ color: '#2DA479', marginLeft: '4px' }}>↑</span>}
                  </div>
                </>
              ) : (
                <div style={{ color: '#2962FF' }}>Value: {tooltipData.data.value}</div>
              )}
            </div>
          )}
        </div>




        <ToastContainer autoClose />
      </div>
      {/* Calculator placement */}
      {isMobile ? (
        <div style={{
          position: 'fixed',
          left: 14,
          bottom: 43,
          width: '93vw',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          zIndex: 10000,
          boxShadow: '0 -2px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          padding: isMobile ? '0px' : '8px 0px',
          borderRadius: isMobile ? '0px' : '8px',


        }}>
          <SideCalculator
            handlePlacePendingOrder={handlePlacePendingOrder}
            handlePlaceOrder={handlePlaceOrder}
            symbolMarketActive={symbolMarketActive}
            handlePriceIncrease={handlePriceIncrease}
            handlePriceDecrease={handlePriceDecrease}
            price={price}
            setPrice={setPrice}
            handleInputChange={handleInputChange}
            showAmountCalculator={showAmountCalculator}
            setShowAmountCalculator={setShowAmountCalculator}
            amount={price}
            setAmount={setPrice}
            time={time}
            setTime={setTime}
            selectedSymbol={selectedSymbol}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            symbolPercentage={symbolPercentage}
            showTimePicker={showTimePicker}
            setShowTimePicker={setShowTimePicker}
            timePickerModel={timePickerModel}
            setTimePickerModel={setTimePickerModel}
          />
        </div>
      ) : (
        <div style={{
          // display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <SideCalculator
            handlePlacePendingOrder={handlePlacePendingOrder}
            handlePlaceOrder={handlePlaceOrder}
            symbolMarketActive={symbolMarketActive}
            handlePriceIncrease={handlePriceIncrease}
            handlePriceDecrease={handlePriceDecrease}
            price={price}
            setPrice={setPrice}
            handleInputChange={handleInputChange}
            showAmountCalculator={showAmountCalculator}
            setShowAmountCalculator={setShowAmountCalculator}
            amount={price}
            setAmount={setPrice}
            time={time}
            setTime={setTime}
            selectedSymbol={selectedSymbol}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            symbolPercentage={symbolPercentage}
            showTimePicker={showTimePicker}
            setShowTimePicker={setShowTimePicker}
            timePickerModel={timePickerModel}
            setTimePickerModel={setTimePickerModel}

          />
        </div>
      )}
    </div>

  );
};

export default TradingViewChart2;

