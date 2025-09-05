export const formatPrice = (value, maxDecimalPlaces) => {
    if (value == null || isNaN(value)) return ""; // Handle null or invalid values
    const actualDecimals = value.toString().split(".")[1]?.length || 0; // Check actual decimal places
    const decimalsToShow = Math.min(actualDecimals, maxDecimalPlaces);
    return value.toFixed(decimalsToShow);
};


export const handleTouchStart = (symbol,longPressTimeout,setLongPressedSymbol,setIsModalOpen) => {
    longPressTimeout.current = setTimeout(() => {
        setLongPressedSymbol(symbol);
        setIsModalOpen(true);
    }, 500);
};

export const toggleModal = (setIsModalOpen,isModalOpen) => {
    setIsModalOpen(!isModalOpen);
};