const sql = require("./").connection;

// constructor
const Role = function(role) {
  this.name = role.name;
};

Role.findById = (id, result) => {
  sql.query(`SELECT * FROM roles WHERE id = ${id}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found role: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Role with the id
    result({ kind: "not_found" }, null);
  });
};

Role.findByName = (name, result) => {
  sql.query(`SELECT * FROM roles WHERE name = '${name}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found role: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Role with the name
    result({ kind: "not_found" }, null);
  });
};

module.exports = Role;