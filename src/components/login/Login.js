import React, { useState, useMemo } from "react";
import "./Login.css";
import logo3 from "../../image/Logo.png";
import svg1 from "../../image/Hi.svg";
import countryList from "react-select-country-list";
import Select from "react-select";
import { Link } from "react-router-dom";

const Login = () => {
  let newDate = new Date();
  let year = newDate.getFullYear();
  const [value, setValue] = useState("");
  const options = useMemo(() => countryList().getData(), []);

  const changeHandler = (value) => {
    setValue(value);
  };
  return (
    <div>
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
                <div className="row px-1">
                  {" "}
                  <label className="mb-1 ms-2">
                    <h6 className="mb-0 text-sm">Select Your Country</h6>
                  </label>{" "}
                  <Select
                    className="mb-4"
                    options={options}
                    value={value}
                    onChange={changeHandler}
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
                    name="email"
                    placeholder="Enter Your Phone Number"
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
                  />{" "}
                </div>
                <div className="row px-3 mb-4">
                  <a href="#" className="ml-auto mb-0 text-sm">
                    Forgot Password?
                  </a>
                </div>
                <div className="row mb-3 px-3">
                  {" "}
                  
                    <button
                      type="submit"
                      style={{ backgroundColor: "#982C31" }}
                      className="btn btn-blue text-white text-center"
                    >
                      Login
                    </button>
                    {" "}
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
    </div>
  );
};

export default Login;