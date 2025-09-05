import React from 'react'
import { Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";

// import required modules
import { Autoplay, Mousewheel } from "swiper/modules";
import ReactApexChart from 'react-apexcharts';
// Import crypto icons 
import btcCoin from '../../../assets/images/crypto-icons/btc.svg';
import ltcCoin from '../../../assets/images/crypto-icons/ltc.svg';
import ethCoin from '../../../assets/images/crypto-icons/eth.svg';
import etcCoin from '../../../assets/images/crypto-icons/etc.svg';
import bnbCoin from '../../../assets/images/crypto-icons/bnb.svg';
import dashCoin from '../../../assets/images/crypto-icons/dash.svg';
import usdtCoin from '../../../assets/images/crypto-icons/usdt.svg';

// avatars 
const user1 = require('../../../assets/images/users/avatar-1.jpg')
const user2 = require('../../../assets/images/users/avatar-2.jpg')
const user3 = require('../../../assets/images/users/avatar-3.jpg')
const user4 = require('../../../assets/images/users/avatar-4.jpg')
const user5 = require('../../../assets/images/users/avatar-5.jpg')
const user6 = require('../../../assets/images/users/avatar-6.jpg')
const user7 = require('../../../assets/images/users/avatar-7.jpg')


const cryptoSlider = [
    {
        id: 1,
        img: user1,
        coin: btcCoin,
        followers: 0,
        label: "Bitcoin",
        price: "$1,523,647",
        change: "+13.11%",
        changeClass: "success",
        coinName: "btc",
        chartsColor: "#f06548",
        series: [{
            name: "Bitcoin",
            data: [85, 68, 35, 90, 8, 11, 26, 54]
        }],
        progress: {
            day: {
                badge: "ri-arrow-down-s-fill",
                badgeColor: "danger",
                percentage: "0.71",
            },
            week: {
                badge: "ri-arrow-down-s-fill",
                badgeColor: "danger",
                percentage: "0.64",
            },
            month: {
                badge: "ri-arrow-down-s-fill",
                badgeColor: "danger",
                percentage: "6.24",
            },

        }
    },
    {
        id: 2,
        img: user2,
        coin: ltcCoin,
        followers: 80,
        label: "Litecoin",
        price: "$2,145,687",
        change: "+15.08%",
        changeClass: "success",
        coinName: "ltc",
        chartsColor: "#f06548",
        series: [{
            name: "Litecoin",
            data: [25, 50, 41, 87, 12, 36, 9, 54]
        }],
        progress: {
            day: {
                badge: "ri-arrow-down-s-fill",
                badgeColor: "danger",
                percentage: "2.24",
            },
            week: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "5.24",
            },
            month: {
                badge: "ri-arrow-down-s-fill",
                badgeColor: "danger",
                percentage: "95.24",
            },

        }
    },
    {
        id: 3,
        img: user3,
        coin: ethCoin,
        followers: 157,
        label: "Ethereum",
        price: "$3,312,870",
        change: "+08.57%",
        changeClass: "success",
        coinName: "etc",
        chartsColor: "#0ab39c",
        series: [{
            name: "Ethereum",
            data: [36, 21, 65, 22, 35, 50, 29, 44]
        }],
        progress: {
            day: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "78.21",
            },
            week: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "0.36",
            },
            month: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "0.98",
            },

        }
    },
    {
        id: 4,
        img: user4,
        coin: etcCoin,
        followers: 93,
        label: "Binance",
        price: "$1,820,045",
        change: "-09.21%",
        changeClass: "danger",
        coinName: "bnb",
        chartsColor: "#f06548",
        series: [{
            name: "Binance",
            data: [30, 58, 29, 89, 12, 36, 9, 54]
        }],
        progress: {
            day: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },
            week: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },
            month: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },

        }
    },
    {
        id: 5,
        img: user5,
        coin: bnbCoin,
        followers: 8,
        label: "Dash",
        price: "$9,458,153",
        change: "+12.07%",
        changeClass: "success",
        coinName: "dash",
        chartsColor: "#0ab39c",
        series: [{
            name: "Dash",
            data: [24, 68, 39, 86, 29, 42, 11, 58]
        }],
        progress: {
            day: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },
            week: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },
            month: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },

        }
    },
    {
        id: 6,
        img: user6,
        coin: dashCoin,
        followers: 27,
        label: "Tether",
        price: "$5,201,458",
        change: "+14.99%",
        changeClass: "success",
        coinName: "usdt",
        chartsColor: "#0ab39c",
        series: [{
            name: "Dash",
            data: [13, 76, 12, 85, 25, 60, 9, 54]
        }],
        progress: {
            day: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },
            week: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },
            month: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },

        }
    },
    {
        id: 7,
        img: user7,
        coin: usdtCoin,
        followers: 140,
        label: "NEO",
        price: "$6,147,957",
        change: "-05.07%",
        changeClass: "danger",
        coinName: "neo",
        chartsColor: "#f06548",
        series: [{
            name: "Neo",
            data: [9, 66, 41, 89, 12, 36, 25, 54]
        }],
        progress: {
            day: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },
            week: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },
            month: {
                badge: "ri-arrow-up-s-fill",
                badgeColor: "success",
                percentage: "6.24",
            },

        }
    },
];


