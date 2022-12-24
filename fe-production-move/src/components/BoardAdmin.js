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
} from "@ant-design/icons";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import ProductCategory from "./admin function/danh mục sản phẩm";
import AccountExiting from "./admin function/Tài khoản hệ thống";
import AccountWaiting from "./admin function/Tk đợi duyệt";
import OverallManagement from "./admin function/quản lý chung";
import BranchesCategory from "./admin function/Danh mục chi nhánh";
import CreateNewProductCategory from "./admin function/danh mục sản phẩm/Tạo danh mục mới";
import CreateNewBrandCategory from "./admin function/Danh mục chi nhánh/Tạo danh mục mới";
import LogOut from "./Logout";
import { logout } from "../slices/auth";
import { Dropdown, Button, Space, Menu, Form, Select, Input } from "antd";
const { Option } = Select;

// const items = [
//   {
//     label: (
//       <Link
//         className="nav-link"
//         style={{ color: "black", display: "inline", width: "100px" }}
//       >
//         asda
//       </Link>
//     ),
//     key: "SubMenu",

//     popupClassName: "sda ",
//     children: [
//       {
//         type: "group",
//         label: "Sản phẩm",

//         children: [
//           {
//             label: (
//               <Link to={"/admin/product-category-mn"}>Danh mục sản phẩm</Link>
//             ),
//             key: "setting:1",
//           },
//           {
//             label: (
//               <Button
//                 type="primary"
//                 onClick={showDrawer}
//                 icon={<PlusOutlined />}
//               >
//                 Tạo mới danh mục
//               </Button>
//             ),
//             key: "setting:2",
//           },
//         ],
//       },
//       {
//         type: "group",
//         label: "Chi nhánh",

//         children: [
//           {
//             label: (
//               <Link to={"/admin/product-category-mn"}>
//                 Danh mục chi nhánh liên quan
//               </Link>
//             ),
//             key: "setting:3",
//           },
//           {
//             label: (
//               <Button
//                 type="primary"
//                 onClick={showDrawer}
//                 icon={<PlusOutlined />}
//               >
//                 Tạo mới chi nhánh
//               </Button>
//             ),
//             key: "setting:4",
//           },
//         ],
//       },
//     ],
//   },
// ];
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
  const [content, setContent] = useState("");
  const [current, setCurrent] = useState("mail");
  const [openProductCategoryDrawer, setOpenProductCategoryDrawer] =
    useState(false);
  const [openBrandCategoryDrawer, setOpenBrandCategoryDrawer] = useState(false);

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
  const showCreateBrandCategoryDrawer = () => {
    setOpenBrandCategoryDrawer(true);
  };
  const items = [
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
              key: "setting:1",
            },
            {
              label: (
                <Button
                  type="primary"
                  onClick={showCreateProductCategoryDrawer}
                  icon={<PlusOutlined />}
                >
                  Tạo mới danh mục
                </Button>
              ),
              key: "setting:2",
            },
          ],
        },
        {
          type: "group",
          label: "Chi nhánh",

          children: [
            {
              label: (
                <Link to={"/admin/cssx-dlpp-ttbh-mn-category-mn"}>
                  Danh mục chi nhánh liên quan
                </Link>
              ),
              key: "setting:3",
            },
            {
              label: (
                <Button
                  type="primary"
                  onClick={showCreateBrandCategoryDrawer}
                  icon={<PlusOutlined />}
                >
                  Tạo mới chi nhánh
                </Button>
              ),
              key: "setting:4",
            },
          ],
        },
      ],
    },
  ];
  // const NewProductRecord = () => {
  //   return (
  //     <Form {...layout} form={form} name="control-hooks" onFinish={onFinish}>
  //       <Form.Item
  //         name="Ngành hàng cha"
  //         label="Ngành hàng cha"
  //         rules={[
  //           {
  //             required: true,
  //           },
  //         ]}
  //       >
  //         <Select
  //           placeholder="Select a option and change input text above"
  //           onChange={onFatherCategoryChange}
  //           allowClear
  //         >
  //           <Option value="male">male</Option>
  //           <Option value="female">female</Option>
  //           <Option value="other">other</Option>
  //         </Select>
  //       </Form.Item>
  //       <Form.Item
  //         name="note"
  //         label="Tên ngành hàng"
  //         rules={[
  //           {
  //             required: true,
  //           },
  //         ]}
  //       >
  //         <Input />
  //       </Form.Item>
  //       <Form.Item {...tailLayout}>
  //         <Button type="primary" htmlType="submit">
  //           Submit
  //         </Button>
  //         <Button htmlType="button" onClick={onReset}>
  //           Reset
  //         </Button>
  //       </Form.Item>
  //     </Form>
  //   );
  // };
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
              <Link
                to={"/admin/cssx-dlpp-ttbh-mn-category-mn"}
                className="nav-link"
              >
                Admin Board
              </Link>
            </li>
            <li
              className="nav-item"
              style={{
                display: "inline",
                marginTop: "-4px",
              }}
            >
              <Menu
                theme={"light"}
                onClick={onClick}
                selectedKeys={[current]}
                mode="horizontal"
                items={items}
                style={{
                  backgroundColor: "black",
                  display: "inline",
                }}
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
          <Route path="account-exiting" element={<AccountExiting />} />
          <Route path="account-waiting" element={<AccountWaiting />} />
          <Route
            path="cssx-dlpp-ttbh-mn-category-mn"
            element={<BranchesCategory />}
          />
          <Route
            path="quan-ly-san-pham-chung"
            element={<OverallManagement />}
          />
        </Routes>
      </div>
      <CreateNewBrandCategory
        open={openBrandCategoryDrawer}
        setClose={setOpenBrandCategoryDrawer}
      />
      <CreateNewProductCategory
        open={openProductCategoryDrawer}
        setClose={setOpenProductCategoryDrawer}
      />
    </>
  );
};
export default BoardAdmin;
