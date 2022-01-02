import React from 'react';
import './App.css';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from "./components/Navbar/Navbar";
import Dashboard from './components/Dashboard/Dashboard';
import Transaction from './components/transaction/Transaction';
import Create from './components/create-user/Create';
import Deposit from './components/create-deposit/Deposit';
import Bottom from './components/bottom-navbar/Bottom';
import Setting from './components/setting/Setting';
import Login from "./components/login/Login"

function App() {
  return (
    <>
      <Login/>
    </>
  );
}

export default App;
