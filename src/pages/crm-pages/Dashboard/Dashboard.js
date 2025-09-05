import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import StatCard from "./StatCard";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    const data = [
      {
        id: 1,
        title: "Total Deposit",
        total: "0.00",
        stats: { Submitted: 500, Pending: 200, Rejected: 100 },
      },
      {
        id: 2,
        title: "Total Withdraw",
        total: "0.00",
        stats: { Submitted: 300, Pending: 100, Rejected: 50 },
      },
      {
        id: 3,
        title: "Total Trading Account Balance",
        total: "4500",
        stats: { Equity: 1000, FreeMargin: 500, Balance: 1500, TotalBalance: 3000 },
      },
     
    ];

    setDashboardData(data);
  };

  const createChartData = (stats) => {
    const labels = Object.keys(stats);
    const dataValues = Object.values(stats);

    const colors = [
      "rgba(75,192,192,0.5)",
      "rgba(255,99,132,0.5)",
      "rgba(255,206,86,0.5)",
      "rgba(54,162,235,0.5)",
    ];

    return {
      labels,
      datasets: [
        {
          label: "Stats",
          data: dataValues,
          backgroundColor: colors.slice(0, labels.length), 
          borderColor: colors.slice(0, labels.length).map((color) => color.replace("0.5", "1")), 
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <Container fluid className="py-4">
      {dashboardData.map((card) => (
        <Row key={card.id} className="mb-4">
          <Col md="12">
            <StatCard
              title={card.title}
              total={card.total}
              stats={card.stats}
              chartData={createChartData(card.stats)}
            />
          </Col>
        </Row>
      ))}
    </Container>
  );
};

export default Dashboard;
