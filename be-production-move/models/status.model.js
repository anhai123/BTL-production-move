const sql = require("./").connection;

// constructor
const Status = function(status) {
  this.id = status.id;
  this.ten_trang_thai = status.ten_trang_thai;
};

Status.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM trang_thai", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }
  
      if (res.length) {
        console.log("Các trạng thái: ", res);
        return resolve(res);
      }
  
      // không tìm thấy các trạng thái
      reject({ kind: "not_found" });
    });
  });
};

module.exports = Status;