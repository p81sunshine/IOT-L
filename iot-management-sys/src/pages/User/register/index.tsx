import { Form, Input, Button, Row, Col, Typography, Card, message } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const { Title } = Typography;

const SignUp = () => {
  const use = useRouter();
  const [error, setError] = useState<null | string>(null);
  const [form] = Form.useForm(); // Use Form hook

  const validateFields = async (values: any) => {
    try {
      const { username, email } = values;

      // Simulate an API request to check duplication (replace with your actual logic)
      const duplicateCheckResponse = await axios.post(
        "http://localhost:3000/checkDuplicate",
        {
          username,
          email,
        }
      );

      console.log("Duplicate check response:", duplicateCheckResponse.data);
      return duplicateCheckResponse.data;
    } catch (error) {
      // Handle other validation errors or API request errors
      console.error("Validation error:", error);
    }
  };

  const onFinish = async (values: any) => {
    try {
      // Send a POST request to your backend endpoint
      const { confirm, ...dataToSend } = values;
      const res = await validateFields(values);
      if (res.usernameExists) {
        message.error("Username already exists!");
        return;
      } else if (res.emailExists) {
        message.error("Email already exists!");
        return;
      } else {
        const response = await axios.post(
          "http://localhost:3000/signup",
          dataToSend
        );
        console.log("Signup successful:", response.data);
        message.success("Sign up successfully!");
        use.push("/User/login");
      }
      // Handle the response, you may want to redirect the user or show a success message
    } catch (error: any) {
      // Handle any errors that occurred during the request
      message.error(error);
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
              Sign Up
            </Title>

            <Form initialValues={{ email: "" }} onFinish={onFinish}>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
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
                  Sign up
                </Button>
                <div style={{ textAlign: "center", marginTop: "1rem" }}>
                  Or <Link href="/User/login">Already have account?</Link>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default SignUp;
