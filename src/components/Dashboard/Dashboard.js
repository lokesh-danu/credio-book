import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./dashboard.css";
import Store from "../../image/Store.png";
import NavBar from "../Navbar/Navbar";
import SideBar from "../../components/sidebar/Sidebar";

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
        <div className='mobile-view-heading'>
          <span className='dashboard-heading-text'>Cash Flow</span>
        </div>
        <div className='container my-5 py-2'>
          <div className='mobile-cash-flow-card'>

          </div>
          <div className='current-cash-card my-3'>
            <div className='card-body' style={{ display: "flex", flexDirection: "column" }}>
              <span className='current-cash-amount'>$35000</span>
              <span className='current-cash-text my-3'>Current Cash Balance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

class DesktopComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isLoaded: false,
    };
  }


  async componentDidMount() {
    console.log("Dashboard is mounted");
    console.log(`${sessionStorage.getItem("tokenManager")}`)
    let data = JSON.parse(sessionStorage.getItem("tokenManager"))
    console.log(`data ----- ${data}`)
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${data.token.token}`,

      },
      // mode: 'no-cors',
      // redirect: "follow",
    };


    await fetch(`https://credio-merchant.herokuapp.com/api/v1/credio_store/overview`,
      requestOptions)
      .then(results => results.json()).then((transfer) => {
        // let over = overview.json();
        console.log(transfer);


        this.setState({
          data: transfer,
          isLoaded: true,
        });


      }).catch((err) => {
        console.log(err);
      });
  }
  render() {
    const { isLoaded, data, } = this.state;
    return (
      <div>
        <NavBar></NavBar>
        <SideBar ></SideBar>
        <div className='display-page'>

          {!isLoaded ? (
            <div class="container h-100">
              <div class="row h-100 justify-content-center align-items-center">

                <FontAwesomeIcon
                  className="spinner mt-6 mb-4"
                  size="6x"
                  icon={faSpinner}
                ></FontAwesomeIcon>

              </div>
            </div>

          ) : (
            <div >
              <div className='dashboard-navbar'>
                <i class="fas fa-circle dash-icon"></i>
                <a href="" className='dashboard-nav'>Your service</a>
                <button className='btn btn-danger'>Make Payment</button>
              </div >

              <div className='row p-3' >
                <div className='col-md-8'>
                  <div className='card transaction-card'>
                    <div className='card-body'>
                      <h5 className='card-title'>Cash Flow</h5>
                      <ul>
                        {

                        }
                        <a href="#" className='more'>More...</a>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-md-4'>
                  <div className='card transaction-card'>
                    <div className='card-body'>
                      <h5 className='card-title'>Transactions</h5>
                      <ul>
                        {
                          data.data.transaction.map((deposit, index) => {

                            < li className={index == 0 ? '' : 'my-3'
                            } >
                              <div className='card stores-card'>
                                <div className='card-body'>
                                  <div className='store-info'>
                                    <img className='store-dp' src={Store} />
                                    <div className='store-infos'>
                                      <span className='store-name'>Tony T store</span>
                                      <span className='store-balance'>$12435.65</span>
                                    </div>
                                  </div>
                                  <hr />
                                  <div className='row' style={{ marginTop: "-0.5rem" }}>
                                    <div className='col-md-6 column-store'>
                                      <span className='deposit-text'>Deposit</span>
                                      <span className='deposit-text'>New Balance</span>
                                    </div>
                                    <div className='col-md-6 column-store'>
                                      <span className='balance'>-$5000.65</span>
                                      <span className='balance'>$900.65</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>

                          })
                        }
                        <a href="#" className='more'>More...</a>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row p-3'>
                <div className='col-md-3'>
                  <div className='card deposit-card'>
                    <div className='card-body'>
                      <h5 className='card-title'>Deposit</h5>
                      <ul>
                        {
                          data.data.deposit.map((deposit, index) => {

                            < li className={index == 0 ? '' : 'my-3'
                            } >
                              <div className='card stores-card'>
                                <div className='card-body'>
                                  <div className='store-info'>
                                    <img className='store-dp' src={Store} />
                                    <div className='store-infos'>
                                      <span className='store-name'>Tony T store</span>
                                      <span className='store-balance'>$12435.65</span>
                                    </div>
                                  </div>
                                  <hr />
                                  <div className='row' style={{ marginTop: "-0.5rem" }}>
                                    <div className='col-md-6 column-store'>
                                      <span className='deposit-text'>Deposit</span>
                                      <span className='deposit-text'>New Balance</span>
                                    </div>
                                    <div className='col-md-6 column-store'>
                                      <span className='balance'>-$5000.65</span>
                                      <span className='balance'>$900.65</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>

                          })
                        }

                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='card withdraw-card'>
                    <div className='card-body'>
                      <h5 className='card-title'>Withdraw</h5>
                      <ul>
                        {
                          data.data.withdrawal.map((deposit, index) => {

                            < li className={index == 0 ? '' : 'my-3'
                            } >
                              <div className='card stores-card'>
                                <div className='card-body'>
                                  <div className='store-info'>
                                    <img className='store-dp' src={Store} />
                                    <div className='store-infos'>
                                      <span className='store-name'>Tony T store</span>
                                      <span className='store-balance'>$12435.65</span>
                                    </div>
                                  </div>
                                  <hr />
                                  <div className='row' style={{ marginTop: "-0.5rem" }}>
                                    <div className='col-md-6 column-store'>
                                      <span className='deposit-text'>Deposit</span>
                                      <span className='deposit-text'>New Balance</span>
                                    </div>
                                    <div className='col-md-6 column-store'>
                                      <span className='balance'>-$5000.65</span>
                                      <span className='balance'>$900.65</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>

                          })
                        }
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='card advance-card'>
                    <div className='card-body'>
                      <h5 className='card-title'>Advance</h5>
                      <ul>
                        {
                          data.data.advance.map((deposit, index) => {

                            < li className={index == 0 ? '' : 'my-3'
                            } >
                              <div className='card stores-card'>
                                <div className='card-body'>
                                  <div className='store-info'>
                                    <img className='store-dp' src={Store} />
                                    <div className='store-infos'>
                                      <span className='store-name'>Tony T store</span>
                                      <span className='store-balance'>$12435.65</span>
                                    </div>
                                  </div>
                                  <hr />
                                  <div className='row' style={{ marginTop: "-0.5rem" }}>
                                    <div className='col-md-6 column-store'>
                                      <span className='deposit-text'>Deposit</span>
                                      <span className='deposit-text'>New Balance</span>
                                    </div>
                                    <div className='col-md-6 column-store'>
                                      <span className='balance'>-$5000.65</span>
                                      <span className='balance'>$900.65</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>

                          })
                        }
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='card user-card'>
                    <div className='card-body'>
                      <h5 className='card-title'>User</h5>
                      <ul>
                        {
                          data.data.user.map((deposit, index) => {

                            < li className={index == 0 ? '' : 'my-3'
                            } >
                              <div className='card stores-card'>
                                <div className='card-body'>
                                  <div className='store-info'>
                                    <img className='store-dp' src={Store} />
                                    <div className='store-infos'>
                                      <span className='store-name'>Tony T store</span>
                                      <span className='store-balance'>$12435.65</span>
                                    </div>
                                  </div>
                                  <hr />
                                  <div className='row' style={{ marginTop: "-0.5rem" }}>
                                    <div className='col-md-6 column-store'>
                                      <span className='deposit-text'>Deposit</span>
                                      <span className='deposit-text'>New Balance</span>
                                    </div>
                                    <div className='col-md-6 column-store'>
                                      <span className='balance'>-$5000.65</span>
                                      <span className='balance'>$900.65</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>

                          })
                        }
                      </ul>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          )}
        </div>
      </div >
    )
  }

}


const MyComponent = () => {
  const { width } = useViewport();
  const breakpoint = 620;

  return width < breakpoint ? <MobileComponent /> : <DesktopComponent />;
};

export default function Dashboard() {
  return (
    <ViewportProvider>
      <MyComponent />
    </ViewportProvider>
  );
}

