
const sql = require("./").connection;

const Dates = function (dates) {
    this.id= dates.id;
    this.nam_tai_kho_cssx= dates.nam_tai_kho_cssx;
    this.chuyen_cho_dai_ly= dates.chuyen_cho_dai_ly;
    this.nam_tai_kho_dai_ly= dates.nam_tai_kho_dai_ly;
    this.ngay_ban_cho_kh= dates.ngay_ban_cho_kh;
    this.ngay_chuyen_ve_cssx= dates.ngay_chuyen_ve_cssx;
    this.ngay_den_cssx= dates.ngay_den_cssx;
    this.ngay_huy_sp= dates.ngay_huy_sp;
    this.ngay_ban_giao_sp_moi= dates.ngay_ban_giao_sp_moi;
}

Dates.create = newDates => {
    return new Promise((resolve, reject) => {
        sql.query('insert into ngay set ?', newDates, (err, res) => {
            if (err) {
                console.log("error:", err);
                return reject(err);
              }
            resolve({ id: res.insertId, ...newDates });
        })
    });
}

Dates.slectIdMax = () => {
    return new Promise((resolve, reject) => {
        sql.query('select max(id) as maxId from ngay', (err, res) => {
            if(err) {
                console.log("error:", err);
                reject(err);
            }

            if (res.affectedRows == 0) {
                // not found max id from directory products
                return reject({ kind: "not_found_max" });
              }
            resolve(res[0].maxId);
        })
    })
}

Dates.getAll= ( status, month, quarter, year) => {
    return new Promise((resolve, reject) => {
        let query = "select * from ngay";
        let count = 0;
        if( month || quarter || year ) {
            query += ' where '
        }
        if (month) {
            query += 'month(' + status + `  ) = ${month}`;
        }
    
        if(quarter) {
            if(quarter == 1) {
                query+= status + ` between \'${year}-10-2\' and \'${year}-12-29\'`  ;
            }
        }
        console.log(query);
        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }
            if(res.length) {
                return resolve(res);
            }
                
            // không tìm có sản phẩm trong thời gian đó
            reject({ kind: "not_found" });
        });

    })
}

Dates.Update = (id) => {
    return new Promise((resolve, reject) => {
        sql.query(`update ngay set ngay_loi_khong_the_sua_chua = (current_timestamp()) where id = (select id_ngay from san_pham where id = ${id})`,
            (err, res) => {
                if(err) {
                    console.log("error:", err);
                    return reject(err);
                }
                console.log("product: successful update");
                resolve(res);
            });
    })
}
module.exports = Dates;
