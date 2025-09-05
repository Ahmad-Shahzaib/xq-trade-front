import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchOpenPositions, selectOpenPositions } from "../../../rtk/slices/openPositionsSlice/openPositionsSlice";
import { selectSymbols } from "../../../rtk/slices/tradingSlice/tradingSlice";
import { fetchAccountDetails, selectAccountDetails } from "../../../rtk/slices/account-detail/accountDetailSlice";
import { useDispatch } from "react-redux";

const StatCard = () => {
  const dispatch = useDispatch();
  const { positions } = useSelector(selectOpenPositions);
  const symbols = useSelector(selectSymbols);
  const { account } = useSelector(selectAccountDetails);

  const [calculatedProfits, setCalculatedProfits] = useState({});
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);

  const calculateProfitMargin = () => {
    const newProfits = {};
    let profitSum = 0;
    let marginSum = 0;

    positions?.forEach((position) => {
      const symbolData = symbols[position.symbol];
      let cryptoSymbols = [
        "BTCUSD", "BTCUSD.ex1", "ETHUSD.ex1", "XRPUSD", "XRPUSD.ex1"
      ];
      let currencySymbols = ["USDJPY", "GBPUSD", "GBPCAD", "USDCHF", "EURUSD", "AUDUSD", "GBPNZD", "AUDJPY", "EURCAD", "EURGBP", "CADJPY", "EURJPY", "GBPJPY", "EURCHF", "EURNOK", "USDCNH", "EURSEK", "NZDUSD", "USDNOK", "USDSEK", "EURAUD", "EURNZD", "CADCHF", "GBPCHF", "CHFJPY", "USDCAD", "GBPAUD", "NZDCHF", "NZDJPY", "NZDCAD"];
      let cfdSymbols = ["USTEC.ex1"];
      let otherSymbols = ["XTI"];
      let metalsSymbols = ["XAUUSD", "XAGUSD", "GOLDFUT-FEB25"];
      if (symbolData) {
        const type = position.type;
        const entryPrice = parseFloat(position.price);
        const exitPrice = type === 'BUY' ? symbolData.bid - 0.10 : symbolData.ask + 0.10;
        let pipValue = 0;
        let marginRate = 0;
        let contractSize = 0;
        if (metalsSymbols.includes(position.symbol)) {
          pipValue = 100;
          marginRate = 2;
          contractSize = 100;
        } else if (currencySymbols.includes(position.symbol)) {
          pipValue = 1000;
          marginRate = 1;
          contractSize = 100000;
        } else if (cfdSymbols.includes(position.symbol)) {
          pipValue = 1;
          marginRate = 0.01;
          contractSize = 1;
        } else if (otherSymbols.includes(position.symbol)) {
          pipValue = 1000;
          marginRate = 1;
          contractSize = 1000;
        } else if (cryptoSymbols.includes(position.symbol)) {
          pipValue = 1;
          marginRate = 0.05;
          contractSize = 1;
        } else {
          pipValue = 100000;
          marginRate = 1;
          contractSize = 1;
        }
        // const pipValue = position.symbol === 'XAUUSD' || position.symbol === 'GOLD.DEC.2024' ? 100 : position.symbol === 'XAGUSD' ? 5000 : 100000;

        const profit = ((exitPrice - entryPrice) * position.volume * pipValue).toFixed(2);
        const margin = ((position.volume * contractSize * marginRate * exitPrice) / 100).toFixed(2);
        // const margin = ((position.volume * pipValue * exitPrice) / 100).toFixed(2);

        newProfits[position.positionid] = profit;
        profitSum += parseFloat(profit);
        marginSum += parseFloat(margin);
      }
    });

    setCalculatedProfits(newProfits);
    setTotalProfit(profitSum);
    setTotalMargin(marginSum);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const accountNum = user ? user.account : null;

    if (accountNum) {
      dispatch(fetchAccountDetails(accountNum));
      dispatch(fetchOpenPositions(accountNum));

    }
  }, [dispatch]);

  useEffect(() => {
    calculateProfitMargin();
  }, [positions, symbols]);

  // Define the data structure for the stats
  const statItems = [
    { label: 'Balance', value: Number(account?.balance).toFixed(2) },
    { label: 'Equity', value: Number(account?.balance + totalProfit).toFixed(2) },
    { label: 'Free Margin', value: Number(account?.balance + totalProfit - totalMargin).toFixed(2) },
  ];

  return (
    <div className="row">
      {statItems.map((stat, index) => (
        <div key={index} className="col-md-6 col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex align-items-center">
                <div className="avatar-sm flex-shrink-0">
                  <span className="avatar-title bg-light text-primary rounded-circle fs-3">
                    <i className='align-middle ri-money-dollar-circle-fill'></i>
                  </span>
                </div>
                <div className="flex-grow-1 ms-3">
                  <p className="text-uppercase fw-semibold fs-12 text-muted mb-1">{stat.label}</p>
                  <h4 className="mb-0">
                    {stat.value && !isNaN(stat.value) ? `${stat.value}` : stat.value === 'NaN' || !stat.value ? `$0.00` : "--"}
                  </h4>

                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCard;