const WidgetsCharts = ({ seriesData, chartsColor }) => {
    const areachartlitecoinColors = [chartsColor];
    var options = {
        chart: {
            width: 130,
            height: 46,
            type: "area",
            sparkline: {
                enabled: true,
            },
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: "smooth",
            width: 1.5,
        },
        fill: {
            type: "gradient",
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.45,
                opacityTo: 0.05,
                stops: [50, 100, 100, 100],
            },
        },
        colors: areachartlitecoinColors
    };
    return (
        <React.Fragment>
            <ReactApexChart dir="ltr"
                options={options}
                series={[...seriesData]}
                type="area"
                height="46"
                className="apex-charts"
            />
        </React.Fragment>
    );
};



const FeatureLeaders = () => {


    return (
        <>
            <Col lg={12}>
                <Swiper
                    slidesPerView={1}
                    spaceBetween={24}
                    mousewheel={true}
                    autoplay={{
                        delay: 2000,
                        disableOnInteraction: false,
                    }}
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                        },
                        1024: {
                            slidesPerView: 2,
                        },
                        1200: {
                            slidesPerView: 4,
                        },
                        1600: {
                            slidesPerView: 5,
                        },
                    }}
                    modules={[Mousewheel]}
                    className="cryptoSlider">

                    {(cryptoSlider || []).map((item, key) => (
                        <SwiperSlide key={key}>
                            <Card className='social-trading-leader-card shadow-lg'>
                                <CardBody>
                                    {/* <div className="float-end">
                                        <UncontrolledDropdown >
                                            <DropdownToggle className="text-reset" tag="a" role="button">
                                                <span className="text-muted fs-18"><i className="mdi mdi-dots-horizontal"></i></span>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu dropdown-menu-end">
                                                <DropdownItem href="#"> Details </DropdownItem>
                                                <DropdownItem href="#"> Cancel </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div> */}
                                    <div className="d-flex align-items-center flex-column">
                                        <img src={item.img} className="bg-light rounded-circle p-1 img-fluid avatar-lg mb-2" alt="" />
                                        <div className="d-flex align-items-center justify-content-between">
                                            <img className='me-2 bg-light rounded-circle p-1 img-fluid avatar-xs' src={item.coin} alt={item.label} />
                                            <h6 className="mb-0 fs-14">{item.label}</h6>
                                        </div>
                                        <h6 className='text-muted fs-6 mt-2'>{item.followers} Total Followers</h6>
                                    </div>
                                    <Row className="align-items-end g-0">
                                        <Col xs={12}>
                                            {/* <h5 className="mb-1 mt-4">{item.price}</h5> */}
                                            {/* <p className={"fs-13 fw-medium mb-0 text-" + item.changeClass}>{item.change}<span className="text-muted ms-2 fs-10 text-uppercase">({item.coinName})</span></p> */}
                                            <div className="d-flex align-items-center justify-content-between">
                                                <p style={{width:'fit-content'}}>
                                                    <strong className='me-1'>1D</strong>
                                                    <span className={"badge bg-" + item.progress.day.badgeColor + "-subtle text-" + item.progress.day.badgeColor + ""}>
                                                        <i className={"align-middle me-1 " + item.progress.day.badge}></i>
                                                       {item.progress.day.percentage} %
                                                        <span>
                                                        </span>
                                                    </span>
                                                </p>
                                                <p style={{width:'fit-content'}}>
                                                    <strong className='me-1'>1W</strong>
                                                    <span className={"badge bg-" + item.progress.week.badgeColor + "-subtle text-" + item.progress.week.badgeColor + ""}>
                                                        <i className={"align-middle me-1 " + item.progress.week.badge}></i>
                                                        {item.progress.week.percentage} %
                                                        <span>
                                                        </span>
                                                    </span>
                                                </p>
                                                <p style={{width:'fit-content'}}>
                                                    <strong className='me-1'>1M</strong>
                                                    <span className={"badge bg-" + item.progress.month.badgeColor + "-subtle text-" + item.progress.month.badgeColor + ""}>
                                                        <i className={"align-middle me-1 " + item.progress.month.badge}></i>
                                                        {item.progress.month.percentage} %
                                                        <span>
                                                        </span>
                                                    </span>
                                                </p>

                                            </div>
                                        </Col>
                                        <Col xs={12}>
                                            <div className="apex-charts crypto-widget" dir="ltr">
                                                <WidgetsCharts seriesData={item.series} chartsColor={item.chartsColor} />
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </Col>
        </>
    )
}

export default FeatureLeaders
