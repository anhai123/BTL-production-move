import React, { useState, useRef } from "react";
import { Space, Switch, Table, Button, Input, message, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useEffect } from "react";
import ModeratorService from "../../../services/moderator.service";

// rowSelection objects indicates the need for row selection

const ProductCategory = () => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRecordKey, setSelectedRecordKey] = useState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
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
      setSelectedRecordKey(record.key);
    },
    onSelectAll: (selected, selectedRows, changeRows) => {
      console.log(selected, selectedRows, changeRows);
    },
  };

  const deleteProductCategory = () => {
    setLoading(true);
    ModeratorService.deleteProductCategory(selectedRecordKey).then(
      (response) => {
        setTimeout(() => {
          message.success({
            content: `${response}`,
            key: "message",
            duration: 2,
          });
        }, 1000);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setTimeout(() => {
          message.error({
            content: `${_content}`,
            key: "message",
            duration: 2,
          });
        }, 1000);
      }
    );

    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

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
  const updateStatusProduct = (id) => {
    console.log(id);
    ModeratorService.summonProductByProductCAtegoryId(id).then(
      (response) => {
        console.log(response);
        message.success("Triệu hồi sản phẩm thuộc danh mục có id =" + `${id}`);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        if (_content === "Request failed with status code 404") {
          message.error("Không có sản phẩm cần triệu hồi");
        }
        console.log(_content);
      }
    );
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
      ...getColumnSearchProps("stt"),
    },
    {
      title: "Product category name",
      dataIndex: "ten_danh_muc_sp",
      key: "ten_danh_muc_sp",
      width: "50%",
      ...getColumnSearchProps("ten_danh_muc_sp"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Tag color="green" onClick={() => updateStatusProduct(record.id)}>
            Triệu hồi sản phẩm
          </Tag>
        </Space>
      ),
    },
  ];
  const [checkStrictly, setCheckStrictly] = useState(false);
  const handleProductCategoryReturnedFromBE = (arrayOfProductCategory) => {
    const ids = arrayOfProductCategory.map((x) => x.id);
    let result = arrayOfProductCategory
      .map((parent) => {
        const children = arrayOfProductCategory.filter((child) => {
          if (
            child.id !== child.id_danh_muc_cha &&
            child.id_danh_muc_cha === parent.id
          ) {
            return true;
          }

          return false;
        });

        if (children.length) {
          parent.children = children;
        }

        return parent;
      })
      .filter((obj) => {
        if (
          obj.id === obj.id_danh_muc_cha ||
          !ids.includes(obj.id_danh_muc_cha)
        ) {
          // include ultimate parents and orphans at root
          return true;
        }

        return false;
      });
    const deQuy = (arrayy) => {
      for (let i = 0; i < arrayy.length; i++) {
        arrayy[i].key = arrayy[i].id;
        if (arrayy[i].children) {
          arrayy[i].children = deQuy(arrayy[i].children);
        }
      }
      return arrayy.sort((a, b) => {
        return a.stt - b.stt;
      });
    };
    result = deQuy(result);
    return result;
  };
  useEffect(() => {
    ModeratorService.getDirectoryProduct().then(
      (response) => {
        setData(handleProductCategoryReturnedFromBE(response.data));
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

  const hasSelected = selectedRowKeys.length > 0;
  return (
    <>
      <Space
        align="center"
        style={{
          marginBottom: 16,
        }}
      >
        CheckStrictly:{" "}
        <Switch checked={checkStrictly} onChange={setCheckStrictly} />
        <Button
          type="primary"
          onClick={deleteProductCategory}
          disabled={!hasSelected}
          loading={loading}
        >
          Delete product category
        </Button>
      </Space>
      <Table
        columns={columns}
        rowSelection={{
          ...rowSelection,
          checkStrictly,
        }}
        dataSource={data}
      />
    </>
  );
};
export default ProductCategory;
