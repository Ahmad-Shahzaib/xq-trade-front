// DropdownUI.jsx
import React, { useState } from "react";

const categories = [
    {
        name: "Currencies",
        icon: "💲",
        bg: "linear-gradient(90deg, #a900ff 0%, #ff2e92 100%)"
    },
    {
        name: "Cryptocurrencies",
        icon: "🅱️",
        bg: "linear-gradient(90deg, #a900ff 0%, #ff2e92 100%)"
    },
    {
        name: "Commodities",
        icon: "📦",
        bg: "linear-gradient(90deg, #a900ff 0%, #ff2e92 100%)"
    },
    {
        name: "Stocks",
        icon: "📈",
        bg: "linear-gradient(90deg, #a900ff 0%, #ff2e92 100%)"
    },
    {
        name: "Indices",
        icon: "📊",
        bg: "linear-gradient(90deg, #a900ff 0%, #ff2e92 100%)"
    },
    {
        name: "Favorites",
        icon: "⭐",
        bg: "linear-gradient(90deg, #a900ff 0%, #ff2e92 100%)"
    },
    {
        name: "Schedule",
        icon: "🗓️",
        bg: "linear-gradient(90deg, #a900ff 0%, #ff2e92 100%)"
    },
];

const currencies = [
    { flag: "🇦🇺🇳🇿", name: "AUD/NZD OTC" },
    { flag: "🇦🇺🇺🇸", name: "AUD/USD OTC" },
    { flag: "🇧🇭🇨🇳", name: "BHD/CNY OTC" },
    { flag: "🇨🇭🇯🇵", name: "CHF/JPY OTC" },
    { flag: "🇪🇺🇨🇭", name: "EUR/CHF OTC" },
    { flag: "🇪🇺🇳🇿", name: "EUR/NZD OTC" },
    { flag: "🇳🇿🇯🇵", name: "NZD/JPY OTC" },
    { flag: "🇳🇿🇺🇸", name: "NZD/USD OTC" },
    { flag: "🇶🇦🇨🇳", name: "QAR/CNY OTC" },
    { flag: "🇺🇸🇨🇳", name: "USD/CNH OTC" },
    { flag: "🇺🇸🇨🇴", name: "USD/COP OTC" },
    { flag: "🇺🇸🇮🇩", name: "USD/IDR OTC" },
    { flag: "🇺🇸🇮🇳", name: "USD/INR OTC" },
];

const DropdownUI = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState("Currencies");
    const [search, setSearch] = useState("");

    const filteredCurrencies = currencies.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );
    function hexToRgba(hex, alpha) {
        let r = 0, g = 0, b = 0;

        // handle #rgb
        if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        // handle #rrggbb
        else if (hex.length === 7) {
            r = parseInt(hex[1] + hex[2], 16);
            g = parseInt(hex[3] + hex[4], 16);
            b = parseInt(hex[5] + hex[6], 16);
        }

        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }


    return (
        <div
            style={{
                display: "block",
                justifyContent: "center",
                paddingLeft: "10px",
                gap: "10px",
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: "500px",
                    height: "494px",
                    backgroundColor: "rgb(36 33 40 / 90%)",
                    color: "white",
                    borderRadius: "10px",
                    overflow: "hidden",
                    fontFamily: "sans-serif",
                    fontSize: "14px",
                    border: "1px solid rgb(118 18 128)", // Optional border for better visibility
                    boxShadow: "0 0 10px rgba(0,0,0,0.4)",
                }}
            >
                {/* Left Panel - Tabs */}
                <div
                    style={{
                        width: "49%",
                        borderRight: "1px solid #261b49",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        {categories.map((cat, index) => {
                            const isActive = activeTab === cat.name;
                            return (
                                <div
                                    key={index}
                                    onClick={() => setActiveTab(cat.name)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        marginBottom: '10px',
                                        padding: '8px 12px',
                                        borderRadius: '8px',
                                        background: isActive ? cat.bg : hexToRgba(cat.bg, 0.4),
                                        color: isActive ? '#fff' : '#ff2e92',
                                        fontWeight: isActive ? 'bold' : 'normal',
                                        cursor: 'pointer',
                                        boxShadow: isActive ? '0 2px 8px #a900ff44' : 'none',
                                        border: isActive ? '1px solid #ff2e92' : '1px solid #888',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: '18px',
                                            background: isActive ? 'transparent' : cat.bg,
                                            color: isActive ? '#fff' : '#fff',
                                            borderRadius: '50%',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: isActive ? '0 0 8px #ff2e92' : 'none',
                                            marginRight: '8px',
                                            transition: 'all 0.2s',
                                            border: isActive ? '2px solid #fff' : '2px solid transparent',
                                        }}
                                    >
                                        {cat.icon}
                                    </span>
                                    <span style={{ flex: 1 }}>{cat.name}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div
                        style={{
                            fontSize: "10px",
                            color: "#999",
                            lineHeight: "1.4",
                        }}
                    >
                        OTC quotes are provided directly by international banks, liquidity
                        providers and market makers without the supervision of an exchange.
                    </div>
                </div>

                {/* Right Panel - Content */}
                <div
                    style={{
                        width: "70%",
                        padding: "16px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Search only for Currencies tab */}
                    {activeTab === "Currencies" && (
                        <input
                            type="text"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                background: "tra",
                                border: "1px solid #2f2460",
                                borderRadius: "4px",
                                padding: "8px 12px",
                                color: "#fff",
                                marginBottom: "12px",
                                outline: "none",
                            }}
                        />
                    )}

                    <div style={{ flex: 1, overflowY: "auto" }}>
                        {activeTab === "Currencies" ? (
                            filteredCurrencies.map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        padding: "8px 0",
                                        borderBottom: "1px solid #2a2152",
                                        cursor: "pointer",
                                    }}
                                    onClick={onClose} // Close modal when selecting an item
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                        }}
                                    >
                                        <span style={{ fontSize: "16px" }}>⭐</span>
                                        <span>{item.flag}</span>
                                        <span>{item.name}</span>
                                    </div>
                                    <div style={{ color: "#7fffc5" }}>+92%</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ color: "#aaa", textAlign: "center", marginTop: "100px" }}>
                                No data available for <strong>{activeTab}</strong>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DropdownUI;