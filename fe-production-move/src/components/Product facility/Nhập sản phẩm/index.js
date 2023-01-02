import React, { useState, useRef } from "react";
import {
  Space,
  Switch,
  Table,
  Button,
  Input,
  Form,
  Select,
  Row,
  Col,
  InputNumber,
  Upload,
  TreeSelect,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useEffect } from "react";
import facilityService from "../../../services/product.facility.service";
import CreateNewProduct from "../Create new product";
import { formItemLayout } from "../../Share function";
import { handleProductCategoryReturnedFromBE } from "../../Share function";
const { Option } = Select;
const string = '"';
const NhapSanPham = () => {
  const [danhMucSP, setDanhMucSp] = useState([]);
  const [form] = Form.useForm();
  const [pdCategoryId, setPdCategoryId] = useState();
  const [id_thong_so, setId_thong_so] = useState();
  const [openCreateNewProductForm, setOpenCreateNewProductForm] =
    useState(false);
  const [file, setFile] = useState();
  //create new prdu
  const [productDirectory, setProductDirectory] = useState([]);
  const [productDirectorySelect, setproductDirectorySelect] =
    useState(undefined);
  const onChangeProductDirectorySelect = (values) => {
    setproductDirectorySelect(values);
  };
  useEffect(() => {
    facilityService.getProductDirectory().then(
      (response) => {
        setProductDirectory(handleProductCategoryReturnedFromBE(response.data));
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
  //Cho phần tải hình ảnh lên
  const [state, setState] = useState({
    selectedFile: null,
    selectedFileList: [],
  });
  const dummyRequest = ({ file, onSuccess }) => {
    console.log(file);
    const url = URL.createObjectURL(file);
    setFile(url);
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const props = {
    name: "file",
    onChange(info) {
      const nextState = {};
      switch (info.file.status) {
        case "uploading":
          nextState.selectedFileList = [info.file];
          console.log(info.file, info.fileList);
          break;
        case "done":
          nextState.selectedFile = info.file;
          nextState.selectedFileList = [info.file];
          break;

        default:
          // error or removed
          nextState.selectedFile = null;
          nextState.selectedFileList = [];
      }
      setState(nextState);
    },
    progress: {
      strokeColor: {
        "0%": "#108ee9",
        "100%": "#87d068",
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
  };

  // Hết phần hình ảnh
  //end of create new pr
  const onFinish = (vl) => {
    const {
      ten_san_pham,
      thoi_han_bao_hanh,
      id_danh_muc_sp,
      so_luong,
      man_hinh,
      he_dieu_hanh,
      camera_truoc,
      camera_sau,
      chip,
      ram,
      dung_luong_luu_tru,
      sim,
      pin,
    } = vl;
    facilityService
      .postCreateNewProduct(
        ten_san_pham,
        file,
        thoi_han_bao_hanh,
        id_danh_muc_sp,
        so_luong,
        man_hinh,
        he_dieu_hanh,
        camera_truoc,
        camera_sau,
        chip,
        ram,
        dung_luong_luu_tru,
        sim,
        pin,
        id_thong_so
      )
      .then(
        (response) => {
          console.log(response);
          alert("Nhập sản phẩm thành công");
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
  useEffect(() => {
    facilityService.getProductDirectory().then(
      (response) => {
        setDanhMucSp(response.data);
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
  const changeProductCategory = (id) => {
    setPdCategoryId(id);
    facilityService.getThongSo(id).then(
      (response) => {
        console.log(response.data.id_thong_so);
        setId_thong_so(response.data.id_thong_so);
        setOpenCreateNewProductForm(false);
      },
      (error) => {
        const _content =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setId_thong_so(undefined);
        console.log(_content);
        setOpenCreateNewProductForm(true);
      }
    );
  };
  return (
    <>
      <Form
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        {...formItemLayout}
      >
        <Form.Item
          name="id_danh_muc_sp"
          label="Chọn danh mục sản phẩm "
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Select
            placeholder="Chọn danh mục sản phẩm"
            allowClear
            onChange={changeProductCategory}
          >
            {danhMucSP.map((dm) => {
              return <Option value={dm.id}>{dm.ten_danh_muc_sp}</Option>;
            })}
          </Select>
        </Form.Item>
        {!openCreateNewProductForm && (
          <>
            <Form.Item
              {...formItemLayout}
              name="so_luong"
              label="Nhập số lượng đầu vào "
              rules={[
                {
                  required: true,
                  message: "Nhập số lượng sản phẩm đầu vào",
                },
              ]}
            >
              <InputNumber min={0} addonAfter="Chiếc" />
            </Form.Item>
            <Form.Item
              name="ten_san_pham"
              label="Tên sản phẩm"
              rules={[
                {
                  required: true,
                  message: "Nhập tên sản phẩm mới",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="hinh_anh"
              label="Chọn hình ảnh"
              rules={[
                {
                  required: true,
                  message: "Hãy tải lên một hình ảnh",
                },
              ]}
            >
              <Upload
                {...props}
                fileList={state.selectedFileList}
                customRequest={dummyRequest}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="thoi_han_bao_hanh"
              label="Thời hạn bảo hành (tháng)"
              rules={[
                {
                  required: true,
                  message: "Nhập tên sản phẩm mới",
                },
              ]}
            >
              <InputNumber min={0} addonAfter="Tháng" />
            </Form.Item>
          </>
        )}
        {openCreateNewProductForm && (
          <>
            <Form.Item
              name="ten_san_pham"
              label="Tên sản phẩm"
              rules={[
                {
                  required: true,
                  message: "Nhập tên sản phẩm mới",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="hinh_anh"
              label="Chọn hình ảnh"
              rules={[
                {
                  required: true,
                  message: "Hãy tải lên một hình ảnh",
                },
              ]}
            >
              <Upload
                {...props}
                fileList={state.selectedFileList}
                customRequest={dummyRequest}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>

            <Form.Item
              name="thoi_han_bao_hanh"
              label="Thời hạn bảo hành (tháng)"
              rules={[
                {
                  required: true,
                  message: "Nhập tên sản phẩm mới",
                },
              ]}
            >
              <InputNumber min={0} addonAfter="Tháng" />
            </Form.Item>
            <Form.Item
              name="Số lượng"
              label="Số lượng sản phẩm"
              rules={[
                {
                  required: true,
                  message: "Nhập số lượng sản phẩm",
                },
              ]}
            >
              <InputNumber min={0} addonAfter="Chiếc" />
            </Form.Item>
            <Form.Item
              name="man_hinh"
              label="Màn hình rộng"
              rules={[
                {
                  required: true,
                  message: "Nhập độ rộng màn hình",
                },
              ]}
            >
              <InputNumber min={0} addonAfter={string} />
            </Form.Item>
            <Form.Item
              name="he_dieu_hanh"
              label="Hệ điều hành"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <InputNumber min={0} addonAfter={string} />
            </Form.Item>
            <Form.Item
              name="camera_truoc"
              label="Cammera trước"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <InputNumber min={0} addonAfter={"MP"} />
            </Form.Item>
            <Form.Item
              name="camera_sau"
              label="Cammera sau"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <InputNumber min={0} addonAfter={"MP"} />
            </Form.Item>
            <Form.Item
              name="chip"
              label="Chip"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="ram"
              label="Ram"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <InputNumber min={0} addonAfter={"G"} />
            </Form.Item>
            <Form.Item
              name="dung_luong_luu_tru"
              label="Dung lượng lưu trữ"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <InputNumber min={0} addonAfter={"G"} />
            </Form.Item>
            <Form.Item
              name="sim"
              label="Sim"
              rules={[
                {
                  required: true,
                  message: "",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="id_danh_muc_sp"
              label="Chọn danh mục tương ứng"
              rules={[
                {
                  required: true,
                  message: "Lựa chọn 1 danh mục có sẵn",
                },
              ]}
            >
              <TreeSelect
                showSearch
                style={{
                  width: "100%",
                }}
                value={productDirectorySelect}
                dropdownStyle={{
                  maxHeight: 400,
                  overflow: "auto",
                }}
                placeholder="Please select"
                allowClear
                treeDefaultExpandAll
                onChange={onChangeProductDirectorySelect}
                treeData={productDirectory}
              />
            </Form.Item>
          </>
        )}
        <Button
          style={{ left: "13%", width: "41%", marginTop: "30px" }}
          type="primary"
          htmlType="submit"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};
export default NhapSanPham;
