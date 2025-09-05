import React from "react";
import { ListGroupItem } from "reactstrap";
import { formatPrice } from "./functions";

const ListItem = React.memo(
  ({
    symbol,
    bid,
    ask,
    time,
    lowestBid,
    highestBid,
    onClick,
    onTouchStart,
    onTouchEnd,
    onContextMenu,
    color,
    decimalPlaces,
    percentageChange,
    spread,
  }) => {
    // Format prices using the helper function
    const formattedBid = formatPrice(bid, decimalPlaces);
    const formattedAsk = formatPrice(ask, decimalPlaces);
    const formattedLowestBid = formatPrice(lowestBid, decimalPlaces);
    const formattedHighestBid = formatPrice(highestBid, decimalPlaces);

    // Function to split and format the decimal parts
    const splitDecimals = (value) => {
      if (!value) return ["", "", "", ""];

      const [integerPart, decimalPart = ""] = value.split(".");

      if (decimalPart.length === 1 || decimalPart.length === 2) {
        return [
          integerPart,
          <span style={{ fontSize: "22px", fontWeight: 700 }}>{decimalPart}</span>,
          "",
          "",
        ]; // Two decimal digits
      } else if (decimalPart.length === 3) {
        return [
            integerPart,
            <span style={{ fontSize: "22px", fontWeight: 700 }}>
              {decimalPart.slice(0, 2)}
            </span>,
            <sup style={{ fontSize: "12px", fontWeight: 700 }}>
              {decimalPart.slice(2)}
            </sup>,
            "",
          ];// Three decimal digits
      } else if (decimalPart.length > 3) {
        const regularDecimals = decimalPart.slice(0, -3);
        const lastThree = decimalPart.slice(-3);
        return [
          integerPart,
          <span style={{ fontSize: "16px", fontWeight: 700 }}>
            {regularDecimals}
          </span>,
          <span style={{ fontSize: "22px", fontWeight: 700 }}>
            {lastThree.slice(0, 2)}
          </span>,
          <span style={{ fontSize: "12px", fontWeight: 700 }}>
            {lastThree.slice(2)}
          </span>,
        ];
      }
      return [integerPart, decimalPart, "", ""]; // Default case
    };

    // Split values into parts for formatting
    const [bidInteger, bidRegularDecimals, bidHighlightDecimals, bidExponent] =
      splitDecimals(formattedBid);
    const [askInteger, askRegularDecimals, askHighlightDecimals, askExponent] =
      splitDecimals(formattedAsk);

    return (
      <ListGroupItem
        className="bg-transparent"
        key={symbol}
        style={{ cursor: "pointer", padding: "5px" }}
        onClick={() => onClick(symbol)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onContextMenu={onContextMenu}
      >
        <div className="d-flex align-items-center">
          <div className="col-6">
            <div
              className={`symbol-volume ${
                percentageChange > 0 ? "text-secondary" : "text-danger"
              }`}
              style={{ fontSize: "12px", lineHeight: "8px" }}
            >
              {percentageChange ? `${percentageChange}%` : "Loading..."}
            </div>
            <strong className="fw-bold" style={{ fontSize: "14px" }}>
              {symbol}
            </strong>
            <div
              style={{
                fontSize: "12px",
                lineHeight: "5px",
                marginTop: "3px",
              }}
            >
              {time}
              <i className="ri-arrow-left-right-fill text-muted"></i>
              {spread}
            </div>
          </div>
          <div className="col-6">
            <div className="d-flex pricing-row-mbl">
              {/* Bid Price */}
              <div className="bid">
                <p className="mb-0 fw-bold">
                  <span className={`${color[symbol]}`}>
                    <span style={{ fontSize: "16px", fontWeight: 700 }}>
                      {bidInteger}
                    </span>
                    <span style={{ fontSize: "16px", fontWeight: 700 }}>.</span>
                    {bidRegularDecimals}
                    {bidHighlightDecimals}
                    {bidExponent && (
                      <sup style={{ fontSize: "12px", fontWeight: 700, }}>
                        {bidExponent}
                      </sup>
                    )}
                  </span>
                </p>
                <p
                  className="m-0 text-muted"
                  style={{ fontSize: "12px", }}
                >
                  L:{formattedLowestBid}
                </p>
              </div>
              {/* Ask Price */}
              <div className="ask">
                <p className="mb-0 fw-bold">
                  <span className={`${color[symbol]}`}>
                    <span style={{ fontSize: "16px", fontWeight: 700 }}>
                      {askInteger}
                    </span>
                    <span style={{ fontSize: "16px", fontWeight: 700 }}>.</span>
                    {askRegularDecimals}
                    {askHighlightDecimals}
                    {askExponent && (
                      <sup style={{ fontSize: "12px", fontWeight: 700 , }}>
                        {askExponent}
                      </sup>
                    )}
                  </span>
                </p>
                <p
                  className="m-0 text-muted"
                  style={{ fontSize: "12px" ,}}
                >
                  H:{formattedHighestBid}
                </p>
              </div>
            </div>
          </div>
        </div>
      </ListGroupItem>
    );
  }
);

export default ListItem;