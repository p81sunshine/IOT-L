import { Button, Col, Form, Input, Row, Select, Space, Table, Tag } from "antd";
import axios from "axios";
import { Content, Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
const { Column, ColumnGroup } = Table;
import moment from "moment";
import { Typography } from "antd";

const MyTable = () => {
  const [data, setData] = useState([]);
  const { Title } = Typography;

  const fetchData = async () => {
    try {
      // 发起GET请求获取数据，确保URL正确
      const response = await axios.get("http://localhost:3000/api/deviceData");
      const sortedData = response.data
        .sort((a, b) => b.timestamp - a.timestamp)
        .map((item) => {
          item.timestamp = moment
            .unix(item.timestamp)
            .format("YYYY-MM-DD HH:mm:ss");
          return item;
        });
      setData(response.data); // 设置获取到的数据到state中
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // 在组件挂载时调用fetchData
  }, []); // 传递空数组，确保只在组件挂载时调用一次

  return (
    <div>
      <Title level={4} style={{ color: "#1677ff", textAlign: "left" }}>
        Data Stream
      </Title>

      <Table
        dataSource={data}
        scroll={{ x: 1000 }}
        pagination={{ pageSize: 8 }}
      >
        <Column title="InfoTime" dataIndex="timestamp" key="Timestamp" />
        <Column title="Client ID" dataIndex="clientId" key="ClientId" />
        <Column title="Info" dataIndex="info" key="Info" />
        <Column title="Value" dataIndex="value" key="Value" />
        <Column title="Alert" dataIndex="alert" key="Alert" />
        <Column title="Lng" dataIndex="lng" key="Lng" />
        <Column title="Lat" dataIndex="lat" key="Lat" />
      </Table>
    </div>
  );
};

export default MyTable;
