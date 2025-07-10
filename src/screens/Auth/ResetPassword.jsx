import { Col, message, Row } from "antd";
import React, { useEffect, useState } from "react";
import forgotPasswordImage from "../../assets/images/reset.png";
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordHandler, validateTokenHandler } from "../../api/auth";
import ImageComponent from "../../components/ImageComponent";

const ResetPassword = () => {
  const { token } = useParams();
  const [data, setData] = useState();
  const navigate = useNavigate();

  const GoToLoginPage = () => {
    navigate("/login");
  };
  const callApi = async () => {
    try {
      const response = await validateTokenHandler(token);
      if (response.status == "success") {
        setData((prevData) => ({
          ...prevData,
          email: response?.data?.email,
          token: token,
        }));
      } else {
        message.error("Invalid Link!");
        navigate("/forgot/password");
      }
    } catch (error) {
      message.error(error.message);
      console.error(error);
    }
  };
  useEffect(() => {
    callApi();
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (data?.newPassword !== data?.confirmNewPassword) {
        message.error("Passwords do not match!");
        return;
      }
      const response = await resetPasswordHandler(data);
      if (response.status == "success") {
        message.success("Password Changed!");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevValues) => ({ ...prevValues, [name]: value }));
  };
  return (
    <div className="min-h-screen bg-[#141422] text-white">
      <Row className="flex items-center min-h-screen">
        {/* Left Section: Registration Form */}
        <Col xs={24} md={10} className="">
          <div className="mx-7">
            <h1 className="text-[20px] font-normal text-[#CCCCCC]">
              Forgot Password
            </h1>
            <p className="text-xs text-[#777777] mb-6">
              Lorem ipsum dolor sit amet, consectetur
            </p>

            <form onSubmit={handleSubmit}>
              <Row gutter={[20, 20]}>
                <Col span={24}>
                  <div className="relative">
                    <input
                      type="password"
                      onChange={handleInputChange}
                      name="newPassword" // Assigning the name to the input field
                      className={`block rounded px-2.5 pb-2.5 pt-5 w-full text-sm text-[#FFFFFFE5] bg-[#141422] dark:bg-[#141422] appearance-none focus:outline-none focus:ring-0 focus:border-[#000000] dark:focus:border-[#000000] peer`} // Adding a class for date type
                      required
                    />
                    <label htmlFor="newPassword" className="input-label">
                      Password
                    </label>
                  </div>
                </Col>
                <Col span={24}>
                  <div className="relative">
                    <input
                      type="password"
                      onChange={handleInputChange}
                      name="confirmNewPassword" // Assigning the name to the input field
                      className={`block rounded px-2.5 pb-2.5 pt-5 w-full text-sm text-[#FFFFFFE5] bg-[#141422] dark:bg-[#141422] appearance-none focus:outline-none focus:ring-0 focus:border-[#000000] dark:focus:border-[#000000] peer`} // Adding a class for date type
                      placeholder=" "
                      required
                    />
                    <label htmlFor="confirmNewPassword" className="input-label">
                      Confirm Password
                    </label>
                  </div>
                </Col>
              </Row>
              <div className="mt-6">
                <button type="submit" className="btn-primary">
                  Submit
                </button>
              </div>
              <div className="mt-6">
                <button
                  onClick={GoToLoginPage}
                  className="w-full bg-transparent border-2 border-[#349800] text-white  text-[15px] font-medium p-3 rounded-lg"
                >
                  Login
                </button>
              </div>
            </form>

            <p className="text-[#FFFFFF80] text-xs mt-5">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              pretium porta eros imperdiet posuere. Nulla sagittis blandit
              sodales. Donec lobortis dapibus nunc vel vehicula. Ut a efficitur
              purus. Duis id mollis massa.
            </p>
          </div>
        </Col>

        {/* Right Section: Image Grid */}
        <Col xs={24} md={14}>
          <div className="w-full h-[97vh] p-2">
            {/* Main Crypto Bull Image */}
            <ImageComponent
              src={forgotPasswordImage}
              alt="Crypto Bull"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ResetPassword;
