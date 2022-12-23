const sql = require("./").connection;

// constructor
const WarrantyCenter = function(warrantyCenter) {
  this.ten_trung_tam = warrantyCenter.ten_co_so;
  this.dia_chi = warrantyCenter.dia_chi_cu_the;
  this.so_dien_thoai = warrantyCenter.so_dien_thoai;
  this.email = warrantyCenter.email;
  this.phuong = warrantyCenter.phuong;
  this.quan = warrantyCenter.quan;
  this.tinh = warrantyCenter.tinh;
};

WarrantyCenter.create = newWarrantyCenter => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO trung_tam_bao_hanh SET ?", newWarrantyCenter, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("trung tâm bảo hành đã tạo: ", { id: res.insertId, ...newWarrantyCenter });
      resolve({ id: res.insertId, ...newWarrantyCenter });
    });
  });
};

WarrantyCenter.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM trung_tam_bao_hanh", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }
  
      if (res.length) {
        console.log("found warranty centers: ", res);
        return resolve(res);
      }
  
      // not found warranty centers
      reject({ kind: "not_found" });
    });
  });
};

WarrantyCenter.findById = id => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM trung_tam_bao_hanh WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }
  
      if (res.length) {
        console.log("found warranty center: ", res[0]);
        return resolve(res[0]);
      }
  
      // not found warranty center with the id
      reject({ kind: "not_found" });
    });
  });
};

WarrantyCenter.remove = id => {
  return new Promise((resolve, reject) => {
    sql.query("DELETE FROM trung_tam_bao_hanh WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.affectedRows == 0) {
        // not found Warranty Center with the id
        return reject({ kind: "not_found" });
      }

      console.log("deleted warranty center with id: ", id);
      resolve(res);
    });
  });
};

module.exports = WarrantyCenter;