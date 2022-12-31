import React, { useState, useRef } from "react";
import {
  Button,
  Table,
  Modal,
  Form,
  Select,
  Row,
  Col,
  Space,
  Switch,
  Input,
} from "antd";
import DistributionAgentServices from "../../../services/distributionAgent.service";
import { useEffect } from "react";

import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
const { Option } = Select;
const columns = [
  {
    title: "Mã sản phẩm",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "ten_san_pham",
    key: "ten_san_pham",
  },
  {
    title: "Thời hạn bảo hành ",
    dataIndex: "thoi_han_bao_hanh",
    key: "thoi_han_bao_hanh",
  },
  {
    title: "Số lần bảo hành",
    dataIndex: "so_lan_bao_hanh",
    key: "so_lan_bao_hanh",
  },
  {
    title: "Ngày sản xuất",
    dataIndex: "ngay_san_xuat",
    key: "ngay_san_xuat",
  },
];
const formItemLayout = {
  labelCol: {
    offset: 0,
    span: 12,
  },
  wrapperCol: {
    offset: 0,
    span: 12,
  },
};

const NeedMaintenanceProduct = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const hasSelected = selectedRowKeys.length > 0;
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [form] = Form.useForm();
  const [warrentyCenter, setWarrentyCenter] = useState([]);
  const [warrentyCenterId, setWarrentyCenterId] = useState();
  useEffect(() => {
    DistributionAgentServices.getNeedMaintenanceProduct().then(
      (response) => {
        for (let i = 0; i < response.data.length; i++) {
          response.data[i].key = response.data[i].id;
        }
        setData(response.data);
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
  }, [loading]);
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const showModal = () => {
    setOpen(true);
  };
  //xem lại phần async click vào nút form

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Success:", values);
      DistributionAgentServices.putShippingProductToWarrantyCenter(
        selectedRowKeys,
        warrentyCenterId
      ).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      setOpen(false);
      form.resetFields();
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  const handleCancel = () => {
    console.log("Clicked cancel button");
    setOpen(false);
  };
  const onFinish = () => {};
  const changeWarrantySelection = (value) => {
    setWarrentyCenterId(value);
  };
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
      title: "Mã sản phẩm",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("id"),
    },
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
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={showModal}
          disabled={!hasSelected}
          loading={loading}
        >
          Chọn trung tâm bảo hành
        </Button>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table
        locale={{ emptyText: "Không có sản phẩm lỗi cần bảo hành ở đại lý" }}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
      />
      <Modal
        title="Người dùng lựa chọn hãy"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Trạng thái đang đến trung tâm bảo hành"
        cancelText="Thoát"
      >
        <Form form={form} name="control-hooks" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item
                name="warrenty-center-select"
                label="Chọn trung tâm bảo hành "
                rules={[
                  {
                    required: true,
                  },
                ]}
                {...formItemLayout}
              >
                <Select
                  placeholder="Chọn trung tâm bảo hành"
                  allowClear
                  onChange={changeWarrantySelection}
                >
                  {warrentyCenter.map((wrc) => {
                    return <Option value={wrc.id}>{wrc.ten_trung_tam}</Option>;
                  })}
                </Select>
              </Form.Item>{" "}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};
export default NeedMaintenanceProduct;
