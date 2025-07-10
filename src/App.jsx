import React from "react";
import { Button, ConfigProvider, Input, Space, theme } from "antd";
import Layout from "./components/layout";
import Route from "./routes";
const App = () => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        components: {
          Menu: {
            darkItemSelectedBg: "#FFFFFF1A",
            itemSelectedBg: "#FFFFFF1A",
            itemSelectedColor: "#fff",
            itemColor: "#FFFFFF99",
          },
        },
      }}
    >
      <Route />
    </ConfigProvider>
  );
};

export default App;
