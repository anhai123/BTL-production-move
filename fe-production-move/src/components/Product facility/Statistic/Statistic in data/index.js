import React, { useEffect, useState, useRef } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Table,
  Space,
  InputNumber,
  Radio,
} from "antd";
import facilityService from "../../../../services/product.facility.service";
import { useDispatch, useSelector } from "react-redux";
import { clickStatisticsProductButton } from "../../../../slices/productFacility";

import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
const { Option } = Select;
const monthArr = () => {
  let arrM = [];
  for (let i = 1; i <= 12; i++) {
    arrM.push(i);
  }
  return arrM;
};
const quarterArr = () => {
  const arrQ = [];
  for (let i = 1; i <= 4; i++) {
    arrQ.push(i);
  }
  return arrQ;
};
const month = monthArr();
const quarter = quarterArr();
const AdvancedSearchForm = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [data1fields, setData1Fields] = useState([]);
  const [statisticType, setStatisticType] = useState("yearType");
  const statisticTypee = Form.useWatch("statistic_type_value", form);
  console.log(statisticTypee);
  const onStatisticTypeChange = ({ statistic_type_value }) => {
    console.log(statistic_type_value);
    setStatisticType(statistic_type_value);
  };
  const getFields = () => {
    const children = [
      <Col span={12} key={1}>
        <Form.Item
          name={"statusId"}
          label={`Trạng thái sản phẩm `}
          rules={[
            {
              required: false,
              message: "Input something!",
            },
          ]}
        >
          <Select allowClear>
            {data1fields !== [] ? (
              data1fields.map((status) => {
                return (
                  <Option value={status.id}>{status.ten_trang_thai}</Option>
                );
              })
            ) : (
              <Option value={0}>No statuses found</Option>
            )}
          </Select>
        </Form.Item>
      </Col>,
      <Col span={12} key={2}>
        <Form.Item
          name={"month"}
          label={`Tháng`}
          rules={[
            {
              required: false,
              message: "Input something!",
            },
          ]}
        >
          <Select
            disabled={
              statisticTypee === "quarterType" ||
              statisticTypee === "yearType" ||
              statisticTypee === "statusType"
            }
            allowClear
          >
            {month.map((month) => {
              return <Option value={month}>{month}</Option>;
            })}
          </Select>
        </Form.Item>
      </Col>,
      <Col span={12} key={3}>
        <Form.Item
          name={"quarter"}
          label={`Quý`}
          rules={[
            {
              required: false,
              message: "Input something!",
            },
          ]}
        >
          <Select
            disabled={
              statisticTypee === "monthType" || statisticTypee === "yearType"
            }
            allowClear
          >
            {quarter.map((quarter) => {
              return <Option value={quarter}>{quarter}</Option>;
            })}
          </Select>
        </Form.Item>
      </Col>,
      <Col span={12} key={4}>
        <Form.Item
          name={"year"}
          label={<span>Nhập năm</span>}
          rules={[
            {
              required: false,
              message: "Input something!",
            },
          ]}
        >
          <InputNumber min={0} defaultValue={2022} />
        </Form.Item>
      </Col>,
    ];

    return children;
  };
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
    const { statusId, month, quarter, year } = values;
    dispatch(
      clickStatisticsProductButton({
        statusId,
        month,
        quarter,
        year,
      })
    );
  };

  useEffect(() => {
    facilityService.getProductStatus().then(
      (response) => {
        setData1Fields(response.data);
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
      initialValues={{
        statistic_type_value: statisticType,
      }}
      onValuesChange={onStatisticTypeChange}
      onFinish={onFinish}
    >
      <Form.Item label="Kiểu thống kê" name="statistic_type_value">
        <Radio.Group>
          <Radio.Button value="statusType">Theo trạng thái</Radio.Button>
          <Radio.Button value="monthType">Theo tháng</Radio.Button>
          <Radio.Button value="quarterType">Theo quý</Radio.Button>
          <Radio.Button value="yearType">Theo năm</Radio.Button>
        </Radio.Group>
      </Form.Item>
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
        </Col>
      </Row>
      <br></br>
      <br></br>
    </Form>
  );
};

const StaticticInData = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "ten_san_pham",
      key: "ten_san_pham",
      ...getColumnSearchProps("ten_san_pham"),
    },
    {
      title: "Thời hạn bảo hành ",
      dataIndex: "thoi_han_bao_hanh",
      key: "thoi_han_bao_hanh",
      ...getColumnSearchProps("thoi_han_bao_hanh"),
    },
    {
      title: "Số lần bảo hành",
      dataIndex: "so_lan_bao_hanh",
      key: "so_lan_bao_hanh",
      ...getColumnSearchProps("so_lan_bao_hanh"),
    },
    {
      title: "Ngày sản xuất",
      dataIndex: "ngay_san_xuat",
      key: "ngay_san_xuat",
      ...getColumnSearchProps("ngay_san_xuat"),
    },
  ];
  const { dataTableStatistic } = useSelector((state) => state.facility);
  console.log(dataTableStatistic);
  return (
    <>
      <AdvancedSearchForm />
      <Table
        locale={{ emptyText: "Không có sản phẩm nào được tìm thâý" }}
        columns={columns}
        dataSource={dataTableStatistic}
        size="middle"
      />
    </>
  );
};
export default StaticticInData;
