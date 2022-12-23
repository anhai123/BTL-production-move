const sql = require("./").connection;

// constructor
const ProductionFacility = function(productionFacility) {
  this.ten_co_so = productionFacility.ten_co_so;
  this.dia_chi = productionFacility.dia_chi_cu_the;
  this.so_dien_thoai = productionFacility.so_dien_thoai;
  this.email = productionFacility.email;
  this.phuong = productionFacility.phuong;
  this.quan = productionFacility.quan;
  this.tinh = productionFacility.tinh;
};

ProductionFacility.create = newProductionFacility => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO co_so_san_xuat SET ?", newProductionFacility, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("cơ sở sản xuất đã tạo: ", { id: res.insertId, ...newProductionFacility });
      resolve({ id: res.insertId, ...newProductionFacility });
    });
  });
};

ProductionFacility.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM co_so_san_xuat", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }
  
      if (res.length) {
        console.log("found production facilitys: ", res);
        return resolve(res);
      }
  
      // not found production facilitys
      reject({ kind: "not_found" });
    });
  });
};

ProductionFacility.findById = id => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM co_so_san_xuat WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }
  
      if (res.length) {
        console.log("found production facility: ", res[0]);
        return resolve(res[0]);
      }
  
      // not found production facility with the id
      reject({ kind: "not_found" });
    });
  });
};

ProductionFacility.remove = id => {
  return new Promise((resolve, reject) => {
    sql.query("DELETE FROM co_so_san_xuat WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.affectedRows == 0) {
        // not found Production Facility with the id
        return reject({ kind: "not_found" });
      }

      console.log("deleted production facility with id: ", id);
      resolve(res);
    });
  });
};

module.exports = ProductionFacility;