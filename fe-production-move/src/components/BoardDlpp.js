import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import "./index.css";
import { DownOutlined } from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import LogOut from "./Logout";

import { Dropdown, Button, Space, Menu, Form, Select, Input } from "antd";
import AgentsSellProduct from "./Distribution agent function/Sell products";
import AgentsReceivingProduct from "./Distribution agent function/List product from production facility";

import ReceivingInNeedMaintainedProduct from "./Distribution agent function/Update stt need maintenance product";
import NeedMaintenanceProduct from "./Distribution agent function/List product that need maintenance";
import ReceivingProductFromWarrantyCenter from "./Distribution agent function/List product return from warranty center";
import ProductNeedToReturnToCustomer from "./Distribution agent function/List product need to return to customer";
import ListHaveToReturnToProductionFacilityProduct from "./Distribution agent function/List have-to-return to production facility";
import ListCustomerAndReplacedProduct from "./Distribution agent function/list customer and replaced products";
import ListSummonProductHasCustomer from "./Distribution agent function/List summon product has customer";
import ListSummonProductNoCustomer from "./Distribution agent function/List summon product no customer";
import StaticticInData from "./Distribution agent function/Statistic/Statistic in data";
import StatisticProductSell from "./Distribution agent function/Statistic/Statistic in number";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

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
            to={"/dlpp/update-stt-product-need-maintanance"}
            className="nav-link"
          >
            Cập nhật trạng thái sản phẩm
          </Link>
        ),
      },
      {
        key: "1.2",
        label: (
          <Link to={"/dlpp/need-maintenance-product-list"} className="nav-link">
            Danh sách sản phẩm lỗi
          </Link>
        ),
      },
    ],
  },
  {
    key: "2",
    type: "group",
    label: "Sản phẩm lỗi, không thể sửa chữa hoặc đã bảo hành xong",
    children: [
      {
        key: "2.1",
        label: (
          <Link
            to={"/dlpp/list-incoming-finish-warranty-or-unfix"}
            className="nav-link"
          >
            Danh sách sản phẩm đang được gửi về
          </Link>
        ),
      },
    ],
  },
  {
    key: "3",
    type: "group",
    label: "Sản phẩm cần trả lại cho khách hàng",
    children: [
      {
        key: "3.1",
        label: (
          <Link
            to={"/dlpp/list-product-need-to-return-to-customer"}
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
    label: "Sản phẩm cần chuyển về cơ sở sản xuất",
    children: [
      {
        key: "4.1",
        label: (
          <Link
            to={"/dlpp/list-product-need-to-return-to-production-facility"}
            className="nav-link"
          >
            Danh sách sản phẩm
          </Link>
        ),
      },
    ],
  },
  //product/warranty/complete/arrived giống
  {
    key: "5",
    type: "group",
    label: "Danh sách khách hàng cần bàn giao sản phẩm mới thay thế",
    children: [
      {
        key: "5.1",
        label: (
          <Link
            to={"/dlpp/list-customer-and-replaced-products"}
            className="nav-link"
          >
            Danh sách sản phẩm
          </Link>
        ),
      },
    ],
  },
  {
    key: "6",
    type: "group",
    label: "Danh sách sản phẩm cần triệu hồi",
    children: [
      {
        key: "6.1",
        label: (
          <Link
            to={"/dlpp/list-need-summon-product-has-customer"}
            className="nav-link"
          >
            Danh sách sản phẩm đã được sở hữu
          </Link>
        ),
      },
      {
        key: "6.2",
        label: (
          <Link
            to={"/dlpp/list-need-summon-product-no-customer"}
            className="nav-link"
          >
            Danh sách sản phẩm chưa được sở hữu
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
      <Link to={"/dlpp/agent-distribution-statistic-data"} className="nav-link">
        Thống kê số liệu
      </Link>
    ),
  },
  {
    key: "2",

    label: (
      <Link
        to={"/dlpp/agent-distribution-statistic-number"}
        className="nav-link"
      >
        Thống kê số lượng sản phẩm
      </Link>
    ),
  },
];
const BoardDlpp = () => {
  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-black">
        <div class="navbar-inner">
          <div class="container-fluid">
            <div className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link to={"/dlpp/agent-receiving-product"} className="nav-link">
                  Sản phẩm đang nhập
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/dlpp/agent-product-sell"} className="nav-link">
                  Bán sản phẩm
                </Link>
              </li>
              <li className="nav-item">
                {/* <Link
                to={"/dlpp/maintenance-product-in-need"}
                className="nav-link"
              >
                Bảo hành sản phẩm
              </Link> */}

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

              <li className="nav-item">
                <LogOut />
              </li>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mt-3">
        <Routes>
          <Route path="agent-product-sell" element={<AgentsSellProduct />} />
          <Route
            path="agent-receiving-product"
            element={<AgentsReceivingProduct />}
          />
          <Route
            path="update-stt-product-need-maintanance"
            element={<ReceivingInNeedMaintainedProduct />}
          />
          <Route
            path="need-maintenance-product-list"
            element={<NeedMaintenanceProduct />}
          />

          <Route
            path="list-incoming-finish-warranty-or-unfix"
            element={<ReceivingProductFromWarrantyCenter />}
          />

          <Route
            path="list-product-need-to-return-to-customer"
            element={<ProductNeedToReturnToCustomer />}
          />
          <Route
            path="list-product-need-to-return-to-production-facility"
            element={<ListHaveToReturnToProductionFacilityProduct />}
          />
          <Route
            Phạm
            Đức
            Hải
            path="list-customer-and-replaced-products"
            element={<ListCustomerAndReplacedProduct />}
          />
          <Route
            path="list-need-summon-product-has-customer"
            element={<ListSummonProductHasCustomer />}
          />
          <Route
            path="list-need-summon-product-no-customer"
            element={<ListSummonProductNoCustomer />}
          />
          <Route
            path="agent-distribution-statistic-data"
            element={<StaticticInData />}
          />
          <Route
            path="agent-distribution-statistic-number"
            element={<StatisticProductSell />}
          />
        </Routes>
      </div>
    </>
  );
};
export default BoardDlpp;
