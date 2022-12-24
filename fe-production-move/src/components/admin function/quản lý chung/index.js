import React, { useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Table } from "antd";
const { Option } = Select;
const productCreation = ["Cơ sở sản xuất"];
const productState = [];
const productAgency = [];
const productWarrantyCenter = [];
const AdvancedSearchForm = () => {
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();
  const getFields = () => {
    const count = expand ? 4 : 4;
    const children = [
      <Col span={6} key={1}>
        <Form.Item
          name={"Trạng thái sản phẩm"}
          label={`Trạng thái sản phẩm `}
          rules={[
            {
              required: true,
              message: "Input something!",
            },
          ]}
        >
          <Select defaultValue="2">
            <Option value="1">1</Option>
            <Option value="2">
              longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong
            </Option>
          </Select>
        </Form.Item>
      </Col>,
      <Col span={6} key={1}>
        <Form.Item
          name={"Trạng thái sản phẩm"}
          label={`Cơ sở sản xuất`}
          rules={[
            {
              required: true,
              message: "Input something!",
            },
          ]}
        >
          <Select defaultValue="2">
            <Option value="1">1</Option>
            <Option value="2">
              longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong
            </Option>
          </Select>
        </Form.Item>
      </Col>,
      <Col span={6} key={1}>
        <Form.Item
          name={"Trạng thái sản phẩm"}
          label={`Đại lý phân phối`}
          rules={[
            {
              required: true,
              message: "Input something!",
            },
          ]}
        >
          <Select defaultValue="2">
            <Option value="1">1</Option>
            <Option value="2">
              longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong
            </Option>
          </Select>
        </Form.Item>
      </Col>,
      <Col span={6} key={1}>
        <Form.Item
          name={"Trạng thái sản phẩm"}
          label={<span>`Trung tâm bảo hành`</span>}
          rules={[
            {
              required: true,
              message: "Input something!",
            },
          ]}
        >
          <Select defaultValue="2">
            <Option value="1">1</Option>
            <Option value="2">
              longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong
            </Option>
          </Select>
        </Form.Item>
      </Col>,
    ];

    return children;
  };
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };
  return (
    <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>{getFields()}</Row>
      <Row>
        <Col
          span={24}
          style={{
            textAlign: "right",
          }}
        >
          <Button type="primary" htmlType="submit">
            Search
          </Button>
          <Button
            style={{
              margin: "0 8px",
            }}
            onClick={() => {
              form.resetFields();
            }}
          >
            Clear
          </Button>
          <a
            style={{
              fontSize: 12,
            }}
            onClick={() => {
              setExpand(!expand);
            }}
          >
            {expand ? <UpOutlined /> : <DownOutlined />} Collapse
          </a>
        </Col>
      </Row>
      <br></br>
      <br></br>
    </Form>
  );
};
const data = [
  ["1", "1", "1"],
  ["2", "2", "2u"],
  ["3", "3", "3"],
];
const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    value: i.toString(36) + i,
    label: i.toString(36) + i,
  });
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];
const dataTable = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
  },
];
const OverallManagement = () => {
  const handleChange = (value) => {
    console.log(value);
  };
  return (
    <>
      <AdvancedSearchForm />
      <Table columns={columns} dataSource={dataTable} size="middle" />
    </>
  );
};
export default OverallManagement;
