import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import "./index.css";
import { Dropdown, Button, Space, Menu, Form, Select, Input } from "antd";
import {
  DownOutlined,
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import LogOut from "./Logout";
import CreateNewProduct from "./Product facility/Create new product";
import ProductAvailableToDeliverToAgentDistribution from "./Product facility/List avaiable product deliver to agent distribution";
import UnfixProductTransferedToFacility from "./Product facility/List product being transfered";
import StaticticInData from "./Product facility/Statistic/Statistic in data";
import StatisticProductSell from "./Product facility/Statistic/Statistic in number";
import NhapSanPham from "./Product facility/Nhập sản phẩm";
import ProductStatisticRatio from "./Product facility/Statistic/Statistic in ratio";
const items = [
  {
    key: "1",
    type: "group",
    label: "Sản phẩm xuất đi đại lý được",
    children: [
      {
        key: "1.1",
        label: (
          <Link
            to={"/cssx/update-stt-can-deliver-to-distribution-agent"}
            className="nav-link"
          >
            Danh sách sản phẩm
          </Link>
        ),
      },
    ],
  },
  {
    key: "2",
    type: "group",
    label: "Sản phẩm hỏng không thể sửa chữa gửi về",
    children: [
      {
        key: "2.1",
        label: (
          <Link
            to={"/cssx/update-stt-unfix-product-deliver"}
            className="nav-link"
          >
            Danh sách sản phẩm
          </Link>
        ),
      },
    ],
  },
];
const items2 = [
  {
    key: "1",

    label: (
      <Link to={"/cssx/facility-statistic-data"} className="nav-link">
        Thống kê số liệu
      </Link>
    ),
  },
  {
    key: "2",

    label: (
      <Link to={"/cssx/facility-statistic-number"} className="nav-link">
        Thống kê số lượng sản phẩm
      </Link>
    ),
  },
  {
    key: "3",

    label: (
      <Link to={"/cssx/facility-error-statistic-number"} className="nav-link">
        Thống kê tỉ lệ sản phẩm lỗi
      </Link>
    ),
  },
];
const BoardCssx = () => {
  const [content, setContent] = useState("");
  // useEffect(() => {
  //   UserService.getAdminBoard().then(
  //     (response) => {
  //       setContent(response.data);
  //     },
  //     (error) => {
  //       const _content =
  //         (error.response &&
  //           error.response.data &&
  //           error.response.data.message) ||
  //         error.message ||
  //         error.toString();
  //       setContent(_content);
  //       if (error.response && error.response.status === 401) {
  //         EventBus.dispatch("logout");
  //       }
  //     }
  //   );
  // }, []);
  return (
    <>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-black">
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/cssx/stack-product"} className="nav-link">
                Nhập sản phẩm
              </Link>
            </li>
            <li className="nav-item">
              <Dropdown menu={{ items }}>
                <Link className="nav-link">
                  <Space style={{ fontSize: "16px" }}>
                    Cập nhật trạng thái sản phẩm
                    <DownOutlined />
                  </Space>
                </Link>
              </Dropdown>
            </li>
            <li className="nav-item">
              <Dropdown menu={{ items: items2 }}>
                <Link className="nav-link">
                  <Space style={{ fontSize: "16px" }}>
                    Thống kê
                    <DownOutlined />
                  </Space>
                </Link>
              </Dropdown>
            </li>
            <li className="nav-item"></li>
            <LogOut />
          </div>
        </nav>
      </div>
      <div className="container mt-3">
        <Routes>
          <Route path="stack-product" element={<NhapSanPham />} />
          <Route
            path="update-stt-can-deliver-to-distribution-agent"
            element={<ProductAvailableToDeliverToAgentDistribution />}
          />
          <Route
            path="update-stt-unfix-product-deliver"
            element={<UnfixProductTransferedToFacility />}
          />
          <Route path="facility-statistic-data" element={<StaticticInData />} />
          <Route
            path="facility-statistic-number"
            element={<StatisticProductSell />}
          />
          <Route
            path="facility-error-statistic-number"
            element={<ProductStatisticRatio />}
          />
        </Routes>
      </div>
    </>
  );
};
export default BoardCssx;
