import { Button, Card, Col, Input, Row } from "antd";
import React from "react";
import { IoIosSearch } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="">
      <div>
        <div className="flex items-center gap-3">
          <span className="bg-[#FFFFFF1A] px-2 py-1 rounded">
            <Link to={"/admin/users/list"}>
              <IoArrowBack size={20} />
            </Link>
          </span>
          <div>
            <h1 className="font-normal text-xl leading-6">View User</h1>
            <p className="font-normal text-xs leading-4 text-text-800">
              This is the description text that will go under the title header
            </p>
          </div>
        </div>
        <div>
          <Card
            style={{
              backgroundColor: "#141421",
              borderRadius: "8px",
              marginTop: "20px",
            }}
          >
            <div>
              <Row gutter={[30, 30]}>
                <Col xs={24} sm={24} md={9} lg={9}>
                  <div
                    className="w-full h-[310px] mt-5 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(180deg, #6B88A2 0%, rgba(107, 136, 162, 0.8) 100%)",
                    }}
                  ></div>
                </Col>
                <Col xs={24} sm={24} md={15} lg={15} className="mt-5">
                  <div>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                      <div className="flex-1">
                        <h1 className="text-[#888888] font-normal text-sm leading-4">
                          Name
                        </h1>
                        <span className="text-[#FFFFFFBF] font-medium text-[15px] leading-[18px]">
                          Alexa Flair
                        </span>
                      </div>
                      <div className="flex-1">
                        <h1 className="text-[#888888] font-normal text-sm leading-4">
                          Email
                        </h1>
                        <span className="text-[#FFFFFFBF] font-medium text-[15px] leading-[18px]">
                          Alexaflair@email.com
                        </span>
                      </div>
                      <div className="flex-1">
                        <h1 className="text-[#888888] font-normal text-sm leading-4">
                          Status
                        </h1>
                        <span className="text-[#349800] font-medium text-[15px] leading-[18px]">
                          Active
                        </span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h1 className="text-[#888888] font-normal text-sm leading-4">
                        About
                      </h1>
                      <span className="text-[#FFFFFFBF] font-medium text-[15px] leading-[18px]">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Mauris pretium porta eros imperdiet posuere. Nulla
                        sagittis blandit sodales. Donec lobortis dapibus nunc
                        vel vehicula. Ut a efficitur purus. Duis id mollis
                        massa. Curabitur consectetur quis tellus et egestas.
                        Aliquam et erat cursus, aliquam ligula eget, posuere
                        tellus. Sed vestibulum consectetur diam, vel sodales
                        arcu rutrum in. Maecenas fermentum nisl sed ante mattis,
                        vitae interdum justo auctor. Phasellus ullamcorper
                        lacinia sollicitudin.
                      </span>
                    </div>
                    <div className="mt-4">
                      <h1 className="text-[#888888] font-normal text-sm leading-4">
                        Subscription
                      </h1>
                      <span className="text-[#FFFFFFBF] font-medium text-[15px] leading-[18px]">
                        Monthly Trading Tool (Add-on) ($10 per month)
                      </span>
                    </div>
                  </div>
                </Col>
              </Row>
              <div className="flex flex-col md:flex-row items-center gap-3 justify-end mt-11">
                <Link
                  className="flex items-center justify-center w-full md:w-[250px] h-[50px] rounded text-text-900 font-semibold text-[14px] leading-4 hover:bg-black hover:border-black hover:text-black"
                  style={{
                    background:
                      "linear-gradient(225.2deg, #FFC700 0.18%, #FF5C00 99.82%)",
                    border: "1px solid transparent",
                  }}
                >
                  Edit
                </Link>
                <button
                  className="w-full md:w-[250px] h-[50px] rounded font-medium text-[14px] text-[#FFFFFF] leading-4 hover:bg-black hover:border-black hover:text-[#FFFFFF]"
                  style={{ background: "#FE2A5D" }}
                >
                  Remove User
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
