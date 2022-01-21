import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Setting.css";
import Store from "../../image/Store.png";
import Navbar from '../Navbar/Navbar';

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
        <div>
            <Navbar navIndex={"Credio services"}></Navbar>
            <div className='mobile-display' style={{ background: "White" }}>
                <ul className='setting-items my-3'>
                    <span className='setting-item-heading my-2'>Customers</span>
                    <li className='setting-items my-2'>
                        <span className='setting-item-text'>Account and settings</span>
                    </li>
                    <li className='setting-items my-2'>
                        <span className='setting-item-text'>Manage users</span>
                    </li>
                    <li className='setting-items my-2'>
                        <span className='setting-item-text'>custom form styles</span>
                    </li>
                    <li className='setting-items my-2'>
                        <span className='setting-item-text'>charts of accounts</span>
                    </li>
                    <li className='setting-items my-2'>
                        <span className='setting-item-text'>Credio labs</span>
                    </li>
                </ul>
                <hr />
                <ul className='setting-items my-3'>
                    <span className='setting-item-heading my-2'>Vendors</span>
                    <li className='setting-items my-2'>
                        <span className='setting-item-text'>All Lists</span>
                    </li>
                    <li className='setting-items my-2'>
                        <span className='setting-item-text'>Product and services</span>
                    </li>
                    <li className='setting-items my-2'>
                        <span className='setting-item-text'>Recurring Transaction</span>
                    </li>
                    <li className='setting-items my-2'>
                        <span className='setting-item-text'>Attachment</span>
                    </li>
                </ul>
                <hr />
                <ul className='setting-items my-3'>
                    <span className='setting-item-heading my-2'>Employee</span>
                    <li className='setting-items my-2'>
                        <span className='setting-item-text'>Order check</span>
                    </li>
                    <li className='setting-items my-2'>
                        <span className='setting-item-text'>Manage users</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

const DesktopComponent = () => {
    return (
        <></>
    )
}


const MyComponent = () => {
    const { width } = useViewport();
    const breakpoint = 620;

    return width < breakpoint ? <MobileComponent /> : <DesktopComponent />;
};

export default function Setting() {
    return (
        <MobileComponent />
    );
}