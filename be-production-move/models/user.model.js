const sql = require("./").connection;

// constructor
const User = function (user) {
  this.tai_khoan = user.tai_khoan;
  this.email = user.email;
  this.mat_khau = user.mat_khau;
  this.id_co_so_sx = user.id_co_so_sx;
  this.id_dai_ly = user.id_dai_ly;
  this.id_trung_tam_bh = user.id_trung_tam_bh;
  this.hop_le = user.hop_le;
};

User.create = newUser => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO ban_quan_ly SET ?", newUser, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("created user: ", { id: res.insertId, ...newUser });
      resolve({ id: res.insertId, ...newUser });
    });
  });
};

User.findById = id => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ban_quan_ly WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found user: ", res[0]);
        return resolve(res[0]);
      }

      // not found User with the id
      reject({ kind: "not_found" });
    });
  });
};

User.findByUserName = tai_khoan => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ban_quan_ly WHERE tai_khoan = '${tai_khoan}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found user: ", res[0]);
        return resolve(res[0]);
      }

      // not found User with the id
      reject({ kind: "not_found" });
    });
  });
};

User.findByEmail = email => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ban_quan_ly WHERE email = '${email}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found user: ", res[0]);
        return resolve(res[0]);
      }

      // not found User with the email
      reject({ kind: "not_found" });
    });
  });
};

User.getAll = title => {
  return new Promise((resolve, reject) => {
    let query = "SELECT * FROM users";

    if (title) {
      query += ` WHERE title LIKE '%${title}%'`;
    }

    sql.query(query, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("users: ", res);
      resolve(res);
    });
  });
};

User.getAllByAccepted = hop_le => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM ban_quan_ly WHERE hop_le=${hop_le}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found users: ", res);
        return resolve(res);
      }

      // not found Users with the hop_le
      reject({ kind: "not_found" });
    });
  });
};

User.updateById = user => {
  return new Promise((resolve, reject) => {
    sql.query(
      "UPDATE ban_quan_ly SET ? WHERE id = ?",
      [user, user.id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found User with the id
          return reject({ kind: "not_found" });
        }

        console.log("updated user: ", { id: user.id, ...user });
        resolve({ id: user.id, ...user });
      }
    );
  });
};

User.remove = id => {
  return new Promise((resolve, reject) => {
    sql.query("DELETE FROM ban_quan_ly WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.affectedRows == 0) {
        // not found User with the id
        return reject({ kind: "not_found" });
      }

      console.log("deleted user with id: ", id);
      resolve(res);
    });
  });
};

User.removeAll = () => {
  return new Promise((resolve, reject) => {
    sql.query("DELETE FROM users", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log(`deleted ${res.affectedRows} users`);
      resolve(res);
    });
  });
};

module.exports = User;