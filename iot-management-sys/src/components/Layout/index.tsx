import {
  LaptopOutlined,
  NotificationOutlined,
  UserOutlined,
  DownOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Breadcrumb,
  Layout,
  Menu,
  theme,
  Affix,
  Avatar,
  Dropdown,
  Button,
  Space,
} from "antd";
import styles from "./index.module.css";
import router, { useRouter } from "next/router";

import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState,
} from "react";

const { Header, Content, Sider } = Layout;

const items: MenuProps["items"] = [
  {
    key: "Home",
    label: "Home",
  },
  {
    key: "Device",
    label: "Device",
  },
  {
    key: "Map",
    label: "Map",
  },
  {
    key: "DeviceInfo",
    label: "DeviceInfo",
  },
  {
    key: "Statistic",
    label: "Statistic",
  },
];

export const MyLayout: React.FC<PropsWithChildren> = ({ children }) => {
  const user = useRouter();

  useEffect(() => {
    // Perform localStorage action
    const Name = localStorage.getItem("username"); // 获取当前的用户名
    setUserName(Name);
  }, []);
  const [userName, setUserName] = useState<string | null>(null);

  const userMenu = (
    <Menu>
      <Menu.Item
        key="logout"
        onClick={() => {
          localStorage.removeItem("email");
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          router.push("/User/login");
        }}
      >
        Logout
      </Menu.Item>
    </Menu>
  );
  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "Home") user.push("/Statistic/onlineCount");
    else if (e.key == "Device") user.push("/Device");
    else if (e.key == "Map") user.push("/Map");
    else if (e.key == "Statistic") user.push("/Statistic/infoCount");
    else if (e.key == "DeviceInfo") user.push("/DeviceInfo");
  };

  return (
    <>
      <Layout hasSider style={{ background: "white" }}>
        <Sider
          width={200}
          className={styles.sider}
          style={{
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <div style={{ margin: 64 }} />

          <Menu
            mode="inline"
            // defaultSelectedKeys={["Home"]}
            theme="dark"
            items={items}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ marginLeft: 200, background: "white" }}>
          <Header className={styles.header}>
            <div>
              <span>IOT Device Management System</span>
              <div style={{ float: "right", left: "100%" }}>
                <Space>
                  <Avatar
                    style={{ backgroundColor: "blue" }}
                    icon={<UserOutlined />}
                  />
                  <Dropdown overlay={userMenu} placement="bottomRight">
                    <Button type="primary" style={{ background: "#1890ff" }}>
                      {userName}
                      <DownOutlined />
                    </Button>
                  </Dropdown>
                </Space>
              </div>
            </div>
          </Header>
          <Content
            style={{
              margin: "24px 16px 0",
              background: "white",
              overflow: "initial",
              height: "100vh",
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </>
  );
};
