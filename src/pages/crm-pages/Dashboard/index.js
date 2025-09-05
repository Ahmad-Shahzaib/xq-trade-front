import React, { useEffect } from "react";
import AccountTable from "./AccountTable";
import MyPortfolio from "./MyPortfolio";
import { useDispatch } from "react-redux";
import { token } from "../../../utils/config";
import { getUserDashboard } from "../../../rtk/slices/crm-slices/userDashboard/userDashboard";
import { useSelector } from "react-redux";
import StatCard from "./StatCard";



const Index = () => {

  const dispatch = useDispatch()
  


    useEffect(() => {
      if (token) {
        dispatch(getUserDashboard(token));
      }
    }, [dispatch, token]);
  
  return (
    <div className="page-content">
      <div className="container-fluid">


       <StatCard/>
        <MyPortfolio />

        {/* <Dashboard /> */}
        <AccountTable />
      </div>
    </div>
  );
};

export default Index;
