import React, { useState, useEffect } from "react";
import {  Input  } from "reactstrap";

const IndicatorsSettings = ({indicatorName, onInputChange}) => {

    const indiName = (typeof indicatorName === 'string') ? indicatorName.toLowerCase() : '' ;
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
        return storedDeviationVal ? JSON.parse(storedDeviationVal) : 2;
      });
    useEffect(() => {
      localStorage.setItem(indiName+'Period', JSON.stringify(periodVal));
      localStorage.setItem(indiName+'LineColor', lineColor);
    }, [periodVal, lineColor, deviationVal]);

  const handlePeriodVal = (event) => {
    setPeriodVal(Number(event.target.value));
    onInputChange({ periodVal: event.target.value, lineColor, indiName });
  };
  const handleLineColor = (event) => {
    setLineColor(event.target.value);
    onInputChange({ indiName, periodVal, lineColor: event.target.value });
  };
  const handleDeviation = (event) => {
     setDeviationVal(Number(event.target.value));
    onInputChange({ indiName, periodVal, lineColor, deviationVal: event.target.value });
  };

  const isMobile = window.innerWidth <= 768;
  
  return (
     <div>
      {(indiName === 'bb') ? <div className="d-flex align-items-center bd-highlight mb-1">
            <label className="me-auto p-1 bd-highlight" style={{ color: '#fff' }}> Standard Deviation :</label>
            <Input
              type="number"
              value={deviationVal}
              onChange={handleDeviation}
              min={1}
              className="p-2 bd-highlight bg-dark text-white"
              style={{ width: isMobile ? "130px" : "150px", border: "1px solid #ccc" }}
            />
          </div>
          : ''}
          {(typeof indicatorName === 'string') && (
            <>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> {indicatorName} Period :</label>
                <Input
                  type="number"
                  value={periodVal}
                  onChange={handlePeriodVal}
                  min={1}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{ width: isMobile ? "130px" : "150px", border: "1px solid #ccc" }}
                />
              </div>
              <div className="d-flex align-items-center bd-highlight mb-3">
                <label className="me-auto p-2 bd-highlight" style={{ color: '#fff' }}> {indicatorName} Line Color:</label>
                <Input
                  type="color"
                  value={lineColor}
                  onChange={handleLineColor}
                  className="p-2 bd-highlight bg-dark text-white"
                  style={{width: isMobile ? "130px" : "150px",
                    border: "1px solid #ccc" }}
                />
              </div>
            </>
          )}
      </div>
  );
};

export default IndicatorsSettings;
