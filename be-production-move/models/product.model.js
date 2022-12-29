const sql = require("./").connection;

// constructor
const Product = function (product) {
    this.name = role.name;
};

Product.getAll = (id_trang_thai, id_co_so_sx, id_dai_ly, ids, id_ngay, oIds) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM san_pham", count = 0;

        if (id_trang_thai || id_co_so_sx || id_dai_ly || ids || id_ngay || oIds) {
            query += ` WHERE `;
        }
        if (oIds) {
            query += `( `;
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
                    query += `${ids[i]}`;
                } else {
                    query += `${ids[i]}, `;
                }
            }
            query += `)`;
        }
        if (id_ngay) {
            count++;
            if (count > 1) {
                query += " AND ";
            }
            query += `id_ngay IN (`;
            for (let i = 0; i < id_ngay.length; i++) {
                if (i == ids.length - 1) {
                    query += `${id_ngay[i]}`;
                } else {
                    query += `${id_ngay[i]}, `;
                }
            }
            query += `)`;
        }
        if (oIds) {
            count++;
            if (count > 1) {
                query += " ) OR ";
            }
            query += `id IN (`;
            for (let i = 0; i < oIds.length; i++) {
                if (i == oIds.length - 1) {
                    query += `${oIds[i]}`;
                } else {
                    query += `${oIds[i]}, `;
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

Product.findByDirectoryProductId = ids => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM san_pham WHERE ";

        query += `id_danh_muc_sp IN (`;
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

            if (res.length) {
                console.log("Các sản phẩm: ", res);
                return resolve(res);
            }

            // không tìm thấy các sản phẩm
            reject({ kind: "not_found" });
        });
    });
};

Product.getProductNeedNewReplacementProduct = (idsOject, dateIdsOject) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM san_pham where id_khach_hang is not null AND id IN (";

        for (let i = 0; i < idsOject.length; i++) {
            if (i == ids.length - 1) {
                query += `${idsOject[i].id_san_pham}) AND id_ngay IN (`;
            } else {
                query += `${idsOject[i].id_san_pham}, `;
            }
        }

        for (let i = 0; i < dateIdsOject.length; i++) {
            if (i == dateIdsOject.length - 1) {
                query += `${dateIdsOject[i].id})`;
            } else {
                query += `${dateIdsOject[i].id}, `;
            }
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

Product.updateByIds = (newProduct, ids) => {
    return new Promise((resolve, reject) => {
        let query = `UPDATE san_pham SET ? WHERE id IN (`;
        for (let i = 0; i < ids.length; i++) {
            if (i == ids.length - 1) {
                query += `${ids[i]})`;
            } else {
                query += `${ids[i]}, `;
            }
        }

        sql.query(query, newProduct, (err, res) => {
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