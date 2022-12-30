const sql = require("./").connection;

// constructor
const Status = function(status) {
  this.id = status.id;
  this.ten_trang_thai = status.ten_trang_thai;
};

Status.getAll = ids => {
  return new Promise((resolve, reject) => {
    let query = `SELECT * FROM trang_thai`;
    if (ids) {
      query += ` WHERE id IN (`;
      for (let i = 0; i < ids.length; i++) {
          if (i === ids.length - 1) {
              query += `${ids[i]})`;
          } else {
              query += `${ids[i]}, `;
          }
      }
    }
    sql.query(query, (err, res) => {
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