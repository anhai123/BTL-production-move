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

const getDirectoryProduct = () => {
  return axios.get(API_URL + "directory/product", { headers: authHeader() });
};
const pushButtonCreateNewDirectoryProduct = () => {
  return axios.get(API_URL + "directory/product/create", {
    headers: authHeader(),
  });
};

const getIndexWhenSelectRelevantRootProductCategory = (type, directoryName) => {
  console.log(directoryName);
  return axios.get(
    API_URL + "directory/product/create/" + `${type}/${directoryName}`,
    {
      headers: authHeader(),
    }
  );
};

const submitCreateNpdForm = (type, directoryName, id, newDirectoryName) => {
  console.log(type, directoryName, id, newDirectoryName);
  return axios.post(
    API_URL + "directory/product/create" + `/${type}/${directoryName}`,
    {
      id,
      newDirectoryName,
    },
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
};

export default moderatorService;
