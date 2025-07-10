import { Button, Card, Col, Input, Row, Table } from "antd";
import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";

const tabs = [
  { key: "1", label: "Products" },
  { key: "2", label: "Categories" },
  { key: "3", label: "Orders" },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => setActiveTab(key);

  const Tab = ({ tab }) => (
    <span
      onClick={() => handleTabChange(tab.key)}
      className={`text-xs px-4 py-2 font-medium rounded-3xl leading-3 transition-colors duration-200`}
      style={{
        background:
          activeTab === tab.key
            ? "linear-gradient(258.88deg, #FF00E6 -18.44%, #00E0FF 109.8%)"
            : "transparent",
        color: activeTab === tab.key ? "white" : "#AAAAAA",
        border: activeTab === tab.key ? "none" : "1px solid #666666",
      }}
    >
      {tab.label}
    </span>
  );

  const dataArray = [
    {
      1: "",
      title: "Ideal for small teams (upto 5 members)",
    },
    {
      2: "",
      title: "Unlimited app access",
    },
    {
      3: "",
      title: "LTG social",
    },
    {
      4: "",
      title: "12 expert sessions (for tactical guidance)",
    },
  ];

  const dataSource = [
    {
      key: "1",
      product: "learn The Game - The Problem",
      type: "Ebook",
      price: "15.99",
      email: "Alexaflair@email.com",
      description:
        "Maecenas et tortor et dolor mattis pharetra a at orci. Donec at leo et felis molestie suscipit. Vivamus vehicula, augue id eleifend viverra.",
      monthly_trading: "Monthly Trading Tool (add-on)",
      subscription: "$10 per month",
      status: "Active",
      statusBgColor: "#34980033",
      statusTextColor: "#349800",
      purchased: "Sep 12, 2024",
      purchasedTime: "8:30 AM",
    },
    {
      key: "2",
      product: "Discover Crypto & Trading",
      type: "Paperback",
      price: "75.00",
      email: "Hammadali@email.com",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pretium porta eros imperdiet posuere. Nulla sagittis blandit sodales. Donec lobortis dapibus nunc vel vehicula.",
      monthly_trading: "Monthly Trading Tool (add-on)",
      subscription: "$10 per month",
      status: "Inactive",
      statusBgColor: "#FE2A5D33",
      statusTextColor: "#FE2A5D",
      purchased: "Sep 12, 2024",
      purchasedTime: "8:30 AM",
    },
  ];

  const columns = [
    {
      title: "Product",
      render: (record) => (
        <div className="flex items-center gap-4">
          <div
            className="h-[60px] w-[70px] rounded"
            style={{
              background:
                "linear-gradient(180deg, #6B88A2 0%, rgba(107, 136, 162, 0.8) 100%)",
            }}
          ></div>
          <div>
            <h1 className="text-[#FFFFFFBF] font-medium text-sm leading-4">
              {record.product}
            </h1>
          </div>
        </div>
      ),
      key: "product",
    },
    {
      title: "Description",
      render: (record) => (
        <div>
          <h1 className="text-[#FFFFFF80] font-medium text-xs leading-4 pt-1">
            {record.description}
          </h1>
        </div>
      ),
      key: "description",
    },
    {
      title: "Type",
      render: (record) => (
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-[#FFFFFFBF] font-bold text-sm leading-4 pt-1">
              {record.type}
            </h1>
          </div>
        </div>
      ),
      key: "type",
    },
    {
      title: "Price",
      render: (record) => (
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-[#FFFFFFBF] font-bold text-sm leading-4 pt-1">
              ${record.price}
            </h1>
          </div>
        </div>
      ),
      key: "price",
    },
    {
      title: "Action",
      render: (record) => (
        <div className="flex items-center gap-3">
          <button
            className="w-[110px] h-[35px] rounded text-text-900 font-semibold text-[14px] leading-4 hover:bg-black hover:border-black hover:text-black"
            style={{
              background:
                "linear-gradient(225.2deg, #FFC700 0.18%, #FF5C00 99.82%)",
              border: "1px solid transparent",
            }}
          >
            Change Type
          </button>
          <button
            className="w-[70px] h-[35px] rounded font-medium text-[14px] text-[#FFFFFF] leading-4 hover:bg-black hover:border-black hover:text-[#FFFFFF]"
            style={{ background: "#FE2A5D" }}
          >
            Delete
          </button>
        </div>
      ),
      key: "action",
    },
  ];

  return (
    <div>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-normal text-xl leading-6">Store</h1>
            <p className="font-normal text-xs leading-4 text-text-800">
              View list of all shop products
            </p>
          </div>
          <div className="flex items-center border border-[#FFFFFF80] rounded-md px-2">
            <Input
              placeholder="Search Anything..."
              className="flex-grow border-none outline-none bg-text-900 px-0 font-normal text-xs py-2 hover:bg-black"
            />
            <IoIosSearch size={14} className="text-[#FFFFFF80]" />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          {tabs.map((tab) => (
            <Tab key={tab.key} tab={tab} />
          ))}
        </div>
        <div>
          {activeTab === "1" && (
            <div>
              <Card
                styles={{ body: { padding: "0 20px" } }}
                style={{
                  backgroundColor: "#141421",
                  borderRadius: "8px",
                  marginTop: "20px",
                }}
              >
                <div style={{ overflowX: "auto" }}>
                  <Table columns={columns} dataSource={dataSource} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
      <div>
        {activeTab === "2" && (
          <div>
            <Card
              styles={{ body: { padding: "0 20px" } }}
              style={{
                backgroundColor: "#141421",
                borderRadius: "8px",
                marginTop: "20px",
              }}
            ></Card>
          </div>
        )}
      </div>
      <div>
        {activeTab === "3" && (
          <div>
            <Card
              styles={{ body: { padding: "0 20px" } }}
              style={{
                backgroundColor: "#141421",
                borderRadius: "8px",
                marginTop: "20px",
              }}
            ></Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
