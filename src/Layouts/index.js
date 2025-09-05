import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import withRouter from "../Components/Common/withRouter";

//import Components
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import RightSidebar from "../Components/Common/RightSidebar";
import { logoLight } from "../utils/config";
import trading from "../assets/images/chartbg.png"


//import actions
import {
  changeLayout,
  changeSidebarTheme,
  changeLayoutMode,
  changeLayoutWidth,
  changeLayoutPosition,
  changeTopbarTheme,
  changeLeftsidebarSizeType,
  changeLeftsidebarViewType,
  changeSidebarImageType,
  changeSidebarVisibility,
} from "../rtk/slices/thunks";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import Pricing from "../pages/DashboardCrypto/Pricing/Pricing";
import { Col, Row } from "reactstrap";
import useWindowSize from "../Components/Hooks/useWindowSize";
import TradingModal from "../pages/DashboardCrypto/TradingModal";

import TabButtonsComponent from "./BottomNavTabs/TabButtonsComponent";
import SideCalculator from "./SideCalculator";
import { TabProvider, useTab } from "./BottomNavTabs/TabContext";

const LayoutContent = (props) => {
  const [headerClass, setHeaderClass] = useState("");

  const dispatch = useDispatch();

  const { width } = useWindowSize();
  const windowSize = document.documentElement.clientWidth;
  const isMobile = windowSize <= 767;
  const selectLayoutState = (state) => state.Layout;
  const selectLayoutProperties = createSelector(
    selectLayoutState,
    (layout) => ({
      layoutType: layout.layoutType,
      leftSidebarType: layout.leftSidebarType,
      layoutModeType: layout.layoutModeType,
      layoutWidthType: layout.layoutWidthType,
      layoutPositionType: layout.layoutPositionType,
      topbarThemeType: layout.topbarThemeType,
      leftsidbarSizeType: layout.leftsidbarSizeType,
      leftSidebarViewType: layout.leftSidebarViewType,
      leftSidebarImageType: layout.leftSidebarImageType,
      preloader: layout.preloader,
      sidebarVisibilitytype: layout.sidebarVisibilitytype,
    })
  );
  // Inside your component
  const {
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    preloader,
    sidebarVisibilitytype,
  } = useSelector(selectLayoutProperties);

  /*
    layout settings
    */
  useEffect(() => {
    if (
      layoutType ||
      leftSidebarType ||
      layoutModeType ||
      layoutWidthType ||
      layoutPositionType ||
      topbarThemeType ||
      leftsidbarSizeType ||
      leftSidebarViewType ||
      leftSidebarImageType ||
      sidebarVisibilitytype
    ) {
      window.dispatchEvent(new Event("resize"));
      dispatch(changeLeftsidebarViewType(leftSidebarViewType));
      dispatch(changeLeftsidebarSizeType(leftsidbarSizeType));
      dispatch(changeSidebarTheme(leftSidebarType));
      dispatch(changeLayoutMode(layoutModeType));
      dispatch(changeLayoutWidth(layoutWidthType));
      dispatch(changeLayoutPosition(layoutPositionType));
      dispatch(changeTopbarTheme(topbarThemeType));
      dispatch(changeLayout(layoutType));
      dispatch(changeSidebarImageType(leftSidebarImageType));
      dispatch(changeSidebarVisibility(sidebarVisibilitytype));
    }
  }, [
    layoutType,
    leftSidebarType,
    layoutModeType,
    layoutWidthType,
    layoutPositionType,
    topbarThemeType,
    leftsidbarSizeType,
    leftSidebarViewType,
    leftSidebarImageType,
    sidebarVisibilitytype,
    dispatch,
  ]);
  /*
    call dark/light mode
    */
  const onChangeLayoutMode = (value) => {
    if (changeLayoutMode) {
      dispatch(changeLayoutMode(value));
    }
  };

  // class add remove in header
  useEffect(() => {
    window.addEventListener("scroll", scrollNavigation, true);
  });

  function scrollNavigation() {
    var scrollup = document.documentElement.scrollTop;
    if (scrollup > 50) {
      setHeaderClass("topbar-shadow");
    } else {
      setHeaderClass("");
    }
  }

  useEffect(() => {
    if (
      sidebarVisibilitytype === "show" ||
      layoutType === "vertical" ||
      layoutType === "twocolumn"
    ) {
      document.querySelector(".hamburger-icon").classList.remove("open");
    } else {
      document.querySelector(".hamburger-icon") &&
        document.querySelector(".hamburger-icon").classList.add("open");
    }
  }, [sidebarVisibilitytype, layoutType]);

  return (
    <React.Fragment>
      <div id="layout-wrapper">
        {isMobile ? (
          // MOBILE VIEW
          <MobileLayout {...props} />
        ) : (
          // DESKTOP/WEB VIEW
          <DesktopLayout {...props} />
        )}
      </div>
      <RightSidebar />
    </React.Fragment>
  );
};


// Mobile layout with SideCalculator only for tab 1
const MobileLayout = (props) => {
  const { activeTab } = useTab();
  const { headerClass, layoutModeType, onChangeLayoutMode } = props;
  return (
    <>
      <Header
        headerClass={headerClass}
        layoutModeType={layoutModeType}
        onChangeLayoutMode={onChangeLayoutMode}
      />
      <div className="main-content" style={{
        minHeight: 'calc(100vh - 140px)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column', position: 'relative'
      }}>
        <div style={{
          height:
            'calc(100vh - 70px)',
          background: 'linear-gradient(rgb(31, 14, 39))',

          overflowY: 'hidden', padding: '20px 0px', display: 'flex', flexDirection: 'column'
        }}>
          {props.children}
        </div>
      </div>
      <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 100, background: 'linear-gradient(180deg, #1F0E27 90%, #000 100%)', borderTopLeftRadius: 12, borderTopRightRadius: 12, boxShadow: '0 -2px 8px rgba(0,0,0,0.08)' }}>
        <TabButtonsComponent />
      </div>
    </>
  );
};

// Desktop layout with SideCalculator only for tab 1
const DesktopLayout = (props) => {
  const { activeTab } = useTab();
  const { headerClass, layoutModeType, onChangeLayoutMode } = props;
  return (
    <>
      <Header
        headerClass={headerClass}
        layoutModeType={layoutModeType}
        onChangeLayoutMode={onChangeLayoutMode}
      />
      <div className="main-content" style={{
        height: 'calc(100vh - 80px)',
        overflow: 'hidden',
      }}>
        <div className="nav-btn-sidebar">
          <TabButtonsComponent />
          <div></div>
        </div>
        <Row className="main-cnt-row" >
          <Col id="main_cnt_desktop" md={12}>
            {props.children}
          </Col>
        </Row>
      </div>
    </>
  );
};

LayoutContent.propTypes = {
  children: PropTypes.object,
};

const Layout = (props) => (
  <TabProvider>
    <LayoutContent {...props} />
    <RightSidebar />
  </TabProvider>
);

export default withRouter(Layout);
