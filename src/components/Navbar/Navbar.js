import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "./navbar.css";
import Sidebar from '../sidebar/Sidebar';

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
    const myFunction = () => {
        var x = document.getElementById("myLinks");
        if (x.style.display === "block") {
            x.style.display = "none";
        } else {
            x.style.display = "block";
        }
    }
    return (
        <div>
            <div class="mobile-container">
                <div class="topnav">
                    <a href="#home" class="active">Logo</a>
                    <div id="myLinks">
                        <a href="#news">News</a>
                        <a href="#contact">Contact</a>
                        <a href="#about">About</a>
                    </div>
                    <a href="javascript:void(0);" class="icon" onclick={myFunction}>
                        <i class="fa fa-bars"></i>
                    </a>
                </div>
            </div>

        </div>
    );
};
// 

class DesktopComponent extends React.Component {
    constructor(props) {
        super(props);
        this.index = 0;
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


        await fetch(`https://credio-merchant.herokuapp.com/api/v1/auth/getProfile`,
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
        // var history = useNavigate();
        const { isLoaded, data, } = this.state;



        return (
            <div>
                <div className='top-navbar d-flex justify-content-between'>
                    <i class="fas fa-sliders-h nav-icon"></i>
                    <a class="navbar-brand">Your service </a>
                    <div class="input-group ">
                        <input className='search-here' type="text" placeholder='Search' />
                        {/* <i class="fas fa-search search-icon fa-sm" ></i> */}
                    </div>
                    <i class="fas fa-circle"></i>
                    <i class="far fa-bell"></i>
                    <span className='user-name'>{isLoaded ? data.message.businessName : ''}</span>
                </div>
            </div>
        )
    }
}

const MyComponent = () => {
    const { width } = useViewport();
    const breakpoint = 620;

    return width < breakpoint ? <MobileComponent /> : <DesktopComponent />;
};

export default function Navbar() {
    return (
        <ViewportProvider>
            <MyComponent />
        </ViewportProvider>
    );
}