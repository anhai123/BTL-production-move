const sql = require("./").connection;

// constructor
const Role = function(role) {
  this.name = role.name;
};

Role.findById = id => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM roles WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }
  
      if (res.length) {
        console.log("found role: ", res[0]);
        return resolve(res[0]);
      }
  
      // not found Role with the id
      reject({ kind: "not_found" });
    });
  });
};

Role.findByName = name => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM vai_tro WHERE ten = '${name}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }
  
      if (res.length) {
        console.log("found role: ", res[0]);
        return resolve(res[0]);
      }
  
      // not found Role with the name
      reject({ kind: "not_found" });
    });
  });
};

Role.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM vai_tro", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }
  
      if (res.length) {
        console.log("found roles: ", res);
        return resolve(res);
      }
  
      // not found Role with the name
      reject({ kind: "not_found" });
    });
  });
};

module.exports = Role;