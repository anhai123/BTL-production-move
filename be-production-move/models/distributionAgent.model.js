const sql = require("./").connection;

// constructor
const DistributionAgent = function (distributionAgent) {
  this.ten_dai_ly = distributionAgent.ten_co_so;
  this.dia_chi = distributionAgent.dia_chi_cu_the;
  this.so_dien_thoai = distributionAgent.so_dien_thoai;
  this.email = distributionAgent.email;
  this.phuong = distributionAgent.phuong;
  this.quan = distributionAgent.quan;
  this.tinh = distributionAgent.tinh;
};

DistributionAgent.create = newDistributionAgent => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO dai_ly_phan_phoi SET ?", newDistributionAgent, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("đại lý phân phối đã tạo: ", { id: res.insertId, ...newDistributionAgent });
      resolve({ id: res.insertId, ...newDistributionAgent });
    });
  });
};

DistributionAgent.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM dai_ly_phan_phoi", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found distribution agents: ", res);
        return resolve(res);
      }

      // not found distribution agents
      reject({ kind: "not_found" });
    });
  });
};

DistributionAgent.findById = id => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM dai_ly_phan_phoi WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found distribution agent: ", res[0]);
        return resolve(res[0]);
      }

      // not found distribution agent with the id
      reject({ kind: "not_found" });
    });
  });
};

DistributionAgent.remove = id => {
  return new Promise((resolve, reject) => {
    sql.query("DELETE FROM dai_ly_phan_phoi WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.affectedRows == 0) {
        // not found Distribution Agent with the id
        return reject({ kind: "not_found" });
      }

      console.log("deleted distribution agent with id: ", id);
      resolve(res);
    });
  });
};

module.exports = DistributionAgent;