import axios from "axios";
import authHeader from "./auth-header";
const API_URL = "/api/moderator/";

const getWaitingAccountList = () => {
  return axios.get(API_URL + "account", { headers: authHeader() });
};

const acceptWaitingAccount = (updateId) => {
  return axios.put(
    API_URL + "account",
    { ids: updateId },
    {
      headers: authHeader(),
    }
  );
};
const rejectWaitingAccount = (updateId) => {
  return axios.delete(API_URL + "account", {
    headers: authHeader(),
    data: {
      ids: updateId,
    },
  });
};
/*
 *
 *Danh mục sản phẩm
 *
 */
const getDirectoryProduct = () => {
  return axios.get(API_URL + "directory/product", { headers: authHeader() });
};
const pushButtonCreateNewDirectoryProduct = () => {
  return axios.get(API_URL + "directory/product/create", {
    headers: authHeader(),
  });
};

const getIndexWhenSelectRelevantRootProductCategory = (type, directoryId) => {
  console.log(directoryId);
  return axios.get(
    API_URL + "directory/product/create/" + `${type}/${directoryId}`,
    {
      headers: authHeader(),
    }
  );
};

const submitCreateNpdForm = (type, directoryId, stt, ten_danh_muc_sp) => {
  console.log(type, directoryId, stt, ten_danh_muc_sp);
  return axios.post(
    API_URL + "directory/product" + `/${type}/${directoryId}`,
    {
      stt,
      ten_danh_muc_sp,
    },
    {
      headers: authHeader(),
    }
  );
};

const deleteProductCategory = (id) => {
  return axios.delete(API_URL + "directory/product/" + `${id}`, {
    headers: authHeader(),
  });
};

/*
 *
 *Danh mục sản phẩm
 *
 */

/*
 *
 *Danh mục trung cssx
 *
 */
const getDirectoryCssx = () => {
  return axios.get(API_URL + "directory/production-facility", {
    headers: authHeader(),
  });
};
const pushButtonCreateNewDirectoryCssx = () => {
  return axios.get(API_URL + "directory/product/production-facility", {
    headers: authHeader(),
  });
};

const getIndexWhenSelectRelevantRootProductFacilityCategory = (
  type,
  directoryId
) => {
  console.log(directoryId);
  return axios.get(
    API_URL +
      "directory/production-facility/create/" +
      `${type}/${directoryId}`,
    {
      headers: authHeader(),
    }
  );
};

const submitCreateNproductFacilityForm = (
  type,
  directoryId,
  stt,
  ten_danh_muc_cssx
) => {
  console.log(type, directoryId, stt, ten_danh_muc_cssx);
  return axios.post(
    API_URL + "directory/production-facility" + `/${type}/${directoryId}`,
    {
      stt,
      ten_danh_muc_cssx,
    },
    {
      headers: authHeader(),
    }
  );
};

const deleteProductFacilityCategory = (id) => {
  return axios.delete(API_URL + "directory/production-facility/" + `${id}`, {
    headers: authHeader(),
  });
};

/*
 *
 *Danh mục ttbh
 *
 */
const getDirectoryTtbh = () => {
  return axios.get(API_URL + "directory/warranty-center", {
    headers: authHeader(),
  });
};
const pushButtonCreateNewDirectoryWarrantyCenter = () => {
  return axios.get(API_URL + "directory/warranty-center/create", {
    headers: authHeader(),
  });
};

const getIndexWhenSelectRelevantRootWarrantyCenterCategory = (
  type,
  directoryId
) => {
  console.log(directoryId);
  return axios.get(
    API_URL + "directory/warranty-center/create/" + `${type}/${directoryId}`,
    {
      headers: authHeader(),
    }
  );
};

const submitCreateNWarrantyCenterForm = (
  type,
  directoryId,
  stt,
  ten_danh_muc_ttbh
) => {
  console.log(type, directoryId, stt, ten_danh_muc_ttbh);
  return axios.post(
    API_URL + "directory/warranty-center" + `/${type}/${directoryId}`,
    {
      stt,
      ten_danh_muc_ttbh,
    },
    {
      headers: authHeader(),
    }
  );
};

const deleteWarrantyCenterCategory = (id) => {
  return axios.delete(API_URL + "directory/warranty-center/" + `${id}`, {
    headers: authHeader(),
  });
};

/*
 *
 *Danh mục đại lý phân phối
 *
 */
const getDirectoryDlpp = () => {
  return axios.get(API_URL + "directory/distribution-agent", {
    headers: authHeader(),
  });
};
const pushButtonCreateNewDirectoryDlpp = () => {
  return axios.get(API_URL + "directory/distribution-agent/create", {
    headers: authHeader(),
  });
};

const getIndexWhenSelectRelevantRootDlppCategory = (type, directoryId) => {
  console.log(directoryId);
  return axios.get(
    API_URL + "directory/distribution-agent/create/" + `${type}/${directoryId}`,
    {
      headers: authHeader(),
    }
  );
};

const submitCreateDlppCategoryForm = (
  type,
  directoryId,
  stt,
  ten_danh_muc_dlpp
) => {
  console.log(type, directoryId, stt, ten_danh_muc_dlpp);
  return axios.post(
    API_URL + "directory/distribution-agent" + `/${type}/${directoryId}`,
    {
      stt,
      ten_danh_muc_dlpp,
    },
    {
      headers: authHeader(),
    }
  );
};

const deleteDlppCategory = (id) => {
  return axios.delete(API_URL + "directory/distribution-agent/" + `${id}`, {
    headers: authHeader(),
  });
};
/*
 *
 *Chức năng thống kê
 *
 */

const getStatisticsDataForSearch = () => {
  return axios.get(API_URL + "/product", {
    headers: authHeader(),
  });
};

const clickStatisticsProductButton = (
  id_trang_thai,
  id_co_so_sx,
  id_dai_ly,
  id_trung_tam_bh
) => {
  return axios.post(
    API_URL + "product",
    {
      id_trang_thai,
      id_co_so_sx,
      id_dai_ly,
      id_trung_tam_bh,
    },
    {
      headers: authHeader(),
    }
  );
};

const summonProductByProductCAtegoryId = (id) => {
  return axios.put(
    API_URL + "directory/product/summon/" + `${id}`,
    {},
    {
      headers: authHeader(),
    }
  );
};
const moderatorService = {
  submitCreateNpdForm,
  getWaitingAccountList,
  acceptWaitingAccount,
  rejectWaitingAccount,
  getDirectoryProduct,
  pushButtonCreateNewDirectoryProduct,
  getIndexWhenSelectRelevantRootProductCategory,
  deleteProductCategory,
  getDirectoryCssx,
  pushButtonCreateNewDirectoryCssx,
  getIndexWhenSelectRelevantRootProductFacilityCategory,
  submitCreateNproductFacilityForm,
  deleteProductFacilityCategory,
  getDirectoryTtbh,
  pushButtonCreateNewDirectoryWarrantyCenter,
  getIndexWhenSelectRelevantRootWarrantyCenterCategory,
  submitCreateNWarrantyCenterForm,
  deleteWarrantyCenterCategory,
  getDirectoryDlpp,
  pushButtonCreateNewDirectoryDlpp,
  getIndexWhenSelectRelevantRootDlppCategory,
  submitCreateDlppCategoryForm,
  deleteDlppCategory,
  getStatisticsDataForSearch,
  clickStatisticsProductButton,
  summonProductByProductCAtegoryId,
};

export default moderatorService;
