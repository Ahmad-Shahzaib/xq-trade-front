import React from 'react'
import { formatPrice } from './functions';


const TableRow = React.memo(({
    symbol,
    bid,
    ask,
    onClick,
    color,
    decimalPlaces,
    lowestBid,
    highestBid,
    percentageChange,
    time,
    spread
}) => {
    // Format bid and ask using the helper function
    const formattedBid = formatPrice(bid, decimalPlaces);
    const formattedAsk = formatPrice(ask, decimalPlaces);

    const formattedLowestBid = formatPrice(lowestBid, decimalPlaces);
    const formattedHighestBid = formatPrice(highestBid, decimalPlaces);

    const splitDecimals = (value) => {
        if (!value) return ["", "", "", ""];

        const [integerPart, decimalPart = ""] = value.split(".");

        if (decimalPart.length === 1 || decimalPart.length === 2) {
            return [
                integerPart,
                <span style={{ fontSize: "17px", }}>{decimalPart}</span>,
                "",
                "",
            ]; // Two decimal digits
        } else if (decimalPart.length === 3) {
            return [
                integerPart,
                <span style={{ fontSize: "17px", }}>
                    {decimalPart.slice(0, 2)}
                </span>,
                <sup style={{ fontSize: "10px", }}>
                    {decimalPart.slice(2)}
                </sup>,
                "",
            ];// Three decimal digits
        } else if (decimalPart.length > 3) {
            const regularDecimals = decimalPart.slice(0, -3);
            const lastThree = decimalPart.slice(-3);
            return [
                integerPart,
                <span style={{ fontSize: "14px", }}>
                    {regularDecimals}
                </span>,
                <span style={{ fontSize: "17px", }}>
                    {lastThree.slice(0, 2)}
                </span>,
                <span style={{ fontSize: "10px", }}>
                    {lastThree.slice(2)}
                </span>,
            ];
        }
        return [integerPart, decimalPart, "", ""]; // Default case
    };

    const [bidInteger, bidRegularDecimals, bidHighlightDecimals, bidExponent] =
        splitDecimals(formattedBid);
    const [askInteger, askRegularDecimals, askHighlightDecimals, askExponent] =
        splitDecimals(formattedAsk);

    return (
        <tr className='pricing-tr' key={symbol} style={{ cursor: 'pointer' }} onClick={() => onClick(symbol)}>
            <td className='p-1 col-4'>
                <div className='d-flex flex-column'>
                    <p className='mb-0'>
                        <span>{symbol} </span>
                        <span style={{ fontSize: '11px' }} className={percentageChange > 0 ? "symbol-volume text-secondary" : "symbol-volume text-danger"}>{percentageChange ? `${percentageChange}%` : "0.00%"}</span>
                    </p>
                    <span className='server-time' style={{ fontSize: '11px', }}>
                        {time}
                        <i className="ri-arrow-left-right-fill text-muted"></i>
                        {isNaN(spread) ? '00' : spread}
                    </span>
                </div>
            </td>
            {/*<td style={{ color: color[symbol] }} className='p-1 col-4'>*/}
            <td className={`${color[symbol]} p-1 col-4`}>
                <div>
                    <span className={`${color[symbol]}`}>
                        <span style={{ fontSize: "14px", }}>
                            {bidInteger}
                        </span>
                        <span>.</span>
                        {bidRegularDecimals}
                        {bidHighlightDecimals}
                        {bidExponent && (
                            <sup style={{ fontSize: "10px", }}>
                                {bidExponent}
                            </sup>
                        )}
                    </span>
                </div>
                <p className='text-muted m-0' style={{ fontSize: "11px" }}>L:{formattedLowestBid}</p>
            </td>
            <td className={`${color[symbol]} p-1 col-4`}>
                <div>
                    <span className={`${color[symbol]}`}>
                        <span style={{ fontSize: "14px", }}>
                            {askInteger}
                        </span>
                        <span>.</span>
                        {askRegularDecimals}
                        {askHighlightDecimals}
                        {askExponent && (
                            <sup style={{ fontSize: "10px", }}>
                                {askExponent}
                            </sup>
                        )}
                    </span>
                </div>
                <p className='text-muted m-0' style={{ fontSize: "11px" }}>H:{formattedHighestBid}</p>
            </td>
        </tr>
    );
});

export default TableRow