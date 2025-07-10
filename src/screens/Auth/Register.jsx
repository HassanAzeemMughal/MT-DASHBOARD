import React, { useState } from "react";
import { Col, Row, notification, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/ApiService";
import InputComponent from "../../components/InputComponent";

const Register = () => {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoader(true);
    try {
      const response = await ApiService.post("/auth/register", formData);

      if (response.success) {
        localStorage.setItem("authToken", response.authToken);
        localStorage.setItem("user", JSON.stringify(response.user));

        notification.success({
          message: "Registration Successful",
          description: response.message,
          placement: "topRight",
        });

        setFormData({ firstName: "", lastName: "", email: "", password: "" });
        navigate("/login");
      } else {
        notification.error({
          message: "Registration Failed",
          description: response.message || "Something went wrong",
          placement: "topRight",
        });
      }
    } catch (error) {
      let errorMessage = "An unexpected error occurred";

      if (error.response) {
        errorMessage = error.response.data.message || "Server error occurred";
      } else if (error.request) {
        errorMessage = "No response from server. Please try again later.";
      } else {
        errorMessage = error.message || "Network error. Check your connection.";
      }

      notification.error({
        message: "Registration Failed",
        description: errorMessage,
        placement: "topRight",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141422] text-white">
      <Row className="flex items-center min-h-screen">
        <Col xs={24} md={10}>
          <div className="mx-7">
            <h1 className="text-[20px] font-normal text-[#CCCCCC]">
              Register Yourself
            </h1>
            <p className="text-xs text-[#777777] mb-6">
              Lorem ipsum dolor sit amet, consectetur
            </p>
            <form onSubmit={handleRegister}>
              <Row gutter={[20, 20]}>
                <Col span={12}>
                  <InputComponent
                    label="First Name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs">{errors.firstName}</p>
                  )}
                </Col>
                <Col span={12}>
                  <InputComponent
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs">{errors.lastName}</p>
                  )}
                </Col>
                <Col span={12}>
                  <InputComponent
                    label="example@gmail.com"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </Col>
                <Col span={12}>
                  <InputComponent
                    label="*********"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs">{errors.password}</p>
                  )}
                </Col>
              </Row>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loader}
                  className="w-full p-3 btn-primary flex justify-center items-center"
                  style={{
                    background:
                      "linear-gradient(225.2deg,#ffc700 .18%,#ff5c00 99.82%)",
                  }}
                >
                  {loader ? <Spin size="small" /> : "Sign Up"}
                </button>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full p-3 btn-outline-green"
                  style={{
                    background: "rgb(52 152 0 / var(--tw-bg-opacity))",
                  }}
                >
                  Login
                </button>
              </div>
            </form>

            <p className="text-[#FFFFFF80] text-xs mt-4">
              By creating an account, you can easily manage your profile, track
              your activities, and enjoy personalized features. Stay connected
              and get the most out of our platform with your free account today!
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Register;
