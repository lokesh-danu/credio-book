import React, { useState, useMemo } from "react";
import "./Login.css";
import logo3 from "../../image/Logo.png";
import svg1 from "../../image/Hi.svg";
import countryList from "../countries.json";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

import { JSEncrypt } from "jsencrypt";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import consts from "../keys/const";
//require('dotenv-webpack').config()
// const Dotenv = require('dotenv-webpack');


const Login = () => {
  let newDate = new Date();
  let year = newDate.getFullYear();
  const [country, setCountry] = useState({
    "label": "Nigeria",
    "value": "+234",
    "code": "NG"
  });
  const [number, setNumber] = useState(null);
  const [password, setPassword] = useState(null);
  const [data, setData] = useState([]);
  const [errorState, setError] = useState([false, ""]);
  const [loading, setLoading] = useState(false);
  const options = useMemo(() => countryList, []);
  const history = useNavigate();

  const handleCountry = (value) => {
    console.log(value);
    setCountry(value);
  };
  const handleNumber = (e) => {
    const value = e.target.value;
    console.log(value);
    setNumber(value);
  };
  const handlePassword = (e) => {
    // console.log(process.env.REACT_APP_PUB_KEY);
    const value = e.target.value;
    var encrypt = new JSEncrypt();
    encrypt.setPublicKey(`${consts.pub_key}`);
    var encrypted = encrypt.encrypt(value);

    console.log(`encrypted   - ${encrypted}`);
    setPassword(encrypted);
  };
  const handleSignUp = async () => {
    //post the login creds
    try {
      console.log(`${country["value"]}${number}`);

      setLoading(true);
      setError([false, ""]);
      const raw = {
        phoneNumber: `${country["value"]}${number}`,
        password: password,
      };
      console.log(`${raw}`);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(raw),
        redirect: "follow",
      };

      let response = await fetch(
        `https://credio-merchant.herokuapp.com/api/v1/auth/login`,
        requestOptions
      );

      if (response.status === 200) {
        setData([country, number, password]);
        let message = await response.json();
        console.log(message);
        sessionStorage.setItem("tokenManager", JSON.stringify(message));
        console.log(`ehn you save ??  --- ${sessionStorage.getItem("tokenManager")}`);
        history(`/dashboard`);
      } else {
        setLoading(false);
        let message = await response.json();
        console.log(message);
        setError([true, message['message'] || "Something went wrong"]);

      }

    } catch (e) {
      setLoading(false);
      setError([true, e.message || "Something went wrong"]);
    }

    // setData([country, number, password]);
    // console.log(data);
    // history.push(`/dashboard`);
  };
  return (

    < div >
      <div className="container-fluid px-1 px-sm-5 px-md-5 px-lg-1 px-xl-5 py-5 mx-auto">
        <div className="card card0 border-0">
          <div className="row d-flex">
            <div className="col-lg-6 col-sm-5">
              <div className="card1 pb-5">
                <div className="row">
                  {" "}
                  <img src={logo3} className="credLogo" />{" "}
                </div>
                <div className="row px-3 justify-content-center mt-4 mb-5 border-line">
                  {" "}
                  <img src={svg1} className="image" />{" "}
                </div>
              </div>
            </div>
            <div className="col-lg-6 col-sm-7 d-flex align-items-center">
              <div className="card2 card border-0 px-4 py-5">
                {(errorState[0]) ?
                  <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    {errorState[1]}

                  </div> : <div></div>
                }
                <div className="row px-1">
                  {" "}
                  <label className="mb-1 ms-2">
                    <h6 className="mb-0 text-sm">Select Your Country</h6>
                  </label>{" "}

                  <Select
                    className="mb-4"
                    options={options}
                    value={country}
                    onChange={handleCountry}
                  />{" "}
                </div>
                <div className="row px-3">
                  {" "}
                  <label className="mb-1">
                    <h6 className="mb-0 text-sm">Phone Number</h6>
                  </label>{" "}
                  <input
                    className="mb-4 border"
                    type="text"
                    maxLength="10"
                    name="email"
                    placeholder="Enter Your Phone Number"
                    onBlur={handleNumber}
                  />{" "}
                </div>
                <div className="row px-3">
                  {" "}
                  <label className="mb-1">
                    <h6 className="mb-0 text-sm">Password</h6>
                  </label>{" "}
                  <input
                    className="border"
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    onBlur={handlePassword}
                  />{" "}
                </div>
                <div className="row px-3 mb-4">
                  <a href="#" className="ml-auto mb-0 text-sm">
                    Forgot Password?
                  </a>
                </div>
                <div className="row mb-3 px-3">
                  <button
                    type="submit"
                    style={{ backgroundColor: "#982C31" }}
                    className="btn btn-blue text-white text-center"
                    onClick={handleSignUp}
                    disabled={loading}
                  >
                    {loading ? (
                      <FontAwesomeIcon
                        className="spinner"
                        icon={faSpinner}
                      ></FontAwesomeIcon>
                    ) : (
                      <span>Login</span>
                    )}
                  </button>
                </div>
                <div className="row mb-4 px-3">
                  {" "}
                  <small className="font-weight-bold">
                    Don't have an account?{" "}
                    <a className="text-danger ">Register</a>
                  </small>{" "}
                </div>
              </div>
            </div>
          </div>
          <div
            style={{ backgroundColor: "#982C31" }}
            className="text-white py-4"
          >
            <div className="row px-3">
              {" "}
              <small className="ml-4 ml-sm-5 mb-2">
                Copyright &copy; {year}. All rights reserved.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Login;