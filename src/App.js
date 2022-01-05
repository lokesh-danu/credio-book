import React, { createContext, useState } from "react";
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import {
  BrowserRouter as Router, Route, Routes,
  useRoutes,
} from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Deposit from "./components/create-deposit/Deposit";
import CreateUser from "./components/create-user/Create";
import Transaction from "./components/transaction/Transaction";
import Dashboard from "./components/Dashboard/Dashboard";
// import { BrowserRouter as Router } from "react-router-dom";
import Login from './components/Login/Login';


function App() {


  return (
    <Router>
      <Routes>

        <Route exact path="/" element={<Login />} >

        </Route>
        <Route exact path="/transactions" element={<Transaction />}>

        </Route>
        <Route path="/dashboard" element={<Dashboard />}>

        </Route>
        <Route path="/deposit" element={<Deposit />}>

        </Route>
        <Route path="/new/user" element={<CreateUser />}>

        </Route>
        {/* <Route path="/balance">
                <Balance />
              </Route> */}

      </Routes >
    </Router >
  );

}

export default App;
