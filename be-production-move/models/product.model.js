const sql = require("./").connection;

// constructor
const Product = function (product) {
    this.name = role.name;
};

Product.getAll = (id_trang_thai, id_co_so_sx, id_dai_ly, ids) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM san_pham", count = 0;

        if (id_trang_thai || id_co_so_sx || id_dai_ly || ids) {
            query += ` WHERE `;
        }
        if (id_trang_thai) {
            count++;
            query += `id_trang_thai = ${id_trang_thai}`;
        }
        if (id_co_so_sx) {
            count++;
            if (count > 1) {
                query += " AND ";
            }
            query += `id_co_so_sx = ${id_co_so_sx}`;
        }
        if (id_dai_ly) {
            count++;
            if (count > 1) {
                query += " AND ";
            }
            query += `id_dai_ly = ${id_dai_ly}`;
        }
        if (ids) {
            count++;
            if (count > 1) {
                query += " AND ";
            }
            query += `id IN (`;
            for (let i = 0; i < ids.length; i++) {
                if (i == ids.length - 1) {
                    query += `${ids[i].id_san_pham}`;
                } else {
                    query += `${ids[i].id_san_pham}, `;
                }
            }
            query += `)`;
        }


        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các sản phẩm: ", res);
                return resolve(res);
            }

            // không tìm thấy các sản phẩm
            reject({ kind: "not_found" });
        });
    });
};

Product.updateStatusByIds = ids => {
    return new Promise((resolve, reject) => {
        let query = "UPDATE san_pham SET id_trang_thai = 3 WHERE id IN (";
        for (let i = 0; i < ids.length; i++) {
            if (i == ids.length - 1) {
                query += `${ids[i]})`;
            } else {
                query += `${ids[i]}, `;
            }
        }

        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.affectedRows == 0) {
                // not found Product with the id
                return reject({ kind: "not_found" });
            }

            resolve();
        });
    });
};

module.exports = Product;