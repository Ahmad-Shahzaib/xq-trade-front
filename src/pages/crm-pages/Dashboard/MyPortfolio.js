import React, { useState, useEffect } from 'react';
import ReactApexChart from "react-apexcharts";
import { useSelector, useDispatch } from "react-redux";
import { token } from '../../../utils/config';
import { withdrawalList } from '../../../rtk/slices/crm-slices/withdraw/withdrawalListSlice';
import { updateDepositSummary, updateWithdrawalSummary } from '../../../rtk/slices/crm-slices/myPortfolio/myPortfolio';
import { depositList } from '../../../rtk/slices/crm-slices/deposite/depositeListSlice';

const ChartCard = ({ title, chartData }) => {
    const [chartColors, setChartColors] = useState(
        chartData.map((item) => item.color) // Set colors directly from chartData
    );

    const seriesData = chartData.map((data) => data.value);
    const labelsData = chartData.map((data) => data.label);

    const chartOptions = {
        labels: labelsData,
        chart: {
            type: 'donut',
        },
        colors: chartColors,
        legend: {
            position: 'bottom',
        },
        dataLabels: {
            enabled: true,
        },
    };

    return (
        <div className="col-12 col-sm-6">
            <div className="card card-height-100">
                <div className="card-header border-0 align-items-center d-flex">
                    <h4 className="card-title mb-0 flex-grow-1">{title}</h4>
                </div>
                <div className="card-body">
                    <ReactApexChart
                        options={chartOptions}
                        series={seriesData}
                        type="donut"
                        height={300}
                    />
                    <ul className="list-group list-group-flush border-dashed mb-0 mt-3 pt-2">
                        {chartData.map((item, index) => (
                            <li className="list-group-item px-0" key={index}>
                                <div className="d-flex">
                                    <div className="flex-grow-1 ms-2">
                                        <h6 className="mb-1">{item.label}</h6>
                                        <p className="text-muted fs-12 mb-0">Amount: {item.value}</p>
                                    </div>
                                    <div className="text-end">
                                        <span className="badge" style={{ backgroundColor: item.color }}>
                                            {item.value}
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const DepositPortfolio = () => {
    const depositeSummary = useSelector((state) => state.userDashboard.depositSummary)
    const depositeSummaryLogin = useSelector((state) => state.auth.depositSummary)

    const chartData = [
        { label: 'Total Deposit', value: Number(depositeSummary?.total) || 0, color: '#007BFF' }, // Blue
        { label: 'Completed Deposit', value: Number(depositeSummary?.completed) || 0, color: '#28A745' }, // Green
        { label: 'Pending Deposit', value: Number(depositeSummary?.pending) || 0, color: '#EB5254' }, // Yellow
    ];

    return <ChartCard title="Deposit Portfolio" chartData={chartData} />;
};

const WithdrawalPortfolio = () => {
    const withdrawalSummary = useSelector((state) => state.userDashboard.withdrawalSummary)

    const chartData = [
        { label: 'Total Withdrawal', value: Number(withdrawalSummary?.total) || 0, color: '#007BFF' }, // Blue
        { label: 'Processed Withdrawal', value: Number(withdrawalSummary?.completed) || 0, color: '#28A745' }, // Green
        { label: 'Pending Withdrawal', value: Number(withdrawalSummary?.pending) || 0, color: '#EB5254' }, // Yellow
    ];

    return <ChartCard title="Withdrawal Portfolio" chartData={chartData} />;
};

const MyPortfolio = () => {
    return (
        <div className="row">
            <DepositPortfolio />
            <WithdrawalPortfolio />
        </div>
    );
};

export default MyPortfolio;
