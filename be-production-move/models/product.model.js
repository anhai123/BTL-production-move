const sql = require("./").connection;

const Product = function (product) {
    this.ten_san_pham = product.ten_san_pham;
    this.hinh_anh = product.hinh_anh;
    this.thoi_han_bao_hanh = product.thoi_han_bao_hanh;
    this.ngay_san_xuat = product.ngay_san_xuat;
    this.id_danh_muc_sp = product.id_danh_muc_sp;
    this.id_co_so_sx = product.id_co_so_sx;
    this.id_thong_so = product.id_thong_so;
    this.id_trang_thai = product.id_trang_thai;
    this.id_ngay = product.id_ngay;
};

// nhập sản phẩm mới
Product.create = newProduct => {
    return new Promise((resolve, reject) => {
        sql.query('INSERT INTO san_pham SET ?', newProduct, (err, res) => {
            if (err) {
                console.log("error:", err);
                return reject(err);
              }
            console.log("đã tạo sản phẩm thành công: ", { id: res.insertId, ...newProduct });
            resolve({ id: res.insertId, ...newProduct });
        })
    })
    
}

Product.getProduct =(id, id_trang_thai)=> {
    return new Promise((resolve, reject) => {
        sql.query(`select * from san_pham where id = ${id} and id_trang_thai = ${id_trang_thai}`, (err, res) => {
            if(err) {
                console.log("error:", err);
                return reject({kind: "not_found"});
            }
            resolve(res);
        })
    })
}

// truy vấn các sản phẩm mới sản xuất
Product.getAllProductNew = (id_trang_thai, id_co_so_sx) => {
    return new Promise((resolve, reject) => {
        sql.query(`select * from san_pham where id_khach_hang is null and id_trang_thai = ${id_trang_thai} and id_co_so_sx = ${id_co_so_sx} and id_dai_ly is null`, (err, res) => {
            if(err) {
                console.log("error:", err);
                return reject(err);
            }
            console.log("product: successful query");
            resolve(res);

        })
    })
}


Product.Deliver = (id_trang_thai, ids, id_dai_ly, id_co_so_sx) => {
    return new Promise((resolve, reject) => {
        sql.query(`update san_pham set id_trang_thai = ?, id_dai_ly = ? where id in (${ids}) and id_co_so_sx = ${id_co_so_sx}`, [id_trang_thai, id_dai_ly], (err, res) => {
            if(err) {
                console.log("error:", err);
                return reject(err);
            }
            console.log("product: successful update");
            resolve(res);
        });
    })
}

// truy vấn các sản phẩm lỗi đang chuyển về cơ sở sản xuất
Product.getAllProductFaulty = (id_trang_thai, id_co_so_sx) => {
    return new Promise((resolve, reject) => {
        sql.query(`select * from san_pham where id_trang_thai = ${id_trang_thai} and id_co_so_sx = ${id_co_so_sx}`, (err, res) => {
            if(err) {
                console.log("error:", err);
                return reject({kind: "not_found"});
            }
            resolve(res);
        })
    })
}


Product.getAll = (id_trang_thai, id_co_so_sx, id_dai_ly, ids, id_ngay, oIds, id_danh_muc_sp) => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM san_pham", count = 0;

        if (id_trang_thai || id_co_so_sx || id_dai_ly || ids || id_ngay || oIds || id_danh_muc_sp) {
            if (id_trang_thai || id_co_so_sx || id_dai_ly || ids || id_ngay || id_danh_muc_sp) {
                query += ` WHERE `;
            } else
            if (oIds) {
                if (oIds.length > 0) {
                    query += ` WHERE `;
                }
            }
        }
        if (oIds) {
            if (oIds.length > 0) {
                query += `( `;
            }
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
                if (i === ids.length - 1) {
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
                if (i === id_ngay.length - 1) {
                    query += `${id_ngay[i]}`;
                } else {
                    query += `${id_ngay[i]}, `;
                }
            }
            query += `)`;
        }
        if (oIds) {
            if (oIds.length > 0) {
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
        }
        
        if (id_danh_muc_sp) {
            count++;
            if (count > 1) {
                query += " AND ";
            }
            query += `id_danh_muc_sp = ${id_danh_muc_sp}`;
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

// update trạng thái sản phẩm
Product.updateStatusId = (id_trang_thai, id) => {
    return new Promise((resolve, reject) => {
        sql.query(`update san_pham set id_trang_thai = ? where id = ${id}`, [id_trang_thai], (err, res) => {
            if(err) {
                console.log("error:", err);
                return reject(err);
            }
            console.log("product: successful update");
            resolve(res);
        })
    })
}



Product.getAllWarranted = (id_trang_thai, id_trung_tam_bh) => {
    return new Promise((resolve, reject) => {
        let query = `select * from san_pham where id_trang_thai = ${id_trang_thai} and id in (select id_san_pham from bao_hanh where id_trung_tam_bh = ${id_trung_tam_bh})`;
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
        })

    })
}



Product.UpdateStatus = (id_trang_thai, id_trang_thai_, id_trung_tam_bh) => {
    return new Promise((resolve, reject) => {
        sql.query(`update san_pham set id_trang_thai = ${id_trang_thai} where id_trang_thai = ${id_trang_thai_} and id in (select id_san_pham from bao_hanh where id_trung_tam_bh = ${id_trung_tam_bh})`, (err, res) => {
                if(err) {
                    console.log("error:", err);
                    return reject(err);
                }
                console.log("product: successful update");
                resolve(res);
            })

    })
}

Product.findByDirectoryProductId = ids => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM san_pham WHERE ";

        query += `id_danh_muc_sp IN (`;
        for (let i = 0; i < ids.length; i++) {
            if (i === ids.length - 1) {
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
            if (i === idsOject.length - 1) {
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
        if (ids.length) {
            let query = `UPDATE san_pham SET ? WHERE id IN (`;
            for (let i = 0; i < ids.length; i++) {
                if (i === ids.length - 1) {
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
        } else {
            resolve();
        }
    });
};

module.exports = Product;

