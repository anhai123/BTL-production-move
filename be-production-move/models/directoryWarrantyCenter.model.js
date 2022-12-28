const sql = require(".").connection;

// constructor
const DirectoryWarrantyCenter = function (directoryWarrantyCenter) {
  this.stt = directoryWarrantyCenter.stt;
  this.id_danh_muc_cha = directoryWarrantyCenter.id_danh_muc_cha;
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

DirectoryWarrantyCenter.findByParentDirectory = parentDirectory => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM danh_muc_ttbh WHERE id_danh_muc_cha = ?", parentDirectory, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found parent directory warranty centers: ", res);
        return resolve(res);
      }

      // not found Directory Warranty Center with the parent directory id
      reject({ kind: "not_found" });
    });
  });
};

DirectoryWarrantyCenter.findOrdinalNumberByParentDirectoryId = parentDirectoryId => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT stt FROM danh_muc_ttbh WHERE id_danh_muc_cha = ?", parentDirectoryId, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found parent directory warranty centers: ", res);
        const ordinalNumbers =[];
        for (let i of res) {
          ordinalNumbers.push(i.stt);
        }
        return resolve(ordinalNumbers);
      }

      // not found Directory Warranty Center Ordinal Number with the parent directory id
      reject({ kind: "not_found" });
    });
  });
};

DirectoryWarrantyCenter.selectMaxOrdinalNumber = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT MAX(stt) as maxOrdinalNumber FROM danh_muc_ttbh", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject({
          kind: "select_max_error",
          content: err,
        });
      }

      if (res.affectedRows == 0) {
        // not found max ordinal number from directory warranty centers
        return reject({ kind: "not_found_max" });
      }

      console.log("max id from directory warranty centers: ", res[0].maxOrdinalNumber);
      resolve(res[0].maxOrdinalNumber);
    });
  });
}

DirectoryWarrantyCenter.normalizeOrdinalNumberUp = ordinalNumber => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxOrdinalNumber = await DirectoryWarrantyCenter.selectMaxOrdinalNumber();
      if (maxOrdinalNumber === null || ordinalNumber > maxOrdinalNumber) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = maxOrdinalNumber; i >= ordinalNumber; i--) {
        sql.query(
          "UPDATE danh_muc_ttbh SET stt = ? WHERE stt = ?",
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
              // not found Directory Warranty Center with the ordinal number
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory warranty center: ", { ordinalNumberOld: i, ordinalNumberNew: i + 1 });
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

DirectoryWarrantyCenter.normalizeOrdinalNumberDown = ordinalNumber => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxOrdinalNumber = await DirectoryWarrantyCenter.selectMaxOrdinalNumber();
      if (ordinalNumber + 1 > maxOrdinalNumber) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = ordinalNumber + 1; i <= maxOrdinalNumber; i++) {
        sql.query(
          "UPDATE danh_muc_ttbh SET stt = ? WHERE stt = ?",
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
              // not found Directory Warranty Center with the ordinal number
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory warranty center: ", { ordinalNumberOld: i, ordinalNumberNew: i - 1 });
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
      "UPDATE danh_muc_ttbh SET id_danh_muc_cha = ? WHERE id_danh_muc_cha = ? AND id != ?",
      [parentDirectoryNew, parentDirectoryOld, parentDirectoryNew],
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