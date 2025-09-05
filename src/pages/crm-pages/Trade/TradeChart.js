import React from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import getChartColorsArray from '../../../Components/Common/ChartsDynamicColor';
import ReactEcharts from "echarts-for-react";
import * as echarts from 'echarts/core';

const CandleStickChart = ({ dataColors }) => {
    var chartCandlestickColors = getChartColorsArray(dataColors);
    var option = {
        grid: {
            left: '1%',
            right: '0%',
            bottom: '0%',
            top: '2%',
            containLabel: true
        },
        xAxis: {
            data: ['2017-10-24', '2017-10-25', '2017-10-26', '2017-10-27'],
            axisLine: {
                lineStyle: {
                    color: '#858d98'
                },
            },
            splitLine: {
                lineStyle: {
                    color: "rgba(133, 141, 152, 0.1)"
                }
            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    color: '#858d98'
                },
            },
            splitLine: {
                lineStyle: {
                    color: "rgba(133, 141, 152, 0.1)"
                }
            }
        },
        textStyle: {
            fontFamily: 'Poppins, sans-serif'
        },
        series: [{
            type: 'candlestick',
            data: [
                [20, 34, 10, 38],
                [40, 35, 30, 50],
                [31, 38, 33, 44],
                [38, 15, 5, 42]
            ],
            itemStyle: {
                normal: {
                    color: chartCandlestickColors[0],
                    color0: chartCandlestickColors[1],
                    borderColor: chartCandlestickColors[0],
                    borderColor0: chartCandlestickColors[1]
                }
            }
        }]
    };
    return (
        <React.Fragment>
            <ReactEcharts style={{ height: "450px" }} option={option} />
        </React.Fragment>
    )
}


const TradeChart = () => {
    
   
    return (
        <Card>
            <CardHeader>
                <h4 className="mb-0 text-secondary">Candlestick Chart</h4>
            </CardHeader>
            <CardBody>
                <CandleStickChart dataColors='["--vz-danger", "--vz-success"]'/>
            </CardBody>
        </Card>
    );
};

export default TradeChart;
