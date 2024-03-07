// export default Dashboard;

import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Layout, Card, Divider, Typography, Row, Col } from "antd";
import axios from "axios";
import { useRouter } from "next/router";

const { Title } = Typography;

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const router = useRouter();
  useEffect(() => {
    fetchData();
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/User/login");
    }
    const uname = localStorage.getItem("username");
    const uemail = localStorage.getItem("email");
    setUserEmail(uemail);
    setUserName(uname);
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/statistic/onlineStat"
      );
      setData(response.data);
      const response2 = await axios.get("http://localhost:3000/api/deviceData");
      setData2(response2.data);
      const response3 = await axios.get(
        "http://localhost:3000/api/statistic/alertCount"
      );
      setData3(response3.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const devicesTotal = data.reduce((total, { count }) => total + count, 0);
  const deviceInfoTotal = data2.length;

  return (
    <Layout style={{ padding: "24px" }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card
            title="Dashboard"
            style={{
              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            }}
          >
            <Title level={4}>
              Device total number:{" "}
              <span style={{ color: "#cf1322" }}>{devicesTotal} </span>
            </Title>
            <Title level={4}>
              Online:{" "}
              <span style={{ color: "green" }}>
                {data.find((item) => item.name === "Online Device")?.count}{" "}
              </span>
            </Title>
            <Title level={4}>
              Received device info total number: {deviceInfoTotal}
            </Title>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="User Information">
            <Title level={4}>Email: {userEmail}</Title>
            <Title level={4}>Username: {userName}</Title>
          </Card>
        </Col>
        <Col>
          <Card
            style={{
              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            }}
          >
            <img src="/1.png" alt="Description" width="250" height="250" />
          </Card>
        </Col>
      </Row>

      <Divider />

      <Row gutter={16}>
        <Col span={12}>
          {/* <Card title="Device Count"> */}
          <Card
            title="Device Count"
            style={{
              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              marginBottom: "25px",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="count"
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#1677ff" : "#82ca9d"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card
            title="Alert Info Count"
            style={{
              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  dataKey="count"
                  data={data3}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `Alert:${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data3.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index % 2 === 0 ? "#1677ff" : "#cf0000"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Dashboard;
