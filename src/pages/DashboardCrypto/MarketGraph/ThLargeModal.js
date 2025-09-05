import React, { useState } from "react";

const ThLargeModal = ({ onClose }) => {
    const layouts = ["Candlestick", "Area", "Bar", "Baseline", "Histogram", "Line"];
    const [selected, setSelected] = useState("Candlestick");

    return (
        <div
            style={modalOverlayStyle}
            onClick={onClose} // Close on outside click
        >
            <div
                style={modalContentStyle}
                onClick={(e) => e.stopPropagation()} // Prevent close on inner click
            >
                {layouts.map((item, i) => (
                    <div
                        key={i}
                        onClick={() => {
                            setSelected(item);
                            onClose(); // ✅ Close modal on option click
                        }}
                        style={{
                            ...itemStyle,
                            color: selected === item ? "#3b82f6" : "#fff",
                            fontWeight: selected === item ? "bold" : "normal",
                        }}
                    >
                        <span>{item}</span>
                        {selected === item && (
                            <span style={{ color: "limegreen", marginLeft: "5px" }}>✔</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: "170px",
    paddingLeft: "390px",
};

const modalContentStyle = {
    backgroundColor: "#160E2F",
    padding: "10px 20px",
    borderRadius: "6px",
    display: "flex",
    flexDirection: "column",
    width: "180px",
};

const itemStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    cursor: "pointer",
    fontSize: "14px",
};

export default ThLargeModal;
