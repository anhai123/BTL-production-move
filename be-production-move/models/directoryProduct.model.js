const sql = require("./").connection;

// constructor
const DirectoryProduct = function (directoryProduct) {
  this.id = directoryProduct.id;
  this.parentDirectory = directoryProduct.parentDirectory;
  this.directoryName = directoryProduct.directoryName;
};

DirectoryProduct.create = (newDirectoryProduct, result) => {
  sql.query("INSERT INTO directoryProducts SET ?", newDirectoryProduct, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created directory product: ", { id: res.insertId, ...newDirectoryProduct });
    result(null, { id: res.insertId, ...newDirectoryProduct });
  });
};

DirectoryProduct.getAll = (result) => {
  sql.query("SELECT * FROM directoryProducts", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("directory products: ", res);
    result(null, res);
  });
};

DirectoryProduct.findById = (id, result) => {
  sql.query(`SELECT * FROM directoryProducts WHERE id = '${id}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found directory product: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Directory Product with the id
    result({ kind: "not_found" }, null);
  });
};

DirectoryProduct.findByDirectoryName = (directoryName, result) => {
  sql.query(`SELECT * FROM directoryProducts WHERE directoryName = '${directoryName}'`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found directory product: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found Directory Product with the directory name
    result({ kind: "not_found" }, null);
  });
};

DirectoryProduct.findByParentDirectory = (parentDirectory, result) => {
  sql.query("SELECT * FROM directoryProducts WHERE parentDirectory = ?", parentDirectory, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found parent directory products: ", res);
      result(null, res);
      return;
    }

    // not found Directory Product with the parent directory name
    result({ kind: "not_found" }, null);
  });
};

DirectoryProduct.findIdByParentDirectory = (parentDirectory, result) => {
  sql.query("SELECT id FROM directoryProducts WHERE parentDirectory = ?", parentDirectory, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found parent directory products: ", res);
      result(null, res);
      return;
    }

    // not found Directory Product Id with the parent directory name
    result({ kind: "not_found" }, null);
  });
};

DirectoryProduct.normalizeIdUp = (id, result) => {
  sql.query("SELECT MAX(id) as maxId FROM directoryProducts", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result([{ kind: "select_max_error" }, err], null);
      return;
    }

    if (res.affectedRows == 0) {
      // not found max id from directory products
      result([{ kind: "not_found_max" }], null);
      return;
    }

    console.log("max id from directory products: ", res[0].maxId);
    if (res[0].maxId === null || id > res[0].maxId) {
      result(null, null);
      return;
    }
    for (var i = res[0].maxId; i >= id; i--) {
      sql.query(
        "UPDATE directoryProducts SET id = ? WHERE id = ?",
        [i + 1, i],
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result([{ kind: "update_loop_error" }, err], null);
            return;
          }

          if (res.affectedRows == 0) {
            // not found Directory Product with the id
            result([{ kind: "not_found" }], null);
            return;
          }

          console.log("updated directory product: ", { idOld: i, idNew: i + 1 });
          result(null, null);
        }
      );
    }
  });
}

DirectoryProduct.normalizeIdDown = (id, result) => {
  id = parseInt(id);
  sql.query("SELECT MAX(id) as maxId FROM directoryProducts", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result([{ kind: "select_max_error" }, err], null);
      return;
    }

    if (res.affectedRows == 0) {
      // not found max id from directory products
      result([{ kind: "not_found_max" }], null);
      return;
    }

    console.log("max id from directory products: ", res[0].maxId);
    if (id + 1 > res[0].maxId)
    {
      console.log("heeeeeeeeeeeeeeee");
      console.log(id + 1);
      console.log(id + 1 > res[0].maxId);
      result(null, null);
    }
    for (var i = id + 1; i <= res[0].maxId; i++) {
      sql.query(
        "UPDATE directoryProducts SET id = ? WHERE id = ?",
        [i - 1, i],
        (err, res) => {
          if (err) {
            console.log("error: ", err);
            result([{ kind: "update_loop_error" }, err], null);
            return;
          }

          if (res.affectedRows == 0) {
            // not found Directory Product with the id
            result([{ kind: "not_found" }], null);
            return;
          }

          console.log("updated directory product: ", { idOld: i, idNew: i - 1 });
          result(null, null);
        }
      );
    }
  })
}

DirectoryProduct.updateById = (id, directoryProduct, result) => {
  if (id !== directoryProduct.id) {
    let hasError = false;
    sql.query("SELECT MAX(id) FROM directoryProducts", (err, res) => {
      if (err) {
        console.log("error: ", err);
        result([{ kind: "select_max_error" }, err], null);
        hasError = true;
        return;
      }

      if (res.affectedRows == 0) {
        // not found max id from directory products
        result({ kind: "not_found_max" }, null);
        hasError = true;
        return;
      }

      console.log("max id from directory products: ", res);
      for (var i = res; i > id; i--) {
        sql.query(
          "UPDATE directoryProducts SET id = ? WHERE id = ?",
          [i + 1, i],
          (err, res) => {
            if (err) {
              console.log("error: ", err);
              result([{ kind: "update_loop_error" }, err], null);
              hasError = true;
              return;
            }

            if (res.affectedRows == 0) {
              // not found Directory Product with the id
              result({ kind: "not_found" }, null);
              hasError = true;
              return;
            }

            console.log("updated directory product: ", { idOld: i, idNew: i + 1 });
          }
        );
      }
    })
    if (hasError) return;
  }
  sql.query(
    "UPDATE directoryProducts SET id = ?, parentDirectory = ?, directoryName = ? WHERE id = ?",
    [directoryProduct.id, directoryProduct.parentDirectory, directoryProduct.directoryName, id],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Directory Product with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("updated directory product: ", { idOld: id, ...directoryProduct });
      result(null, { idOld: id, ...directoryProduct });
    }
  );
};

DirectoryProduct.updateParentDirectoryByParentDirectory = (parentDirectoryOld, parentDirectoryNew, result) => {
  sql.query(
    "UPDATE directoryProducts SET parentDirectory = ? WHERE parentDirectory = ?",
    [parentDirectoryNew, parentDirectoryOld],
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }

      if (res.affectedRows == 0) {
        // not found Directory Product with the parent directory
        result({ kind: "not_found" }, null);
        return;
      }

      console.log("directory product update successfully!");
      result(null, res);
    }
  );
};

DirectoryProduct.remove = (id, result) => {
  sql.query("DELETE FROM directoryProducts WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      // not found Directory Product with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted directory products with id: ", id);
    result(null, res);
  });
};

module.exports = DirectoryProduct;