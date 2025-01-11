import React, { useState } from "react";
import SignupImg from "../Assets/signup.svg";
import { Link } from "react-router-dom";

function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focused, setFocused] = useState("");

  const emailChange = (event) => {
    setEmail(event.target.value);
  };

  const nameChange = (event) => {
    setName(event.target.value);
  };

  const usernameChange = (event) => {
    setUsername(event.target.value);
  };

  const passwordChange = (event) => {
    setPassword(event.target.value);
  };

  const confirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const registerClick = async () => {
    if (
      name === "" ||
      username === "" ||
      email === "" ||
      password === "" ||
      confirmPassword === ""
    ) {
      window.alert("No Field can be empty");
      return;
    }
    if (password !== confirmPassword) {
      window.alert("Password and Confirm Password don't match");
      setPassword("");
      setConfirmPassword("");
      return;
    }

    const requestBody = JSON.stringify({
      name,
      username,
      email,
      password,
    });

    try {
      const response = await fetch("http://localhost:4000/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      const data = await response.json();
      window.location.href = "login";
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
                <h1 className="fw-bold">Register</h1>
                <p>Get Started with demo cash and start your trading journey</p>
              </div>
              <div className="input-container pb-1">
                <input
                  type="text"
                  className={`form-control ${
                    focused === "name" ? "focused" : ""
                  }`}
                  id="name"
                  placeholder="Enter Your Name"
                  onChange={nameChange}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                  value={name}
                />
                <label htmlFor="name">Name</label>
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
                  type="email"
                  className={`form-control ${
                    focused === "email" ? "focused" : ""
                  }`}
                  id="email"
                  placeholder="Eg. abc@xyz.com"
                  onChange={emailChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  value={email}
                />
                <label htmlFor="email">Email Address</label>
              </div>

              <div className="input-container pb-1">
                <input
                  type="password"
                  className={`form-control ${
                    focused === "password" ? "focused" : ""
                  }`}
                  id="password"
                  placeholder="Set A Password"
                  onChange={passwordChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  value={password}
                />
                <label htmlFor="password">Password</label>
              </div>

              <div className="input-container pb-1">
                <input
                  type="password"
                  className={`form-control ${
                    focused === "confirmPassword" ? "focused" : ""
                  }`}
                  id="confirmPassword"
                  placeholder="Re-Enter The Password"
                  onChange={confirmPasswordChange}
                  onFocus={() => setFocused("confirmPassword")}
                  onBlur={() => setFocused("")}
                  value={confirmPassword}
                />
                <label htmlFor="confirmPassword">Confirm Password</label>
              </div>

              <div className="row w-100 justify-content-center">
                <p style={{ fontSize: "1.5rem", color: "#ccc", fontWeight: "bold", fontStyle: "italic" }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color: "#F49867", fontWeight: "bold" }}>
                    Login
                  </Link>
                </p>
              </div>
              <div className="row w-100 justify-content-start mt-4 mb-3 mx-0">
                <div
                  className="btn my-1 p-2 rounded-pill"
                  onClick={registerClick}
                  style={{
                    backgroundColor: "#F49867",
                    color: "black",
                    fontWeight: "bold",
                    fontSize: "1.5rem",
                    width: "11rem",
                  }}
                >
                  Sign Up
                </div>
              </div>

            </div>
          </div>
        </div>
        <div
          className="col-md-6  p-4"
          style={{
            background:
              "linear-gradient(89.97deg, #040c18 1.84%, #F49867 102.67%)",
          }}
        >
          <img src={SignupImg} alt="" />
        </div>
      </section>
    </>
  );
}

export default Register;
