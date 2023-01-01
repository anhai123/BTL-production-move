import axios from "axios";

const API_URL = "/api/auth/";

const register = (
  tai_khoan,
  email,
  mat_khau,
  id_vai_tro,
  ten_co_so,
  dia_chi_cu_the,
  so_dien_thoai,
  phuong,
  quan,
  tinh
) => {
  return axios.post(API_URL + "signup", {
    tai_khoan,
    email,
    mat_khau,
    id_vai_tro,
    ten_co_so,
    dia_chi_cu_the,
    so_dien_thoai,
    phuong,
    quan,
    tinh,
  });
};

const login = (username, password) => {
  return axios
    .post(API_URL + "signin", {
      tai_khoan: username,
      mat_khau: password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
