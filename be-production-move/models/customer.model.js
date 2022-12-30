const sql = require("./").connection;

// constructor
const Customer = function (customer) {
    this.ho_ten = customer.ho_ten;
    this.ngay_sinh = customer.ngay_sinh;
    this.dia_chi = customer.dia_chi;
    this.so_dien_thoai = customer.so_dien_thoai;
    this.email = customer.email;
};

Customer.create = newCustomer => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO khach_hang SET ?", newCustomer, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("Khách hàng đã tạo: ", { id: res.insertId, ...newCustomer });
      resolve({ id: res.insertId, ...newCustomer });
    });
  });
};

Customer.getAll = ids => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM khach_hang";

        if (ids) {
            query += ` WHERE `;
        }
        if (ids) {
            query += `id IN (`;
            for (let i = 0; i < ids.length; i++) {
                if (i === ids.length - 1) {
                    query += `${ids[i]}`;
                } else {
                    query += `${ids[i]}, `;
                }
            }
            query += `)`;
        }


        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các khách hàng: ", res);
                return resolve(res);
            }

            // không tìm thấy các khách hàng
            reject({ kind: "not_found" });
        });
    });
};

Customer.findByNameAndDateOfBirth = (name, dateOfBirth) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM khach_hang WHERE ho_ten = '${name}' AND ngay_sinh = '${dateOfBirth}'`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các khách hàng: ", res);
                return resolve(res);
            }

            // không tìm thấy các khách hàng với tên và ngày sinh
            reject({ kind: "not_found" });
        });
    });
};

module.exports = Customer;