import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthTokenHandler"; // Import the useAuth hook
import "./LoginPopup.css";
import toast, { Toaster } from "react-hot-toast";

function LoginPopup() {
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { login, setShowLogin, user } = useContext(AuthContext); // Access the login function from context

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url =
      currState === "Login"
        ? "http://localhost:5000/auth/login"
        : "http://localhost:5000/auth/registration";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message, {
          duration: 4000,
          style: {
            background: "white",
            border: "2px solidrgb(105, 236, 113)",
            color: "#6a41af",
            padding: "16px",
            borderRadius: "8px",
          },
        });
        login(result.data.accessToken);
        user(result.data.userInformation);
      } else {
        toast.error(result.message, {
          duration: 4000,
          style: {
            background: "white",
            border: "2px solidrgb(251, 111, 111)",
            color: "#6a41af",
            padding: "16px",
            borderRadius: "8px",
          },
        }); // Display error message if any
      }
    } catch (error) {
      console.error("Error:", error.message);
      alert("Something went wrong, please try again.");
    }
  };

  return (
    <div className="login-popup">
      <form className="login-popup-container" onSubmit={handleSubmit}>
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <h1 onClick={() => setShowLogin(false)} style={{ cursor: "pointer" }}>
            X
          </h1>
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              type="text"
              placeholder="Your name"
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>
        <div>
          <button type="submit">
            {currState === "Sign Up" ? "Create account" : "Login"}
          </button>
          <Toaster />
        </div>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By continuing, I agree to the terms of use & privacy policy.</p>
        </div>
        {currState === "Login" ? (
          <p>
            Create a new account?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span onClick={() => setCurrState("Login")}>Login here</span>
          </p>
        )}
      </form>
    </div>
  );
}

export default LoginPopup;
