import React, { useState, useRef } from "react";
import { Space, Switch, Table, Button, Input, Tag, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useEffect } from "react";
import warrantyCenterService from "../../../services/warranty.center.service";
const ReturnFinishProductToAgentDistribution = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [data, setData] = useState([]);
  const updateStatusProduct = (id, id_trang_thai) => {
    warrantyCenterService
      .postSttSendUnfixProductToAgentDistribution(id, id_trang_thai)
      .then(
        (response) => {
          console.log(response);
          message.success("Cập nhật trạng thái thành công");
          warrantyCenterService.getFinishMaintenanceProduct().then(
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
              console.log(error);
            }
          );
        },
        (error) => {
          console.log(error);
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
  };

  useEffect(() => {
    warrantyCenterService.getFinishMaintenanceProduct().then(
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

  //Not change much
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
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tag color="green" onClick={() => updateStatusProduct(record.id, 12)}>
            Đã bảo hành xong
          </Tag>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        locale={{
          emptyText:
            "Không có sản phẩm nào đã được bảo hành xong để chuyển về đại lý",
        }}
      />
    </>
  );
};
export default ReturnFinishProductToAgentDistribution;
