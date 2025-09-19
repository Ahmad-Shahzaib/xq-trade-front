import React, { useEffect } from "react";
import { Container, Card, CardBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { fetchMarkets } from "../../../rtk/slices/MarketAndEventsSlice/GetMarketSlice";
import { Spinner, Alert } from "reactstrap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Market1 from "../../../assets/images/markete/Market 01.png";
import Market2 from "../../../assets/images/markete/Market 02.png";
import Market3 from "../../../assets/images/markete/Market 03.png";
import Market4 from "../../../assets/images/markete/Market 04.png";



import swiperSLide1 from "../../../assets/images/Purple Dark Blue Modern Professional Stocks Trader Linkedin Banner.png";
import swiperSLide2 from "../../../assets/images/Purple Creative Finance LinkedIn Banner.png";
import swiperSLide3 from "../../../assets/images/Yellow and Blue Bold Marketing Agency with Hexagon Frame LinkedIn Banner.png";

import { useTranslation } from 'react-i18next';
import TradingViewChart2 from "../MarketGraph/TradingViewChart";
const swiperData = [
  { image: swiperSLide1 },
  { image: swiperSLide2 },
  { image: swiperSLide3 },
];

const Market = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch();
  const { markets, marketImages, isLoading, isError } = useSelector((state) => state.markets);

  const stripHtmlTags = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };


  useEffect(() => {
    dispatch(fetchMarkets());
  }, [dispatch]);

  // console.log('marketImages:', marketImages); // Removed console.log

  // const { t } = useTranslation();
  return (
    <div className="page-content" style={{ display: 'flex' , paddingTop: window.innerWidth <= 768 ? '40px' : undefined  }}>
      {/* Left section: Only visible on mobile view */}
      <div
        style={{
          width: '20%',
          height: '89vh',
          minWidth: '0px',
          background: 'linear-gradient(rgb(31, 14, 39))',
          maxWidth: '450px',
          display: window.innerWidth <= 768 ? 'flex' : 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          // paddingRight: '24px',
          marginRight: '7px',
          borderRadius: '10px',
          marginLeft: window.innerWidth <= 768 ? '' : '',
          ...(window.innerWidth > 768 ? { display: 'flex' } : { width: '100%', maxWidth: '100%', marginTop:"10px" })
        }}
      >
       
        {/* Four market images in a column for web view */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px',  alignItems: 'center',padding: '10px',
          overflowY: window.innerWidth <= 768 ? 'scroll' : 'auto',
          height: window.innerWidth <= 768 ? 'calc(100% - 150px)' : 'auto',
         }}>
          <h5 style={{ fontSize: "20px", fontWeight: "bold", color: "white", margin: "10px" }}>
          {t('Market')}
        </h5>
          <img src={Market1} alt="Market 1" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
          <img src={Market2} alt="Market 2" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
          <img src={Market3} alt="Market 3" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
          <img src={Market4} alt="Market 4" style={{ width: '100%', height: 'auto', borderRadius: '10px' }} />
        </div>
        {/* Show Loader or Error Message */}  
        {isLoading && <p className="text-white">{t('Loading markets')}...</p>}
        {isError && <p className="text-danger">{t('Failed to load market data.')}</p>}
      </div>
      {/* Center section: hidden on mobile view */}
      {window.innerWidth > 768 && (
        <div style={{ width: '80%' }}>
          <TradingViewChart2 />
        </div>
      )}
      {/* ...existing code for other sections (center, right, etc.)... */}
    </div>
  );
};

export default Market;

