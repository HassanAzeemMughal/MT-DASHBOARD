import React, { useState } from "react";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Drawer, Layout, Menu, theme } from "antd";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import logoImage from "../../assets/logo/logo.svg";
const { Sider, Content } = Layout;

const App = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [shoWDrawer, setShowDrawer] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  console.log("====theme===", theme.getDesignToken());
  return (
    // border-none overflow-scroll
    <Layout className="h-screen w-screen">
      <Sider
        className="bg-transparent md:block hidden overflow-y-auto"
        trigger={null}
        collapsible
        collapsed={collapsed}
        onBreakpoint={(e) => {
          setShowDrawer(e);
        }}
        breakpoint="md"
      >
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="h-[100px] w-full flex items-center justify-center mb-6"
        >
          <img src={logoImage} style={{ width: "100px" }} />
          {/* <LogoSvg /> */}
        </div>
        <Sidebar />
      </Sider>

      {shoWDrawer && (
        <Drawer
          styles={{ body: { padding: 0, background: "#000000" } }}
          className="p-0"
          placement="left"
          title={null}
          closeIcon={null}
          open={collapsed}
          width={"240px"}
          onClose={() => setCollapsed(false)}
        >
          <div
            onClick={() => setCollapsed(!collapsed)}
            className="h-[60px] w-full flex items-center justify-center mb-10"
          >
            <img src={logoImage} />

            {/* <LogoSvg /> */}
          </div>
          <Sidebar />
        </Drawer>
      )}

      <Layout>
        <Header setCollapsed={setCollapsed} collapsed={collapsed} />

        <Content
          style={{
            margin: "20px 30px",
            padding: 0,
            minHeight: 280,
            background: "transparent",
            overflowY: "auto",
            overflowX: "hidden",
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};
export default App;
