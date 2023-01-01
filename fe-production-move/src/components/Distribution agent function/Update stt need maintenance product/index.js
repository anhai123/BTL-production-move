import React, { useState, useRef } from "react";
import {
  Space,
  Switch,
  Table,
  Button,
  Input,
  Select,
  Form,
  Row,
  Col,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useEffect } from "react";

import DistributionAgentServices from "../../../services/distributionAgent.service";

const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 18,
    span: 6,
  },
};
const formItemLayout = {
  labelCol: {
    offset: 0,
    span: 12,
  },
  wrapperCol: {
    offset: 2,
    span: 12,
  },
};
const formTailLayout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 8,
    offset: 4,
  },
};
const ReceivingInNeedMaintainedProduct = () => {
  const [form] = Form.useForm();
  const productId = Form.useWatch("product-id", form);
  const [warrentyCenter, setWarrentyCenter] = useState([]);
  console.log(productId);
  const changeWarrantySelection = () => {};
  useEffect(() => {
    DistributionAgentServices.getSelectWarrantyCenter().then(
      (response) => {
        setWarrentyCenter(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        console.log(_content);
      }
    );
  }, []);
  const onFinish = (values) => {
    console.log(values);
  };
  const onReset = () => {
    form.resetFields();
  };
  const updateErrNeedMaintanceStt = () => {
    DistributionAgentServices.putProductNeedMaintanance(productId).then(
      (response) => {
        message.success("Đã nhận sản phẩm cần bảo hành từ khách hàng");
        console.log("jsjlca");
        alert("Đã nhận sản phẩm cần bảo hành từ khách hàng");
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        console.log(_content);
        message.error("Sản phẩm chưa được bán, không được bảo hành");
        alert("Sản phẩm chưa được bán, không được bảo hành");
      }
    );
  };
  return (
    <Form form={form} name="control-hooks" onFinish={onFinish}>
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item
            name="product-id"
            label="Nhập id sản phẩm"
            {...formItemLayout}
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col span={4}>
          <Form.Item>
            <Button
              onClick={updateErrNeedMaintanceStt}
              type="primary"
              disabled={productId === "" || productId === undefined}
            >
              Cần bảo hành
            </Button>
          </Form.Item>
        </Col>
      </Row>

      {/* <Form.Item
        noStyle
        shouldUpdate={(prevValues, currentValues) =>
          prevValues.gender !== currentValues.gender
        }
      >
        {({ getFieldValue }) =>
          getFieldValue("gender") === "other" ? (
            <Form.Item
              name="customizeGender"
              label="Customize Gender"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
          ) : null
        }
      </Form.Item> */}
    </Form>
  );
};
export default ReceivingInNeedMaintainedProduct;
