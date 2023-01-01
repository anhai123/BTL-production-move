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
import ListProductNeedMaintenance from "./Warranty center/List need maintenance product";
import ProductNeedToReturnToCustomer from "./Warranty center/List in maintenance period product";
import ReturnFinishProductToAgentDistribution from "./Warranty center/List finish maintenance product";
import ReturnUnfixedProductToAgentDistribution from "./Warranty center/List finish maintenance and err product copy";
import StaticticInData from "./Warranty center/Statistic";
const items = [
  {
    key: "1",
    type: "group",
    label: "Sản phẩm cần bảo hành",
    children: [
      {
        key: "1.1",
        label: (
          <Link
            to={"/ttbh/update-stt-receive-product-for-maintenance"}
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
    label: "Sản phẩm đang bảo hành",
    children: [
      {
        key: "2.1",
        label: (
          <Link
            to={"/ttbh/update-stt-finishMaintenance-or-unfixed-product"}
            className="nav-link"
          >
            Danh sách sản phẩm
          </Link>
        ),
      },
    ],
  },
  {
    key: "3",
    type: "group",
    label: "Sản phẩm đã bảo hành xong, không lỗi",
    children: [
      {
        key: "3.1",
        label: (
          <Link
            to={
              "/ttbh/update-stt-return-FINISH-MAINTENANCE-product-to-agent-distribution"
            }
            className="nav-link"
          >
            Danh sách sản phẩm
          </Link>
        ),
      },
    ],
  },
  {
    key: "4",
    type: "group",
    label: "Sản phẩm lỗi không bảo hành được",
    children: [
      {
        key: "4.1",
        label: (
          <Link
            to={"/ttbh/update-stt-return-UNFIXED-product-to-agent-distribution"}
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
      <Link to={"/ttbh/warranty-center-statistic-data"} className="nav-link">
        Thống kê số liệu
      </Link>
    ),
  },
];
const BoardTtbh = () => {
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
  const createRoute = (path, element) => {
    return <Route path={`${path}`} element={element} />;
  };
  return (
    <>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-black">
          <div className="navbar-nav mr-auto">
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
          {createRoute(
            "update-stt-receive-product-for-maintenance",
            <ListProductNeedMaintenance />
          )}
          {createRoute(
            "update-stt-finishMaintenance-or-unfixed-product",
            <ProductNeedToReturnToCustomer />
          )}
          {createRoute(
            "update-stt-return-FINISH-MAINTENANCE-product-to-agent-distribution",
            <ReturnFinishProductToAgentDistribution />
          )}
          {createRoute(
            "update-stt-return-UNFIXED-product-to-agent-distribution",
            <ReturnUnfixedProductToAgentDistribution />
          )}
          {createRoute("warranty-center-statistic-data", <StaticticInData />)}
        </Routes>
      </div>
    </>
  );
};
export default BoardTtbh;
