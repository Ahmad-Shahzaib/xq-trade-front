// src/components/AccountDetails.js

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAccountDetails, selectAccountDetails } from '../../rtk/slices/account-detail/accountDetailSlice';
import { Card, ListGroup, ListGroupItem } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { selectOpenPositions } from '../../rtk/slices/openPositionsSlice/openPositionsSlice';
import { selectSymbols } from '../../rtk/slices/tradingSlice/tradingSlice';
import { setTP } from '../../rtk/slices/openPositionsSlice/openPositionsSlice';

const AccountDetails = () => {
    const dispatch = useDispatch();
    const { positions } = useSelector(selectOpenPositions);
    const { account } = useSelector(selectAccountDetails);
    const symbols = useSelector(selectSymbols);
    const layout = useSelector((state)=> state.Layout.layoutModeType)


    const [calculatedProfits, setCalculatedProfits] = useState({});
    const [totalProfit, setTotalProfit] = useState(0);
    const [totalMargin, setTotalMargin] = useState(0);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        const accountNumber = user ? user.account : null;

        if (accountNumber) {
            dispatch(fetchAccountDetails(accountNumber)); // Fetch account details on mount
        }
    }, [dispatch]);

    const calculateProfitMargin = () => {
        const newProfits = {};
        let profitSum = 0;
        let marginSum = 0;
    
        positions.forEach((position) => {
          const symbolData = symbols[position.symbol];
          let cryptoSymbols = [
            "BTCUSD", "BTCUSD.ex1", "ETHUSD.ex1", "XRPUSD", "XRPUSD.ex1"
          ];
          let currencySymbols = ["USDJPY", "GBPUSD", "GBPCAD", "USDCHF", "EURUSD", "AUDUSD", "GBPNZD", "AUDJPY", "EURCAD", "EURGBP", "CADJPY", "EURJPY", "GBPJPY", "EURCHF", "EURNOK", "USDCNH", "EURSEK", "NZDUSD", "USDNOK", "USDSEK", "EURAUD", "EURNZD", "CADCHF", "GBPCHF", "CHFJPY", "USDCAD", "GBPAUD", "NZDCHF", "NZDJPY", "NZDCAD"];
          let cfdSymbols = ["USTEC.ex1"];
          let otherSymbols = [ "XTI"];
          let metalsSymbols = ["XAUUSD", "XAGUSD", "GOLDFUT-FEB25"];
          if (symbolData) {
            const type = position.type;
            const entryPrice = parseFloat(position.price);
            const exitPrice = type === 'BUY' ? symbolData.bid - 0.10 : symbolData.ask + 0.10;
            let pipValue = 0;
            let marginRate = 0;
            let contractSize = 0;
            if(metalsSymbols.includes(position.symbol)) {
              pipValue = 100;
              marginRate = 2;
              contractSize = 100;
            }else if(currencySymbols.includes(position.symbol)){
              pipValue = 1000;
              marginRate = 1;
              contractSize = 100000;
            }else if(cfdSymbols.includes(position.symbol)){
              pipValue = 1;
              marginRate = 0.01;
              contractSize = 1;
            }else if(otherSymbols.includes(position.symbol)){
              pipValue = 1000;
              marginRate = 1;
              contractSize = 1000;
            }else if(cryptoSymbols.includes(position.symbol)) {
              pipValue = 1;
              marginRate = 0.05;
              contractSize = 1;
            }else{
              pipValue = 100000;
              marginRate = 1;
              contractSize = 1;
            }
            // const pipValue = position.symbol === 'XAUUSD' || position.symbol === 'GOLD.DEC.2024' ? 100 : position.symbol === 'XAGUSD' ? 5000 : 100000;
    
            const profit = ((exitPrice - entryPrice) * position.volume * pipValue).toFixed(2);
            const margin = ((position.volume * contractSize * marginRate * exitPrice)/100).toFixed(2);
            // const margin = ((position.volume * pipValue * exitPrice) / 100).toFixed(2);
    
            newProfits[position.positionid] = profit;
            profitSum += parseFloat(profit);
            marginSum += parseFloat(margin);
          }
        });
    
        setCalculatedProfits(newProfits);
        setTotalProfit(profitSum);
        setTotalMargin(marginSum);
        dispatch(setTP(totalProfit));
      };

    useEffect(() => {
        calculateProfitMargin();
    }, [positions, symbols]);

    return (
        <>
            <Card className="mb-1 bg-body border">
                <SimpleBar >
                    {
                        account && (
                            <>

                                <ListGroup>
                                    <ListGroupItem style={{ fontSize: "16px", paddingInline: '5px',color:layout==='light'? '#000000':'#ffffff' }} className="m-0 fw-bold py-0 border-0 bg-transparent">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <div className="d-flex">

                                                    <div className="flex-shrink-0">
                                                        <h6 style={{ fontSize: "16px" }} className="fw-bold mb-0">Balance:</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span style={{color:layout==='light'? '#000000':'#ffffff',fontWeight:600}}> {account.balance}</span>
                                            </div>
                                        </div>
                                    </ListGroupItem>

                                    <ListGroupItem style={{ fontSize: "16px", paddingInline: '5px' ,color:layout==='light'? '#000000':'#ffffff'}} className="m-0 fw-bold py-0 border-0 bg-transparent">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <div className="d-flex">

                                                    <div className="flex-shrink-0 ">
                                                        <h6 style={{ fontSize: "16px" }} className="fw-bold mb-0">Equity:</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span style={{color:layout==='light'? '#000000':'#ffffff',fontWeight:600}}>{(account.balance + totalProfit).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </ListGroupItem>



                                    <ListGroupItem style={{ fontSize: "16px", paddingInline: '5px',color:layout==='light'? '#000000':'#ffffff' }} className="m-0 fw-bold py-0 border-0 bg-transparent">
                                        <div className="d-flex align-items-center">
                                            <div className="flex-grow-1">
                                                <div className="d-flex">

                                                    <div className="flex-shrink-0 ">
                                                        <h6 style={{ fontSize: "16px" }} className="fw-bold mb-0">Free Margin:</h6>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span style={{color:layout==='light'? '#000000':'#ffffff',fontWeight:600}}> {(account.balance + totalProfit - totalMargin).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </ListGroupItem>




                                    {positions.length > 0 && (
                                        <>
                                            <ListGroupItem style={{ fontSize: "16px", paddingInline: '5px',color:layout==='light'? '#000000':'#ffffff' }} className="m-0 fw-bold py-0 border-0 bg-transparent">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex">

                                                            <div className="flex-shrink-0 ">
                                                                <h6 style={{ fontSize: "16px" }} className="fw-bold mb-0">Margin:</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <span style={{color:layout==='light'? '#000000':'#ffffff',fontWeight:600}}>{totalMargin.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </ListGroupItem>
                                            <ListGroupItem style={{ fontSize: "16px", paddingInline: '5px',color:layout==='light'? '#000000':'#ffffff' }} className="m-0 fw-bold py-0 border-0 mb-1 bg-transparent">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-grow-1">
                                                        <div className="d-flex">

                                                            <div className="flex-shrink-0">
                                                                <h6 style={{ fontSize: "16px" }} className="fw-bold mb-0">Margin Level:</h6>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex-shrink-0">
                                                        <span style={{color:layout==='light'? '#000000':'#ffffff',fontWeight:600}}>{((account.balance + totalProfit) / totalMargin * 100).toFixed(2)}%</span>
                                                    </div>
                                                </div>
                                            </ListGroupItem>
                                        </>
                                    )}
                                </ListGroup>
                            </>
                        )
                    }

                </SimpleBar>
            </Card >
        </>
    );
};

export default AccountDetails;
