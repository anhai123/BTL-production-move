const sql = require("./").connection;
const MyDate = require("../models/myDate.model");

// constructor
const Warranty = function (warranty) {
    this.id_san_pham = warranty.id_san_pham;
    this.id_dai_ly = warranty.id_dai_ly;
    this.lan_bao_hanh = 1;
    this.ngay_loi_can_bao_hanh = new Date;
};

Warranty.create = newWarranty => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO bao_hanh SET ?", newWarranty, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            console.log("Đối tượng đã tạo: ", { id: res.insertId, ...newWarranty });
            resolve({ id: res.insertId, ...newWarranty });
        });
    });
};

Warranty.getProductIdFromWarrantyCenterId = id_trung_tam_bh => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM bao_hanh where id_trung_tam_bh=? group by id_san_pham", id_trung_tam_bh, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các id sản phẩm: ", res);
                return resolve(res);
            }

            // không tìm thấy các id sản phẩm
            reject({ kind: "not_found" });
        });
    });
};

Warranty.getWarrantyIdByMaxWarrantyTimeAndProductId = id_san_pham => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT *, max(lan_bao_hanh) FROM bao_hanh where id_san_pham = ?", id_san_pham, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Id bảo hành: ", res[0]);
                return resolve(res[0]);
            }

            // không tìm thấy id bảo hành
            reject({ kind: "not_found" });
        });
    });
};

Warranty.getWarrantyCompletedAndShippingProductId = id_dai_ly => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT id_san_pham, max(lan_bao_hanh) FROM bao_hanh where ngay_dang_tra_ve_dai_ly is not NULL And ngay_den_dai_ly is null AND id_dai_ly = ${id_dai_ly} group by id_san_pham`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các id sản phẩm: ", res);
                return resolve(res);
            }

            // không tìm thấy các id sản phẩm
            reject({ kind: "not_found" });
        });
    });
};

Warranty.getWarrantyCompletedAndArrivedProductId = id_dai_ly => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT id_san_pham, max(lan_bao_hanh) FROM bao_hanh where ngay_tra_lai_kh is NULL And ngay_den_dai_ly is not null AND id_dai_ly = ${id_dai_ly} group by id_san_pham`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các id sản phẩm: ", res);
                return resolve(res);
            }

            // không tìm thấy các id sản phẩm
            reject({ kind: "not_found" });
        });
    });
};

Warranty.getFinalWarrantyAtDistributionAgentProductId = id_dai_ly => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT id_san_pham, max(lan_bao_hanh) FROM bao_hanh where id_dai_ly=${id_dai_ly} group by id_san_pham`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các id sản phẩm: ", res);
                return resolve(res);
            }

            // không tìm thấy các id sản phẩm
            reject({ kind: "not_found" });
        });
    });
};

Warranty.getSummonProductId = () => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT id_san_pham FROM bao_hanh where ngay_loi_can_trieu_hoi is not null and ngay_loi_can_bao_hanh is null`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các id sản phẩm: ", res);
                return resolve(res);
            }

            // không tìm thấy các id sản phẩm
            reject({ kind: "not_found" });
        });
    });
};

Warranty.findByProductIds = idProducts => {
    return new Promise((resolve, reject) => {
        let query = `SELECT *, max(lan_bao_hanh) FROM bao_hanh where id_san_pham IN (`;

        for (let i = 0; i < idProducts.length; i++) {
            if (i == idProducts.length - 1) {
                query += `${idProducts[i]}) group by id_san_pham`;
            } else {
                query += `${idProducts[i]}, `;
            }
        }
        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các kết quả: ", res);
                return resolve(res);
            }

            // không tìm thấy kết quả
            reject({ kind: "not_found" });
        });
    });
};

Warranty.findErrProductIds = () => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM bao_hanh group by id_san_pham`;
        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các kết quả: ", res);
                return resolve(res);
            }

            // không tìm thấy kết quả
            reject({ kind: "not_found" });
        });
    });
};

Warranty.findByPropertyAndMonth = (dOWPropertyName, dOWId, propertyName, month, year) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM bao_hanh where `;
        if (dOWPropertyName) {
            query += `${dOWPropertyName} = ${dOWId} AND `;
        }
        query += `EXTRACT(YEAR FROM ${propertyName}) = ${year} AND EXTRACT(MONTH FROM ${propertyName}) = ${month} group by id_san_pham`;
        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các kết quả: ", res);
                return resolve(res);
            }

            // không tìm thấy kết quả
            reject({ kind: "not_found" });
        });
    });
};

Warranty.findByPropertyAndQuarter = (dOWPropertyName, dOWId, propertyName, quarter, year) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM bao_hanh where `;
        if (dOWPropertyName) {
            query += `${dOWPropertyName} = ${dOWId} AND `;
        }
        query += `EXTRACT(YEAR FROM ${propertyName}) = ${year} AND EXTRACT(QUARTER FROM ${propertyName}) = ${quarter} group by id_san_pham`;
        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các kết quả: ", res);
                return resolve(res);
            }

            // không tìm thấy kết quả
            reject({ kind: "not_found" });
        });
    });
};

Warranty.findByPropertyAndYear = (dOWPropertyName, dOWId, propertyName, year) => {
    return new Promise((resolve, reject) => {
        let query = `SELECT * FROM bao_hanh where `;
        if (dOWPropertyName) {
            query += `${dOWPropertyName} = ${dOWId} AND `;
        }
        query += `EXTRACT(YEAR FROM ${propertyName}) = ${year} group by id_san_pham`;
        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các kết quả: ", res);
                return resolve(res);
            }

            // không tìm thấy kết quả
            reject({ kind: "not_found" });
        });
    });
};

Warranty.updateByIds = (newWarranty, ids) => {
    return new Promise((resolve, reject) => {
        if (ids.length) {
            let query = `UPDATE bao_hanh SET ? WHERE id IN (`;
            for (let i = 0; i < ids.length; i++) {
                if (i === ids.length - 1) {
                    query += `${ids[i]})`;
                } else {
                    query += `${ids[i]}, `;
                }
            }
    
            sql.query(query, newWarranty, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    return reject(err);
                }
    
                if (res.affectedRows == 0) {
                    // not found Warranty with the id
                    return reject({ kind: "not_found" });
                }
    
                resolve();
            });
        } else {
            resolve();
        }
    });
};

Warranty.UpdateDates = (column, ids) =>{

    return new Promise((resolve, reject) => {
        let query = `update bao_hanh set `;
        query += column + ` = (current_timestamp()) where id_san_pham in (${ids})`
        
        sql.query(query, (err, res) => {
            console.log(query)
            if(err) {
                console.log("error:", err);
                return reject(err);
            }
            console.log("e");
            resolve(res);
        });
        
    });
}
module.exports = Warranty;