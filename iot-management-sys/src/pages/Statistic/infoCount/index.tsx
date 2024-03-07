import React, { useEffect, useState } from "react";
import {
  LineChart,
  PieChart,
  BarChart,
  Line,
  Pie,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Layout, Card, Divider } from "antd";
import { Typography, Col, Row } from "antd";
// import "antd/dist/antd.css";
import axios from "axios";

const { Header, Content, Footer, Sider } = Layout;

const Dashboard = () => {
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const { Title } = Typography;

  const fetchData = async () => {
    // Fetch data from your backend here，进行请求后端数据.
    // setData(response)；
    try {
      // 发起GET请求获取数据，确保URL正确
      const response = await axios.get(
        "http://localhost:3000/api/statistic/infoCount"
      );
      const response2 = await axios.get(
        "http://localhost:3000/api/statistic/createStat"
      );
      const response3 = await axios.get(
        "http://localhost:3000/api/alerts/daily"
      );
      setData3(response3.data); // 设置获取到的数据到state中
      setData1(response.data); // 设置获取到的数据到state中
      setData2(response2.data); // 设置获取到的数据到state中
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Card
            title="Device returning Information Count Histogram"
            bordered={false}
          >
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={data1}
                margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickCount={3} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1677f0" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        {/* <Card title="设备在线和离线统计" bordered={false}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="count"
              data={data2}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </Card> */}

        <Col span={12}>
          <Card title="Daily created device statistic" bordered={false}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data2}>
                <Line
                  type="monotone"
                  dataKey="createdDevice"
                  stroke="#8884d8"
                />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
      <Divider></Divider>
      <Row>
        <Col span={24}>
          <Card
            title="Device returning information statistics"
            bordered={false}
          >
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data3}>
                <Legend />
                <Line type="monotone" dataKey="alertCount" stroke="#8884d8" />
                <Line type="monotone" dataKey="noAlertCount" stroke="#ff0000" />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
