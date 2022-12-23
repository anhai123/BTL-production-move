const sql = require(".").connection;

// constructor
const DirectoryWarrantyCenter = function (directoryWarrantyCenter) {
  this.id = directoryWarrantyCenter.id;
  this.danh_muc_cha = directoryWarrantyCenter.danh_muc_cha;
  this.ten_danh_muc_ttbh = directoryWarrantyCenter.ten_danh_muc_ttbh;
};

DirectoryWarrantyCenter.create = newDirectoryWarrantyCenter => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO danh_muc_ttbh SET ?", newDirectoryWarrantyCenter, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("created directory warranty center: ", { id: res.insertId, ...newDirectoryWarrantyCenter });
      resolve({ id: res.insertId, ...newDirectoryWarrantyCenter });
    });
  });
};

DirectoryWarrantyCenter.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM danh_muc_ttbh", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("directory warranty centers: ", res);
      resolve(res);
    });
  });
};

DirectoryWarrantyCenter.findById = id => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM danh_muc_ttbh WHERE id = '${id}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found directory warranty center: ", res[0]);
        return resolve(res[0]);
      }

      // not found Directory Warranty Center with the id
      reject({ kind: "not_found" });
    });
  });
};

DirectoryWarrantyCenter.findByDirectoryName = directoryName => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM danh_muc_ttbh WHERE ten_danh_muc_ttbh = '${directoryName}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found directory warranty center: ", res[0]);
        return resolve(res[0]);
      }

      // not found Directory Warranty Center with the directory name
      reject({ kind: "not_found" });
    });
  });
};

DirectoryWarrantyCenter.findByParentDirectory = parentDirectory => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM danh_muc_ttbh WHERE danh_muc_cha = ?", parentDirectory, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found parent directory warranty centers: ", res);
        return resolve(res);
      }

      // not found Directory Warranty Center with the parent directory name
      reject({ kind: "not_found" });
    });
  });
};

DirectoryWarrantyCenter.findIdByParentDirectory = parentDirectory => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT id FROM danh_muc_ttbh WHERE danh_muc_cha = ?", parentDirectory, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found parent directory warranty centers: ", res);
        const ids =[];
        for (let i of res) {
          ids.push(i.id);
        }
        return resolve(ids);
      }

      // not found Directory Warranty Center Id with the parent directory name
      reject({ kind: "not_found" });
    });
  });
};

DirectoryWarrantyCenter.selectMaxId = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT MAX(id) as maxId FROM danh_muc_ttbh", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject({
          kind: "select_max_error",
          content: err,
        });
      }

      if (res.affectedRows == 0) {
        // not found max id from directory warranty centers
        return reject({ kind: "not_found_max" });
      }

      console.log("max id from directory warranty centers: ", res[0].maxId);
      resolve(res[0].maxId);
    });
  });
}

DirectoryWarrantyCenter.normalizeIdUp = id => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxId = await DirectoryWarrantyCenter.selectMaxId();
      if (maxId === null || id > maxId) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = maxId; i >= id; i--) {
        sql.query(
          "UPDATE danh_muc_ttbh SET id = ? WHERE id = ?",
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
              // not found Directory Warranty Center with the id
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory warranty center: ", { idOld: i, idNew: i + 1 });
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

DirectoryWarrantyCenter.normalizeIdDown = id => {
  return new Promise(async (resolve, reject) => {
    id = parseInt(id);
    try {
      const maxId = await DirectoryWarrantyCenter.selectMaxId();
      if (id + 1 > maxId) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = id + 1; i <= maxId; i++) {
        sql.query(
          "UPDATE danh_muc_ttbh SET id = ? WHERE id = ?",
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
              // not found Directory Warranty Center with the id
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory warranty center: ", { idOld: i, idNew: i - 1 });
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

DirectoryWarrantyCenter.updateById = (id, directoryWarrantyCenter) => {
  return new Promise(async (resolve, reject) => {
    if (id !== directoryWarrantyCenter.id) {
      let hasError = false;
      try {
        const maxId = await DirectoryWarrantyCenter.selectMaxId();
        for (var i = maxId; i > id; i--) {
          sql.query(
            "UPDATE danh_muc_ttbh SET id = ? WHERE id = ?",
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
                // not found Directory Warranty Center with the id
                hasError = true;
                return reject({ kind: "not_found" });
              }
              // test
              console.log("updated directory warranty center: ", { idOld: i, idNew: i + 1 });
            }
          );
        }
        if (hasError) return;
      } catch (err) {
        // test
      }
    }
    sql.query(
      "UPDATE danh_muc_ttbh SET ? WHERE id = ?",
      [directoryWarrantyCenter, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found Directory Warranty Center with the id
          return reject({ kind: "not_found" });
        }

        console.log("updated directory warranty center: ", { idOld: id, ...directoryWarrantyCenter });
        resolve({ idOld: id, ...directoryWarrantyCenter });
      }
    );
  });
};

DirectoryWarrantyCenter.updateParentDirectoryByParentDirectory = (parentDirectoryOld, parentDirectoryNew) => {
  return new Promise((resolve, reject) => {
    sql.query(
      "UPDATE danh_muc_ttbh SET danh_muc_cha = ? WHERE danh_muc_cha = ?",
      [parentDirectoryNew, parentDirectoryOld],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found Directory Warranty Center with the parent directory
          return reject({ kind: "not_found" });
        }

        console.log("directory warranty center update successfully!");
        resolve(res);
      }
    );
  });
};

DirectoryWarrantyCenter.remove = id => {
  return new Promise((resolve, reject) => {
    sql.query("DELETE FROM danh_muc_ttbh WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.affectedRows == 0) {
        // not found Directory Warranty Center with the id
        return reject({ kind: "not_found" });
      }

      console.log("deleted directory warranty centers with id: ", id);
      resolve(res);
    });
  });
};

module.exports = DirectoryWarrantyCenter;