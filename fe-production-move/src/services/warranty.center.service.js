import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "/api/warranty-center/";

/*
 *
 * Tất cả sản phẩm cần bảo hành
 *
 */
const getneedMaintenanceProduct = () => {
  return axios.get(API_URL + "products", {
    headers: authHeader(),
  });
};

/*
 *
 * Nhận sản phẩm bắt đầu bảo hành
 *
 */
const putSttReceivingMaintenanceProduct = (updateId) => {
  return axios.put(
    API_URL + "products/receiv",
    { ids: updateId },
    {
      headers: authHeader(),
    }
  );
};

/*
 *
 * Tất cả sản phẩm đang bảo hành tại trung tâm
 *
 */
const getInMaintenancePeriodProduct = () => {
  return axios.get(API_URL + "products/under", {
    headers: authHeader(),
  });
};

/*
 *
 * bấm xác nhận sau khi , chọn lỗi ko sửa được, or sửa chữa được
 *
 */

const postSttUnfixOrCompletedMaintenance = (id, id_trang_thai) => {
  return axios.post(
    API_URL + "product/finnish",
    {
      id_trang_thai,
      id,
    },
    {
      headers: authHeader(),
    }
  );
};

/*
 *
 * Tất cả sản phẩm bảo hành xong , không lỗi
 *
 */
const getFinishMaintenanceProduct = () => {
  return axios.get(API_URL + "products-finnish", {
    headers: authHeader(),
  });
};

/*
 *
 * Tất cả sản phẩm lỗi, không bảo hành được
 *
 */
const getUnfixEventAfterMaintenanceProduct = () => {
  return axios.get(API_URL + "products-faulty", {
    headers: authHeader(),
  });
};

/*
 *
 * Khi bấm vào nút xác nhận chuyển sản phảm lỗi or bảo hành xong đến đại lý
 *
 */
const postSttSendUnfixProductToAgentDistribution = (id, id_trang_thai_) => {
  return axios.post(
    API_URL + "products/deliver",
    {
      id_trang_thai_,
      id,
    },
    {
      headers: authHeader(),
    }
  );
};
/*
 *
 * Thống kê
 *
 */
const getAllProductStatus = () => {
  return axios.get(API_URL + "product/statistical/status/show", {
    headers: authHeader(),
  });
};

//Thống kê số liệu sản phẩm theo từng loại
const getStatisticInData = (statusId, month, quarter, year) => {
  return axios.get(
    API_URL +
      "product/statistical/status" +
      `/${statusId}/${month}/${quarter}/${year}`,
    {
      headers: authHeader(),
    }
  );
};
const warrantyCenterService = {
  getneedMaintenanceProduct,
  putSttReceivingMaintenanceProduct,
  getInMaintenancePeriodProduct,
  postSttUnfixOrCompletedMaintenance,
  getFinishMaintenanceProduct,
  getUnfixEventAfterMaintenanceProduct,
  postSttSendUnfixProductToAgentDistribution,
  getStatisticInData,
  getAllProductStatus,
};
export default warrantyCenterService;
