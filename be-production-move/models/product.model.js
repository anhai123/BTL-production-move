const { Model } = require("sequelize");

const sql = require("./").connection;

const Product = function (product) {
    this.id = product.id;
    this.ten_san_pham = product.ten_san_pham;
    this.thoi_han_bao_hanh = product.thoi_han_bao_hanh;
    this.ngay_san_xuat = product.ngay_san_xuat;
    this.id_dong_san_pham = product.id_dong_san_pham;
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

// truy vấn các sản phẩm mới sản xuất
Product.getAllProductNew = (id_trang_thai, id_co_so_sx) => {
    return new Promise((resolve, reject) => {
        sql.query(`select * from san_pham where id_khach_hang is null and id_trang_thai = ${id_trang_thai} and id_co_so_sx = ${id_co_so_sx}`, (err, res) => {
            if(err) {
                console.log("error:", err);
                return reject(err);
            }
            console.log("product: successful query");
            resolve(res);

        })
    })
}

// update trạng thái sản phẩm
Product.updateStatusId = (id_trang_thai, id_trang_thai_, id_co_so_sx) => {
    return new Promise((resolve, reject) => {
        sql.query(`update san_pham set id_trang_thai = ? where id_trang_thai = ${id_trang_thai_} and id_co_so_sx = ${id_co_so_sx}`, [id_trang_thai], (err, res) => {
            if(err) {
                console.log("error:", err);
                return reject(err);
            }
            console.log("product: successful update");
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
Product.getAllProductFaulty = (id_trang_thai) => {
    return new Promise((resolve, reject) => {
        sql.query(`select * from san_pham where id_trang_thai = ${id_trang_thai}`, (err, res) => {
            if(err) {
                console.log("error:", err);
                return reject({kind: "not_found"});
            }
            resolve(res);
        })
    })
}


Product.getAll = (id_trang_thai, id_co_so_sx, id_dai_ly, ids, month, quarter, year) => {
    let status;
    switch(id_trang_thai) {
        case "1": 
            status = 'nam_tai_kho_cssx';
            break;
        case "2":
            status = 'chuyen_cho_dai_ly';
            break;
        case "3":
            status = 'nam_tai_kho_dai_ly';
            break;
        case "4": 
            status = 'ngay_ban_cho_kh';
            break;
        case "5":
            status = 'ngay_chuyen_ve_cssx';
            break;
        case "6":
            status = 'ngay_den_cssx';
            break;
        case "7":
            status = 'ngay_huy_sp';
            break;
        case "8":
            status = 'ngay_ban_giao_sp_moi';
            break;
        default:
            status = 'a';
    }
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM san_pham", count = 0;

        if (id_trang_thai || id_co_so_sx || id_dai_ly || ids) {
            query += ` WHERE `;
        }
       
        if(year && quarter) {
            if(quarter == 1) {
                query += 'id_ngay in (select id from ngay where ' + status + ` between \'${year}-1-1\' and \'${year}-3-31\') and `; 
            }
            if(quarter == 2) {
                query += 'id_ngay in (select id from ngay where ' + status + ` between \'${year}-4-1\' and \'${year}-6-30\') and `; 
            }
            if(quarter == 3) {
                query += 'id_ngay in (select id from ngay where ' + status + ` between \'${year}-7-1\' and \'${year}-9-30\') and `; 
            }
            if(quarter == 4) {
                query += 'id_ngay in (select id from ngay where ' + status + ` between \'${year}-10-1\' and \'${year}-12-31\') and `; 
            }
        } else
        if(month) {     
            query += 'id_ngay in (select id from ngay where month(' + status + `) = \'${month}\' and year(` + status + `) = \'${year}\') and `; 
        }
        if (id_trang_thai && !year) {
            count++;
            query += `id_trang_thai = ${id_trang_thai}`;
        } else
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


module.exports = Product;
  
