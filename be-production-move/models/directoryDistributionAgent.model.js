const sql = require(".").connection;

// constructor
const DirectoryDistributionAgent = function (directoryDistributionAgent) {
  this.stt = directoryDistributionAgent.stt;
  this.id_danh_muc_cha = directoryDistributionAgent.id_danh_muc_cha;
  this.ten_danh_muc_dlpp = directoryDistributionAgent.ten_danh_muc_dlpp;
};

DirectoryDistributionAgent.create = newDirectoryDistributionAgent => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO danh_muc_dlpp SET ?", newDirectoryDistributionAgent, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("created directory distribution agent: ", { id: res.insertId, ...newDirectoryDistributionAgent });
      resolve({ id: res.insertId, ...newDirectoryDistributionAgent });
    });
  });
};

DirectoryDistributionAgent.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM danh_muc_dlpp", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("directory distribution agents: ", res);
      resolve(res);
    });
  });
};

DirectoryDistributionAgent.findById = id => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM danh_muc_dlpp WHERE id = '${id}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found directory distribution agent: ", res[0]);
        return resolve(res[0]);
      }

      // not found Directory Distribution Agent with the id
      reject({ kind: "not_found" });
    });
  });
};

DirectoryDistributionAgent.findByParentDirectory = parentDirectory => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM danh_muc_dlpp WHERE id_danh_muc_cha = ?", parentDirectory, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found parent directory distribution agents: ", res);
        return resolve(res);
      }

      // not found Directory Distribution Agent with the parent directory id
      reject({ kind: "not_found" });
    });
  });
};

DirectoryDistributionAgent.findOrdinalNumberByParentDirectoryId = parentDirectoryId => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT stt FROM danh_muc_dlpp WHERE id_danh_muc_cha = ?", parentDirectoryId, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found directory distribution agents: ", res);
        const ordinalNumbers =[];
        for (let i of res) {
          ordinalNumbers.push(i.stt);
        }
        return resolve(ordinalNumbers);
      }

      // not found Directory Distribution Agent Ordinal Number with the parent directory id
      reject({ kind: "not_found" });
    });
  });
};

DirectoryDistributionAgent.selectMaxOrdinalNumber = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT MAX(stt) as maxOrdinalNumber FROM danh_muc_dlpp", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject({
          kind: "select_max_error",
          content: err,
        });
      }

      if (res.affectedRows == 0) {
        // not found max ordinal number from directory distribution agents
        return reject({ kind: "not_found_max" });
      }

      console.log("max ordinal number from directory distribution agents: ", res[0].maxOrdinalNumber);
      resolve(res[0].maxOrdinalNumber);
    });
  });
}

DirectoryDistributionAgent.normalizeOrdinalNumberUp = ordinalNumber => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxOrdinalNumber = await DirectoryDistributionAgent.selectMaxOrdinalNumber();
      if (maxOrdinalNumber === null || ordinalNumber > maxOrdinalNumber) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = maxOrdinalNumber; i >= ordinalNumber; i--) {
        sql.query(
          "UPDATE danh_muc_dlpp SET stt = ? WHERE stt = ?",
          [i + 1, i],
          (err, res) => {
            if (err) {
              console.log("error: ", err);
              return reject({
                kind: "update_loop_error",
                content: err,
              });
            }

            if (res.affectedRows == 0) {
              // not found Directory Distribution Agent with the ordinal number
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory distribution agent: ", { ordinalNumberOld: i, ordinalNumberNew: i + 1 });
            resolve({
              message: "Successfully!",
            });
          }
        );
      }
    } catch (err) {
      reject(err);
    }
  });
}

DirectoryDistributionAgent.normalizeOrdinalNumberDown = ordinalNumber => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxOrdinalNumber = await DirectoryDistributionAgent.selectMaxOrdinalNumber();
      if (ordinalNumber + 1 > maxOrdinalNumber) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = ordinalNumber + 1; i <= maxOrdinalNumber; i++) {
        sql.query(
          "UPDATE danh_muc_dlpp SET stt = ? WHERE stt = ?",
          [i - 1, i],
          (err, res) => {
            if (err) {
              console.log("error: ", err);
              return reject({
                kind: "update_loop_error",
                content: err,
              });
            }

            if (res.affectedRows == 0) {
              // not found Directory Distribution Agent with the id
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory distribution agent: ", { ordinalNumberOld: i, ordinalNumberNew: i - 1 });
            resolve({
              message: "Successfully!",
            });
          }
        );
      }
    } catch (err) {
      reject(err);
    }
  });
}

DirectoryDistributionAgent.updateById = (id, directoryDistributionAgent) => {
  return new Promise(async (resolve, reject) => {
    if (id !== directoryDistributionAgent.id) {
      let hasError = false;
      try {
        const maxId = await DirectoryDistributionAgent.selectMaxId();
        for (var i = maxId; i > id; i--) {
          sql.query(
            "UPDATE danh_muc_dlpp SET id = ? WHERE id = ?",
            [i + 1, i],
            (err, res) => {
              if (err) {
                console.log("error: ", err);
                hasError = true;
                return reject({
                  kind: "update_loop_error",
                  content: err,
                });
              }

              if (res.affectedRows == 0) {
                // not found Directory Distribution Agent with the id
                hasError = true;
                return reject({ kind: "not_found" });
              }
              // test
              console.log("updated directory distribution agent: ", { idOld: i, idNew: i + 1 });
            }
          );
        }
        if (hasError) return;
      } catch (err) {
        // test
      }
    }
    sql.query(
      "UPDATE danh_muc_dlpp SET ? WHERE id = ?",
      [directoryDistributionAgent, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found Directory Distribution Agent with the id
          return reject({ kind: "not_found" });
        }

        console.log("updated directory distribution agent: ", { idOld: id, ...directoryDistributionAgent });
        resolve({ idOld: id, ...directoryDistributionAgent });
      }
    );
  });
};

DirectoryDistributionAgent.updateParentDirectoryByParentDirectory = (parentDirectoryOld, parentDirectoryNew) => {
  return new Promise((resolve, reject) => {
    sql.query(
      "UPDATE danh_muc_dlpp SET id_danh_muc_cha = ? WHERE id_danh_muc_cha = ? AND id != ?",
      [parentDirectoryNew, parentDirectoryOld, parentDirectoryNew],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found Directory Distribution Agent with the parent directory
          return reject({ kind: "not_found" });
        }

        console.log("directory distribution agent update successfully!");
        resolve(res);
      }
    );
  });
};

DirectoryDistributionAgent.remove = id => {
  return new Promise((resolve, reject) => {
    sql.query("DELETE FROM danh_muc_dlpp WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.affectedRows == 0) {
        // not found Directory Distribution Agent with the id
        return reject({ kind: "not_found" });
      }

      console.log("deleted directory distribution agents with id: ", id);
      resolve(res);
    });
  });
};

module.exports = DirectoryDistributionAgent;