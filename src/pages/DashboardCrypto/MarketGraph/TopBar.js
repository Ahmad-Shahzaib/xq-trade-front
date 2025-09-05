// TopActionBar.jsx
import React, { useState, useRef } from "react";
import { FaChartLine, FaChartBar, FaFeatherAlt, FaThLarge } from "react-icons/fa";
import TimeSelectorModal from "./TimeSelectorModal";
import ChartBarModal from "./ChartBarModal";
import FeatherModal from "./FeatherModal";
import ThLargeModal from "./ThLargeModal";
import DropdownUI from "./AssetSelector"; // Adjust the import path as necessary

const TopActionBar = () => {
    const [activeModal, setActiveModal] = useState(null); // null, "line", "bar", "feather", "th"
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref to position the dropdown

    const icons = [FaChartLine, FaChartBar, FaFeatherAlt, FaThLarge];

    const handleIconClick = (index) => {
        const modalNames = ["line", "bar", "feather", "th"];
        setActiveModal(modalNames[index]);
    };

    const handleDropdownToggle = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "traspareent",
                    padding: "8px 12px",
                    marginLeft: "10px",
                    borderRadius: "10px",
                    alignItems: "center",
                    marginBottom: "10px",
                    width: "400px", // Ensure full width
                }}
            >
                <div
                    ref={dropdownRef} // Attach ref to the CHF/JPY button
                    style={{
                        backgroundColor: "#160318",
                        padding: "8px 14px",
                        borderRadius: "10px",
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "13px",
                        cursor: "pointer",
                        position: "relative",
                        width: "160px", // Fixed width for the button
                    }}
                    onClick={handleDropdownToggle}
                >
                    CHF/JPY ▼
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    {icons.map((Icon, i) => (
                        <div
                            key={i}
                            onClick={() => handleIconClick(i)}
                            style={{
                                backgroundColor: "#160318",
                                padding: "10px",
                                borderRadius: "50%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            <Icon size={20} />
                        </div>
                    ))}
                </div>
            </div >

            {activeModal === "line" && <TimeSelectorModal onClose={() => setActiveModal(null)} />
            }
            {activeModal === "bar" && <ChartBarModal onClose={() => setActiveModal(null)} />}
            {activeModal === "feather" && <FeatherModal onClose={() => setActiveModal(null)} />}
            {activeModal === "th" && <ThLargeModal onClose={() => setActiveModal(null)} />}

            {
                isDropdownOpen && (
                    <div
                        style={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            // backgroundColor: "rgba(0, 0, 0, 0.5)", 
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            zIndex: 1000,
                        }}
                        onClick={handleDropdownToggle}
                    >
                        <div
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                position: "absolute",
                                top: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().bottom + window.scrollY : 0,
                                left: dropdownRef.current ? dropdownRef.current.getBoundingClientRect().left + window.scrollX : 0,
                                width: "300px",
                                transform: "translateY(10px)",
                            }}
                        >
                            <DropdownUI onClose={handleDropdownToggle} />
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default TopActionBar;