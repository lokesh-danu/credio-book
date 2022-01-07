import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./sidebar.css";
import Logo from "../../image/Logo.png";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Transaction from "../transaction/Transaction";
import Dashboard from "../Dashboard/Dashboard";
import User from "../../image/user.png"
import Trans from "../../image/Trans.png"
import Dash from "../../image/Dash.png";
import Set from "../../image/Set.png";

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
    return (

        < div >

        </div >

    )
}

const DesktopComponent = () => {
    return (
        <div>
            <div className='sidebar'>
                <div className='sidebar-brand'>
                    <img src={Logo} className='brand-logo' alt="" />
                    <span className='brand-name'>Credio Books</span>
                </div>
                <Link to="/new/user"> <div className='create-user'>
                    <span className='create-user-text'>+ Create Users</span>
                </div> </Link>
                <ul className='sidebar-menu-items'>
                    <Link to="/dashboard">
                        <li className='sidebar-menu-item'>
                            <img src={Dash} alt="" />
                            <span className='sidebar-text'>Dashboard</span>
                        </li>
                    </Link>
                    <Link to="/transactions">
                        <li className='sidebar-menu-item'>

                            <img src={Trans} alt="" />
                            <span className='sidebar-text'>Transactions</span>
                        </li>
                    </Link>
                    <Link to="/users">
                        <li className='sidebar-menu-item'>
                            <img src={User} alt="" />
                            <span className='sidebar-text'>All users</span>
                        </li>
                    </Link>

                    <Link to="/settings">
                        <li className='sidebar-menu-item'>
                            <img src={Set} alt="" />
                            <span className='sidebar-text'>Settings</span>
                        </li>
                    </Link>
                </ul>
            </div>
        </div>
        // </Router>
    )
}


const MyComponent = () => {
    const { width } = useViewport();
    const breakpoint = 620;

    return width < breakpoint ? <MobileComponent /> : <DesktopComponent />;
};

export default function Sidebar() {
    return (
        <ViewportProvider>
            <MyComponent />
        </ViewportProvider>
    );
}