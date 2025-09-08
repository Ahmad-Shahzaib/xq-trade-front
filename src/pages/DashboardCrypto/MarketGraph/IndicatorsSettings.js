import React, { useState, useEffect } from "react";
import {  Input  } from "reactstrap";

const IndicatorsSettings = ({indicatorName, onInputChange}) => {

    const indiName = (indicatorName) ? indicatorName.toLowerCase() : '' ;
    const [periodVal, setPeriodVal] =  useState(() => {
        const storedPeriodVal = localStorage.getItem(indiName+'Period');
        return storedPeriodVal ? JSON.parse(storedPeriodVal) : 14;
      });
    const [lineColor, setLineColor] = useState(() => {
      const storedLineColor = localStorage.getItem(indiName+'LineColor');
      return storedLineColor ? storedLineColor : '#FFA500';
    });
     const [deviationVal, setDeviationVal] =  useState(() => {
        const storedDeviationVal = localStorage.getItem(indiName+'Deviation');
        return storedDeviationVal ? JSON.parse(storedDeviationVal) : (indiName === 'zigzag' ? 5 : 2);
      });
     const [depthVal, setDepthVal] =  useState(() => {
        const storedDepthVal = localStorage.getItem(indiName+'Depth');
        return storedDepthVal ? JSON.parse(storedDepthVal) : 12;
      });
     const [backStepVal, setBackStepVal] =  useState(() => {
        const storedBackStepVal = localStorage.getItem(indiName+'BackStep');
        return storedBackStepVal ? JSON.parse(storedBackStepVal) : 3;
      });
    const [volumeColor1, setVolumeColor1] = useState(() => {
      const storedVolumeColor1 = localStorage.getItem(indiName+'Color1');
      return storedVolumeColor1 ? storedVolumeColor1 : '#26a69a';
    });
    const [volumeColor2, setVolumeColor2] = useState(() => {
      const storedVolumeColor2 = localStorage.getItem(indiName+'Color2');
      return storedVolumeColor2 ? storedVolumeColor2 : '#ef5350';
    });
    const [jawColor, setJawColor] = useState(() => {
      const storedJawColor = localStorage.getItem(indiName+'JawColor');
      return storedJawColor ? storedJawColor : '#0000FF';
    });
    const [teethColor, setTeethColor] = useState(() => {
      const storedTeethColor = localStorage.getItem(indiName+'TeethColor');
      return storedTeethColor ? storedTeethColor : '#FF0000';
    });
    const [lipsColor, setLipsColor] = useState(() => {
      const storedLipsColor = localStorage.getItem(indiName+'LipsColor');
      return storedLipsColor ? storedLipsColor : '#00FF00';
    });
    
    // Alligator individual period and shift values
    const [jawPeriod, setJawPeriod] = useState(() => {
      const storedJawPeriod = localStorage.getItem(indiName+'JawPeriod');
      return storedJawPeriod ? JSON.parse(storedJawPeriod) : 13;
    });
    const [jawShift, setJawShift] = useState(() => {
      const storedJawShift = localStorage.getItem(indiName+'JawShift');
      return storedJawShift ? JSON.parse(storedJawShift) : 8;
    });
    const [teethPeriod, setTeethPeriod] = useState(() => {
      const storedTeethPeriod = localStorage.getItem(indiName+'TeethPeriod');
      return storedTeethPeriod ? JSON.parse(storedTeethPeriod) : 8;
    });
    const [teethShift, setTeethShift] = useState(() => {
      const storedTeethShift = localStorage.getItem(indiName+'TeethShift');
      return storedTeethShift ? JSON.parse(storedTeethShift) : 5;
    });
    const [lipsPeriod, setLipsPeriod] = useState(() => {
      const storedLipsPeriod = localStorage.getItem(indiName+'LipsPeriod');
      return storedLipsPeriod ? JSON.parse(storedLipsPeriod) : 5;
    });
    const [lipsShift, setLipsShift] = useState(() => {
      const storedLipsShift = localStorage.getItem(indiName+'LipsShift');
      return storedLipsShift ? JSON.parse(storedLipsShift) : 3;
    });
    
    // Parabolic SAR state variables
    const [stepVal, setStepVal] = useState(() => {
      const storedStepVal = localStorage.getItem(indiName+'Step');
      return storedStepVal ? JSON.parse(storedStepVal) : 0.02;
    });
    
    // MACD state variables
    const [macdFastPeriod, setMacdFastPeriod] = useState(() => {
      const storedMacdFastPeriod = localStorage.getItem(indiName+'FastPeriod');
      return storedMacdFastPeriod ? JSON.parse(storedMacdFastPeriod) : 12;
    });
    const [macdSlowPeriod, setMacdSlowPeriod] = useState(() => {
      const storedMacdSlowPeriod = localStorage.getItem(indiName+'SlowPeriod');
      return storedMacdSlowPeriod ? JSON.parse(storedMacdSlowPeriod) : 26;
    });
    const [macdSignalPeriod, setMacdSignalPeriod] = useState(() => {
      const storedMacdSignalPeriod = localStorage.getItem(indiName+'SignalPeriod');
      return storedMacdSignalPeriod ? JSON.parse(storedMacdSignalPeriod) : 9;
    });
    const [macdLineColor, setMacdLineColor] = useState(() => {
      const storedMacdLineColor = localStorage.getItem(indiName+'LineColor');
      return storedMacdLineColor ? storedMacdLineColor : '#2196F3';
    });
    const [macdSignalColor, setMacdSignalColor] = useState(() => {
      const storedMacdSignalColor = localStorage.getItem(indiName+'SignalColor');
      return storedMacdSignalColor ? storedMacdSignalColor : '#FF9800';
    });
    const [macdHistogramColor, setMacdHistogramColor] = useState(() => {
      const storedMacdHistogramColor = localStorage.getItem(indiName+'HistogramColor');
      return storedMacdHistogramColor ? storedMacdHistogramColor : '#9C27B0';
    });
    const [showMacdLine, setShowMacdLine] = useState(() => {
      const storedShowMacdLine = localStorage.getItem(indiName+'ShowMacdLine');
      return storedShowMacdLine ? JSON.parse(storedShowMacdLine) : true;
    });
    const [showSignalLine, setShowSignalLine] = useState(() => {
      const storedShowSignalLine = localStorage.getItem(indiName+'ShowSignalLine');
      return storedShowSignalLine ? JSON.parse(storedShowSignalLine) : true;
    });
    const [showHistogramLine, setShowHistogramLine] = useState(() => {
      const storedShowHistogramLine = localStorage.getItem(indiName+'ShowHistogramLine');
      return storedShowHistogramLine ? JSON.parse(storedShowHistogramLine) : true;
    });

    // Donchian Channel state variables
    const [donchianPeriod, setDonchianPeriod] = useState(() => {
      const storedDonchianPeriod = localStorage.getItem(indiName+'Period');
      return storedDonchianPeriod ? JSON.parse(storedDonchianPeriod) : 20;
    });
    const [donchianUpperColor, setDonchianUpperColor] = useState(() => {
      const storedDonchianUpperColor = localStorage.getItem(indiName+'UpperColor');
      return storedDonchianUpperColor ? storedDonchianUpperColor : '#FF0000';
    });
    const [donchianMiddleColor, setDonchianMiddleColor] = useState(() => {
      const storedDonchianMiddleColor = localStorage.getItem(indiName+'MiddleColor');
      return storedDonchianMiddleColor ? storedDonchianMiddleColor : '#0000FF';
    });
    const [donchianLowerColor, setDonchianLowerColor] = useState(() => {
      const storedDonchianLowerColor = localStorage.getItem(indiName+'LowerColor');
      return storedDonchianLowerColor ? storedDonchianLowerColor : '#00FF00';
    });
    const [donchianFillColor, setDonchianFillColor] = useState(() => {
      const storedDonchianFillColor = localStorage.getItem(indiName+'FillColor');
      return storedDonchianFillColor ? storedDonchianFillColor : '#FF6B6B';
    });
    const [donchianFillOpacity, setDonchianFillOpacity] = useState(() => {
      const storedDonchianFillOpacity = localStorage.getItem(indiName+'FillOpacity');
      return storedDonchianFillOpacity ? JSON.parse(storedDonchianFillOpacity) : 0.1;
    });

    // Ichimoku Cloud state variables
    const [ichimokuTenkanPeriod, setIchimokuTenkanPeriod] = useState(() => {
      const storedIchimokuTenkanPeriod = localStorage.getItem(indiName+'TenkanPeriod');
      return storedIchimokuTenkanPeriod ? JSON.parse(storedIchimokuTenkanPeriod) : 9;
    });
    const [ichimokuKijunPeriod, setIchimokuKijunPeriod] = useState(() => {
      const storedIchimokuKijunPeriod = localStorage.getItem(indiName+'KijunPeriod');
      return storedIchimokuKijunPeriod ? JSON.parse(storedIchimokuKijunPeriod) : 26;
    });
    const [ichimokuSenkouBPeriod, setIchimokuSenkouBPeriod] = useState(() => {
      const storedIchimokuSenkouBPeriod = localStorage.getItem(indiName+'SenkouBPeriod');
      return storedIchimokuSenkouBPeriod ? JSON.parse(storedIchimokuSenkouBPeriod) : 52;
    });
    const [ichimokuTenkanColor, setIchimokuTenkanColor] = useState(() => {
      const storedIchimokuTenkanColor = localStorage.getItem(indiName+'TenkanColor');
      return storedIchimokuTenkanColor ? storedIchimokuTenkanColor : '#FF0000';
    });
    const [ichimokuKijunColor, setIchimokuKijunColor] = useState(() => {
      const storedIchimokuKijunColor = localStorage.getItem(indiName+'KijunColor');
      return storedIchimokuKijunColor ? storedIchimokuKijunColor : '#0000FF';
    });
    const [ichimokuChikouColor, setIchimokuChikouColor] = useState(() => {
      const storedIchimokuChikouColor = localStorage.getItem(indiName+'ChikouColor');
      return storedIchimokuChikouColor ? storedIchimokuChikouColor : '#00FF00';
    });
    const [ichimokuSenkouAColor, setIchimokuSenkouAColor] = useState(() => {
      const storedIchimokuSenkouAColor = localStorage.getItem(indiName+'SenkouAColor');
      return storedIchimokuSenkouAColor ? storedIchimokuSenkouAColor : '#FFA500';
    });
    const [ichimokuSenkouBColor, setIchimokuSenkouBColor] = useState(() => {
      const storedIchimokuSenkouBColor = localStorage.getItem(indiName+'SenkouBColor');
      return storedIchimokuSenkouBColor ? storedIchimokuSenkouBColor : '#800080';
    });
    const [ichimokuFillColor, setIchimokuFillColor] = useState(() => {
      const storedIchimokuFillColor = localStorage.getItem(indiName+'FillColor');
      return storedIchimokuFillColor ? storedIchimokuFillColor : '#E0E0E0';
    });
    const [ichimokuShowFill, setIchimokuShowFill] = useState(() => {
      const storedIchimokuShowFill = localStorage.getItem(indiName+'ShowFill');
      return storedIchimokuShowFill ? JSON.parse(storedIchimokuShowFill) : true;
    });

    useEffect(() => {
      localStorage.setItem(indiName+'Period', JSON.stringify(periodVal));
      localStorage.setItem(indiName+'LineColor', lineColor);
      if (indiName === 'bb' || indiName === 'zigzag') {
        localStorage.setItem(indiName+'Deviation', JSON.stringify(deviationVal));
      }
      if (indiName === 'zigzag') {
        localStorage.setItem(indiName+'Depth', JSON.stringify(depthVal));
        localStorage.setItem(indiName+'BackStep', JSON.stringify(backStepVal));
      }
      if (indiName === 'volume') {
        localStorage.setItem(indiName+'Color1', volumeColor1);
        localStorage.setItem(indiName+'Color2', volumeColor2);
      }
      if (indiName === 'alligator') {
        localStorage.setItem(indiName+'JawColor', jawColor);
        localStorage.setItem(indiName+'TeethColor', teethColor);
        localStorage.setItem(indiName+'LipsColor', lipsColor);
        localStorage.setItem(indiName+'JawPeriod', JSON.stringify(jawPeriod));
        localStorage.setItem(indiName+'JawShift', JSON.stringify(jawShift));
        localStorage.setItem(indiName+'TeethPeriod', JSON.stringify(teethPeriod));
        localStorage.setItem(indiName+'TeethShift', JSON.stringify(teethShift));
        localStorage.setItem(indiName+'LipsPeriod', JSON.stringify(lipsPeriod));
        localStorage.setItem(indiName+'LipsShift', JSON.stringify(lipsShift));
      }
      if (indiName === 'parabolic') {
        localStorage.setItem(indiName+'Step', JSON.stringify(stepVal));
      }
      if (indiName === 'macd') {
        localStorage.setItem(indiName+'FastPeriod', JSON.stringify(macdFastPeriod));
        localStorage.setItem(indiName+'SlowPeriod', JSON.stringify(macdSlowPeriod));
        localStorage.setItem(indiName+'SignalPeriod', JSON.stringify(macdSignalPeriod));
        localStorage.setItem(indiName+'LineColor', macdLineColor);
        localStorage.setItem(indiName+'SignalColor', macdSignalColor);
        localStorage.setItem(indiName+'HistogramColor', macdHistogramColor);
        localStorage.setItem(indiName+'ShowMacdLine', JSON.stringify(showMacdLine));
        localStorage.setItem(indiName+'ShowSignalLine', JSON.stringify(showSignalLine));
        localStorage.setItem(indiName+'ShowHistogramLine', JSON.stringify(showHistogramLine));
      }
      if (indiName === 'donchianchannel') {
        localStorage.setItem(indiName+'Period', JSON.stringify(donchianPeriod));
        localStorage.setItem(indiName+'UpperColor', donchianUpperColor);
        localStorage.setItem(indiName+'MiddleColor', donchianMiddleColor);
        localStorage.setItem(indiName+'LowerColor', donchianLowerColor);
        localStorage.setItem(indiName+'FillColor', donchianFillColor);
        localStorage.setItem(indiName+'FillOpacity', JSON.stringify(donchianFillOpacity));
      }
      if (indiName === 'ichimokucloud') {
        localStorage.setItem(indiName+'TenkanPeriod', JSON.stringify(ichimokuTenkanPeriod));
        localStorage.setItem(indiName+'KijunPeriod', JSON.stringify(ichimokuKijunPeriod));
        localStorage.setItem(indiName+'SenkouBPeriod', JSON.stringify(ichimokuSenkouBPeriod));
        localStorage.setItem(indiName+'TenkanColor', ichimokuTenkanColor);
        localStorage.setItem(indiName+'KijunColor', ichimokuKijunColor);
        localStorage.setItem(indiName+'ChikouColor', ichimokuChikouColor);
        localStorage.setItem(indiName+'SenkouAColor', ichimokuSenkouAColor);
        localStorage.setItem(indiName+'SenkouBColor', ichimokuSenkouBColor);
        localStorage.setItem(indiName+'FillColor', ichimokuFillColor);
        localStorage.setItem(indiName+'ShowFill', JSON.stringify(ichimokuShowFill));
      }
    }, [periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1, volumeColor2, jawColor, teethColor, lipsColor, jawPeriod, jawShift, teethPeriod, teethShift, lipsPeriod, lipsShift, stepVal, macdFastPeriod, macdSlowPeriod, macdSignalPeriod, macdLineColor, macdSignalColor, macdHistogramColor, showMacdLine, showSignalLine, showHistogramLine, donchianPeriod, donchianUpperColor, donchianMiddleColor, donchianLowerColor, donchianFillColor, donchianFillOpacity, ichimokuTenkanPeriod, ichimokuKijunPeriod, ichimokuSenkouBPeriod, ichimokuTenkanColor, ichimokuKijunColor, ichimokuChikouColor, ichimokuSenkouAColor, ichimokuSenkouBColor, ichimokuFillColor, ichimokuShowFill, indiName]);

  const handlePeriodVal = (event) => {
    setPeriodVal(Number(event.target.value));
    onInputChange({ periodVal: event.target.value, lineColor, deviationVal, depthVal, backStepVal, indicatorName });
  };
  const handleLineColor = (event) => {
    setLineColor(event.target.value);
    onInputChange({ indicatorName, periodVal, lineColor: event.target.value, deviationVal, depthVal, backStepVal });
  };
  const handleDeviation = (event) => {
     setDeviationVal(Number(event.target.value));
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal: event.target.value, depthVal, backStepVal });
  };
  const handleDepth = (event) => {
     setDepthVal(Number(event.target.value));
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal: event.target.value, backStepVal });
  };
  const handleBackStep = (event) => {
     setBackStepVal(Number(event.target.value));
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal: event.target.value });
  };
  const handleVolumeColor1 = (event) => {
    setVolumeColor1(event.target.value);
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1: event.target.value, volumeColor2 });
  };
  const handleVolumeColor2 = (event) => {
    setVolumeColor2(event.target.value);
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1, volumeColor2: event.target.value });
  };
  const handleJawColor = (event) => {
    setJawColor(event.target.value);
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1, volumeColor2, jawColor: event.target.value, teethColor, lipsColor, jawPeriod, jawShift, teethPeriod, teethShift, lipsPeriod, lipsShift });
  };
  const handleTeethColor = (event) => {
    setTeethColor(event.target.value);
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1, volumeColor2, jawColor, teethColor: event.target.value, lipsColor, jawPeriod, jawShift, teethPeriod, teethShift, lipsPeriod, lipsShift });
  };
  const handleLipsColor = (event) => {
    setLipsColor(event.target.value);
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1, volumeColor2, jawColor, teethColor, lipsColor: event.target.value, jawPeriod, jawShift, teethPeriod, teethShift, lipsPeriod, lipsShift });
  };
  
  // Alligator period and shift handlers
  const handleJawPeriod = (event) => {
    setJawPeriod(Number(event.target.value));
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1, volumeColor2, jawColor, teethColor, lipsColor, jawPeriod: event.target.value, jawShift, teethPeriod, teethShift, lipsPeriod, lipsShift });
  };
  const handleJawShift = (event) => {
    setJawShift(Number(event.target.value));
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1, volumeColor2, jawColor, teethColor, lipsColor, jawPeriod, jawShift: event.target.value, teethPeriod, teethShift, lipsPeriod, lipsShift });
  };
  const handleTeethPeriod = (event) => {
    setTeethPeriod(Number(event.target.value));
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1, volumeColor2, jawColor, teethColor, lipsColor, jawPeriod, jawShift, teethPeriod: event.target.value, teethShift, lipsPeriod, lipsShift });
  };
  const handleTeethShift = (event) => {
    setTeethShift(Number(event.target.value));
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1, volumeColor2, jawColor, teethColor, lipsColor, jawPeriod, jawShift, teethPeriod, teethShift: event.target.value, lipsPeriod, lipsShift });
  };
  const handleLipsPeriod = (event) => {
    setLipsPeriod(Number(event.target.value));
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1, volumeColor2, jawColor, teethColor, lipsColor, jawPeriod, jawShift, teethPeriod, teethShift, lipsPeriod: event.target.value, lipsShift });
  };
  const handleLipsShift = (event) => {
    setLipsShift(Number(event.target.value));
    onInputChange({ indicatorName, periodVal, lineColor, deviationVal, depthVal, backStepVal, volumeColor1, volumeColor2, jawColor, teethColor, lipsColor, jawPeriod, jawShift, teethPeriod, teethShift, lipsPeriod, lipsShift: event.target.value });
  };
  
  // Parabolic SAR handlers
  const handleStepVal = (event) => {
    setStepVal(Number(event.target.value));
    onInputChange({ indicatorName, stepVal: event.target.value, lineColor });
  };
  
  // MACD handlers
  const handleMacdFastPeriod = (event) => {
    setMacdFastPeriod(Number(event.target.value));
    onInputChange({ indicatorName, macdFastPeriod: event.target.value, macdSlowPeriod, macdSignalPeriod, macdLineColor, macdSignalColor, macdHistogramColor });
  };
  const handleMacdSlowPeriod = (event) => {
    setMacdSlowPeriod(Number(event.target.value));
    onInputChange({ indicatorName, macdFastPeriod, macdSlowPeriod: event.target.value, macdSignalPeriod, macdLineColor, macdSignalColor, macdHistogramColor });
  };
  const handleMacdSignalPeriod = (event) => {
    setMacdSignalPeriod(Number(event.target.value));
    onInputChange({ indicatorName, macdFastPeriod, macdSlowPeriod, macdSignalPeriod: event.target.value, macdLineColor, macdSignalColor, macdHistogramColor });
  };
  const handleMacdLineColor = (event) => {
    setMacdLineColor(event.target.value);
    onInputChange({ indicatorName, macdFastPeriod, macdSlowPeriod, macdSignalPeriod, macdLineColor: event.target.value, macdSignalColor, macdHistogramColor });
  };
  const handleMacdSignalColor = (event) => {
    setMacdSignalColor(event.target.value);
    onInputChange({ indicatorName, macdFastPeriod, macdSlowPeriod, macdSignalPeriod, macdLineColor, macdSignalColor: event.target.value, macdHistogramColor });
  };
  const handleMacdHistogramColor = (event) => {
    setMacdHistogramColor(event.target.value);
    onInputChange({ indicatorName, macdFastPeriod, macdSlowPeriod, macdSignalPeriod, macdLineColor, macdSignalColor, macdHistogramColor: event.target.value });
  };
  const handleShowMacdLine = (event) => {
    setShowMacdLine(event.target.checked);
    onInputChange({ indicatorName, macdFastPeriod, macdSlowPeriod, macdSignalPeriod, macdLineColor, macdSignalColor, macdHistogramColor, showMacdLine: event.target.checked, showSignalLine, showHistogramLine });
  };
  const handleShowSignalLine = (event) => {
    setShowSignalLine(event.target.checked);
    onInputChange({ indicatorName, macdFastPeriod, macdSlowPeriod, macdSignalPeriod, macdLineColor, macdSignalColor, macdHistogramColor, showMacdLine, showSignalLine: event.target.checked, showHistogramLine });
  };
  const handleShowHistogramLine = (event) => {
    setShowHistogramLine(event.target.checked);
    onInputChange({ indicatorName, macdFastPeriod, macdSlowPeriod, macdSignalPeriod, macdLineColor, macdSignalColor, macdHistogramColor, showMacdLine, showSignalLine, showHistogramLine: event.target.checked });
  };

  // Donchian Channel handlers
  const handleDonchianPeriod = (event) => {
    setDonchianPeriod(Number(event.target.value));
    onInputChange({ indicatorName, donchianPeriod: event.target.value, donchianUpperColor, donchianMiddleColor, donchianLowerColor, donchianFillColor });
  };
  const handleDonchianUpperColor = (event) => {
    setDonchianUpperColor(event.target.value);
    onInputChange({ indicatorName, donchianPeriod, donchianUpperColor: event.target.value, donchianMiddleColor, donchianLowerColor, donchianFillColor });
  };
  const handleDonchianMiddleColor = (event) => {
    setDonchianMiddleColor(event.target.value);
    onInputChange({ indicatorName, donchianPeriod, donchianUpperColor, donchianMiddleColor: event.target.value, donchianLowerColor, donchianFillColor });
  };
  const handleDonchianLowerColor = (event) => {
    setDonchianLowerColor(event.target.value);
    onInputChange({ indicatorName, donchianPeriod, donchianUpperColor, donchianMiddleColor, donchianLowerColor: event.target.value, donchianFillColor });
  };
  const handleDonchianFillColor = (event) => {
    setDonchianFillColor(event.target.value);
    // Convert hex to rgba with current opacity
    const hex = event.target.value;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${donchianFillOpacity})`;
    onInputChange({ indicatorName, donchianPeriod, donchianUpperColor, donchianMiddleColor, donchianLowerColor, donchianFillColor: rgbaColor });
  };
  const handleDonchianFillOpacity = (event) => {
    const opacity = parseFloat(event.target.value);
    setDonchianFillOpacity(opacity);
    // Convert current hex color to rgba with new opacity
    const hex = donchianFillColor;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const rgbaColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
    onInputChange({ indicatorName, donchianPeriod, donchianUpperColor, donchianMiddleColor, donchianLowerColor, donchianFillColor: rgbaColor });
  };

  // Ichimoku Cloud handlers
  const handleIchimokuTenkanPeriod = (event) => {
    setIchimokuTenkanPeriod(Number(event.target.value));
    onInputChange({ indicatorName, ichimokuTenkanPeriod: event.target.value, ichimokuKijunPeriod, ichimokuSenkouBPeriod, ichimokuTenkanColor, ichimokuKijunColor, ichimokuChikouColor, ichimokuSenkouAColor, ichimokuSenkouBColor, ichimokuFillColor, ichimokuShowFill });
  };
  const handleIchimokuKijunPeriod = (event) => {
    setIchimokuKijunPeriod(Number(event.target.value));
    onInputChange({ indicatorName, ichimokuTenkanPeriod, ichimokuKijunPeriod: event.target.value, ichimokuSenkouBPeriod, ichimokuTenkanColor, ichimokuKijunColor, ichimokuChikouColor, ichimokuSenkouAColor, ichimokuSenkouBColor, ichimokuFillColor, ichimokuShowFill });
  };
  const handleIchimokuSenkouBPeriod = (event) => {
    setIchimokuSenkouBPeriod(Number(event.target.value));
    onInputChange({ indicatorName, ichimokuTenkanPeriod, ichimokuKijunPeriod, ichimokuSenkouBPeriod: event.target.value, ichimokuTenkanColor, ichimokuKijunColor, ichimokuChikouColor, ichimokuSenkouAColor, ichimokuSenkouBColor, ichimokuFillColor, ichimokuShowFill });
  };
  const handleIchimokuTenkanColor = (event) => {
    setIchimokuTenkanColor(event.target.value);
    onInputChange({ indicatorName, ichimokuTenkanPeriod, ichimokuKijunPeriod, ichimokuSenkouBPeriod, ichimokuTenkanColor: event.target.value, ichimokuKijunColor, ichimokuChikouColor, ichimokuSenkouAColor, ichimokuSenkouBColor, ichimokuFillColor, ichimokuShowFill });
  };
  const handleIchimokuKijunColor = (event) => {
    setIchimokuKijunColor(event.target.value);
    onInputChange({ indicatorName, ichimokuTenkanPeriod, ichimokuKijunPeriod, ichimokuSenkouBPeriod, ichimokuTenkanColor, ichimokuKijunColor: event.target.value, ichimokuChikouColor, ichimokuSenkouAColor, ichimokuSenkouBColor, ichimokuFillColor, ichimokuShowFill });
  };
  const handleIchimokuChikouColor = (event) => {
    setIchimokuChikouColor(event.target.value);
    onInputChange({ indicatorName, ichimokuTenkanPeriod, ichimokuKijunPeriod, ichimokuSenkouBPeriod, ichimokuTenkanColor, ichimokuKijunColor, ichimokuChikouColor: event.target.value, ichimokuSenkouAColor, ichimokuSenkouBColor, ichimokuFillColor, ichimokuShowFill });
  };
  const handleIchimokuSenkouAColor = (event) => {
    setIchimokuSenkouAColor(event.target.value);
    onInputChange({ indicatorName, ichimokuTenkanPeriod, ichimokuKijunPeriod, ichimokuSenkouBPeriod, ichimokuTenkanColor, ichimokuKijunColor, ichimokuChikouColor, ichimokuSenkouAColor: event.target.value, ichimokuSenkouBColor, ichimokuFillColor, ichimokuShowFill });
  };
  const handleIchimokuSenkouBColor = (event) => {
    setIchimokuSenkouBColor(event.target.value);
    onInputChange({ indicatorName, ichimokuTenkanPeriod, ichimokuKijunPeriod, ichimokuSenkouBPeriod, ichimokuTenkanColor, ichimokuKijunColor, ichimokuChikouColor, ichimokuSenkouAColor, ichimokuSenkouBColor: event.target.value, ichimokuFillColor, ichimokuShowFill });
  };
  const handleIchimokuFillColor = (event) => {
    setIchimokuFillColor(event.target.value);
    onInputChange({ indicatorName, ichimokuTenkanPeriod, ichimokuKijunPeriod, ichimokuSenkouBPeriod, ichimokuTenkanColor, ichimokuKijunColor, ichimokuChikouColor, ichimokuSenkouAColor, ichimokuSenkouBColor, ichimokuFillColor: event.target.value, ichimokuShowFill });
  };
  const handleIchimokuShowFill = (event) => {
    setIchimokuShowFill(event.target.checked);
    onInputChange({ indicatorName, ichimokuTenkanPeriod, ichimokuKijunPeriod, ichimokuSenkouBPeriod, ichimokuTenkanColor, ichimokuKijunColor, ichimokuChikouColor, ichimokuSenkouAColor, ichimokuSenkouBColor, ichimokuFillColor, ichimokuShowFill: event.target.checked });
  };

  
  return (
     <div>
      {(indiName === 'bb') ? <div className="d-flex align-items-center bd-highlight mb-3">
            <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Standard Deviation :</label>
            <Input
              type="number"
              value={deviationVal}
              onChange={handleDeviation}
              min={1}
              className="p-2 bd-highlight bg-dark text-white"
              style={{ width: "150px", border: "1px solid #ccc" }}
            />
          </div>
          : ''}
      {(indiName === 'zigzag') ? 
        <>
          <div className="d-flex align-items-center bd-highlight mb-3">
            <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Deviation (%) :</label>
            <Input
              type="number"
              value={deviationVal}
              onChange={handleDeviation}
              min={1}
              className="p-2 bd-highlight bg-dark text-white"
              style={{ width: "150px", border: "1px solid #ccc" }}
            />
          </div>
          <div className="d-flex align-items-center bd-highlight mb-3">
            <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Depth :</label>
            <Input
              type="number"
              value={depthVal}
              onChange={handleDepth}
              min={1}
              className="p-2 bd-highlight bg-dark text-white"
              style={{ width: "150px", border: "1px solid #ccc" }}
            />
          </div>
          <div className="d-flex align-items-center bd-highlight mb-3">
            <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Back Step :</label>
            <Input
              type="number"
              value={backStepVal}
              onChange={handleBackStep}
              min={1}
              className="p-2 bd-highlight bg-dark text-white"
              style={{ width: "150px", border: "1px solid #ccc" }}
            />
          </div>
        </>
        : ''}
          {(indiName !== 'zigzag' && indiName !== 'volume' && indiName !== 'alligator' && indiName !== 'parabolic' && indiName !== 'macd' && indiName !== 'ichimokucloud') ? 
            <div className="d-flex align-items-center bd-highlight mb-3">
              <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> {indicatorName} Period :</label>
              <Input
                type="number"
                value={periodVal}
                onChange={handlePeriodVal}
                min={1}
                className="p-2 bd-highlight bg-dark text-white"
                style={{ width: "150px", border: "1px solid #ccc" }}
              />
            </div>
            : ''}
          {indiName === 'volume' ? (
            <>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Color 1 (Up):</label>
                <Input
                  type="color"
                  value={volumeColor1}
                  onChange={handleVolumeColor1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Color 2 (Down):</label>
                <Input
                  type="color"
                  value={volumeColor2}
                  onChange={handleVolumeColor2}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
            </>
          ) : indiName === 'alligator' ? (
            <>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Jaw Period:</label>
                <Input
                  type="number"
                  value={jawPeriod}
                  onChange={handleJawPeriod}
                  min={1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Jaw Shift:</label>
                <Input
                  type="number"
                  value={jawShift}
                  onChange={handleJawShift}
                  min={0}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Jaw Color:</label>
                <Input
                  type="color"
                  value={jawColor}
                  onChange={handleJawColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Teeth Period:</label>
                <Input
                  type="number"
                  value={teethPeriod}
                  onChange={handleTeethPeriod}
                  min={1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Teeth Shift:</label>
                <Input
                  type="number"
                  value={teethShift}
                  onChange={handleTeethShift}
                  min={0}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Teeth Color:</label>
                <Input
                  type="color"
                  value={teethColor}
                  onChange={handleTeethColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Lips Period:</label>
                <Input
                  type="number"
                  value={lipsPeriod}
                  onChange={handleLipsPeriod}
                  min={1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Lips Shift:</label>
                <Input
                  type="number"
                  value={lipsShift}
                  onChange={handleLipsShift}
                  min={0}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Lips Color:</label>
                <Input
                  type="color"
                  value={lipsColor}
                  onChange={handleLipsColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
            </>
          ) : indiName === 'parabolic' ? (
            <>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Step:</label>
                <Input
                  type="number"
                  value={stepVal}
                  onChange={handleStepVal}
                  min={0.01}
                  max={1}
                  step={0.01}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>

              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Line Color:</label>
                <Input
                  type="color"
                  value={lineColor}
                  onChange={handleLineColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
            </>          ) : indiName === 'macd' ? (
            <>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Fast Period:</label>
                <Input
                  type="number"
                  value={macdFastPeriod}
                  onChange={handleMacdFastPeriod}
                  min={1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Slow Period:</label>
                <Input
                  type="number"
                  value={macdSlowPeriod}
                  onChange={handleMacdSlowPeriod}
                  min={1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Signal Period:</label>
                <Input
                  type="number"
                  value={macdSignalPeriod}
                  onChange={handleMacdSignalPeriod}
                  min={1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> MACD Line Color:</label>
                <Input
                  type="color"
                  value={macdLineColor}
                  onChange={handleMacdLineColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Signal Line Color:</label>
                <Input
                  type="color"
                  value={macdSignalColor}
                  onChange={handleMacdSignalColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Histogram Color:</label>
                <Input
                  type="color"
                  value={macdHistogramColor}
                  onChange={handleMacdHistogramColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Show MACD Line:</label>
                <Input
                  type="checkbox"
                  checked={showMacdLine}
                  onChange={handleShowMacdLine}
                  className="p-2 bd-highlight"
                  style={{width: "20px", height: "20px" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Show Signal Line:</label>
                <Input
                  type="checkbox"
                  checked={showSignalLine}
                  onChange={handleShowSignalLine}
                  className="p-2 bd-highlight"
                  style={{width: "20px", height: "20px" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Show Histogram:</label>
                <Input
                  type="checkbox"
                  checked={showHistogramLine}
                  onChange={handleShowHistogramLine}
                  className="p-2 bd-highlight"
                  style={{width: "20px", height: "20px" }}
                />
              </div>
            </>
          ) : indiName === 'donchianchannel' ? (
            <>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Period:</label>
                <Input
                  type="number"
                  value={donchianPeriod}
                  onChange={handleDonchianPeriod}
                  min={1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Top Line Color:</label>
                <Input
                  type="color"
                  value={donchianUpperColor}
                  onChange={handleDonchianUpperColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Base Line Color:</label>
                <Input
                  type="color"
                  value={donchianMiddleColor}
                  onChange={handleDonchianMiddleColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Bottom Line Color:</label>
                <Input
                  type="color"
                  value={donchianLowerColor}
                  onChange={handleDonchianLowerColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Fill Area Color:</label>
                <Input
                  type="color"
                  value={donchianFillColor}
                  onChange={handleDonchianFillColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Fill Opacity:</label>
                <Input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={donchianFillOpacity}
                  onChange={handleDonchianFillOpacity}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
                <span className="p-2 bd-highlight" style={{ color: '#fff', minWidth: '40px' }}>{donchianFillOpacity}</span>
              </div>
            </>
          ) : indiName === 'ichimokucloud' ? (
            <>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Tenkan Sen Period:</label>
                <Input
                  type="number"
                  value={ichimokuTenkanPeriod}
                  onChange={handleIchimokuTenkanPeriod}
                  min={1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "80px", border: "1px solid #ccc" }}
                />
                <label className="ms-3 me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Color:</label>
                <Input
                  type="color"
                  value={ichimokuTenkanColor}
                  onChange={handleIchimokuTenkanColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "70px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Kijun Sen Period:</label>
                <Input
                  type="number"
                  value={ichimokuKijunPeriod}
                  onChange={handleIchimokuKijunPeriod}
                  min={1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "80px", border: "1px solid #ccc" }}
                />
                <label className="ms-3 me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Color:</label>
                <Input
                  type="color"
                  value={ichimokuKijunColor}
                  onChange={handleIchimokuKijunColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "70px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Chikou Span Color:</label>
                <Input
                  type="color"
                  value={ichimokuChikouColor}
                  onChange={handleIchimokuChikouColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Senkou Span A Color:</label>
                <Input
                  type="color"
                  value={ichimokuSenkouAColor}
                  onChange={handleIchimokuSenkouAColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Senkou Span B Period:</label>
                <Input
                  type="number"
                  value={ichimokuSenkouBPeriod}
                  onChange={handleIchimokuSenkouBPeriod}
                  min={1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "80px", border: "1px solid #ccc" }}
                />
                <label className="ms-3 me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Color:</label>
                <Input
                  type="color"
                  value={ichimokuSenkouBColor}
                  onChange={handleIchimokuSenkouBColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "70px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Fill Area Color:</label>
                <Input
                  type="color"
                  value={ichimokuFillColor}
                  onChange={handleIchimokuFillColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> Show Fill Area:</label>
                <Input
                  type="checkbox"
                  checked={ichimokuShowFill}
                  onChange={handleIchimokuShowFill}
                  className="p-2 bd-highlight"
                  style={{width: "20px", height: "20px" }}
                />
              </div>
            </>
          ) : (
            <div className="d-flex align-items-center bd-highlight mb-3">
              <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> {indicatorName} Line Color:</label>
              <Input
                type="color"
                value={lineColor}
                onChange={handleLineColor}
                className="p-2 bd-highlight bg-dark text-white"
                style={{width: "150px", border: "1px solid #ccc" }}
              />
            </div>
          )}
      </div>
  );
};

export default IndicatorsSettings;
