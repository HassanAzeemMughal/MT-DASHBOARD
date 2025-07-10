import React from "react";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import { IoNewspaperOutline, IoSettingsSharp } from "react-icons/io5";
import { Menu } from "antd";
import { Link, useLocation } from "react-router-dom";
import { SiMarketo, SiSimpleanalytics } from "react-icons/si";
import { FaGraduationCap, FaStore, FaVideo, FaViruses } from "react-icons/fa";
import { CiStreamOn } from "react-icons/ci";
import {
  MdMessage,
  MdOutlineContactMail,
  MdSubscriptions,
} from "react-icons/md";
import { ImBlocked } from "react-icons/im";
import { FaUserGroup } from "react-icons/fa6";
import { GiBookmarklet } from "react-icons/gi";
import { RiContactsBook3Fill, RiVideoFill } from "react-icons/ri";

const Sidebar = () => {
  const location = useLocation();
  return (
    <Menu
      className="bg-transparent border-none "
      mode="inline"
      defaultSelectedKeys={[location?.pathname]}
      items={[
        {
          key: "/dashboard",
          icon: (
            <span className="ant-menu-item-icon">
              <IoNewspaperOutline size={13} />
            </span>
          ),
          label: <Link to="/dashboard">Dashboard</Link>,
        },
        {
          key: "/users",
          icon: (
            <span className="ant-menu-item-icon">
              <FaUserGroup size={13} />
            </span>
          ),
          label: <Link to="/users/list">Users</Link>,
        },
        {
          key: "/roles",
          icon: (
            <span className="ant-menu-item-icon">
              <FaUserGroup size={13} />
            </span>
          ),
          label: <Link to="/roles/list">Roles</Link>,
        },
        {
          key: "/category",
          icon: (
            <span className="ant-menu-item-icon">
              <FaUserGroup size={13} />
            </span>
          ),
          label: <Link to="/category/list">Category</Link>,
        },
        {
          key: "/product",
          icon: (
            <span className="ant-menu-item-icon">
              <FaUserGroup size={13} />
            </span>
          ),
          label: <Link to="/product/list">Product</Link>,
        },
        {
          key: "/brand",
          icon: (
            <span className="ant-menu-item-icon">
              <FaUserGroup size={13} />
            </span>
          ),
          label: <Link to="/brand/list">Brand</Link>,
        },
        {
          key: "/store",
          icon: (
            <span className="ant-menu-item-icon">
              <FaStore size={13} />
            </span>
          ),
          label: <Link to="/store">Store</Link>,
        },
      ]}
    />
  );
};

export default Sidebar;
