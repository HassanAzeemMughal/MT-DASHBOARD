import { Col, Row } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../../redux/actions/authApis";
import { getReducer } from "../../redux/reducer";
import { useDispatch } from "react-redux";
import InputComponent from "../../components/InputComponent";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const setToken = getReducer("token");
  const setLoginData = getReducer("userInfo");
  const setLayout = getReducer("layout");

  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(""); // State for error message
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value })); // Update state based on input changes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    try {
      await authApi(
        dispatch,
        data,
        setToken,
        setLoginData,
        setLoader,
        navigate,
        setError // Pass error setter function
      );
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#141422] text-white">
      <Row className="flex items-center min-h-screen">
        {/* Left Section: Registration Form */}
        <Col xs={24} md={10} className="">
          <div className="mx-7">
            <h1 className="text-[20px] font-normal text-[#CCCCCC]">Login</h1>
            <p className="text-xs text-[#777777] mb-6">
              Lorem ipsum dolor sit amet, consectetur
            </p>

            {error && (
              <p className="text-red-500 text-sm bg-red-100 p-2 rounded mb-4">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <Row gutter={[20, 20]}>
                <Col span={12}>
                  <InputComponent
                    label="Email"
                    type={"text"}
                    name="email"
                    value={data.email}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col span={12}>
                  <InputComponent
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={handleInputChange}
                  />
                </Col>
              </Row>
              <div className="mt-6">
                <button
                  disabled={loader}
                  className="w-full p-3 btn-primary"
                  style={{
                    background:
                      "linear-gradient(225.2deg,#ffc700 .18%,#ff5c00 99.82%)",
                  }}
                >
                  {loader ? "Logging in..." : "Login"}
                </button>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/register")}
                  className="w-full p-3 btn-outline-green"
                  style={{
                    background: "rgb(52 152 0 / var(--tw-bg-opacity))",
                  }}
                >
                  Register Yourself
                </button>
              </div>
            </form>

            <div className="mt-9">
              <Link
                to="/forgot/password"
                className="flex items-center justify-center cursor-pointer bg-transparent text-[#349800] hover:text-[#349800]  text-[15px] font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <p className="text-[#FFFFFF80] text-xs mt-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              pretium porta eros imperdiet posuere. Nulla sagittis blandit
              sodales. Donec lobortis dapibus nunc vel vehicula. Ut a efficitur
              purus. Duis id mollis massa.
            </p>
          </div>
        </Col>

        {/* Right Section: Image Grid */}
      </Row>
    </div>
  );
};

export default Login;
