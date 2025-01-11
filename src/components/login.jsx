import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginImg from "../Assets/login.svg";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState("");

  const usernameChange = (event) => {
    setUsername(event.target.value);
  };

  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  const loginClick = async () => {
    if (username === "" || password === "") {
      window.alert("No Field can be empty");
      return;
    }
    const requestBody = JSON.stringify({ username, password });
    try {
      const response = await fetch("http://localhost:4000/api/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: requestBody,
      });
      const { token } = await response.json();
      localStorage.setItem("user", token);
      window.location.href = "/in";
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section
        className="justify-content-start row m-0"
        style={{
          height: "100vh",
          width: "100%",
          background: "rgb(34, 33, 35)",
        }}
      >
        <div
          className="col-md-6 p-4 text-light d-flex align-items-center justify-content-center"
          style={{ backgroundColor: "#040C18" }}
        >
          <div className="col-md-7">
            <div className="col d-flex flex-column align-items-start">
              <div className="mb-3">
                <h1 className="fw-bold">Login</h1>
                <p>Get Started with demo cash and start your trading journey</p>
              </div>

              <div className="input-container pb-1">
                <input
                  type="text"
                  className={`form-control ${
                    focused === "username" ? "focused" : ""
                  }`}
                  id="username"
                  placeholder="Enter Your Username"
                  onChange={usernameChange}
                  onFocus={() => setFocused("username")}
                  onBlur={() => setFocused("")}
                  value={username}
                />
                <label htmlFor="username">Username</label>
              </div>

              <div className="input-container pb-1">
                <input
                  type="password"
                  className={`form-control ${
                    focused === "password" ? "focused" : ""
                  }`}
                  id="password"
                  placeholder="Enter Your Password"
                  onChange={passwordChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  value={password}
                />
                <label htmlFor="password">Password</label>
              </div>
              <div className="row w-100 justify-content-center">
              <p style={{ fontSize: "1.5rem", color: "#ccc", fontWeight: "bold", fontStyle: "italic" }}>
                  Not Registered Yet?{" "}
                  <Link to="/register" style={{ color: "#F49867", fontWeight: "bold" }}>
                    Create an account
                  </Link>
                </p>
              </div>
              <div className="row w-100 justify-content-start mt-4 mb-3 mx-0">
                <div
                  className="btn my-1 p-2 rounded-pill"
                  onClick={loginClick}
                  style={{
                    backgroundColor: "#F49867",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    width: "11rem",
                  }}
                >
                  Login
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-md-6 p-4 d-flex align-items-center justify-content-center"
          style={{
            background:
              "linear-gradient(89.97deg, #040c18 1.84%, #F49867 102.67%)",
          }}
        >
          <img src={LoginImg} alt="Login Illustration" />
        </div>
      </section>
    </>
  );
}

export default Login;
