import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Bottom.css";
import Store from "../../image/Store.png";

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
          <div className='down-navbar'>
              <div className="container">
                  <div style={{display: "flex", flexDirection: "row"}}>
                        <div className='col-sm'>
                            <div className='down-card' style={{display: "flex", flexDirection: "column"}}>
                                <i class="fas fa-user my-1 mx-4"></i>
                                <span className='down-text my-2'>Dashboard</span>
                            </div>
                        </div>
                        <div className='col-sm mx-3'>
                            <div className='down-card' style={{display: "flex", flexDirection: "column"}}>
                                <i class="fas fa-user my-1 mx-4"></i>
                                <span className='down-text my-2'>Transaction</span>
                            </div>
                        </div>
                        <div className='col-sm mx-3'>
                            <div className='down-card' style={{display: "flex", flexDirection: "column"}}>
                                <i class="fas fa-user my-1 mx-4"></i>
                                <span className='down-text my-2'>Setting</span>
                            </div>
                        </div>
                  </div>
              </div>
          </div>
        </div>
    )
}

const DesktopComponent = () => {
    return(
        <></>
    )
}


const MyComponent = () => {
    const { width } = useViewport();
    const breakpoint = 620;
  
    return width < breakpoint ? <MobileComponent /> : <DesktopComponent />;
};

export default function Bottom(){
    return (
        <ViewportProvider>
          <MyComponent />
        </ViewportProvider>
    );
}