import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "/api/facility/";

/*
 *
 *Dữ liệu để chọn danh mục sp trong khi nhập sản phẩm vào kho cssx
 *
 */
const getProductDirectory = () => {
  return axios.get(API_URL + "directory/product", {
    headers: authHeader(),
  });
};
/*
 *
 *Khi bấm chọn id danh mục sp thì sẽ có thông số gửi lên, ko có thì phải thêm mới thông số
 *
 */
const getThongSo = (id) => {
  return axios.get(API_URL + "specifications/" + `${id}`, {
    headers: authHeader(),
  });
};
const postCreateNewProduct = (
  ten_san_pham,
  hinh_anh,
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
) => {
  console.log(id_thong_so);
  console.log(so_luong);
  console.log(hinh_anh);
  return axios.post(
    API_URL + "product/create",
    {
      ten_san_pham,
      hinh_anh,
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
      id_thong_so,
    },
    {
      headers: authHeader(),
    }
  );
};
/*
 *
 * Tất cả sản phẩm có thể xuất đi đại lý
 *
 */
const getProductAbleToTransferToAgentDistribution = () => {
  return axios.get(API_URL + "product-new", {
    headers: authHeader(),
  });
};
//missing
const getAgentDistributionList = () => {
  return axios.get("/api/distribution-agent/directory", {
    headers: authHeader(),
  });
};

/*
 *
 * Xuất sản phẩm cho đại lý
 *
 */
const postSttProductIsDeliveringToAgentDistribution = (ids, id_dai_ly) => {
  console.log(ids, id_dai_ly);
  return axios.post(
    API_URL + "product/deliver",
    {
      ids,
      id_dai_ly,
    },
    {
      headers: authHeader(),
    }
  );
};
/*
 *
 *  xem  ds sản phẩm lỗi đang chuyển về cơ sở
 *
 */
const getProductIncomingToThisFacility = () => {
  return axios.get(API_URL + "product/faulty/all", {
    headers: authHeader(),
  });
};

const putSttWhenProductDelivered = (ids) => {
  return axios.put(
    API_URL + "product/faulty/receiv",
    { ids },
    {
      headers: authHeader(),
    }
  );
};
/*
 *
 *  Thống kê
 *
 */
const getProductStatus = () => {
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
    API_URL + "product/statistical/sold",
    {
      type,
      year,
    },
    {
      headers: authHeader(),
    }
  );
};

//Thống kê tỉ lệ
const ProductStatisticRatioData = () => {
  return axios.get(
    API_URL + "product/statistical/err/show",

    {
      headers: authHeader(),
    }
  );
};

const ProductStatisticRatioNumber = (
  directoryProductId,
  productionFacilityId,
  distributionAgentId
) => {
  return axios.get(
    API_URL +
      "product/statistical/err/" +
      `${directoryProductId}/${productionFacilityId}/${distributionAgentId}`,

    {
      headers: authHeader(),
    }
  );
};
const facilityService = {
  getProductDirectory,
  postCreateNewProduct,
  getProductAbleToTransferToAgentDistribution,
  getAgentDistributionList,
  postSttProductIsDeliveringToAgentDistribution,
  getProductIncomingToThisFacility,
  putSttWhenProductDelivered,
  getProductStatus,
  ProductStatisticData,
  ProductStatisticNumber,
  getThongSo,
  ProductStatisticRatioData,
  ProductStatisticRatioNumber,
};
export default facilityService;
