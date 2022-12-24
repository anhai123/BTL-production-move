import React, { useState } from "react";
import { Button, Table } from "antd";
import ModeratorService from "../../../services/moderator.service";
import { useEffect } from "react";
const columns = [
  {
    title: "Username",
    dataIndex: "username",
  },
  {
    title: "Email",
    dataIndex: "email",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];

const AccountWaiting = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  useEffect(() => {
    ModeratorService.getWaitingAccountList().then(
      (response) => {
        const _data = [];
        console.log(response.data);
        for (let i = 0; i < response.data.length; i++) {
          _data.push({
            key: response.data[i].id,
            username: response.data[i].tai_khoan,
            email: response.data[i].email,
            address: response.data[i].cua,
          });
        }

        // for (let i = 0; i < 10; i++) {
        //   _data.push({
        //     key: i,
        //     username: `Edward King ${i}`,
        //     email: 32,
        //     role: `London, Park Lane no. ${i}`,
        //   });
        // }

        setData(_data);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(error);
        setData(_content);
      }
    );
    // for (let i = 0; i < 10; i++) {
    //   _data.push({
    //     key: i,
    //     username: `Edward King ${i}`,
    //     email: 32,
    //     role: `London, Park Lane no. ${i}`,
    //   });
    // }
    // setData(_data);
  }, [loading]);
  const start = () => {
    setLoading(true);
    ModeratorService.acceptWaitingAccount(selectedRowKeys).then(
      (response) => {
        console.log(response);
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

    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };

  const startReject = () => {
    setLoading(true);
    ModeratorService.rejectWaitingAccount(selectedRowKeys).then(
      (response) => {
        console.log(response);
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

    setTimeout(() => {
      setSelectedRowKeys([]);
      setLoading(false);
    }, 1000);
  };
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;
  return (
    <div>
      <div
        style={{
          marginBottom: 16,
        }}
      >
        <Button
          type="primary"
          onClick={start}
          disabled={!hasSelected}
          loading={loading}
        >
          Except
        </Button>
        <Button
          type="primary"
          onClick={startReject}
          disabled={!hasSelected}
          danger
        >
          Reject
        </Button>
        <span
          style={{
            marginLeft: 8,
          }}
        >
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
      </div>
      <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
    </div>
  );
};
export default AccountWaiting;
