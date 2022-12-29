const sql = require("./").connection;

// constructor
const Warranty = function (warranty) {
    this.name = role.name;
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