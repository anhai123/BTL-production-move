const sql = require(".").connection;

// constructor
const DirectoryProductionFacility = function (directoryProductionFacility) {
  this.id = directoryProductionFacility.id;
  this.danh_muc_cha = directoryProductionFacility.danh_muc_cha;
  this.ten_danh_muc_sp = directoryProductionFacility.ten_danh_muc_sp;
};

DirectoryProductionFacility.create = newDirectoryProductionFacility => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO danh_muc_cssx SET ?", newDirectoryProductionFacility, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("created directory production facility: ", { id: res.insertId, ...newDirectoryProductionFacility });
      resolve({ id: res.insertId, ...newDirectoryProductionFacility });
    });
  });
};

DirectoryProductionFacility.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM danh_muc_cssx", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("directory production facilitys: ", res);
      resolve(res);
    });
  });
};

DirectoryProductionFacility.findById = id => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM danh_muc_cssx WHERE id = '${id}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found directory production facility: ", res[0]);
        return resolve(res[0]);
      }

      // not found Directory Production Facility with the id
      reject({ kind: "not_found" });
    });
  });
};

DirectoryProductionFacility.findByDirectoryName = directoryName => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM danh_muc_cssx WHERE ten_danh_muc_cssx = '${directoryName}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found directory production facility: ", res[0]);
        return resolve(res[0]);
      }

      // not found Directory Production Facility with the directory name
      reject({ kind: "not_found" });
    });
  });
};

DirectoryProductionFacility.findByParentDirectory = parentDirectory => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM danh_muc_cssx WHERE danh_muc_cha = ?", parentDirectory, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found parent directory production facilitys: ", res);
        return resolve(res);
      }

      // not found Directory Production Facility with the parent directory name
      reject({ kind: "not_found" });
    });
  });
};

DirectoryProductionFacility.findIdByParentDirectory = parentDirectory => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT id FROM danh_muc_cssx WHERE danh_muc_cha = ?", parentDirectory, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found parent directory production facilitys: ", res);
        const ids =[];
        for (let i of res) {
          ids.push(i.id);
        }
        return resolve(ids);
      }

      // not found Directory Production Facility Id with the parent directory name
      reject({ kind: "not_found" });
    });
  });
};

DirectoryProductionFacility.selectMaxId = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT MAX(id) as maxId FROM danh_muc_cssx", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject({
          kind: "select_max_error",
          content: err,
        });
      }

      if (res.affectedRows == 0) {
        // not found max id from directory production facilitys
        return reject({ kind: "not_found_max" });
      }

      console.log("max id from directory production facilitys: ", res[0].maxId);
      resolve(res[0].maxId);
    });
  });
}

DirectoryProductionFacility.normalizeIdUp = id => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxId = await DirectoryProductionFacility.selectMaxId();
      if (maxId === null || id > maxId) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = maxId; i >= id; i--) {
        sql.query(
          "UPDATE danh_muc_cssx SET id = ? WHERE id = ?",
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
              // not found Directory Production Facility with the id
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory production facility: ", { idOld: i, idNew: i + 1 });
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

DirectoryProductionFacility.normalizeIdDown = id => {
  return new Promise(async (resolve, reject) => {
    id = parseInt(id);
    try {
      const maxId = await DirectoryProductionFacility.selectMaxId();
      if (id + 1 > maxId) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = id + 1; i <= maxId; i++) {
        sql.query(
          "UPDATE danh_muc_cssx SET id = ? WHERE id = ?",
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
              // not found Directory Production Facility with the id
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory production facility: ", { idOld: i, idNew: i - 1 });
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

DirectoryProductionFacility.updateById = (id, directoryProductionFacility) => {
  return new Promise(async (resolve, reject) => {
    if (id !== directoryProductionFacility.id) {
      let hasError = false;
      try {
        const maxId = await DirectoryProductionFacility.selectMaxId();
        for (var i = maxId; i > id; i--) {
          sql.query(
            "UPDATE danh_muc_cssx SET id = ? WHERE id = ?",
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
                // not found Directory Production Facility with the id
                hasError = true;
                return reject({ kind: "not_found" });
              }
              // test
              console.log("updated directory production facility: ", { idOld: i, idNew: i + 1 });
            }
          );
        }
        if (hasError) return;
      } catch (err) {
        // test
      }
    }
    sql.query(
      "UPDATE danh_muc_cssx SET ? WHERE id = ?",
      [directoryProductionFacility, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found Directory Production Facility with the id
          return reject({ kind: "not_found" });
        }

        console.log("updated directory production facility: ", { idOld: id, ...directoryProductionFacility });
        resolve({ idOld: id, ...directoryProductionFacility });
      }
    );
  });
};

DirectoryProductionFacility.updateParentDirectoryByParentDirectory = (parentDirectoryOld, parentDirectoryNew) => {
  return new Promise((resolve, reject) => {
    sql.query(
      "UPDATE danh_muc_cssx SET danh_muc_cha = ? WHERE danh_muc_cha = ?",
      [parentDirectoryNew, parentDirectoryOld],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found Directory Production Facility with the parent directory
          return reject({ kind: "not_found" });
        }

        console.log("directory production facility update successfully!");
        resolve(res);
      }
    );
  });
};

DirectoryProductionFacility.remove = id => {
  return new Promise((resolve, reject) => {
    sql.query("DELETE FROM danh_muc_cssx WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.affectedRows == 0) {
        // not found Directory Production Facility with the id
        return reject({ kind: "not_found" });
      }

      console.log("deleted directory production facilitys with id: ", id);
      resolve(res);
    });
  });
};

module.exports = DirectoryProductionFacility;