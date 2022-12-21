const sql = require("./").connection;

// constructor
const DirectoryProduct = function (directoryProduct) {
  this.id = directoryProduct.id;
  this.parentDirectory = directoryProduct.parentDirectory;
  this.directoryName = directoryProduct.directoryName;
};

DirectoryProduct.create = newDirectoryProduct => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO directoryProducts SET ?", newDirectoryProduct, (err, res) => {
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
    sql.query("SELECT * FROM directoryProducts", (err, res) => {
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
    sql.query(`SELECT * FROM directoryProducts WHERE id = '${id}'`, (err, res) => {
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

DirectoryProduct.findByDirectoryName = directoryName => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM directoryProducts WHERE directoryName = '${directoryName}'`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found directory product: ", res[0]);
        return resolve(res[0]);
      }

      // not found Directory Product with the directory name
      reject({ kind: "not_found" });
    });
  });
};

DirectoryProduct.findByParentDirectory = parentDirectory => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM directoryProducts WHERE parentDirectory = ?", parentDirectory, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found parent directory products: ", res);
        return resolve(res);
      }

      // not found Directory Product with the parent directory name
      reject({ kind: "not_found" });
    });
  });
};

DirectoryProduct.findIdByParentDirectory = parentDirectory => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT id FROM directoryProducts WHERE parentDirectory = ?", parentDirectory, (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject(err);
      }

      if (res.length) {
        console.log("found parent directory products: ", res);
        const ids =[];
        for (let i of res) {
          ids.push(i.id);
        }
        return resolve(ids);
      }

      // not found Directory Product Id with the parent directory name
      reject({ kind: "not_found" });
    });
  });
};

DirectoryProduct.selectMaxId = () => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT MAX(id) as maxId FROM directoryProducts", (err, res) => {
      if (err) {
        console.log("error: ", err);
        return reject({
          kind: "select_max_error",
          content: err,
        });
      }

      if (res.affectedRows == 0) {
        // not found max id from directory products
        return reject({ kind: "not_found_max" });
      }

      console.log("max id from directory products: ", res[0].maxId);
      resolve(res[0].maxId);
    });
  });
}

DirectoryProduct.normalizeIdUp = id => {
  return new Promise(async (resolve, reject) => {
    try {
      const maxId = await DirectoryProduct.selectMaxId();
      if (maxId === null || id > maxId) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = maxId; i >= id; i--) {
        sql.query(
          "UPDATE directoryProducts SET id = ? WHERE id = ?",
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
              // not found Directory Product with the id
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory product: ", { idOld: i, idNew: i + 1 });
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

DirectoryProduct.normalizeIdDown = id => {
  return new Promise(async (resolve, reject) => {
    id = parseInt(id);
    try {
      const maxId = await DirectoryProduct.selectMaxId();
      if (id + 1 > maxId) {
        return resolve({
          message: "Successfully!",
        });
      }
      for (var i = id + 1; i <= maxId; i++) {
        sql.query(
          "UPDATE directoryProducts SET id = ? WHERE id = ?",
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
              // not found Directory Product with the id
              return reject({ kind: "not_found" });
            }
            // test
            console.log("updated directory product: ", { idOld: i, idNew: i - 1 });
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
            "UPDATE directoryProducts SET id = ? WHERE id = ?",
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
      "UPDATE directoryProducts SET id = ?, parentDirectory = ?, directoryName = ? WHERE id = ?",
      [directoryProduct.id, directoryProduct.parentDirectory, directoryProduct.directoryName, id],
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
      "UPDATE directoryProducts SET parentDirectory = ? WHERE parentDirectory = ?",
      [parentDirectoryNew, parentDirectoryOld],
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
    sql.query("DELETE FROM directoryProducts WHERE id = ?", id, (err, res) => {
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