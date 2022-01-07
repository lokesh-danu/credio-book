import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./create.css";
import Store from "../../image/Store.png";
import NavBar from "../Navbar/Navbar";
import SideBar from "../../components/sidebar/Sidebar";


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
            <div className='mobile-display'>
                <div className="users mx-3">
                    <div className="users-card my-3">
                        <div className='card-body'>
                            <div className='store-info' style={{ marginTop: "0rem" }}>
                                <img className='store-dp' src={Store} />
                                <div className='store-infos' style={{ marginLeft: "1rem" }}>
                                    <span className='store-name'>Tony T store</span>
                                    <span style={{ color: "#707070", fontSize: "16px", fontWeight: "normal" }} className='store-balance'>+1 (212) 336-1440</span>
                                </div>
                            </div>
                            <hr />
                            <div className="user-bank-detail">
                                <span className="bank-heading">Bank Details</span>
                                <div className="user-bank-name my-2">
                                    <i class="fas fa-university"></i>
                                    <span className="bank-name">021000322 – Bank of America</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="users-card my-3">
                        <div className='card-body'>
                            <div className='store-info' style={{ marginTop: "0rem" }}>
                                <img className='store-dp' src={Store} />
                                <div className='store-infos' style={{ marginLeft: "1rem" }}>
                                    <span className='store-name'>Tony T store</span>
                                    <span style={{ color: "#707070", fontSize: "16px", fontWeight: "normal" }} className='store-balance'>+1 (212) 336-1440</span>
                                </div>
                            </div>
                            <hr />
                            <div className="user-bank-detail">
                                <span className="bank-heading">Bank Details</span>
                                <div className="user-bank-name my-2">
                                    <i class="fas fa-university"></i>
                                    <span className="bank-name">021000322 – Bank of America</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button className="btn make-payment mx-3 my-4">Create User</button>
                </div>


                <div className="create-user-form" style={{ visibility: "hidden" }}>
                    <div className='mobile-view-heading'>
                        <span className='business-detail-heading'>Business detail</span>
                    </div>
                    <div className='container my-5'>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Business Name</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" />
                        </div>
                        <div class="form-group my-3">
                            <label for="exampleInputPassword1">Phone Number</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" />
                        </div>
                        <div class="form-group my-3">
                            <label for="exampleInputPassword1">Address</label>
                            <input style={{ height: "100px" }} type="password" class="form-control" id="exampleInputPassword1" />
                        </div>
                        <div class="form-group my-3">
                            <label for="exampleInputPassword1">Business Type</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" />
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Add Business Logo</label>
                            <input type="text" className='file-upload-mobile' placeholder='Add a Business Logo' />
                        </div>
                        <button className='submit-button mb-3 my-3 mx-2'>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const DesktopComponent = () => {
    return (
        <div>
            <NavBar></NavBar>
            <SideBar ></SideBar>

            <div className='display-page'>
                <div className='dashboard-navbar'>
                    <a style={{ marginLeft: "-2.5rem", fontWeight: "700" }} className='dashboard-nav'>Create New Users</a>
                    <button className='btn btn-danger'>Submit</button>
                </div>
                <div className='card create-user-card'>
                    <ul className='business-detail'>
                        <h3>Business details</h3>
                        <li className='mx-3 business-details'>
                            <span className='business-text'>Business Name</span>
                            <span className='colon'>:</span>
                            <input type="text" className='mx-3 business-input' />
                        </li>
                        <li className='mx-3 my-3 business-details'>
                            <span className='business-text'>Phone Number</span>
                            <span className='colon'>:</span>
                            <input type="text" className='mx-3 business-input' />
                        </li>
                        <li className='mx-3 my-3 business-details'>
                            <span className='business-text'>Address</span>
                            <span className='colon'>:</span>
                            <input type="text" className='mx-3 business-input' />
                        </li>
                        <li className='mx-3 my-5 business-details'>
                            <span className='business-text'>Business Type</span>
                            <span className='colon'>:</span>
                            <input type="text" className='mx-3 business-input' />
                        </li>
                    </ul>
                    <ul className='bank-detail'>
                        <h3>Bank details</h3>
                        <li className='mx-3 business-details'>
                            <span className='business-text'>Account Holder Name</span>
                            <span className='colon'>:</span>
                            <input type="text" className='mx-3 business-input' />
                        </li>
                        <li className='mx-3 my-3 business-details'>
                            <span className='business-text'>Account Number</span>
                            <span className='colon'>:</span>
                            <input type="text" className='mx-3 business-input' />
                        </li>
                        <li className='mx-3 my-3 business-details'>
                            <span className='business-text'>Confirm Account Number</span>
                            <span className='colon'>:</span>
                            <input type="text" className='mx-3 business-input' />
                        </li>
                        <li className='mx-3 my-3 business-details'>
                            <span className='business-text'>Branch</span>
                            <span className='colon'>:</span>
                            <input type="text" className='mx-3 business-input' />
                        </li>
                        <span className='my-4 verification'>To verify your Account we'll send you two tiny deposit within 1-2 days</span>
                    </ul>
                    <input type="text" className='file-upload' placeholder='Add a Business Logo' />
                </div>

            </div>
        </div>
    )
}


const MyComponent = () => {
    const { width } = useViewport();
    const breakpoint = 620;

    return width < breakpoint ? <MobileComponent /> : <DesktopComponent />;
};

export default function Create() {
    return (
        <ViewportProvider>
            <MyComponent />
        </ViewportProvider>
    );
}