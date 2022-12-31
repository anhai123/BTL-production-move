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
import DistributionAgentServices from "../../../../services/distributionAgent.service";
import { useDispatch, useSelector } from "react-redux";
import { clickStatisticsProductButton2 } from "../../../../slices/agentDistribution";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

//setColumnDisplay : prop
const AdvancedSearchForm = (props) => {
  console.log(props);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [data1fields, setData1Fields] = useState([]);
  let statisticTypee = Form.useWatch("statistic_type_value", form);

  const getFields = () => {
    const children = [
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
    const { statistic_type_value, year } = values;
    console.log(values);
    props.setColumnDisplay(statistic_type_value);
    dispatch(
      clickStatisticsProductButton2({
        statistic_type_value,
        year,
      })
    );
  };
  useEffect(() => {
    props.setColumnDisplay(statisticTypee);
  }, [statisticTypee]);
  return (
    <Form
      form={form}
      name="advanced_search"
      className="ant-advanced-search-form"
      onFinish={onFinish}
    >
      <Form.Item label="Kiểu thống kê" name="statistic_type_value">
        <Radio.Group>
          <Radio.Button value="month">Theo tháng</Radio.Button>
          <Radio.Button value="quarter">Theo quý</Radio.Button>
          <Radio.Button value="year">Theo năm</Radio.Button>
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

const StatisticProductSell = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [columnDisplayType, setColumnDisplayType] = useState();
  const [columnDisplay, setColumnDisplay] = useState();
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
  let columns;
  const columnsTypeYear = [
    {
      title: "Năm",
      dataIndex: "year",
      key: "year",
      ...getColumnSearchProps("year"),
    },
    {
      title: "Số lượng sản phẩm bán được",
      dataIndex: "so_luong",
      key: "so_luong",
      ...getColumnSearchProps("so_luong"),
    },
  ];
  const columnsTypeQuarter = [
    {
      title: "Năm",
      dataIndex: "year",
      key: "year",
      ...getColumnSearchProps("year"),
    },
    {
      title: "Số lượng sản phẩm bán được",
      dataIndex: "so_luong",
      key: "so_luong",
      ...getColumnSearchProps("so_luong"),
    },
  ];
  const columnsTypeMonth = [
    {
      title: "Tháng",
      dataIndex: "month",
      key: "month",
      ...getColumnSearchProps("month"),
    },
    {
      title: "Số lượng sản phẩm bán được",
      dataIndex: "so_luong",
      key: "so_luong",
      ...getColumnSearchProps("so_luong"),
    },
  ];
  const { dataTableStatistic2 } = useSelector(
    (state) => state.distributionAgent
  );
  console.log(dataTableStatistic2);
  useEffect(() => {
    console.log("eheg");
    if (columnDisplayType === "month") {
      columns = columnsTypeMonth;
    } else if (columnDisplayType === "quarter") {
      columns = columnsTypeQuarter;
    } else columns = columnsTypeYear;
    console.log(columns);
    setColumnDisplay(columns);
  }, [columnDisplayType]);
  return (
    <>
      <AdvancedSearchForm setColumnDisplay={setColumnDisplayType} />
      <Table
        locale={{ emptyText: "Không có sản phẩm nào được tìm thâý" }}
        columns={columnDisplay}
        dataSource={dataTableStatistic2}
        size="middle"
      />
    </>
  );
};
//cbi test với data.
export default StatisticProductSell;
