import React, { useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';

const TradingViewTimeline = ({ market = "crypto", width = "100%", height = "550" }) => {
    const containerRef = useRef(null);
    const { t } = useTranslation();
    useEffect(() => {
        // Ensure the script is not added multiple times
        if (containerRef.current.querySelector("script")) return;

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
        
        script.innerHTML = JSON.stringify({
            feedMode: "market",
            market: market,
            isTransparent: false,
            displayMode: "adaptive",
            width: width,
            height: height,
            colorTheme: "dark",
            locale: "en"
        });

        containerRef.current.appendChild(script);
    }, [market, width, height]);

    

    return (
        <div className="tradingview-widget-container" ref={containerRef}>
            <div className="tradingview-widget-container__widget"></div>
            <div className="tradingview-widget-copyright">
                <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
                    <span className="blue-text">{t('Track all markets on TradingView')}</span>
                </a>
            </div>
        </div>
    );
};

export default TradingViewTimeline;
