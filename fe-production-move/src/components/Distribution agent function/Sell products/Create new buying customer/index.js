import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
  Typography,
  message,
} from "antd";
import DistributionAgentServices from "../../../../services/distributionAgent.service";
import React, { useEffect, useState, useRef } from "react";
const { Option } = Select;
const prefixSelector = (
  <Form.Item name="prefix" noStyle>
    <Select
      style={{
        width: 70,
      }}
    >
      <Option value="0">+84</Option>
    </Select>
  </Form.Item>
);

const CreateNewBuyingCustomers = ({ open, setClose }) => {
  const [dateOfBirth, setDateOfBirth] = useState();
  const onDateOfBirthSelected = (date, dateString) => {
    setDateOfBirth(dateString);

    console.log(form.getFieldValue("dateOfBirth"));
    // console.log(form.getFieldValue("customername"));
    // console.log(form.getFieldValue("dateOfBirth"));
    // console.log(form.getFieldsValue());
    // console.log(CustomerNameRef.current.value);
  };
  const [form] = Form.useForm();
  const onClose = () => {
    setClose(false);
  };
  const finishs = async (values) => {
    // console.log(form.getFieldValue("description"));
    // const values = await form.validateFields();
    // console.log("Success:", values);
    // console.log(valuess);

    try {
      const values = await form.validateFields();
      console.log("Success:", values);
      const { ho_ten, dia_chi, email, productId } = values;
      let sdt = values.prefix + values.so_dien_thoai;
      let id_khach_hang;
      values.so_dien_thoai = sdt;
      DistributionAgentServices.putProductStatusAfterSelling(
        ho_ten,
        dateOfBirth,
        dia_chi,
        sdt,
        email,
        id_khach_hang,
        productId
      ).then(
        (response) => {
          console.log(response);
          message.success("Bán sản phẩm thành công");
        },
        (error) => {
          console.log(error);
        }
      );
      setClose(false);
      form.resetFields();
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  return (
    <>
      <Drawer
        title="Tạo khách hàng mới"
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        <Form onFinish={finishs} form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="ho_ten"
                label="Họ và tên khách hàng"
                rules={[
                  {
                    required: true,
                    message: "Nhập họ và tên",
                  },
                ]}
              >
                <Input rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="ngay_sinh"
                label="Nhập ngày sinh"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập ngày tháng năm sinh vào đây",
                  },
                ]}
              >
                <DatePicker onChange={onDateOfBirthSelected} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="dia_chi"
                label="Nhập địa chỉ"
                rules={[
                  {
                    required: true,
                    message: "Nhập địa chỉ",
                  },
                ]}
              >
                <Input rows={4} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="email"
                label="Nhập email"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "Nhập email",
                  },
                ]}
              >
                <Input rows={4} placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="so_dien_thoai"
                label="Số điện thoại"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập số điện thoại",
                  },
                ]}
              >
                <Input
                  addonBefore={prefixSelector}
                  style={{
                    width: "100%",
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label="Nhập id sản phẩm"
                name="productId"
                rules={[
                  {
                    required: true,
                    message: "Hãy nhập id sản phẩm vào",
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Tạo mới khách hàng và lưu thông tin sản phẩm đã bán
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
export default CreateNewBuyingCustomers;
