import React, { useEffect, useRef } from 'react';
import {
  createChart
} from 'lightweight-charts';

const ChartWithSMA = () => {
  const chartContainerRef = useRef();

  useEffect(() => {
    // Create chart instance
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        backgroundColor: '#ffffff',
        textColor: '#000',
      },
      grid: {
        vertLines: { color: '#eee' },
        horzLines: { color: '#eee' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Candle series
    const candleSeries = chart.addCandlestickSeries();

    // Dummy candle data
    const candleData = [
      { time: 1640995200, open: 100, high: 105, low: 95, close: 102 },
      { time: 1641081600, open: 102, high: 106, low: 98, close: 104 },
      { time: 1641168000, open: 104, high: 107, low: 101, close: 103 },
      { time: 1641254400, open: 103, high: 110, low: 100, close: 108 },
      { time: 1641340800, open: 108, high: 112, low: 105, close: 109 },
      { time: 1641427200, open: 109, high: 115, low: 108, close: 112 },
    ];

    candleSeries.setData(candleData);

    // Compute 5-period SMA
    function calculateSMA(data, period) {
      const result = [];
      for (let i = 0; i < data.length; i++) {
        if (i < period - 1) continue;
        const slice = data.slice(i - period + 1, i + 1);
        const avg = slice.reduce((sum, d) => sum + d.close, 0) / period;
        result.push({ time: data[i].time, value: avg });
      }
      return result;
    }

    const smaData = calculateSMA(candleData, 5);

    // SMA series
    const smaSeries = chart.addLineSeries({
      color: 'blue',
      lineWidth: 2,
    });

    smaSeries.setData(smaData);

    // Cleanup
    return () => chart.remove();
  }, []);

  return (
    <div
      ref={chartContainerRef}
      style={{ width: '100%', height: '400px' }}
    />
  );
};

export default ChartWithSMA;
