import { Avatar, Divider, Layout } from "antd";
import React from "react";
import imageProfile from "../../../assets/images/avatar.png";
import { IoMenu } from "react-icons/io5";
import { GoBellFill } from "react-icons/go";
import { BiSolidMessageDots } from "react-icons/bi";
const { Header } = Layout;
const HeaderComponent = ({ setCollapsed, collapsed }) => {
  return (
    <Header
      className=" h-auto px-[30px]"
      style={{
        background: "transparent",
      }}
    >
      <div className="flex items-center justify-between  py-[10px]">
        <div>
          <div className="flex items-center gap-2">
            <span onClick={() => setCollapsed(!collapsed)}>
              <IoMenu />
            </span>
            <h2 className="capitalize text-xl  text-[#AAAAAA]">
              welcome back alex!
            </h2>
          </div>
          <p className="text-[#777777] text-xs">
            Here’s what happening with the dashboard today
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="bg-[#131316] w-[40px] h-[40px] rounded-lg flex items-center justify-center">
              <GoBellFill fill="#FFFFFF59" size={20} />
              <span className="absolute top-[9px] right-[12px] w-2 h-2 bg-[#FF00E5] rounded-full"></span>
            </div>
          </div>
          <div className="relative">
            <div className="bg-[#131316] w-[40px] h-[40px] rounded-lg flex items-center justify-center">
              <BiSolidMessageDots fill="#FFFFFF59" size={20} />
              <span className="absolute top-[9px] right-[8px] w-2 h-2 bg-[#FF00E5] rounded-full"></span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Avatar size={40} src={imageProfile} />
            <div>
              <h3 className="mb-2 leading-none font-medium text-[15px]">
                Nick Erwin
              </h3>
              <p className="mb-0 leading-none font-normal text-xs text-text-800">
                System User
              </p>
            </div>
          </div>
        </div>
      </div>
      <Divider className="m-0" />
    </Header>
  );
};

export default HeaderComponent;
