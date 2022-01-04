import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./sidebar.css";
import Logo from "../../image/Logo.png";
import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
import Transaction from "../transaction/Transaction";
import Dashboard from "../Dashboard/Dashboard";
import User from "../create-user/Create";

const viewportContext = React.createContext({});

const ViewportProvider = ({ children }) => {
  const [width, setWidth] = React.useState(window.innerWidth);
  const [height, setHeight] = React.useState(window.innerHeight);
  const handleWindowResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  );
};


const useViewport = () => {
    const { width, height } = React.useContext(viewportContext);
    return { width, height };
};

const MobileComponent = () => {
    return(
        <div>
            
        </div>
    )
}

const DesktopComponent = () => {
    return(
        <Router>
            <Routes>
                <Route path="/home" element={<Dashboard/>} />
                <Route path="/transaction" element={<Transaction/>} />
                <Route path="/user" element={<User/>} />
                <Route path="/settings"  />
            </Routes>
        <div>
            <div className='sidebar'>
                <div className='sidebar-brand'>
                    <img src={Logo} className='brand-logo' alt="" />
                    <span className='brand-name'>Credio Books</span>
                </div>
                <div className='create-user'>
                    <span className='create-user-text'>+ Create Users</span>
                </div>
                <ul className='sidebar-menu-items'>
                    <Link to="/home">
                    <li className='sidebar-menu-item'>
                        <i class="far fa-user"></i>
                        <span className='sidebar-text'>Dashboard</span>
                    </li>
                    </Link>
                    <Link to="/transaction">
                    <li className='sidebar-menu-item'>
                        <i class="far fa-user"></i>
                        <span className='sidebar-text'>Transactions</span>
                    </li>
                    </Link>
                    <Link to="/user">
                    <li className='sidebar-menu-item'>
                        <i class="far fa-user"></i>
                        <span className='sidebar-text'>Users</span>
                    </li>
                    </Link>
                    <Link to="/settings">
                    <li className='sidebar-menu-item'>
                        <i class="far fa-user"></i>
                        <span className='sidebar-text'>Settings</span>
                    </li>
                    </Link>
                </ul>
            </div>
        </div>
        </Router>
    )
}


const MyComponent = () => {
    const { width } = useViewport();
    const breakpoint = 620;
  
    return width < breakpoint ? <MobileComponent /> : <DesktopComponent />;
};

export default function Sidebar(){
    return (
        <ViewportProvider>
          <MyComponent />
        </ViewportProvider>
    );
}