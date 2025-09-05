import React from "react";

const TimeSelectorModal = ({ onClose }) => {
    const times = Array.from({ length: 10 }, (_, i) => `${i + 1}m`);

    return (
        <div
            style={{
                position: "fixed",
                top: 170,
                left: 390,
                height: "100vh",
                // backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "block",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClose}
        >
            <div
                style={{
                    backgroundColor: "#160E2F",
                    padding: "20px",
                    borderRadius: "10px",
                    display: "block",
                    flexWrap: "wrap",
                    gap: "10px",
                    justifyContent: "center",
                }}
                onClick={(e) => e.stopPropagation()} // Prevent modal close on inner click
            >
                {times.map((time, i) => (
                    <div
                        key={i}
                        onClick={onClose} // ✅ Close modal on click
                        style={{
                            color: "white",
                            padding: "10px 15px",
                            borderRadius: "8px",
                            fontWeight: "bold",
                            cursor: "pointer",
                        }}
                    >
                        {time}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TimeSelectorModal;
