import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { register } from "../slices/auth";
import { clearMessage } from "../slices/message";
const roles = [
  { id: 1, ten: "Ban điều hành" },
  { id: 2, ten: "Cơ sở sản xuất" },
  { id: 3, ten: "Đại lý phân phối" },
  { id: 4, ten: "Trung tâm bảo hành" },
];
const Register = () => {
  const [successful, setSuccessful] = useState(false);

  const { message } = useSelector((state) => state.message);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  const initialValues = {
    tai_khoan: "",
    email: "",
    mat_khau: "",
    id_vai_tro: "",
    ten_co_so: "",
    dia_chi_cu_the: "",
    so_dien_thoai: "",
    phuong: "",
    quan: "",
    tinh: "",
  };

  const validationSchema = Yup.object().shape({
    tai_khoan: Yup.string()
      .test(
        "len",
        "The username must be between 3 and 20 characters.",
        (val) =>
          val && val.toString().length >= 3 && val.toString().length <= 20
      )
      .required("This field is required!"),
    email: Yup.string()
      .email("This is not a valid email.")
      .required("This field is required!"),
    mat_khau: Yup.string()
      .test(
        "len",
        "The password must be between 6 and 40 characters.",
        (val) =>
          val && val.toString().length >= 6 && val.toString().length <= 40
      )
      .required("This field is required!"),
  });

  const handleRegister = (formValue) => {
    const {
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
    } = formValue;
    console.log(formValue);
    setSuccessful(false);

    dispatch(
      register({
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
      })
    )
      .unwrap()
      .then(() => {
        setSuccessful(true);
      })
      .catch(() => {
        setSuccessful(false);
      });
  };

  return (
    <>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-black">
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign up
              </Link>
            </li>
          </div>
        </nav>
      </div>
      <div className="col-md-12 signup-form">
        <div className="card card-container">
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            <Form>
              {!successful && (
                <div>
                  <div className="form-group">
                    <label htmlFor="tai_khoan">Tài khoản</label>
                    <Field
                      name="tai_khoan"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="tai_khoan"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="dia_chi_cu_the">Địa chỉ cụ thể:</label>
                    <Field
                      name="dia_chi_cu_the"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="dia_chi_cu_the"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="ten_co_so">Tên cơ sở:</label>
                    <Field
                      name="ten_co_so"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="ten_co_so"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="so_dien_thoai">Số điện thoại:</label>
                    <Field
                      name="so_dien_thoai"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="so_dien_thoai"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phuong">Phường:</label>
                    <Field name="phuong" type="text" className="form-control" />
                    <ErrorMessage
                      name="phuong"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="quan">Quận:</label>
                    <Field name="quan" type="text" className="form-control" />
                    <ErrorMessage
                      name="quan"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="tinh">Tỉnh:</label>
                    <Field name="tinh" type="text" className="form-control" />
                    <ErrorMessage
                      name="tinh"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <Field name="email" type="email" className="form-control" />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="id_vai_tro">Vai trò</label>
                    <Field
                      as="select"
                      name="id_vai_tro"
                      className="form-control"
                    >
                      {roles.map((role) => {
                        return (
                          <option key={role.id} value={role.id}>
                            {role.ten}
                          </option>
                        );
                      })}
                    </Field>
                    <ErrorMessage
                      name="id_vai_tro"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="mat_khau">Mật khẩu</label>
                    <Field
                      name="mat_khau"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="mat_khau"
                      component="div"
                      className="alert alert-danger"
                    />
                  </div>

                  <div className="form-group">
                    <button type="submit" className="btn btn-primary btn-block">
                      Sign Up
                    </button>
                  </div>
                </div>
              )}
            </Form>
          </Formik>
        </div>

        {message && (
          <div className="form-group">
            <div
              className={
                successful ? "alert alert-success" : "alert alert-danger"
              }
              role="alert"
            >
              {message}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Register;
