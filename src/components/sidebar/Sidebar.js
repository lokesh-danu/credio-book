import React, { Component } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./sidebar.css";
import Modal from '../modal/Modal';
import Logo from "../../image/Logo.png";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Transaction from "../transaction/Transaction";
import Dashboard from "../Dashboard/Dashboard";
import User from "../../image/user.png"
import Trans from "../../image/Trans.png"
import Dash from "../../image/Dash.png";
import Set from "../../image/Set.png";
import Setting from '../setting/Setting';

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

const MobileComponent = (props) => {
    const index=props.index;
    return (
        < div >
            <div  className="sidebar-cnt-mobile" >
                <div className={index == 'dashboard' ? 'sidebar-active-mobile sidebar-item-mobile' : 'sidebar-item-mobile'}>
                    <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                        <div >
                            <img src={Dash} alt="" />
                            <span >Dashboard</span>
                        </div>
                    </Link>
                </div>
                <div className={index == 'transactions' ? 'sidebar-active-mobile sidebar-item-mobile' : 'sidebar-item-mobile'}>
                    <Link to="/transactions" style={{ textDecoration: 'none' }}>
                        <div >
                            <img src={Trans} alt="" />
                            <span >Transactions</span>
                        </div>
                    </Link>
                </div>
                <div className={index == 'settings' ? 'sidebar-active-mobile sidebar-item-mobile' : 'sidebar-item-mobile'}>
                    <Link to="/settings"
                    //  onClick={this.showModal} 
                     style={{ textDecoration: 'none' }}>
                        <div >
                            <img src={Set} alt="" />
                            <span >Settings</span>
                        </div>
                    </Link>
                </div>
            </div>
        </div >

    )
}

class DesktopComponent extends Component {
    constructor() {
        super();
        this.state = {
            show: false
        };
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal = () => {
        this.setState({ show: true });
    };

    hideModal = () => {
        this.setState({ show: false });
    };

    render() {
        return (

            <div >
                <Modal show={this.state.show} handleClose={this.hideModal}>
                    <Setting ></Setting>
                </Modal>
                <div className='sidebar'>
                    <div className='sidebar-brand'>
                        <img src={Logo} className='brand-logo' alt="" />
                        <span className='brand-name'>Credio Books</span>
                    </div>
                    <Link to="/new/user" style={{ textDecoration: 'none' }} > <div className={this.props.index == 'create' ? ' active-create create-user' : 'create-user'}>
                        <span className={'create-user-text  d-flex justify-content-center'}>+ Create Users</span>
                    </div> </Link>
                    <ul className='sidebar-menu-items pt-4'>
                        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                            <li className={this.props.index == 'dashboard' ? 'sidebar-menu-item active' : 'sidebar-menu-item'}>
                                <img src={Dash} alt="" />
                                <span className='sidebar-text'>Dashboard</span>
                            </li>
                        </Link>
                        <Link to="/transactions" style={{ textDecoration: 'none' }}>
                            <li className={this.props.index == 'transactions' ? 'sidebar-menu-item active' : 'sidebar-menu-item'}>

                                <img src={Trans} alt="" />
                                <span className='sidebar-text'>Transactions</span>
                            </li>
                        </Link>
                        <Link to="/users" style={{ textDecoration: 'none' }}>
                            <li className={this.props.index == 'users' ? 'sidebar-menu-item active' : 'sidebar-menu-item'}>
                                <img src={User} alt="" />
                                <span className='sidebar-text'>All users</span>
                            </li>
                        </Link>

                        <Link to="#" onClick={this.showModal} style={{ textDecoration: 'none' }}>
                            <li className={this.props.index == 'settings' ? 'sidebar-menu-item active' : 'sidebar-menu-item'}>
                                <img src={Set} alt="" />
                                <span className='sidebar-text'>Settings</span>
                            </li>
                        </Link>
                    </ul>
                </div >
            </div >
            // </Router>
        )
    }
}


const MyComponent = ({ index }) => {
    const { width } = useViewport();
    const breakpoint = 620;

    return width < breakpoint ? <MobileComponent index={index}/> : <DesktopComponent index={index} />;
};

export default function Sidebar({ index }) {
    return (
        <ViewportProvider>
            <MyComponent index={index} />
        </ViewportProvider>
    );
}