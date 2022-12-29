

const sql = require("./").connection;

const Product = function (product) {
    this.id = product.id;
    this.ten_san_pham = product.ten_san_pham;
    this.thoi_han_bao_hanh = product.thoi_han_bao_hanh;
    this.ngay_san_xuat = product.ngay_san_xuat;
    this.id_danh_muc_sp = product.id_dong_san_pham;
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

