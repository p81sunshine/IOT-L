import React from "react";
import { Button, Form, Input, Select, message } from "antd";
import dayjs from "dayjs";
import { Router } from "next/router";
import { useRouter } from "next/router";

const { Option } = Select;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 5, span: 16 },
};

const DeviceForm: React.FC = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const onFinish = async (values: any) => {
    values.submitAt = dayjs(values.publishAt).format("YYYY-MM-DD HH:mm:ss");
    console.log(values);

    try {
      // 发送POST请求到Express后端
      const response = await fetch("http://localhost:3000/api/devices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        message.success("Successfully created!");
      } else {
        message.error("Failed to create device");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred while creating device");
    }

    router.push("/Device"); // 创建成功后跳转到列表页
  };

  const onReset = () => {
    form.resetFields();
  };

  return (
    <Form
      {...layout}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600, margin: "0 auto", display: "block" }}
    >
      <Form.Item name="name" label="Device name" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="category" label="Category" rules={[{ required: true }]}>
        <Select placeholder="Select a option " allowClear>
          <Option value="sensor">Sensor</Option>
          <Option value="actuator">actuator</Option>
          <Option value="other">other</Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button
          type="primary"
          style={{ background: "#1890ff" }}
          htmlType="submit"
        >
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DeviceForm;
