import { Col, message, notification, Row } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState();

  const GoToLoginPage = () => {
    navigate("/login");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await ApiService.post("/auth/forget/password");
      if (response.success === "true") {
        notification.success({
          message: "Success",
          description: response.message,
          placement: "topRight",
        });
      } else if (response.success === "false") {
        notification.error({
          message: "Error",
          description: response.message,
          placement: "topRight", // Position of the notification
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
      console.error(error);
    }
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
                      type="text"
                      onChange={(e) => setEmail(e.target.value)}
                      name="email" // Assigning the name to the input field
                      className={`block rounded px-2.5 pb-2.5 pt-5 w-full text-sm text-[#FFFFFFE5] bg-[#141422] dark:bg-[#141422] appearance-none focus:outline-none focus:ring-0 focus:border-[#000000] dark:focus:border-[#000000] peer`} // Adding a class for date type
                      placeholder=" "
                    />
                    <label htmlFor="email" className="input-label">
                      Email
                    </label>
                  </div>
                </Col>
              </Row>

              <div className="mt-6">
                <button type="submit" className="w-full btn-primary">
                  Get Reset Code
                </button>
              </div>
              <div className="mt-6">
                <button
                  onClick={GoToLoginPage}
                  className="w-full btn-outline-green"
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
          {/* <div className="w-full h-[97vh] p-2">
            <ImageComponent
              src={forgotPasswordImage}
              alt="Crypto Bull"
              className="w-full h-full object-cover rounded-3xl"
            />
          </div> */}
        </Col>
      </Row>
    </div>
  );
};

export default ForgotPassword;
