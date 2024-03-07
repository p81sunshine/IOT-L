import { Row, Col, Typography, Card, Form, Input, Button, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import jwt from "jsonwebtoken";
import { AuthContext } from "@/utils/hoos";
import React from "react";

// import { useCookies } from "react-cookie";

const { Title, Paragraph } = Typography;

const App = () => {
  const authContext = React.useContext(AuthContext);
  const use = useRouter();
  const onFinish = async (values: any) => {
    console.log("Received values of form: ", values);
    try {
      const response = await axios.post("http://localhost:3000/login", values);
      // const [cookies, setCookie, removeCookie] = useCookies(["cookie-name"]);
      // const [cookies, setCookie] = useCookies(["token"]);

      // const email =
      console.log("Loginresponse", response.data.status);
      if (response.data.status == 1) {
        const SECRET_KEY = "ljx_iot_2023_fall";
        const email = values.email;
        const username = response.data.username;

        // const token = jwt.sign(payload, secretKey, options);
        // setCookie("token", token, { path: "/" });
        localStorage.setItem("token", email);
        localStorage.setItem("email", email);
        localStorage.setItem("username", username);

        // authContext.setUserAuthInfo({ token });

        message.success("Login success!");
        use.push("/Statistic/onlineCount");
      } else if (response.data.status == 2) {
        message.error("User not found!");
      } else if (response.data.status == 3) {
        message.error("Password not correct!");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Row style={{ height: "100vh" }}>
      <Col
        span={12}
        style={{
          backgroundColor: "#001529",
          padding: "50px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          fontFamily: "Inter",
        }}
      >
        <Title
          style={{
            color: "white",
            fontSize: "6em",
            marginBottom: "20px",
            fontFamily: "Arial",
          }}
        >
          Iot Device Management Sys
        </Title>
        <Paragraph
          style={{
            fontSize: "1.5em",
            lineHeight: "3em",
            color: "white",
            // fontFamily: "Source Sans Pro ",
          }}
        >
          Our IoT Device Management System is a state-of-the-art platform that
          allows you to monitor, manage, and secure your IoT devices in a
          scalable, efficient, and secure manner. With our system, you can
          easily connect your devices, collect data, and create actions based on
          that data.
        </Paragraph>
      </Col>
      <Col
        span={12}
        style={{
          backgroundColor: "white",
          padding: "50px",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          bordered={false}
          style={{
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          }}
        >
          <Title level={2} style={{ textAlign: "center" }}>
            Sign In
          </Title>

          <Form initialValues={{ email: "" }} onFinish={onFinish}>
            <Form.Item
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                {
                  required: true,
                  message: "Please input your E-mail!",
                },
              ]}
              hasFeedback
            >
              <Input prefix={<MailOutlined />} placeholder="Email" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                  min: 6,
                  max: 24,
                },
              ]}
              hasFeedback
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Link href="/User/reset">Forget password?</Link>
            </Form.Item>

            <Form.Item style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ background: "#1890ff", width: "100%" }}
              >
                Log in
              </Button>
              Or <Link href="/User/register">register now!</Link>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default App;
