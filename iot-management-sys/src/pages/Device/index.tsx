import { Button, Col, Form, Input, Row, Select, Space, Table, Tag } from "antd";
import axios from "axios";
import { Content, Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
const { Column, ColumnGroup } = Table;

interface DataType {
  name: string;
  createTime: string;
  description: string;
  category: string[];
  clientId: Number;
}

const MyTable = () => {
  const handleDelete = async (clientId: any) => {
    try {
      const confirmed = window.confirm("Delete Device?");

      if (!confirmed) {
        return; // If the user cancels the deletion, do nothing
      }

      // Assuming your backend API supports DELETE requests for device deletion
      await axios.delete(`http://localhost:3000/delete/${clientId}`);

      // After successful deletion, fetch updated data
      fetchData();
      alert("Device deleted successfully!");
    } catch (error) {
      console.error("Error deleting device:", error);
      alert("Error deleting device. Please try again.");
    }
  };
  const router = useRouter();

  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      // 发起GET请求获取数据，确保URL正确
      const response = await axios.get("http://localhost:3000/api/devices");
      setData(response.data); // 设置获取到的数据到state中
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(); // 在组件挂载时调用fetchData
  }, []); // 传递空数组，确保只在组件挂载时调用一次

  const handleEdit = (device: DataType) => {
    router.push({
      pathname: "/Device/edit/",
      query: { deviceData: JSON.stringify(device) },
    });
  };
  return (
    <Table dataSource={data} scroll={{ x: 1000 }}>
      <Column title="Device Name" dataIndex="name" key="name" />
      <Column title="Create Time" dataIndex="createTime" key="createTime" />
      <Column title="Descrption" dataIndex="description" key="description" />
      <Column
        title="Category"
        dataIndex="category"
        key="category"
        render={(tags: string[]) => {
          if (typeof tags === "string") tags = [tags];
          return (
            <>
              {tags.map((tag) => (
                <Tag color="blue" key={tag}>
                  {tag}
                </Tag>
              ))}
            </>
          );
        }}
      />
      <Column
        title="Action"
        key="action"
        render={(_: any, record: DataType) => (
          <Space size="small">
            {/* <a style={{ color: "#1890ff" }}>Edit </a> */}
            <Button type="link" onClick={() => handleEdit(record)}>
              edit
            </Button>
            {/* <a style={{ color: "#1890ff" }}>Delete</a> */}
            <Button
              type="link"
              danger
              onClick={() => handleDelete(record.clientId)}
            >
              delete
            </Button>
          </Space>
        )}
      />
    </Table>
  );
};
export default function Home() {
  const handleSearch = (values) => {
    console.log(values);
  };
  const { Option } = Select;
  const [form] = Form.useForm();
  const handleClear = () => {
    form.resetFields();
  };

  const router = useRouter();
  return (
    <>
      <Form
        name="search"
        form={form}
        onFinish={handleSearch}
        initialValues={{
          Name: "",
          Category: "",
        }}
      >
        <Row gutter={25}>
          <Col>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                onClick={() => {
                  router.push("/Device/add");
                }}
                style={{ background: "#1890ff" }}
              >
                Add Device
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <div style={{ overflow: "auto", height: "120%" }}>
        <MyTable />
      </div>
    </>
  );
}
