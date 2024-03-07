import { Form, Input, Button, Row, Col, Typography, Card, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Dashboard from "@/pages/Statistic";

const { Title } = Typography;

const Reset = () => {
  const use = useRouter();

  const onFinish = async (values: any) => {
    try {
      const { confirm, ...dataToSend } = values;
      console.log(dataToSend);
      const response = await axios.post(
        "http://localhost:3000/reset",
        dataToSend
      );
      console.log(response.data);
      if (response.data.status == 1) {
        message.success("Reset successfully!");
        use.push("/User/login");
      } else {
        console.log("Reset failed!");
        message.error("Reset failed! Email does not exist!");
      }
      // Handle the response, you may want to redirect the user or show a success message
    } catch (error: any) {
      // Handle any errors that occurred during the request
      message.error(error.message);
    }
  };

  return (
    <>
      <Row
        justify="center"
        align="middle"
        style={{ height: "100vh", backgroundColor: "#001529" }}
      >
        <Col xs={20} sm={16} md={12} lg={8} xl={6}>
          <Title level={1} style={{ textAlign: "center", color: "white" }}>
            Welcome to Iot Device Management System
          </Title>
          <Card
            bordered={false}
            style={{ boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)" }}
          >
            <Title level={2} style={{ textAlign: "center" }}>
              Reset password
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

              <Form.Item
                name="confirm"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }

                      return Promise.reject(
                        new Error(
                          "The two passwords that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Confirm Password"
                />
              </Form.Item>

              <Form.Item style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ background: "#1890ff", width: "100%" }}
                >
                  Reset
                </Button>
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  Or <Link href="/User/login">Login?</Link>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Reset;
