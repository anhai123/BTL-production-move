const sql = require("./").connection;

// constructor
const DirectoryProduct = function (directoryProduct) {
  this.stt = directoryProduct.stt;
  this.id_danh_muc_cha = directoryProduct.id_danh_muc_cha;
  this.ten_danh_muc_sp = directoryProduct.ten_danh_muc_sp;
};

DirectoryProduct.create = newDirectoryProduct => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO danh_muc_sp SET ?", newDirectoryProduct, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("created directory product: ", { id: res.insertId, ...newDirectoryProduct });
      resolve({ id: res.insertId, ...newDirectoryProduct });
    });
  });
};  

DirectoryProduct.getAll = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM danh_muc_sp", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      console.log("directory products: ", res);
      resolve(res);
    });
  });
};

DirectoryProduct.findById = id => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM danh_muc_sp WHERE id = ${id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found directory product: ", res[0]);
        return resolve(res[0]);
      }

      // not found Directory Product with the id
      reject({ kind: "not_found" });
    });
  });
};

DirectoryProduct.findByParentDirectory = parentDirectory => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM danh_muc_sp WHERE id_danh_muc_cha = ?`, parentDirectory, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found parent directory products: ", res);
        return resolve(res);
      }

      // not found Directory Product with the parent directory id
      reject({ kind: "not_found" });
    });
  });
};

DirectoryProduct.findOrdinalNumberByParentDirectoryId = parentDirectoryId => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT stt FROM danh_muc_sp WHERE id_danh_muc_cha = ?", parentDirectoryId, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found directory products: ", res);
        const ordinalNumbers =[];
        for (let i of res) {
          ordinalNumbers.push(i.stt);
        }
        return resolve(ordinalNumbers);
      }

      // not found Directory Product Ordinal Number with the parent directory id
      reject({ kind: "not_found" });
    });
  });
};

DirectoryProduct.selectMaxOrdinalNumber = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT MAX(stt) as maxOrdinalNumber FROM danh_muc_sp", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject({
          kind: "select_max_error",
          content: err,
        });
      }

      if (res.affectedRows == 0) {
        // not found max ordinal number from directory products
        return reject({ kind: "not_found_max" });
      }

      console.log("max ordinal number from directory products: ", res[0].maxOrdinalNumber);
      resolve(res[0].maxOrdinalNumber);
    });
  });
}

DirectoryProduct.normalizeOrdinalNumberUp = ordinalNumber => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxOrdinalNumber = await DirectoryProduct.selectMaxOrdinalNumber();
      if (maxOrdinalNumber === null || ordinalNumber > maxOrdinalNumber) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = maxOrdinalNumber; i >= ordinalNumber; i--) {
        sql.query(
          "UPDATE danh_muc_sp SET stt = ? WHERE stt = ?",
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
              // not found Directory Product with the ordinal number
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory product: ", { ordinalNumberOld: i, ordinalNumberNew: i + 1 });
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

DirectoryProduct.normalizeOrdinalNumberDown = ordinalNumber => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxOrdinalNumber = await DirectoryProduct.selectMaxOrdinalNumber();
      if (ordinalNumber + 1 > maxOrdinalNumber) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = ordinalNumber + 1; i <= maxOrdinalNumber; i++) {
        sql.query(
          "UPDATE danh_muc_sp SET stt = ? WHERE stt = ?",
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
              // not found Directory Product with the ordinal number
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory product: ", { ordinalNumberOld: i, ordinalNumberNew: i - 1 });
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

DirectoryProduct.updateById = (id, directoryProduct) => {
  return new Promise(async (resolve, reject) => {
    if (id !== directoryProduct.id) {
      let hasError = false;
      try {
        const maxId = await DirectoryProduct.selectMaxId();
        for (var i = maxId; i > id; i--) {
          sql.query(
            "UPDATE danh_muc_sp SET id = ? WHERE id = ?",
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
                // not found Directory Product with the id
                hasError = true;
                return reject({ kind: "not_found" });
              }
              // test
              console.log("updated directory product: ", { idOld: i, idNew: i + 1 });
            }
          );
        }
        if (hasError) return;
      } catch (err) {
        // test
      }
    }
    sql.query(
      "UPDATE directoryProducts SET ? WHERE id = ?",
      [directoryProduct, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found Directory Product with the id
          return reject({ kind: "not_found" });
        }

        console.log("updated directory product: ", { idOld: id, ...directoryProduct });
        resolve({ idOld: id, ...directoryProduct });
      }
    );
  });
};

DirectoryProduct.updateParentDirectoryByParentDirectory = (parentDirectoryOld, parentDirectoryNew) => {
  return new Promise((resolve, reject) => {
    sql.query(
      "UPDATE danh_muc_sp SET id_danh_muc_cha = ? WHERE id_danh_muc_cha = ? AND id != ?",
      [parentDirectoryNew, parentDirectoryOld, parentDirectoryNew],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          return reject(err);
        }

        if (res.affectedRows == 0) {
          // not found Directory Product with the parent directory
          return reject({ kind: "not_found" });
        }

        console.log("directory product update successfully!");
        resolve(res);
      }
    );
  });
};

DirectoryProduct.remove = id => {
  return new Promise((resolve, reject) => {
    sql.query("DELETE FROM danh_muc_sp WHERE id = ?", id, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.affectedRows == 0) {
        // not found Directory Product with the id
        return reject({ kind: "not_found" });
      }

      console.log("deleted directory products with id: ", id);
      resolve(res);
    });
  });
};

module.exports = DirectoryProduct;