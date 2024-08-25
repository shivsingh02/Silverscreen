import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/fonts/fonts.css"; // Import your fonts CSS file

function Login(props) {
  const navigate = useNavigate();
  const [logStat, setlogStat] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("user");
  const [confirmPassword, setConfirmPassword] = useState("");

  const baseUrl = import.meta.env.PROD ? "" : "http://localhost:8080";

  async function submitLogin(e) {
    e.preventDefault();
    try {
      await axios
        .post(`${baseUrl}/api/auth/signin`, {
          username,
          password,
        })
        .then((res) => {
          console.log(res.status);
          if (res.status === 200) {
            console.log("Login successful");
            props.notifysuccess("Login successful");
            // localStorage.setItem("accessToken", res.data.accessToken);
            // localStorage.setItem("username", res.data.username);
            localStorage.setItem("isLoggedIn", "true");
            navigate("/home");
          }
        })
        .catch((e) => {
          if (e.response.status === 401) {
            props.notifyerror("Incorrect Password");
          } else if (e.response.status === 404) {
            props.notifyerror("User does not exist");
          }
          //   else if (e.response.status === 400) {
          //     props.notifyerror("Incomplete details provided.");
          //   }
          else {
            props.notifyerror("Something went wrong during login.");
            console.error("Error during login:", e);
          }
        });
    } catch (e) {
      props.notifyerror("Something went wrong during login.");
      console.error("Error during login:", e);
    }
  }

  // signup submit
  async function singnupsubmit(e) {
    e.preventDefault();
    try {
      await axios
        .post("${baseUrl}/api/auth/signup", {
          username,
          email,
          role,
          password,
        })
        .then((res) => {
          if (res.status === 200) {
            props.notifysuccess("Signup successful");
            // localStorage.setItem("authToken", res.data.authToken);
            // localStorage.setItem("userType", res.data.userType);
            localStorage.setItem("isLoggedIn", "true");
            // props.setOpenModal();
            // props.setLogstat();
            navigate("/home");
          } else {
            console.log(res);
          }
        })
        .catch((e) => {
          if (e.response.status === 409) {
            // props.notifyerror(
            //   "User already exists with this User Id or Vehicle Id."
            // );
          } else if (e.response.status === 400) {
            props.notifyerror(e.response.data.message);
          } else {
            props.notifyerror("Something went wrong during signup.");
            console.error("Error during signup:", e);
          }
        });
    } catch (e) {
      props.notifyerror("Something went wrong during signup.");
      console.error("Error during signup:", e);
    }
  }
  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center bg-opacity-50"
      style={{
        backgroundImage:
          "url('https://assets.nflxext.com/ffe/siteui/vlv3/9d3533b2-0e2b-40b2-95e0-ecd7979cc88b/a3873901-5b7c-46eb-b9fa-12fea5197bd3/IN-en-20240311-popsignuptwoweeks-perspective_alpha_website_small.jpg')",
      }}
    >
      {logStat && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-4/5 flex justify-between items-center opacity-90">
          <div className="flex-1 mr-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              Welcome back
            </h1>
            {/* Increased font size to 4xl */}
            <p className="text-lg text-gray-600 mb-4">
              Log in to continue
            </p>{" "}
            {/* Increased font size to lg */}
            <p className="text-lg text-gray-600 mb-2">
              New to SilverScreen?{" "}
              <a
                className="text-blue-500 font-semibold"
                onClick={() => {
                  setlogStat(false);
                }}
                style={{ cursor: "pointer" }}
              >
                Sign up now.
              </a>
            </p>{" "}
            {/* Increased font size to lg */}
          </div>
          <div className="w-80">
            <form className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button
                type="submit"
                className="py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
                onClick={submitLogin}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
      {!logStat && (
        <div className="bg-white p-8 rounded-lg shadow-lg w-4/5 flex justify-between items-center opacity-90">
          <div className="flex-1 mr-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">New Here</h1>{" "}
            {/* Increased font size to text-4xl */}
            <p className="text-lg text-gray-600 mb-4">
              Sign up to continue
            </p>{" "}
            {/* Increased font size to text-lg */}
            <p className="text-lg text-gray-600 mb-2">
              Already registered to SilverScreen?{" "}
              <a
                className="text-blue-500 font-semibold"
                onClick={() => {
                  setlogStat(true);
                }}
                style={{ cursor: "pointer" }}
              >
                Login now.
              </a>
            </p>{" "}
            {/* Increased font size to text-lg */}
          </div>
          <div className="w-80">
            <form action="POST" className="flex flex-col space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email id"
                className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
              />
              <button
                type="submit"
                className="py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-500"
                onClick={singnupsubmit}
              >
                Signup
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;
