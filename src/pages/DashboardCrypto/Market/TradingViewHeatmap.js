// TradingViewHeatmap.jsx
import React, { useEffect, useRef, memo } from 'react';
import { useTranslation } from 'react-i18next';

function TradingViewHeatmap() {
  const container = useRef();
  const { t } = useTranslation();
  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "dataSource": "Crypto",
          "blockSize": "market_cap_calc",
          "blockColor": "change|60",
          "locale": "en",
          "symbolUrl": "",
          "colorTheme": "dark",
          "hasTopBar": true,
          "isDataSetEnabled": true,
          "isZoomEnabled": true,
          "hasSymbolTooltip": true,
          "isMonoSize": true,
          "width": "100%",
          "height": "500"
        }`;
      container.current.appendChild(script);
    },
    []
  );

  return (
    <div className="tradingview-widget-container" ref={container}>
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"><a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span className="blue-text">{t('Track all markets on TradingView')}</span></a></div>
    </div>
  );
}

export default memo(TradingViewHeatmap);
