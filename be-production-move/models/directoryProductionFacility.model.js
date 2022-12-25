const sql = require(".").connection;

// constructor
const DirectoryProductionFacility = function (directoryProductionFacility) {
  this.stt = directoryProductionFacility.stt;
  this.id_danh_muc_cha = directoryProductionFacility.id_danh_muc_cha;
  this.ten_danh_muc_cssx = directoryProductionFacility.ten_danh_muc_cssx;
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

DirectoryProductionFacility.findByParentDirectory = parentDirectory => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM danh_muc_cssx WHERE id_danh_muc_cha = ?", parentDirectory, (err, res) => {
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

DirectoryProductionFacility.findOrdinalNumberByParentDirectoryId = parentDirectoryId => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT stt FROM danh_muc_cssx WHERE id_danh_muc_cha = ?", parentDirectoryId, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found directory production facilitys: ", res);
        const ordinalNumbers =[];
        for (let i of res) {
          ordinalNumbers.push(i.stt);
        }
        return resolve(ordinalNumbers);
      }

      // not found Directory Production Facility Ordinal Number with the parent directory id
      reject({ kind: "not_found" });
    });
  });
};

DirectoryProductionFacility.selectMaxOrdinalNumber = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT MAX(stt) as maxOrdinalNumber FROM danh_muc_cssx", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject({
          kind: "select_max_error",
          content: err,
        });
      }

      if (res.affectedRows == 0) {
        // not found max ordinal number from directory production facilitys
        return reject({ kind: "not_found_max" });
      }

      console.log("max ordinal number from directory production facilitys: ", res[0].maxOrdinalNumber);
      resolve(res[0].maxOrdinalNumber);
    });
  });
}

DirectoryProductionFacility.normalizeOrdinalNumberUp = ordinalNumber => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxOrdinalNumber = await DirectoryProductionFacility.selectMaxOrdinalNumber();
      if (maxOrdinalNumber === null || ordinalNumber > maxOrdinalNumber) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = maxOrdinalNumber; i >= ordinalNumber; i--) {
        sql.query(
          "UPDATE danh_muc_cssx SET stt = ? WHERE stt = ?",
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
              // not found Directory Production Facility with the ordinal number
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory production facility: ", { ordinalNumberOld: i, ordinalNumberNew: i + 1 });
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

DirectoryProductionFacility.normalizeOrdinalNumberDown = ordinalNumber => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxOrdinalNumber = await DirectoryProductionFacility.selectMaxOrdinalNumber();
      if (ordinalNumber + 1 > maxOrdinalNumber) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = ordinalNumber + 1; i <= maxOrdinalNumber; i++) {
        sql.query(
          "UPDATE danh_muc_cssx SET stt = ? WHERE stt = ?",
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
              // not found Directory Production Facility with the ordinal number
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory production facility: ", { ordinalNumberOld: i, ordinalNumberNew: i - 1 });
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
      "UPDATE danh_muc_cssx SET id_danh_muc_cha = ? WHERE id_danh_muc_cha = ? AND id != ?",
      [parentDirectoryNew, parentDirectoryOld, parentDirectoryNew],
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