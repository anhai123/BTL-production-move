import React, { useEffect, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import ModeratorService from "../../../../services/moderator.service";
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  Row,
  Select,
  Space,
} from "antd";
const { Option } = Select;
const CreateNewProductCategory = ({ open, setClose }) => {
  const [rootDataSelection, setRootDataSelection] = useState([]);
  const [index, setIndex] = useState([]);
  const [form] = Form.useForm();
  const [type, setType] = useState();
  const [RootProductCategory, setRootProductCategory] = useState();
  const onClose = () => {
    setClose(false);
  };
  useEffect(() => {
    if ((type && RootProductCategory) != null) {
      //đang lỗi do không tìm được nên ko set đc index
      ModeratorService.getIndexWhenSelectRelevantRootProductCategory(
        type,
        RootProductCategory
      ).then(
        (response) => {
          console.log(response.data[1].ordinalNumbers);
          setIndex(response.data[1].ordinalNumbers);
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
    }
  }, [type, RootProductCategory]);
  useEffect(() => {
    ModeratorService.getDirectoryProduct().then(
      (response) => {
        setRootDataSelection(response.data);
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
  }, [type]);
  const onTypeChange = (value) => {
    console.log(value);
    setType(value);
  };
  const onRootProductCategorySelect = (value) => {
    console.log(value);
    setRootProductCategory(value);
  };
  const clickSubmitCreateNpdForm = async () => {
    console.log(form.getFieldValue("description"));
    try {
      const values = await form.validateFields();
      console.log("Success:", values);
      ModeratorService.submitCreateNpdForm(
        type,
        RootProductCategory,
        index,
        form.getFieldValue("description")
      ).then(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
      setClose(false);
      form.resetFields();
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };
  const handleIndexChange = (index) => {
    setIndex(index);
  };
  return (
    <>
      <Drawer
        title="Create  a new product category"
        width={720}
        onClose={onClose}
        open={open}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="owner"
                label="Root product category"
                rules={[
                  {
                    required: true,
                    message: "PLease select a root product category",
                  },
                ]}
              >
                <Select
                  onChange={onRootProductCategorySelect}
                  placeholder="PLease select a root product category"
                >
                  <Option value={0}>Chua co gi</Option>
                  {rootDataSelection.map((dataObject) => {
                    return (
                      <Option value={dataObject.id}>
                        {dataObject.ten_danh_muc_sp}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category-type"
                label="Type of this category"
                rules={[
                  {
                    required: true,
                    message: "PLease select a type product category",
                  },
                ]}
              >
                <Select
                  onChange={onTypeChange}
                  placeholder="PLease select a type product category"
                >
                  <Option value="parentDirectory">Parent Directory</Option>
                  <Option value="brotherDirectory">Brother Directory</Option>
                  <Option value="childDirectory">Child Directory</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="type"
                label="Index"
                rules={[
                  {
                    required: true,
                    message: "Please chose an index",
                  },
                ]}
              >
                <Select
                  onChange={handleIndexChange}
                  placeholder="Please chose an index"
                >
                  {index[0] != null ? (
                    index.map((dataObject) => {
                      return <Option value={dataObject}>{dataObject}</Option>;
                    })
                  ) : (
                    <></>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Product category name"
                rules={[
                  {
                    required: true,
                    message: "PLease insert a name",
                  },
                ]}
              >
                <Input rows={4} placeholder="Unduplicated name would be nice" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item>
                <Button
                  onClick={clickSubmitCreateNpdForm}
                  type="primary"
                  htmlType="submit"
                >
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </>
  );
};
export default CreateNewProductCategory;
