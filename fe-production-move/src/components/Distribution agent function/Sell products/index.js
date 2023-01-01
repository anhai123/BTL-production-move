import React, { useEffect, useState, useRef } from "react";
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
  Typography,
  Tooltip,
  message,
} from "antd";
// import moment from "moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import DistributionAgentServices from "../../../services/distributionAgent.service";
import CreateNewBuyingCustomers from "./Create new buying customer";
const { Option } = Select;
const AgentSellProduct = () => {
  const [customername, setCustomerName] = useState();
  const [dateOfBirth, setDateOfBirth] = useState();
  const [customerList, setCustomerList] = useState([]);
  const [activeFindCustomerInfor, setActiveFindCustomerInfor] = useState(true);

  const [createNewCustomerForm, setCreateNewCustomerForm] = useState(false);
  const [customerBuyProduct, setCustomerBuyProduct] = useState();

  const [form] = Form.useForm();
  const nameValue = Form.useWatch("customername", form);
  const CustomerNameRef = useRef(null);
  const clickSubmitUpdateProductStatusForm = async () => {
    // console.log(form.getFieldValue("description"));
    const values = await form.validateFields();
    console.log("Success:", values);
    // try {
    //   const values = await form.validateFields();
    //   console.log("Success:", values);
    //   ModeratorService.submitCreateNpdForm(
    //     type,
    //     RootProductCategory,
    //     index,
    //     form.getFieldValue("description")
    //   ).then(
    //     (response) => {
    //       console.log(response);
    //     },
    //     (error) => {
    //       console.log(error);
    //     }
    //   );
    //   setClose(false);
    //   form.resetFields();
    // } catch (errorInfo) {
    //   console.log("Failed:", errorInfo);
    // }
  };
  const showDrawer = () => {
    setCreateNewCustomerForm(true);
  };
  const onClose = () => {
    setCreateNewCustomerForm(false);
  };
  const onFinish = (values) => {
    form.validateFields();
    console.log("Success:", values);
    const { customername, customerId, productId } = values;

    const customerSelected = customerList.filter(
      (cus) => cus.id === customerId
    );
    DistributionAgentServices.putProductStatusAfterSelling(productId).then(
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
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onDateOfBirthSelected = (date, dateString) => {
    setDateOfBirth(dateString);

    console.log(form.getFieldValue("dateOfBirth"));
    // console.log(form.getFieldValue("customername"));
    // console.log(form.getFieldValue("dateOfBirth"));
    // console.log(form.getFieldsValue());
    // console.log(CustomerNameRef.current.value);
    console.log(nameValue);
  };
  const onCustomerSelected = (customerId) => {
    console.log(customerId);
  };
  console.log(typeof dateOfBirth);
  useEffect(() => {
    if (customerList[0] === "Không có khách hàng nào phù hợp") {
      setCreateNewCustomerForm(true);
      console.log("heefef");
    }
  }, [customerList]);
  const onchangee = (value) => {
    console.log(value.value);
    console.log(CustomerNameRef.current.value);
    console.log(nameValue);
  };
  useEffect(() => {
    if (
      (nameValue && dateOfBirth) !== undefined &&
      dateOfBirth !== "" &&
      nameValue !== ""
    ) {
      setActiveFindCustomerInfor(false);
    } else setActiveFindCustomerInfor(true);
  }, [dateOfBirth, nameValue]);
  const clickFindExistingCustomer = () => {
    console.log(nameValue);
    if ((nameValue && dateOfBirth) !== undefined && dateOfBirth !== "") {
      setActiveFindCustomerInfor(false);
      DistributionAgentServices.getCustomerInformation(
        nameValue,
        dateOfBirth
      ).then(
        (response) => {
          console.log(response);
          setCustomerList(response.data);
        },
        (error) => {
          const _content =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          console.log(_content);
          setCustomerList(["Không có khách hàng nào phù hợp"]);
          message.error("Không có khách hàng nào phù hợp. Yêu cầu tạo mới");
        }
      );
    }
  };
  return (
    <>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Họ và tên khách"
          name="customername"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input ref={CustomerNameRef} />
        </Form.Item>

        <Form.Item
          label="Ngày sinh khách hàng"
          name="dateOfBirth"
          rules={[
            {
              required: true,
              message: "Please input your date of birth!",
            },
          ]}
        >
          <DatePicker onChange={onDateOfBirthSelected} />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Tooltip
            title={"Bước 1: điền đầy đủ thông tin ở trên."}
            color={"geekblue"}
          >
            <Button
              disabled={activeFindCustomerInfor}
              onClick={clickFindExistingCustomer}
              type="primary"
            >
              Tìm kiếm thông tin khách hàng
            </Button>
          </Tooltip>
        </Form.Item>
        {customerList[0] !== "Không có khách hàng nào phù hợp" &&
        customerList.length > 0 ? (
          <>
            <Form.Item
              label="Nhập id sản phẩm"
              name="productId"
              rules={[
                {
                  required: true,
                  message: "Hãy nhập id sản phẩm vào",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="customerId"
              label="Chọn khách hàng tương ứng"
              rules={[
                {
                  required: true,
                  message: "Chọn một khách hàng",
                },
              ]}
            >
              <Select
                onChange={onCustomerSelected}
                placeholder="Hãy chọn khách hàng tương ứng"
              >
                <Option value={0}>Chua co gi</Option>
                {customerList.map((dataObject) => {
                  if (dataObject !== "Không có khách hàng nào phù hợp")
                    return (
                      <Option value={dataObject.id}>
                        {dataObject.ho_ten} + {dataObject.so_dien_thoai}
                      </Option>
                    );
                })}
              </Select>
            </Form.Item>
          </>
        ) : (
          <></>
        )}

        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button
            onClick={clickSubmitUpdateProductStatusForm}
            type="primary"
            htmlType="submit"
            disabled={
              customerList[0] === "Không có khách hàng nào phù hợp" ||
              customerList.length <= 0
            }
          >
            Lưu thông tin sản phẩm đã bán
          </Button>
        </Form.Item>
      </Form>
      <CreateNewBuyingCustomers
        open={createNewCustomerForm}
        setClose={setCreateNewCustomerForm}
      />
    </>
  );
};
export default AgentSellProduct;
