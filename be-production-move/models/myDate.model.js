const sql = require("./").connection;

// constructor
const MyDate = function (myDate) {
    this.name = role.name;
};

MyDate.getNow = () => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT now() as now;", (err, res) => {
            console.log("Thời gian hiện tại: ", res[0].now);
            resolve(res[0].now);
        });
    });
};

MyDate.getAll = ids => {
    return new Promise((resolve, reject) => {
        let query = "SELECT * FROM ngay";

        if (ids) {
            query += ` WHERE `;
        }
        if (ids) {
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


        sql.query(query, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các ngày: ", res);
                return resolve(res);
            }

            // không tìm thấy các ngày
            reject({ kind: "not_found" });
        });
    });
};

MyDate.findByPropertyAndMonth = (propertyName, month, year) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ngay where EXTRACT(YEAR FROM ${propertyName}) = ${year} AND EXTRACT(MONTH FROM ${propertyName}) = ${month}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các ngày: ", res);
                return resolve(res);
            }

            // không tìm thấy các ngày
            reject({ kind: "not_found" });
        });
    });
};

MyDate.findByPropertyAndQuarter = (propertyName, quarter, year) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ngay where EXTRACT(YEAR FROM ${propertyName}) = ${year} AND EXTRACT(QUARTER FROM ${propertyName}) = ${quarter}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các ngày: ", res);
                return resolve(res);
            }

            // không tìm thấy các ngày
            reject({ kind: "not_found" });
        });
    });
};

MyDate.findByPropertyAndYear = (propertyName, year) => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ngay where EXTRACT(YEAR FROM ${propertyName}) = ${year}`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các ngày: ", res);
                return resolve(res);
            }

            // không tìm thấy các ngày
            reject({ kind: "not_found" });
        });
    });
};

MyDate.getErrAndAtDistributionAgentDate = () => {
    return new Promise((resolve, reject) => {
        sql.query(`SELECT * FROM ngay where ngay_loi_khong_the_sua_chua_o_dai_ly is not null`, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.length) {
                console.log("Các ngày: ", res);
                return resolve(res);
            }

            // không tìm thấy các ngày
            reject({ kind: "not_found" });
        });
    });
};

MyDate.updateByIds = (newDate, ids) => {
    return new Promise((resolve, reject) => {
        let query = `UPDATE ngay SET ? WHERE id IN (`;
        for (let i = 0; i < ids.length; i++) {
            if (i == ids.length - 1) {
                query += `${ids[i]})`;
            } else {
                query += `${ids[i]}, `;
            }
        }

        sql.query(query, newDate, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            if (res.affectedRows == 0) {
                // not found Date with the id
                return reject({ kind: "not_found" });
            }

            resolve();
        });
    });
};

module.exports = MyDate;