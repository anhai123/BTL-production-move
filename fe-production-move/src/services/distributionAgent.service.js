import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "/api/distribution-agent/";

const getListOfComingToDistributionAgentProduct = () => {
  return axios.get(API_URL + "product", {
    headers: authHeader(),
  });
};

const putProductInWarehouseOfDistributionAgent = (ids) => {
  return axios.put(
    API_URL + "product ",
    { ids: ids },
    {
      headers: authHeader(),
    }
  );
};
const getCustomerInformation = (name, dateOfBirth) => {
  return axios.get(API_URL + "customer" + `/${name}/${dateOfBirth}`, {
    headers: authHeader(),
  });
};
//customername, dateOfBirth, customerSelected.dia_chi, customerSelected.so_dien_thoai, customerSelected.email, customerSelected.id_khach_hang , productId
const putProductStatusAfterSelling = (id) => {
  return axios.put(
    API_URL + "product/sell",
    { id },
    {
      headers: authHeader(),
    }
  );
};

const putProductNeedMaintanance = (id) => {
  const id1 = parseInt(id);
  return axios.put(
    API_URL + `product/error/${id1}`,
    {},
    {
      headers: authHeader(),
    }
  );
};

const getSelectWarrantyCenter = () => {
  return axios.get(API_URL + "warranty-center-pick", {
    headers: authHeader(),
  });
};

/*
 *
 * Cho việc cập nhật trạng thái danh sách sản phẩm lỗi đang chuyển đến đại lý
 *
 */
const getNeedMaintenanceProduct = () => {
  return axios.get(API_URL + "product/warranty", { headers: authHeader() });
};

const putShippingProductToWarrantyCenter = (ids, id_trung_tam_bh) => {
  return axios.put(
    API_URL + "product/shipping-to-warranty-center",
    { ids, id_trung_tam_bh },
    {
      headers: authHeader(),
    }
  );
};

/*
 *
 * Khi nhận được sản phẩm bảo hành xong hoặc lỗi, không thể sửa chữa (hiện ra thông tin các sản phẩm đang gửi về)
 *
 *
 */
//40
const getIncomingMaintenanceCompleteOrUnfixedProduct = () => {
  return axios.get(API_URL + "product/warranty/complete", {
    headers: authHeader(),
  });
};
//41
const putSttIncomingToShippedToDistributionAgents = (ids, id_trung_tam_bh) => {
  return axios.put(
    API_URL + "product/warranty/complete/arrived",
    { ids },
    {
      headers: authHeader(),
    }
  );
};

/*
 *
 * Xem các sản phẩm cần trả lại cho khách hàng
 *
 *
 */
const getReturningToCustomerProduct = () => {
  return axios.get(API_URL + "product/warranty/complete/arrived", {
    headers: authHeader(),
  });
};

const putSttProductWhenReturnToCustomer = (id) => {
  return axios.put(
    API_URL + "product/return/" + `${id}`,
    {},
    {
      headers: authHeader(),
    }
  );
};
/*
 *
 * Xem các sản phẩm cần trả cơ sở sản xuất
 *
 */
const getNeedToDeliverToProductFacilityProduct = () => {
  return axios.get(API_URL + "product/err", {
    headers: authHeader(),
  });
};

const putSttProductWhenReturnToProductFacility = (ids) => {
  return axios.put(
    API_URL + "/product/move-to-production-facility",
    { ids },
    {
      headers: authHeader(),
    }
  );
};

/*
 *
 * Xem danh sách khách hàng cần bàn giao sản phẩm mới thay thế
 *
 */
//46
const getCustomerListGetReplaceProduct = () => {
  return axios.get(API_URL + "customer/new-replacement-product", {
    headers: authHeader(),
  });
};

const putSttProductWhenCustomerGetReplacedOnes = (
  id_cu,
  id_moi,
  id_khach_hang
) => {
  return axios.put(
    API_URL + "product/new-replacement-product",
    { id_cu, id_moi, id_khach_hang },
    {
      headers: authHeader(),
    }
  );
};
/*
 *
 * Xem danh sách sản phẩm cần triệu hồi
 *
 */

const getListSummonProduct = () => {
  return axios.get(API_URL + "product/summon", {
    headers: authHeader(),
  });
};

/*
 *
 * Chức năng thống kê
 *
 */

//Chọn trạng thái thống kê

const StatusProduct = () => {
  return axios.get(API_URL + "product/statistical/status/show", {
    headers: authHeader(),
  });
};

//Theo từng loại
const ProductStatisticData = (statusId, month, quarter, year) => {
  return axios.get(
    API_URL +
      "product/statistical/status" +
      `/${statusId}/${month}/${quarter}/${year}/`,

    {
      headers: authHeader(),
    }
  );
};
//Thống kê số lượng sản phẩm bán ra
const ProductStatisticNumber = (type, year) => {
  return axios.get(
    API_URL + "product/statistical/sell/" + `${type}/${year}`,

    {
      headers: authHeader(),
    }
  );
};
const distributionAgentServices = {
  getListOfComingToDistributionAgentProduct,
  putProductInWarehouseOfDistributionAgent,
  getCustomerInformation,
  putProductStatusAfterSelling,
  putProductNeedMaintanance,
  getSelectWarrantyCenter,
  getNeedMaintenanceProduct,
  putShippingProductToWarrantyCenter,
  getIncomingMaintenanceCompleteOrUnfixedProduct,
  putSttIncomingToShippedToDistributionAgents,
  getNeedToDeliverToProductFacilityProduct,
  putSttProductWhenReturnToProductFacility,
  getCustomerListGetReplaceProduct,
  putSttProductWhenCustomerGetReplacedOnes,
  getReturningToCustomerProduct,
  putSttProductWhenReturnToCustomer,
  getListSummonProduct,
  ProductStatisticData,
  ProductStatisticNumber,
  StatusProduct,
};

export default distributionAgentServices;
