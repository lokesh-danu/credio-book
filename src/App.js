import React from 'react';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import {BrowserRouter as Router} from "react-router-dom";
import Login from './components/login/Login';

function App() {
  return (
    <>
      <Login/>
    </>
  );
}

export default App;
