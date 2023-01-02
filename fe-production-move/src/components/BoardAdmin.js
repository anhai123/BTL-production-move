import React, { useState, useEffect } from "react";
import UserService from "../services/user.service";
import EventBus from "../common/EventBus";
import "./index.css";
import {
  DownOutlined,
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  PlusOutlined,
  ContainerOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";

import AccountExiting from "./admin function/Tài khoản hệ thống";
import AccountWaiting from "./admin function/Tk đợi duyệt";
import OverallManagement from "./admin function/quản lý chung";
import CssxCategory from "./admin function/Danh mục cssx";
import CreateNewCssxCategory from "./admin function/Danh mục cssx/Tạo danh mục mới";
import DlppCategory from "./admin function/Danh mục dlpp";
import CreateNewDlppCategory from "./admin function/Danh mục dlpp/Tạo danh mục mới";
import TtbhCategory from "./admin function/Danh mục ttbh";
import CreateNewTtbhCategory from "./admin function/Danh mục ttbh/Tạo danh mục mới";
import CreateNewProductCategory from "./admin function/danh mục sản phẩm/Tạo danh mục mới";
import ProductCategory from "./admin function/danh mục sản phẩm";
import LogOut from "./Logout";
import { logout } from "../slices/auth";
import { Dropdown, Button, Space, Menu, Form, Select, Input } from "antd";
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
const BoardAdmin = () => {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const [content, setContent] = useState("");
  const [current, setCurrent] = useState("mail");
  const [openProductCategoryDrawer, setOpenProductCategoryDrawer] =
    useState(false);
  const [openCssxCategoryDrawer, setOpenCssxCategoryDrawer] = useState(false);
  const [openDlppCategoryDrawer, setOpenDlppCategoryDrawer] = useState(false);
  const [openTtbhCategoryDrawer, setOpenTtbhCategoryDrawer] = useState(false);

  const [form] = Form.useForm();
  const onFatherCategoryChange = () => {};
  const onFinish = (values) => {
    console.log(values);
  };
  const onReset = () => {
    form.resetFields();
  };
  const onClick = (e) => {
    console.log("click", e);
    setCurrent(e.key);
  };
  const showCreateProductCategoryDrawer = () => {
    setOpenProductCategoryDrawer(true);
  };
  const showCreateCssxCategoryDrawer = () => {
    setOpenCssxCategoryDrawer(true);
  };
  const showCreateDlppCategoryDrawer = () => {
    setOpenDlppCategoryDrawer(true);
  };
  const showCreateTtbhCategoryDrawer = () => {
    setOpenTtbhCategoryDrawer(true);
  };
  function getItem(label, key, icon, children, type) {
    return {
      key,
      icon,
      children,
      label,
      type,
    };
  }
  const items = [
    // getItem("Option 1", "1", <PieChartOutlined />),
    // getItem("Option 2", "2", <DesktopOutlined />),
    // getItem("Option 3", "3", <ContainerOutlined />),
    getItem("Quản lý danh mục", "sub1", <MailOutlined />, [
      getItem("Sản phẩm", "1.1", null, [
        getItem(
          <Link to={"/admin/product-category-mn"}>Danh mục sản phẩm</Link>,
          "sub1.2",
          null
        ),
        getItem(
          <Button
            type="primary"
            onClick={showCreateProductCategoryDrawer}
            icon={<PlusOutlined />}
          >
            Tạo mới danh mục sản phẩm
          </Button>,
          "sub1.3",
          null
        ),
      ]),

      getItem("Trung tâm bảo hành", "2.1", null, [
        getItem(
          <Link to={"/admin/ttbh-category-mn"}>Danh mục ttbh</Link>,
          "sub2.2",
          null
        ),
        getItem(
          <Button
            type="primary"
            onClick={showCreateTtbhCategoryDrawer}
            icon={<PlusOutlined />}
          >
            Tạo mới danh mục TTBH
          </Button>,
          "sub2.3",
          null
        ),
      ]),
      getItem("Cơ sở sản xuất", "3.1", null, [
        getItem(
          <Link to={"/admin/cssx-category-mn"}>Danh mục CSSX</Link>,
          "sub3.2",
          null
        ),
        getItem(
          <Button
            type="primary"
            onClick={showCreateCssxCategoryDrawer}
            icon={<PlusOutlined />}
          >
            Tạo mới danh mục CSSX
          </Button>,
          "sub3.3",
          null
        ),
      ]),

      getItem("Đại lý phân phối", "4.1", null, [
        getItem(
          <Link to={"/admin/dlpp-category-mn"}>Danh mục DLPP</Link>,
          "sub4.2",
          null
        ),
        getItem(
          <Button
            type="primary"
            onClick={showCreateDlppCategoryDrawer}
            icon={<PlusOutlined />}
          >
            Tạo mới danh mục DLPP
          </Button>,
          "sub4.3",
          null
        ),
      ]),
    ]),
  ];
  const itemss = [
    {
      label: (
        <span
          style={{
            color: "rgba(255, 255, 255, 0.55)",
            fontSize: "1.25em",
          }}
        >
          Quản lý danh mục
        </span>
      ),
      key: "SubMenu",

      popupClassName: "sda ",
      children: [
        {
          type: "group",
          label: "Sản phẩm",

          children: [
            {
              label: (
                <Link to={"/admin/product-category-mn"}>Danh mục sản phẩm</Link>
              ),
              key: "setting:1.1",
            },
            {
              label: (
                <Button
                  type="primary"
                  onClick={showCreateProductCategoryDrawer}
                  icon={<PlusOutlined />}
                >
                  Tạo mới danh mục sản phẩm
                </Button>
              ),
              key: "setting:1.2",
            },
          ],
        },
        {
          type: "group",
          label: "Trung tâm bảo hành",

          children: [
            {
              label: <Link to={"/admin/ttbh-category-mn"}>Danh mục ttbh</Link>,
              key: "setting:2.1",
            },
            {
              label: (
                <Button
                  type="primary"
                  onClick={showCreateTtbhCategoryDrawer}
                  icon={<PlusOutlined />}
                >
                  Tạo mới danh mục TTBH
                </Button>
              ),
              key: "setting:2.2",
            },
          ],
        },
        {
          type: "group",
          label: "Cơ sở sản xuất",

          children: [
            {
              label: <Link to={"/admin/cssx-category-mn"}>Danh mục CSSX</Link>,
              key: "setting:3.1",
            },
            {
              label: (
                <Button
                  type="primary"
                  onClick={showCreateCssxCategoryDrawer}
                  icon={<PlusOutlined />}
                >
                  Tạo mới danh mục CSSX
                </Button>
              ),
              key: "setting:3.2",
            },
          ],
        },
        {
          type: "group",
          label: "Đại lý phân phối",

          children: [
            {
              label: <Link to={"/admin/dlpp-category-mn"}>Danh mục DLPP</Link>,
              key: "setting:4.1",
            },
            {
              label: (
                <Button
                  type="primary"
                  onClick={showCreateDlppCategoryDrawer}
                  icon={<PlusOutlined />}
                >
                  Tạo mới danh mục DLPP
                </Button>
              ),
              key: "setting:4.2",
            },
          ],
        },
      ],
    },
  ];
  return (
    <>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-black">
          <div className="navbar-nav mr-auto">
            <li
              className="nav-item"
              style={{
                display: "inline",
                marginTop: "-4px",
              }}
            >
              <Menu
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                mode="horizontal"
                theme="dark"
                inlineCollapsed={collapsed}
                items={items}
              />
            </li>
            <li className="nav-item">
              <Link to={"/admin/account-waiting"} className="nav-link">
                Tk đợi duyệt
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/admin/quan-ly-san-pham-chung"} className="nav-link">
                Sản phẩm toàn quốc
              </Link>
            </li>
            <LogOut />
          </div>
        </nav>
      </div>
      <div className="container mt-3">
        <Routes>
          <Route path="product-category-mn" element={<ProductCategory />} />
          <Route path="ttbh-category-mn" element={<TtbhCategory />} />
          <Route path="cssx-category-mn" element={<CssxCategory />} />
          <Route path="dlpp-category-mn" element={<DlppCategory />} />
          <Route path="account-exiting" element={<AccountExiting />} />
          <Route path="account-waiting" element={<AccountWaiting />} />
          <Route
            path="quan-ly-san-pham-chung"
            element={<OverallManagement />}
          />
        </Routes>
      </div>

      <CreateNewProductCategory
        open={openProductCategoryDrawer}
        setClose={setOpenProductCategoryDrawer}
      />
      <CreateNewTtbhCategory
        open={openTtbhCategoryDrawer}
        setClose={setOpenTtbhCategoryDrawer}
      />
      <CreateNewDlppCategory
        open={openDlppCategoryDrawer}
        setClose={setOpenDlppCategoryDrawer}
      />
      <CreateNewCssxCategory
        open={openCssxCategoryDrawer}
        setClose={setOpenCssxCategoryDrawer}
      />
    </>
  );
};
export default BoardAdmin;
