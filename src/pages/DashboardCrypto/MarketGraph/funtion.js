// Function to get icon and color based on symbol
export const getSymbolDetails = (symbol) => {
    const symbolLower = symbol.toLowerCase();

    // Cryptocurrencies
    if (symbolLower.includes('btc')) {
        return { icon: 'ri-bit-coin-fill', color: '#F7931A' };
    } else if (symbolLower.includes('eth')) {
        return { icon: 'ri-eth-fill', color: '#627EEA' };
    } else if (symbolLower.includes('xrp')) {
        return { icon: 'ri-xrp-fill', color: '#23292F' };
    }

    // Precious Metals
    else if (symbolLower.includes('xau') || symbolLower.includes('gold')) {
        return { icon: 'ri-copper-coin-fill', color: '#FFD700' };
    }

    // Stock Indices
    else if (symbolLower.includes('ustec')) {
        return { icon: 'ri-line-chart-fill', color: '#2962FF' };
    }

    // Currency Pairs
    else if (symbolLower.startsWith('usd')) {
        return { icon: 'ri-money-dollar-circle-fill', color: '#85bb65' };
    } else if (symbolLower.startsWith('eur')) {
        return { icon: 'ri-money-euro-circle-fill', color: '#0052B4' };
    } else if (symbolLower.startsWith('gbp') || symbolLower.endsWith('gbp')) {
        return { icon: 'ri-money-pound-circle-fill', color: '#C8102E' };
    } else if (symbolLower.startsWith('jpy') || symbolLower.endsWith('jpy')) {
        return { icon: 'ri-money-cny-circle-fill', color: '#BC002D' };
    } else if (symbolLower.startsWith('aud') || symbolLower.endsWith('aud')) {
        return { icon: 'ri-money-dollar-circle-fill', color: '#00843D' };
    } else if (symbolLower.startsWith('cad') || symbolLower.endsWith('cad')) {
        return { icon: 'ri-money-dollar-circle-fill', color: '#FF0000' };
    } else if (symbolLower.startsWith('nzd') || symbolLower.endsWith('nzd')) {
        return { icon: 'ri-money-dollar-circle-fill', color: '#00247D' };
    } else if (symbolLower.startsWith('chf') || symbolLower.endsWith('chf')) {
        return { icon: 'ri-money-franc-circle-fill', color: '#FF0000' };
    } else if (symbolLower.startsWith('zar') || symbolLower.endsWith('zar')) {
        return { icon: 'ri-money-dollar-circle-fill', color: '#007A4D' };
    }

    // Default for unknown symbols
    return { icon: 'ri-exchange-fill', color: '#6c757d' };
};


export const symbolFullNames = {
    BTCUSD: "Bitcoin / US Dollar",
    XRPUSD: "Ripple / US Dollar",
    EURUSD: "Euro / US Dollar",
    GBPUSD: "British Pound / US Dollar",
    USDJPY: "US Dollar / Japanese Yen",
    AUDUSD: "Australian Dollar / US Dollar",
    USDCAD: "US Dollar / Canadian Dollar",
    AUDJPY: "Australian Dollar / Japanese Yen",
    EURCHF: "Euro / Swiss Franc",
    EURGBP: "Euro / British Pound",
    EURJPY: "Euro / Japanese Yen",
    NZDUSD: "New Zealand Dollar / US Dollar",
    AUDCAD: "Australian Dollar / Canadian Dollar",
    CADCHF: "Canadian Dollar / Swiss Franc",
    CADJPY: "Canadian Dollar / Japanese Yen",
    CHFJPY: "Swiss Franc / Japanese Yen",
    EURAUD: "Euro / Australian Dollar",
    GBPJPY: "British Pound / Japanese Yen",
    NZDCAD: "New Zealand Dollar / Canadian Dollar",
    NZDJPY: "New Zealand Dollar / Japanese Yen",
    USDCHF: "US Dollar / Swiss Franc",
    EURNZD: "Euro / New Zealand Dollar",
    GBPAUD: "British Pound / Australian Dollar",
    GBPCAD: "British Pound / Canadian Dollar",
    GBPNZD: "British Pound / New Zealand Dollar",
    XAGUSD: "Silver / US Dollar",
    XAUUSD: "Gold / US Dollar",
    USDCNH: "US Dollar / Chinese Yuan",
    USDZAR: "US Dollar / South African Rand",
    BTCUSD_ex1: "Bitcoin / US Dollar",
    ETHUSD_ex1: "Ethereum / US Dollar",
    AUDNZD: "Australian Dollar / New Zealand Dollar",
    USTEC: "US Tech 100 Index",
    XRPUSD_ex1: "Ripple / US Dollar",
    USTEC_ex1: "US Tech 100 Index",
    USOil_ex1: "Crude Oil (WTI)",
    AUDCHF: "Australian Dollar / Swiss Franc",
    EURCAD: "Euro / Canadian Dollar",
    GOLDFUT_APR25: "Gold Futures (April 2025)",
    XTI: "Crude Oil (West Texas Intermediate)",
    GBPCHF: "British Pound / Swiss Franc",
    NZDCHF: "New Zealand Dollar / Swiss Franc"
};

export const timeframes = {
  "1m": 60,
  "5m": 300,
  "15m": 900,
  "1h": 3600,
  "1D": 86400
};


export const seriesTypes = ['Candlestick', 'Area', 'Bar', 'Baseline', 'Histogram', 'Line'];