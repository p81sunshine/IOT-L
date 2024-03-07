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
} from "recharts";
import { Layout, Card } from "antd";
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

  const fetchData = async () => {
    // Fetch data from your backend here，进行请求后端数据.
    // setData(response)；
    try {
      // 发起GET请求获取数据，确保URL正确
      const response = await axios.get(
        "http://localhost:3000/api/statistic/infoCount"
      );
      setData1(response.data); // 设置获取到的数据到state中
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      <Card
        title="Device Daily Information Return Count Histogram"
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

      <Card title="设备在线和离线统计" bordered={false}>
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
      </Card>

      <Card title="设备创建数量统计" bordered={false}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data3}>
            <Line type="monotone" dataKey="createdDevice" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
};

export default Dashboard;
