const sql = require("./").connection;

// constructor
const User = function (user) {
  this.username = user.username;
  this.email = user.email;
  this.password = user.password;
  this.accepted = user.accepted;
  this.roleId = user.roleId;
};

User.create = newUser => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
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
    sql.query(`SELECT * FROM users WHERE id = ${id}`, (err, res) => {
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

User.findByUserName = username => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM users WHERE username = '${username}'`, (err, res) => {
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
    sql.query(`SELECT * FROM users WHERE email = '${email}'`, (err, res) => {
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

User.getAllByAccepted = accepted => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM users WHERE accepted=${accepted}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("users: ", res);
      resolve(res);
    });
  });
};

User.updateById = (id, user) => {
  return new Promise((resolve, reject) => {
    sql.query(
      "UPDATE users SET username = ?, email = ?, password = ?, accepted = ?, roleId = ? WHERE id = ?",
      [user.username, user.email, user.password, user.accepted, user.roleId, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found User with the id
          return reject({ kind: "not_found" });
        }

        console.log("updated user: ", { id: id, ...user });
        resolve({ id: id, ...user });
      }
    );
  });
};

User.remove = id => {
  return new Promise((resolve, reject) => {
    sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
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