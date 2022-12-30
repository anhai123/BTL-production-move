const sql = require("./").connection;

// constructor
const Specifications = function (specifications) {
    this.man_hinh = specifications.man_hinh;
    this.he_dieu_hanh = specifications.he_dieu_hanh;
    this.camera_truoc = specifications.camera_truoc;
    this.camera_sau = specifications.camera_sau;
    this.chip = specifications.chip;
    this.ram = specifications.ram;
    this.dung_luong_luu_tru = specifications.dung_luong_luu_tru;
    this.sim = specifications.sim;
    this.pin = specifications.pin;
};

Specifications.create = newSpecifications => {
    return new Promise((resolve, reject) => {
        sql.query(`INSERT INTO thong_so SET ?`, newSpecifications, (err, res) => {
            if (err) {
                console.log("error: ", err);
                return reject(err);
            }

            console.log("Đối tượng đã tạo: ", { id: res.insertId, ...newSpecifications });
            resolve({ id: res.insertId, ...newSpecifications });
        });
    });
};

module.exports = Specifications;