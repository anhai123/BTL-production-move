//pending
import React, { useState, useEffect } from "react";
import {
  AutoComplete,
  Button,
  Cascader,
  Checkbox,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Upload,
  TreeSelect,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { handleProductCategoryReturnedFromBE } from "../../Share function";
import facilityService from "../../../services/product.facility.service";
import { formItemLayout } from "../../Share function";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const string = '"';

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
const CreateNewProduct = () => {
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
  const onFinish = (values) => {
    alert("Nhập sản phẩm vào kho thành công");
  };
  const [form] = Form.useForm();

  //Cho phần tải hình ảnh lên
  const [state, setState] = useState({
    selectedFile: null,
    selectedFileList: [],
  });
  const dummyRequest = ({ file, onSuccess }) => {
    console.log(file);
    // const url = URL.createObjectURL(file);
    // setFile(url);
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
  return (
    <>
      <Form
        form={form}
        {...formItemLayout}
        scrollToFirstError
        onFinish={onFinish}
      >
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
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            style={{ left: "13%", width: "41%", marginTop: "30px" }}
            type="primary"
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default CreateNewProduct;
