import React, { useEffect, useState, useRef } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Table, Space } from "antd";
import facilityService from "../../../../services/product.facility.service";
import { useDispatch, useSelector } from "react-redux";
import { clickStatisticsProductButton2 } from "../../../../slices/productFacility";

import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
const { Option } = Select;
const AdvancedSearchForm = () => {
  const dispatch = useDispatch();
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();
  const [data5fields, setData5Fields] = useState();
  const getFields = () => {
    const children = [
      <Col span={12} key={2}>
        <Form.Item
          name={"id_co_so_sx"}
          label={`Cơ sở sản xuất`}
          rules={[
            {
              required: false,
              message: "Input something!",
            },
          ]}
        >
          <Select>
            {data5fields !== undefined ? (
              data5fields.productionFacilitys.map((cssx) => {
                return <Option value={cssx.id}>{cssx.ten_co_so}</Option>;
              })
            ) : (
              <Option value={0}>No product facility found</Option>
            )}
          </Select>
        </Form.Item>
      </Col>,
      <Col span={12} key={3}>
        <Form.Item
          name={"id_dai_ly"}
          label={`Đại lý phân phối`}
          rules={[
            {
              required: false,
              message: "Input something!",
            },
          ]}
        >
          <Select>
            {data5fields !== undefined ? (
              data5fields.distributionAgents.map((dlpp) => {
                return <Option value={dlpp.id}>{dlpp.ten_dai_ly}</Option>;
              })
            ) : (
              <Option value={0}>No distribution agent found</Option>
            )}
          </Select>
        </Form.Item>
      </Col>,
      <Col span={12} key={4}>
        <Form.Item
          name={"id_danh_muc_sp"}
          label={<span>Danh mục sản phẩm</span>}
          rules={[
            {
              required: false,
              message: "Input something!",
            },
          ]}
        >
          <Select>
            {data5fields !== undefined ? (
              data5fields.directoryProducts.map((dmp) => {
                return <Option value={dmp.id}>{dmp.ten_danh_muc_sp}</Option>;
              })
            ) : (
              <Option value={0}>No distribution agent found</Option>
            )}
          </Select>
        </Form.Item>
      </Col>,
    ];

    return children;
  };
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    const { id_co_so_sx, id_dai_ly, id_danh_muc_sp } = values;
    dispatch(
      clickStatisticsProductButton2({
        id_co_so_sx,
        id_dai_ly,
        id_danh_muc_sp,
      })
    );
  };
  useEffect(() => {
    facilityService.ProductStatisticRatioData().then(
      (response) => {
        setData5Fields(response.data);
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

const ProductStatisticRatio = () => {
  const { dataTableStatistic2 } = useSelector((state) => state.facility);

  return (
    <>
      <AdvancedSearchForm />
      <span>RESULT: {dataTableStatistic2}</span>
    </>
  );
};
export default ProductStatisticRatio;
