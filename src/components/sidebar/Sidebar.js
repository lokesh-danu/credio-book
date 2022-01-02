import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./sidebar.css";
import Logo from "../../image/Logo.png";


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
                    <li className='sidebar-menu-item'>
                        <i class="far fa-user"></i>
                        <span className='sidebar-text'>Dashboard</span>
                    </li>
                    <li className='sidebar-menu-item'>
                        <i class="far fa-user"></i>
                        <span className='sidebar-text'>Transactions</span>
                    </li>
                    <li className='sidebar-menu-item'>
                        <i class="far fa-user"></i>
                        <span className='sidebar-text'>Users</span>
                    </li>
                    <li className='sidebar-menu-item'>
                        <i class="far fa-user"></i>
                        <span className='sidebar-text'>Settings</span>
                    </li>
                </ul>
            </div>
        </div>
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