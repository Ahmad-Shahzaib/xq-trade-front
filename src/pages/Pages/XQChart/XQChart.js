import React, { useEffect, useMemo, useRef, useState } from "react";
import { createChart } from "lightweight-charts";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

import { setClickedSymbolData } from "../../../rtk/slices/tradingSlice/tradingSlice";
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle, } from "reactstrap";
import { fetchMarketDataHistory } from "../../../rtk/slices/marketDataHistorySlice/marketDataHistorySlice";


import { getSymbolDetails, seriesTypes, symbolFullNames, timeframes } from "../../DashboardCrypto/MarketGraph/funtion";

const XQChart = () => {
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


  const [selectedTimeframe, setSelectedTimeframe] = useState("1m");
  const [selectedSeriesType, setSelectedSeriesType] = useState("Candlestick");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [seriesDropdownOpen, setSeriesDropdownOpen] = useState(false);
  const [bars, setbars] = useState(100);
  const [isLoading, setIsLoading] = useState(false);
  const [ohlcData, setOhlcData] = useState({ open: 0, high: 0, low: 0, close: 0, time: null, color: "#2DA479" });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipData, setTooltipData] = useState(null);
  const latestOrderResult = useSelector((state) => state.accountType.latestOrderResult);
  const [selectedOption, setSelectedOption] = useState(null);
  const selectedSymbol = useSelector((state) => state.trading.clickedSymbolData) || "BTCUSD";
  const symbols = useSelector((state) => state.trading.symbols);
  const layoutMode = useSelector((state) => state.Layout.layoutModeType);
  const { data, status } = useSelector((state) => state.marketDataHistory);
  const selectedSymbolBid = useSelector((state) => state.trading.clickedSymbolBid);


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

    return processedData?.length > 0 ? processedData : [];
    // return processedData.length > 0 ? processedData.slice(0, -1) : [];
  }, [data]);

  const options = useMemo(() => (
    symbols
      ? Object.keys(symbols)
        // .filter(symbolKey => symbolKey !== "BTCUSD" && symbolKey !== "BTCUSD.ex1") // Exclude specific symbols
        .map(symbolKey => {
          const { icon, color } = getSymbolDetails(symbolKey);
          return {
            value: symbolKey,
            label: (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0' }}>
                <i
                  className={icon}
                  style={{
                    fontSize: '25px',
                    color: color,
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                ></i>
                <span>{symbolKey}</span>
              </div>
            )
          };
        })
      : []
  ), [symbols]);


  function getSymbolFullName(symbol) {
    return symbolFullNames[symbol.replace(".ex1", "")] || symbol;
  }

  const handleSelectChange = (selectedOption) => {
    if (!selectedOption) return;

    const fullName = getSymbolFullName(selectedOption.value);
    // document.getElementById("chart-title").innerText = fullName;

    const newSymbol = selectedOption.value;
    setbars(100);
    visibleRangeRef.current = null;
    dispatch(setClickedSymbolData(newSymbol));

    // Clear existing chart data
    if (seriesRef.current) {
      seriesRef.current.setData([]);
    }

    // 🔧 Reset last candle reference to prevent bridging between symbols
    lastCandleRef.current = null;

    // 🚀 Always fetch new data when symbol changes (Don't check `status`)
    dispatch(fetchMarketDataHistory({ symbol: newSymbol, timeframe: 'M1', bars: 100 }));
    // chartRef.current.timeScale().scrollToRealTime();
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleSeriesDropdown = () => setSeriesDropdownOpen(!seriesDropdownOpen);


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


  useEffect(() => {
    if (!latestOrderResult) return;

    const newAlert = {
      id: Date.now(),
      result: latestOrderResult,
    };




  }, [latestOrderResult, dispatch]);




  const handleSeriesTypeChange = (type) => {
    setSelectedSeriesType(type);
    if (chartRef.current && seriesRef.current) {
      chartRef.current.removeSeries(seriesRef.current);
      seriesRef.current = createSeries(chartRef.current, type);

      if (selectedSymbol && mappedData.length > 0 && status === 'succeeded') {
        const transformedData = transformData(mappedData, type);
        seriesRef.current.setData(transformedData);
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
  };

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
      if (!seriesRef.current || mappedData.length === 0 || isLoading) return;

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
  }, [mappedData, bars, selectedSymbol, dispatch, isLoading, selectedTimeframe]);

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

    dispatch(fetchMarketDataHistory({ symbol: selectedSymbol, timeframe: 'M1', bars: 100 }))
      .then(() => {
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });

  }, [selectedSymbol, dispatch]);

  useEffect(() => {
    if (!status || status !== "succeeded" || !data || data.length === 0 || !seriesRef.current) return;

    seriesRef.current.setData([]);

    if (status === "succeeded") {
      const transformedData = transformData(mappedData, selectedSeriesType);
      seriesRef.current.setData(transformedData);

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
  }, [data, status, selectedSeriesType, bars]);

  useEffect(() => {
    if (!status || status !== "succeeded" || !historyBarData || historyBarData.length === 0 || !seriesRef.current) return;

    // console.log("✅ Rendering OHLC History Data:", historyBarData);

    seriesRef.current.setData([]); // Clear previous data

    const transformedData = historyBarData.map(item => ({
      time: Math.floor(new Date(item.time).getTime() / 1000),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
    }));

    seriesRef.current.setData(transformedData);
  }, [data, status]);



  useEffect(() => {
    if (!chartContainerRef.current) return;

    chartRef.current = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: chartContainerRef.current.clientHeight || 400,
      layout: {
        background: {
          type: "solid",
          color: layoutMode === "dark" ? "#000000" : "#ffffff",
        },
        textColor: layoutMode === "dark" ? "#ffffff" : "#000000",
      },
      grid: {
        vertLines: { color: layoutMode === "dark" ? "#131212" : "#eee" },
        horzLines: { color: layoutMode === "dark" ? "#131212" : "#eee" },
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1, // Adds space above the highest price
          bottom: 0.2, // Adds space below the lowest price
        },
        borderVisible: false,
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

    if (selectedSymbol && mappedData.length > 0) {
      const transformedData = transformData(mappedData, selectedSeriesType);
      seriesRef.current.setData(transformedData);
    }

    // Re-add all markers after changing series
    if (markersRef.current.length > 0) {
      seriesRef.current.setMarkers(markersRef.current);
    }
  }, [selectedSymbol, selectedTimeframe, selectedSeriesType, mappedData]);


  useEffect(() => {
    if (!selectedSymbol || !symbols[selectedSymbol] || !seriesRef.current || status === 'loading') return;

    const { bid } = symbols[selectedSymbol];
    const currentTime = Math.floor(Date.UTC(
      new Date().getUTCFullYear(),
      new Date().getUTCMonth(),
      new Date().getUTCDate(),
      new Date().getUTCHours(),
      new Date().getUTCMinutes(),
      new Date().getUTCSeconds()
    ) / 1000);

    // Convert to UTC+2 by adding 7200 seconds (2 hours)
    const currentTimeGMT2 = currentTime + 21600;

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

      const transformedCandle = transformData([newCandle], selectedSeriesType)[0];
      seriesRef.current.update(transformedCandle);
    }

  }, [symbols, selectedSymbol, selectedTimeframe, selectedSeriesType, status]);

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



  return (
    <div className="  pt-1 xq-chart-top-wraper" >
      <div className="container-fluid p-0">
        <div className="chart-wrapper">




          <div className="chart-topbar w-100  d-flex align-items-center gap-2 p-2">
            <Select
              options={options}
              value={options.find(option => option.value === (selectedSymbol || "BTCUSD"))}
              onChange={handleSelectChange}
              placeholder={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="ri-search-line" style={{ color: '#6c757d' }}></i>
                  <span>Select a symbol</span>
                </div>
              }
              className="symbol-select p-0"
              isSearchable={true}
            />

            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="btn btn-outline-light">
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

            <Dropdown isOpen={seriesDropdownOpen} toggle={toggleSeriesDropdown} className="btn btn-outline-light">
              <DropdownToggle tag="i" className="ri-line-chart-line" style={{ cursor: 'pointer' }} />
              <DropdownMenu end>
                {seriesTypes?.map((type) => (
                  <DropdownItem
                    key={type}
                    onClick={() => handleSeriesTypeChange(type)}
                    className={selectedSeriesType === type ? "active" : ""}
                  >
                    {type}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>


            <button
              onClick={() => {
                chartRef.current.timeScale().scrollToRealTime();
              }}
              className="p-2 px-3"
              title="Go to realtime"
            >
              <i className="ri-rfid-line"></i>
            </button>

          </div>

          <div ref={chartContainerRef} className="chart-conAtainer xq-chart" style={{ position: 'relative' }}>
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


        </div>
      </div>
    </div>
  );
};

export default XQChart;

