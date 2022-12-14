import React, { useState, useRef } from "react";
import {
  Modal,
  Row,
  Col,
  Select,
  Space,
  Switch,
  Table,
  Button,
  Input,
  Form,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useEffect } from "react";
import facilityService from "../../../services/product.facility.service";
const { Option } = Select;
// rowSelection objects indicates the need for row selection
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
const ProductAvailableToDeliverToAgentDistribution = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const hasSelected = selectedRowKeys.length > 0;
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");
  const [form] = Form.useForm();
  const [distributionAgent, setdistributionAgent] = useState([]);
  const [distributionAgentId, setdistributionAgentId] = useState();
  const [open, setOpen] = useState(false);
  const updateStatusProduct = () => {
    setLoading(true);
    showModal();
    // facilityService
    //   .postSttProductIsDeliveringToAgentDistribution(selectedRowKeys)
    //   .then(
    //     (response) => {
    //       facilityService.getProductAbleToTransferToAgentDistribution().then(
    //         (response) => {
    //           for (let i = 0; i < response.data.length; i++) {
    //             response.data[i].key = response.data[i].id;
    //           }
    //           setData(response.data);
    //         },
    //         (error) => {
    //           const _content =
    //             (error.response &&
    //               error.response.data &&
    //               error.response.data.message) ||
    //             error.message ||
    //             error.toString();

    //           console.log(_content);
    //         }
    //       );
    //     },
    //     (error) => {
    //       const _content =
    //         (error.response &&
    //           error.response.data &&
    //           error.response.data.message) ||
    //         error.message ||
    //         error.toString();

    //       console.log(_content);
    //     }
    //   );

    // setTimeout(() => {
    //   setSelectedRowKeys([]);
    //   setLoading(false);
    // }, 1000);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
      setSelectedRowKeys(selectedRowKeys);
    },
    onSelect: (record, selected, selectedRows) => {
      console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  //modal
  const showModal = () => {
    setOpen(true);
  };
  //xem l???i ph???n async click v??o n??t form

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Success:", values);
      facilityService
        .postSttProductIsDeliveringToAgentDistribution(
          selectedRowKeys,
          distributionAgentId
        )
        .then(
          (response) => {
            console.log(response);
            setLoading(false);
            alert("chuy???n sang ?????i l?? th??nh c??ng");
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
  const changeAgentDistributionValue = (value) => {
    setdistributionAgentId(value);
  };
  useEffect(() => {
    facilityService.getAgentDistributionList().then(
      (response) => {
        setdistributionAgent(response.data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        console.log(_content);
        setData([]);
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
      title: "T??n s???n ph???m",
      dataIndex: "ten_san_pham",
      key: "ten_san_pham",
      ...getColumnSearchProps("ten_san_pham"),
    },
    {
      title: "Th???i h???n b???o h??nh ",
      dataIndex: "thoi_han_bao_hanh",
      key: "thoi_han_bao_hanh",
      ...getColumnSearchProps("thoi_han_bao_hanh"),
    },
    {
      title: "S??? l???n b???o h??nh",
      dataIndex: "so_lan_bao_hanh",
      key: "so_lan_bao_hanh",
      ...getColumnSearchProps("so_lan_bao_hanh"),
    },
    {
      title: "Ng??y s???n xu???t",
      dataIndex: "ngay_san_xuat",
      key: "ngay_san_xuat",
      ...getColumnSearchProps("ngay_san_xuat"),
    },
  ];
  const [checkStrictly, setCheckStrictly] = useState(false);
  useEffect(() => {
    facilityService.getProductAbleToTransferToAgentDistribution().then(
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
  }, []);
  return (
    <>
      <Space
        align="center"
        style={{
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={updateStatusProduct}
          disabled={!hasSelected}
        >
          Chuy???n sang ?????i l??
        </Button>
      </Space>
      <Table
        columns={columns}
        rowSelection={{
          ...rowSelection,
          checkStrictly,
        }}
        dataSource={data}
        locale={{ emptyText: "Kh??ng c?? s???n ph???m n??o ???????c g???i ??i ?????i l?? c???" }}
      />
      <Modal
        title="L???a ch???n ?????i l??"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
        okText="Tr???ng th??i ??ang g???i ??i ?????i l??"
        cancelText="Tho??t"
      >
        <Form form={form} name="control-hooks" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={20}>
              <Form.Item
                name="id_dai_ly"
                label="Ch???n ?????i l?? g???i ??i "
                rules={[
                  {
                    required: true,
                  },
                ]}
                {...formItemLayout}
              >
                <Select
                  placeholder="Ch???n m???t ?????i l??"
                  allowClear
                  onChange={changeAgentDistributionValue}
                >
                  {distributionAgent.map((disAgent) => {
                    return (
                      <Option value={disAgent.id}>{disAgent.ten_dai_ly}</Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
export default ProductAvailableToDeliverToAgentDistribution;
