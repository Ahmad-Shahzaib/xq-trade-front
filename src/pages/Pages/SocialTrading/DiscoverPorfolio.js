import React, { useState } from 'react';
import { Table, Input, Pagination, PaginationItem, PaginationLink, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Button } from 'reactstrap';

// Import crypto icons 
import btcCoin from '../../../assets/images/crypto-icons/btc.svg';
import ltcCoin from '../../../assets/images/crypto-icons/ltc.svg';
import ethCoin from '../../../assets/images/crypto-icons/eth.svg';
import etcCoin from '../../../assets/images/crypto-icons/etc.svg';
import bnbCoin from '../../../assets/images/crypto-icons/bnb.svg';
import dashCoin from '../../../assets/images/crypto-icons/dash.svg';
import usdtCoin from '../../../assets/images/crypto-icons/usdt.svg';
import ReactApexChart from 'react-apexcharts';

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



const DiscoverPorfolio = () => {
    const [filterText, setFilterText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [selectedCryptos, setSelectedCryptos] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleCryptoSelect = (coinName) => {
        setSelectedCryptos((prevSelected) =>
            prevSelected.includes(coinName) ? prevSelected.filter(item => item !== coinName) : [...prevSelected, coinName]
        );
    };

    const filteredData = cryptoSlider.filter(item =>
        (selectedCryptos.length === 0 || selectedCryptos.includes(item.coinName)) &&
        item.label.toLowerCase().includes(filterText.toLowerCase())
    );

    const handlePageClick = (pageNumber) => setCurrentPage(pageNumber);
    const handleFilterChange = (event) => setFilterText(event.target.value);

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    return (
        <>
            <div>
                <h3>Discover Portfolio</h3>
                <Input
                    type="text"
                    placeholder="Search crypto..."
                    value={filterText}
                    onChange={handleFilterChange}
                    className="mb-3"
                />

                <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="mb-3">
                    <DropdownToggle caret>
                        Filter by Cryptocurrency
                    </DropdownToggle>
                    <DropdownMenu>
                        {cryptoSlider.map((crypto) => (
                            <DropdownItem key={crypto.id} toggle={false} onClick={() => handleCryptoSelect(crypto.coinName)}>
                                <input
                                    type="checkbox"
                                    checked={selectedCryptos.includes(crypto.coinName)}
                                    onChange={() => handleCryptoSelect(crypto.coinName)}
                                />
                                {' '}{crypto.label}
                            </DropdownItem>
                        ))}
                    </DropdownMenu>
                </Dropdown>

                <div className="table-responsive">
                    <Table striped>
                        <thead>
                            <tr>
                                <th>Crypto</th>
                                <th>Price</th>
                                <th>Change</th>
                                <th>Followers</th>
                                <th>Chart</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img src={item.coin} alt={item.label} style={{ width: 20, marginRight: 10 }} />
                                            {item.label}
                                        </div>
                                    </td>
                                    <td>{item.price}</td>
                                    <td className={`text-${item.changeClass}`}>{item.change}</td>
                                    <td>{item.followers}</td>
                                    <td>
                                        <WidgetsCharts seriesData={item.series} chartsColor={item.chartsColor} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <Pagination aria-label="Page navigation">
                    <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink first onClick={() => handlePageClick(1)} />
                    </PaginationItem>
                    <PaginationItem disabled={currentPage === 1}>
                        <PaginationLink previous onClick={() => handlePageClick(currentPage - 1)} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, index) => (
                        <PaginationItem active={currentPage === index + 1} key={index}>
                            <PaginationLink onClick={() => handlePageClick(index + 1)}>
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem disabled={currentPage === totalPages}>
                        <PaginationLink next onClick={() => handlePageClick(currentPage + 1)} />
                    </PaginationItem>
                    <PaginationItem disabled={currentPage === totalPages}>
                        <PaginationLink last onClick={() => handlePageClick(totalPages)} />
                    </PaginationItem>
                </Pagination>
            </div>
        </>
    );
};

export default DiscoverPorfolio
