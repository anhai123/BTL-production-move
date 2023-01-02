import React, { useState, useRef } from "react";
import { Space, Switch, Table, Button, Input, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useEffect } from "react";
import DistributionAgentServices from "../../../services/distributionAgent.service";
const ProductNeedToReturnToCustomer = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [data, setData] = useState([]);
  const updateStatusProduct = (id) => {
    console.log(id);
    DistributionAgentServices.putSttProductWhenReturnToCustomer(id).then(
      (response) => {
        console.log(response);
        DistributionAgentServices.getReturningToCustomerProduct().then(
          (response) => {
            handleDataReturnedFromReturningApi(response.data);
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
        alert("Cập nhật trạng thái thành công");
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
  };

  const handleDataReturnedFromReturningApi = (data) => {
    for (let i = 0; i < data.allProduct.length; i++) {
      const customer = data.allCustomer.filter((cus) => {
        return cus.id === data.allProduct[i].id_khach_hang;
      });
      console.log(customer);
      if (customer !== undefined && customer.length > 0) {
        data.allProduct[i].email_khach_hang = customer[0].email;
        data.allProduct[i].sdt_khach_hang = customer[0].so_dien_thoai;
      }
    }
    for (let i = 0; i < data.allProduct.length; i++) {
      data.allProduct[i].key = data.allProduct[i].id;
    }
    setData(data.allProduct);
  };
  useEffect(() => {
    DistributionAgentServices.getReturningToCustomerProduct().then(
      (response) => {
        handleDataReturnedFromReturningApi(response.data);
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
      title: "Số điện thoại khách hàng",
      dataIndex: "sdt_khach_hang",
      key: "sdt_khach_hang",
      ...getColumnSearchProps("sdt_khach_hang"),
    },
    {
      title: "Email khách",
      dataIndex: "email_khach_hang",
      key: "email_khach_hang",
      ...getColumnSearchProps("email_khach_hang"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tag color="green" onClick={() => updateStatusProduct(record.id)}>
            Trả lại cho khách
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
          emptyText: "Không có sản phẩm nào cần gửi trả lại khách hàng",
        }}
      />
    </>
  );
};
export default ProductNeedToReturnToCustomer;
