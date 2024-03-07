// DeviceForm.tsx

import React, { useEffect } from "react";
import { Button, Form, Input, Select, message } from "antd";
import dayjs from "dayjs";
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

  // 从参数中解析设备数据
  const { deviceData } = router.query;
  const device = deviceData ? JSON.parse(deviceData as string) : null;

  useEffect(() => {
    // 如果存在设备数据，则填充表单
    if (device) {
      form.setFieldsValue(device);
    }
  }, [device, form]);

  const onFinish = async (values: any) => {
    values.submitAt = dayjs(values.publishAt).format("YYYY-MM-DD HH:mm:ss");

    try {
      const url = `http://localhost:3000/api/edit/${device.clientId}`;
      const method = "PUT";

      // 构建请求体，只包含需要传递的字段
      const requestBody = {
        name: values.name,
        category: values.category,
        description: values.description,
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        message.success("Successfully updated!");
      } else {
        message.error("Failed to update device");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Error updating device");
    }

    router.push("/Device"); // 操作成功后跳转到列表页
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
      style={{
        maxWidth: 600,
        margin: "0 auto",
        display: "block",
        background: "white",
      }}
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
