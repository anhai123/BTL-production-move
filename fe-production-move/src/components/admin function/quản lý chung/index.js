import React, { useEffect, useState, useRef } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Table, Space } from "antd";
import ModeratorService from "../../../services/moderator.service";
import { useDispatch, useSelector } from "react-redux";
import { clickStatisticsProductButton } from "../../../slices/moderator";

import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
const { Option } = Select;
const AdvancedSearchForm = () => {
  const dispatch = useDispatch();
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();
  const [data5fields, setData5Fields] = useState();
  const getFields = () => {
    const count = expand ? 4 : 4;
    const children = [
      <Col span={12} key={1}>
        <Form.Item
          name={"id_trang_thai"}
          label={`Trạng thái sản phẩm `}
          rules={[
            {
              required: false,
              message: "Input something!",
            },
          ]}
        >
          <Select>
            {data5fields !== undefined ? (
              data5fields.statuses.map((status) => {
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
          name={"id_trung_tam_bh"}
          label={<span>Trung tâm bảo hành</span>}
          rules={[
            {
              required: false,
              message: "Input something!",
            },
          ]}
        >
          <Select>
            {data5fields !== undefined ? (
              data5fields.warrantyCenters.map((ttbh) => {
                return <Option value={ttbh.id}>{ttbh.ten_trung_tam}</Option>;
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
    const { id_trang_thai, id_co_so_sx, id_dai_ly, id_trung_tam_bh } = values;
    dispatch(
      clickStatisticsProductButton({
        id_trang_thai,
        id_co_so_sx,
        id_dai_ly,
        id_trung_tam_bh,
      })
    );
  };
  useEffect(() => {
    ModeratorService.getStatisticsDataForSearch().then(
      (response) => {
        console.log(response.data.distributionAgents);
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

const OverallManagement = () => {
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
  const { dataTableStatistic } = useSelector((state) => state.moderator);
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
export default OverallManagement;
