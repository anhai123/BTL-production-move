const User = require("../models/user.model.js");
const DirectoryProduct = require("../models/directoryProduct.model");
const DirectoryProductionFacility = require("../models/directoryProductionFacility.model");
const DirectoryDistributionAgent = require("../models/directoryDistributionAgent.model");
const DirectoryWarrantyCenter = require("../models/directoryWarrantyCenter.model");
const Status = require("../models/status.model.js");
const ProductionFacility = require("../models/productionFacility.model");
const DistributionAgent = require("../models/distributionAgent.model");
const WarrantyCenter = require("../models/warrantyCenter.model");
const Product = require("../models/product.model");
const Dates = require("../models/date.model");
const Specifications = require("../models/specifications.model");
const Warranty = require("../models/warranty.model");
const Customer = require("../models/customer.model.js");
const MyDate = require("../models/myDate.model");
require("dotenv").config();

exports.FacilityProductCreate = async (req, res) => {
  try {
    let id_thong_so;
    if (req.body.id_thong_so) {
      id_thong_so = req.body.id_thong_so;
    } else {
      const specifications = await Specifications.create(
        new Specifications(req.body)
      );
      id_thong_so = specifications.id;
    }
    for (let i = 0; i < req.body.so_luong; i++) {
      let Date_ = await Dates.create(
        new Dates({
          nam_tai_kho_cssx: new Date(),
        })
      );
      let id_ngay_ = await Dates.slectIdMax();
      await Product.create(
        new Product({
          ten_san_pham: req.body.ten_san_pham,
          hinh_anh: req.body.hinh_anh,
          thoi_han_bao_hanh: req.body.thoi_han_bao_hanh,
          ngay_san_xuat: new Date(),
          id_danh_muc_sp: req.body.id_danh_muc_sp,
          id_thong_so: id_thong_so,
          id_trang_thai: 1,
          id_ngay: id_ngay_,
          id_co_so_sx: req.id_co_so_sx,
        })
      );
    }
    res.status(200).send({ message: "Thêm sản phẩm mới thành công" });
  } catch (err) {
    res.status(500).send({
      message: "Thêm mới sản phẩm không thành công",
    });
  }
};

exports.FacilityProductNew = async (req, res) => {
  try {
    const products = await Product.getAllProductNew(
      process.env.NAM_TAI_KHO_CO_SO_SAN_XUAT,
      req.id_co_so_sx
    );
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "Không có sản phẩm nào mới sản xuất",
      });
    } else {
      res.status(500).send({
        message: "Lỗi khi truy xuất sản phẩm mới sản xuất",
      });
    }
  }
};

exports.FacilityProductDeliver = async (req, res) => {
  try {
    let ids = req.body.ids;
    await Product.Deliver(
      process.env.DANG_CHUYEN_DEN_CHO_DAI_LY,
      ids,
      req.body.id_dai_ly,
      req.id_co_so_sx
    );
    const products = await Product.getAll(null, null, null, ids);
    let dateIds = [];
    for (let i = 0; i < products.length; i++) {
      dateIds.push(products[i].id_ngay);
    }
    await MyDate.updateByIds(
      {
        chuyen_cho_dai_ly: new Date(),
      },
      dateIds
    );
    res.status(200).send({
      message: "Gửi sản phẩm cho đại lý thành công",
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found data`,
      });
    } else {
      res.status(500).send({
        message: "Lỗi, xác nhận sản phẩm chuyển đi đại lý",
      });
    }
  }
};

exports.FacilityProduct = async (req, res) => {
  try {
    let products;
    req.params.statusId = parseInt(req.params.statusId);
    req.params.month = parseInt(req.params.month);
    req.params.quarter = parseInt(req.params.quarter);
    req.params.year = parseInt(req.params.year);
    if (req.params.month) {
      if (req.params.statusId === 1) {
        const dates = await MyDate.findByPropertyAndMonth(
          `nam_tai_kho_cssx`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      }
      if (req.params.statusId === 2) {
        const dates = await MyDate.findByPropertyAndMonth(
          `chuyen_cho_dai_ly`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 5) {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_chuyen_ve_cssx`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 7) {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_ban_cho_kh`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 8) {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_huy_sp`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 9) {
        const warrantys = await Warranty.findByPropertyAndMonth(
          null,
          null,
          `ngay_loi_can_bao_hanh`,
          req.params.month,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          productIds
        );
      } else if (req.params.statusId === 13) {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_loi_khong_the_sua_chua`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 15) {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_ban_giao_sp_moi`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 16) {
        const warrantys = await Warranty.findByPropertyAndMonth(
          null,
          null,
          `ngay_loi_can_trieu_hoi`,
          req.params.month,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          productIds
        );
      } else if (req.params.statusId === 17) {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_den_cssx`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      }
    } else if (req.params.quarter) {
      if (req.params.statusId === 1) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `nam_tai_kho_cssx`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      }
      if (req.params.statusId === 2) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `chuyen_cho_dai_ly`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 5) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `ngay_chuyen_ve_cssx`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 7) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `ngay_ban_cho_kh`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 8) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `ngay_huy_sp`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 9) {
        const warrantys = await Warranty.findByPropertyAndQuarter(
          null,
          null,
          `ngay_loi_can_bao_hanh`,
          req.params.quarter,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          productIds
        );
      } else if (req.params.statusId === 13) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `ngay_loi_khong_the_sua_chua`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 15) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `ngay_ban_giao_sp_moi`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 16) {
        const warrantys = await Warranty.findByPropertyAndQuarter(
          null,
          null,
          `ngay_loi_can_trieu_hoi`,
          req.params.quarter,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          productIds
        );
      } else if (req.params.statusId === 17) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `ngay_den_cssx`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      }
    } else {
      if (req.params.statusId === 1) {
        const dates = await MyDate.findByPropertyAndYear(
          `nam_tai_kho_cssx`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      }
      if (req.params.statusId === 2) {
        const dates = await MyDate.findByPropertyAndYear(
          `chuyen_cho_dai_ly`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 5) {
        const dates = await MyDate.findByPropertyAndYear(
          `ngay_chuyen_ve_cssx`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 7) {
        const dates = await MyDate.findByPropertyAndYear(
          `ngay_ban_cho_kh`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 8) {
        const dates = await MyDate.findByPropertyAndYear(
          `ngay_huy_sp`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 9) {
        const warrantys = await Warranty.findByPropertyAndYear(
          null,
          null,
          `ngay_loi_can_bao_hanh`,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          productIds
        );
      } else if (req.params.statusId === 13) {
        const dates = await MyDate.findByPropertyAndYear(
          `ngay_loi_khong_the_sua_chua`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 15) {
        const dates = await MyDate.findByPropertyAndYear(
          `ngay_ban_giao_sp_moi`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      } else if (req.params.statusId === 16) {
        const warrantys = await Warranty.findByPropertyAndYear(
          null,
          null,
          `ngay_loi_can_trieu_hoi`,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          productIds
        );
      } else if (req.params.statusId === 17) {
        const dates = await MyDate.findByPropertyAndYear(
          `ngay_den_cssx`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
      }
    }
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi lấy sản phẩm!`,
      });
    }
  }
};

exports.FacilityProductFaulty = async (req, res) => {
  try {
    const products = await Product.getAllProductFaulty(
      process.env.DANG_CHUYEN_DEN_CO_SO_SAN_XUAT,
      req.id_co_so_sx
    );
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "Không có sản phẩm lỗi đang chuyển về.",
      });
    } else {
      res.status(500).send({
        message: "Lỗi khi truy vấn sp lỗi đang về cssx",
      });
    }
  }
};

exports.FacilityProductFaultyReceive = async (req, res) => {
  try {
    await Product.updateByIds(
      {
        id_trang_thai: 17,
      },
      req.body.ids
    );
    const products = await Product.getAll(
      process.env.SAN_PHAM_LOI_NAM_TAI_KHO_CO_SO_SX,
      req.id_co_so_sx
    );
    let dateIds = [];
    for (let i = 0; i < products.length; i++) {
      dateIds.push(products[i].id_ngay);
    }
    await MyDate.updateByIds(
      {
        ngay_den_cssx: new Date(),
      },
      dateIds
    );
    res.status(200).send({
      message: "xác nhận sản phẩm lỗi đã về đến cssx thành công",
    });
  } catch (err) {
    res.status(500).send({
      message: "Lỗi không thể update ID trạng thái cho sản phẩm",
    });
  }
};

// trung tam bao hanh
exports.WarrantyCenterProducts = async (req, res) => {
  try {
    const products = await Product.getAllWarranted(4, req.id_trung_tam_bh);
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "không có data sản phẩm cần bảo hành",
      });
    } else {
      res.status(500).send({
        message: "Xảy ra lỗi khi truy vấn sản phẩm cần bảo hành",
      });
    }
  }
};

exports.FacilityProductSold = async (req, res) => {
  let results = [];
  if (req.params.type === `month`) {
    for (let i = 1; i <= 12; i++) {
      try {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_ban_cho_kh`,
          i,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        const products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
        results.push(products.length);
      } catch (err) {
        if (err.kind === "not_found") {
          results.push(0);
        } else {
          res.status(500).send({
            message: `Lỗi khi lấy sản phẩm!`,
          });
        }
      }
    }
  }
  if (req.params.type === `quarter`) {
    for (let i = req.params.year - 2; i <= req.params.year; i++) {
      for (let j = 1; j <= 4; j++) {
        try {
          const dates = await MyDate.findByPropertyAndQuarter(
            `ngay_ban_cho_kh`,
            j,
            i
          );
          let dateIds = [];
          for (let i = 0; i < dates.length; i++) {
            dateIds.push(dates[i].id);
          }
          const products = await Product.getAll(
            null,
            req.id_co_so_sx,
            null,
            null,
            dateIds
          );
          results.push(products.length);
        } catch (err) {
          if (err.kind === "not_found") {
            results.push(0);
          } else {
            res.status(500).send({
              message: `Lỗi khi lấy sản phẩm!`,
            });
          }
        }
      }
    }
  }
  if (req.params.type === `year`) {
    for (let i = req.params.year - 11; i <= req.params.year; i++) {
      try {
        const dates = await MyDate.findByPropertyAndYear(`ngay_ban_cho_kh`, i);
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        const products = await Product.getAll(
          null,
          req.id_co_so_sx,
          null,
          null,
          dateIds
        );
        results.push(products.length);
      } catch (err) {
        if (err.kind === "not_found") {
          results.push(0);
        } else {
          res.status(500).send({
            message: `Lỗi khi lấy sản phẩm!`,
          });
        }
      }
    }
  }
  res.status(200).send(results);
};

exports.WarrantyCenterProductReceiv = async (req, res) => {
  try {
    await Product.updateByIds(
      {
        id_trang_thai: 6,
      },
      req.body.ids
    );
    await Warranty.UpdateDates(
      "ngay_dang_bao_hanh_tai_trung_tam",
      req.body.ids
    );
    res.status(200).send({
      message: "thanh cong",
    });
  } catch (err) {
    res.status(500).send({
      message: "Xảy ra lỗi khi update trạng thái cho sản phẩm cần bảo hành",
    });
  }
};

// sản phẩm đang bảo hành
exports.WarrantyCenterProductUnder = async (req, res) => {
  try {
    const products = await Product.getAllWarranted(6, req.id_trung_tam_bh);
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "không có data sản phẩm đang bảo hành",
      });
    } else {
      res.status(500).send({
        message: "Xảy ra lỗi khi truy vấn sản phẩm đang bảo hành",
      });
    }
  }
};

// update lỗi or bảo hành xong
exports.WarrantyCenterUpdateStatus = async (req, res) => {
  try {
    await Product.updateStatusId(req.body.id_trang_thai, req.body.id);
    if (req.body.id_trang_thai == 13) {
      await Dates.Update(req.body.id);
    } else {
      await Warranty.UpdateDates("ngay_bao_hanh_xong", req.body.id);
    }
    res.status(200).send({
      message: "thanh cong",
    });
  } catch (err) {
    res.status(500).send({
      message: "Lỗi khi thay đổi trạng thái thành lỗi or bảo hành xong",
    });
  }
};

// Đã bảo hành xong , không lỗi
exports.WarrantyCenterProductsFinnish = async (req, res) => {
  try {
    const products = await Product.getAllWarranted(12, req.id_trung_tam_bh);
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "không có data sản phẩm bảo hành xong",
      });
    } else {
      res.status(500).send({
        message: "Xảy ra lỗi khi truy vấn sản phẩm bảo hành xong",
      });
    }
  }
};

// Gửi đến đại lý sp đã bảo hành xong
exports.WarrantyCenterProductDeliver = async (req, res) => {
  try {
    await Product.updateByIds({
      id_trang_thai: 2,
    }, [req.body.id]);
    await Warranty.UpdateDates("ngay_dang_tra_ve_dai_ly", [req.body.id]);
    res.status(200).send({
      message: "gui den dai ly thanh cong",
    });
  } catch (err) {
    res.status(500).send({
      message: "Lỗi khi gửi sản phẩm bảo hành xong đến đại lý",
    });
  }
};

// Sản phẩm lỗi không thể bảo hành
exports.WarrantyCenterProductFaulty = async (req, res) => {
  try {
    const products = await Product.getAllWarranted(13, req.id_trung_tam_bh);
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "không có data sản phẩm lỗi không thể bảo hành",
      });
    } else {
      res.status(500).send({
        message: "Xảy ra lỗi khi truy vấn sản phẩm lỗi không thể bh",
      });
    }
  }
};

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.ModeratorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.ModeratorAccount = async (req, res) => {
  try {
    const users = await User.getAllByAccepted(0);
    const usersFix = [];
    for (let user of users) {
      try {
        let subject, cua, id;
        if (user.id_co_so_sx) {
          id = user.id_co_so_sx;
          subject = await ProductionFacility.findById(id);
          cua = subject.ten_co_so;
        } else if (user.id_dai_ly) {
          id = user.id_dai_ly;
          subject = await DistributionAgent.findById(id);
          cua = subject.ten_dai_ly;
        } else {
          id = user.id_trung_tam_bh;
          subject = await WarrantyCenter.findById(id);
          cua = subject.ten_trung_tam;
        }
        usersFix.push({
          id: user.id,
          tai_khoan: user.tai_khoan,
          email: user.email,
          cua: cua,
        });
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found subject with id ${id}.`,
          });
          return;
        } else {
          res.status(500).send({
            message: "Error retrieving subject with id " + id,
          });
          return;
        }
      }
    }
    res.status(200).send(usersFix);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có tài khoản cần xử lý.`,
      });
      return;
    } else {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
      return;
    }
  }
};

exports.ModeratorAccept = async (req, res) => {
  for (let id of req.body.ids) {
    try {
      const user = await User.findById(id);
      user.hop_le = 1;
      await User.updateById(user);
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${id}.`,
        });
        return;
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + id,
        });
        return;
      }
    }
  }
  res.send({
    message: "Users was updated successfully.",
  });
};

exports.ModeratorReject = async (req, res) => {
  for (let id of req.body.ids) {
    try {
      let user = await User.findById(id);
      await User.remove(id);
      if (user.id_co_so_sx) {
        await ProductionFacility.remove(user.id_co_so_sx);
      } else if (user.id_dai_ly) {
        await DistributionAgent.remove(user.id_dai_ly);
      } else if (user.id_trung_tam_bh) {
        await WarrantyCenter.remove(user.id_trung_tam_bh);
      }
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with id ${id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete with id " + id,
        });
      }
      return;
    }
  }
  res.send({ message: `Users was deleted successfully!` });
};

exports.ModeratorDirectoryProduct = async (req, res) => {
  try {
    const directoryProducts = await DirectoryProduct.getAll();
    res.status(200).send(directoryProducts);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving directory products.",
    });
  }
};

exports.ModeratorDirectoryProductId = async (req, res) => {
  try {
    const allDirectoryProducts = await DirectoryProduct.getAll();
    if (req.params.type === "parentDirectory") {
      try {
        const childrenDirectoryProductOrdinalNumber =
          await DirectoryProduct.findOrdinalNumberByParentDirectoryId(
            req.params.directoryId
          );
        childrenDirectoryProductOrdinalNumber.push(
          childrenDirectoryProductOrdinalNumber[
            childrenDirectoryProductOrdinalNumber.length - 1
          ] + 1
        );
        res.status(200).send([
          allDirectoryProducts,
          {
            ordinalNumbers: childrenDirectoryProductOrdinalNumber,
          },
        ]);
      } catch (err) {
        if (err.kind === "not_found") {
          try {
            const parentDirectoryProduct = await DirectoryProduct.findById(
              req.params.directoryId
            );
            res.status(200).send([
              allDirectoryProducts,
              {
                ordinalNumbers: [parentDirectoryProduct.stt + 1],
              },
            ]);
          } catch (err) {
            if (err.kind === "not_found") {
              res.status(200).send([
                allDirectoryProducts,
                {
                  ordinalNumbers: [1],
                },
              ]);
            } else {
              res.status(500).send({
                message:
                  "Error retrieving parent directory product with directory id " +
                  req.params.directoryId,
              });
            }
          }
        } else {
          res.status(500).send({
            message:
              "Error retrieving children directory product with directory id " +
              req.params.directoryId,
          });
        }
      }
    } else if (req.params.type === "brotherDirectory") {
      try {
        const brotherDirectoryProduct = await DirectoryProduct.findById(
          req.params.directoryId
        );
        try {
          const brotherDirectoryProductOrdinalNumbers =
            await DirectoryProduct.findOrdinalNumberByParentDirectoryId(
              brotherDirectoryProduct.id_danh_muc_cha
            );
          try {
            const parentOfBrotherDirectoryProduct =
              await DirectoryProduct.findById(
                brotherDirectoryProduct.id_danh_muc_cha
              );
            try {
              const brotherOfParentOfBrotherDirectoryProductOrdinalNumbers =
                await DirectoryProduct.findOrdinalNumberByParentDirectoryId(
                  parentOfBrotherDirectoryProduct.id_danh_muc_cha
                );
              for (
                let i = 0;
                i <
                brotherOfParentOfBrotherDirectoryProductOrdinalNumbers.length;
                i++
              ) {
                if (
                  i + 1 !==
                  brotherOfParentOfBrotherDirectoryProductOrdinalNumbers.length
                ) {
                  if (
                    parentOfBrotherDirectoryProduct.stt ===
                    brotherOfParentOfBrotherDirectoryProductOrdinalNumbers[i]
                  ) {
                    brotherDirectoryProductOrdinalNumbers.push(
                      brotherOfParentOfBrotherDirectoryProductOrdinalNumbers[
                        i + 1
                      ]
                    );
                    break;
                  }
                } else {
                  try {
                    const maxOrdinalNumber =
                      await DirectoryProduct.selectMaxOrdinalNumber();
                    brotherDirectoryProductOrdinalNumbers.push(
                      maxOrdinalNumber + 1
                    );
                  } catch (err) {
                    if (err.kind === "not_found_max") {
                      res.status(404).send({
                        message:
                          "Not found Directory Product ordinal number max",
                      });
                    } else {
                      res.status(500).send({
                        message:
                          "Error select Directory Product ordinal number max",
                      });
                    }
                  }
                }
              }
            } catch (err) {
              res.status(500).send({
                message:
                  "Error retrieving brother of parent of brother directory products with directory id " +
                  parentOfBrotherDirectoryProduct.id_danh_muc_cha,
              });
            }
          } catch (err) {
            if (err.kind === "not_found") {
              try {
                const maxOrdinalNumber =
                  await DirectoryProduct.selectMaxOrdinalNumber();
                brotherDirectoryProductOrdinalNumbers.push(
                  maxOrdinalNumber + 1
                );
              } catch (err) {
                if (err.kind === "not_found_max") {
                  res.status(404).send({
                    message: "Not found Directory Product ordinal number max",
                  });
                } else {
                  res.status(500).send({
                    message:
                      "Error select Directory Product ordinal number max",
                  });
                }
              }
            } else {
              res.status(500).send({
                message:
                  "Error retrieving Directory Product with id " +
                  brotherDirectoryProduct.id_danh_muc_cha,
              });
            }
          }
          res.status(200).send([
            allDirectoryProducts,
            {
              ordinalNumbers: brotherDirectoryProductOrdinalNumbers,
            },
          ]);
        } catch (err) {
          res.status(500).send({
            message:
              "Error retrieving brother directory products with directory id " +
              brotherDirectoryProduct.id_danh_muc_cha,
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([
            allDirectoryProducts,
            {
              ordinalNumbers: [1],
            },
          ]);
        } else {
          res.status(500).send({
            message:
              "Error retrieving brother directory product with directory id " +
              req.params.directoryId,
          });
        }
      }
    } else {
      try {
        const childDirectoryProduct = await DirectoryProduct.findById(
          req.params.directoryId
        );
        try {
          var brotherDirectoryProducts =
            await DirectoryProduct.findByParentDirectory(
              childDirectoryProduct.id_danh_muc_cha
            );
          res.status(200).send([
            allDirectoryProducts,
            {
              ordinalNumbers: [brotherDirectoryProducts[0].stt],
            },
          ]);
        } catch (err) {
          res.status(500).send({
            message:
              "Error retrieving brother directory products with directory id " +
              brotherDirectoryProducts.id_danh_muc_cha,
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([
            allDirectoryProducts,
            {
              ordinalNumbers: [1],
            },
          ]);
        } else {
          res.status(500).send({
            message:
              "Error retrieving child directory product with directory id " +
              id,
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving directory products.",
    });
  }
};

exports.ModeratorDirectoryProductCreate = async (req, res) => {
  let parentDirectoryT = 0;
  let hasError = false;
  try {
    const directoryProduct = await DirectoryProduct.findById(
      req.params.directoryId
    );
    if (req.params.type === "parentDirectory") {
      parentDirectoryT = req.params.directoryId;
    } else if (req.params.type === "brotherDirectory") {
      parentDirectoryT = directoryProduct.id_danh_muc_cha;
    } else if (req.params.type === "childDirectory") {
      parentDirectoryT = directoryProduct.id_danh_muc_cha;
    }
    if (hasError) {
      return;
    }
  } catch (err) {
    if (err.kind !== "not_found") {
      res.status(500).send({
        message:
          "Error retrieving directory product with directory id " +
          req.params.directoryId,
      });
    }
  }
  try {
    await DirectoryProduct.normalizeOrdinalNumberUp(req.body.stt);
    try {
      const directoryProductNew = await DirectoryProduct.create(
        new DirectoryProduct({
          stt: req.body.stt,
          id_danh_muc_cha: parentDirectoryT,
          ten_danh_muc_sp: req.body.ten_danh_muc_sp,
        })
      );
      if (req.params.type === "childDirectory") {
        try {
          await DirectoryProduct.updateParentDirectoryByParentDirectory(
            parentDirectoryT,
            directoryProductNew.id
          );
        } catch (err) {
          hasError = true;
          if (err.kind !== "not_found") {
            res.status(500).send({
              message:
                "Error updating Directory Product with parent directory id " +
                parentDirectoryT,
            });
          }
        }
      }
      res.send({ message: "Directory product was created successfully!" });
    } catch (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Directory product.",
      });
    }
  } catch (err) {
    if (err.kind === "select_max_error") {
      res.status(500).send({
        message: "Error select Directory Product ordinal number max",
      });
    } else if (err.kind === "not_found_max") {
      res.status(404).send({
        message: "Not found Directory Product ordinal number max",
      });
    } else if (err.kind === "update_loop_error") {
      res.status(500).send({
        message: "Error update Directory Product ordinal number in loop",
      });
    } else if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Product with ordinal number",
      });
    }
  }
};

exports.ModeratorDirectoryProductDelete = async (req, res) => {
  let hasError = false;
  try {
    const directoryProduct = await DirectoryProduct.findById(req.params.id);
    try {
      await DirectoryProduct.findByParentDirectory(req.params.id);
      try {
        await DirectoryProduct.updateParentDirectoryByParentDirectory(
          req.params.id,
          directoryProduct.id_danh_muc_cha
        );
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Product with parent directory id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Product with parent directory id ${req.params.id}.`,
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory products with parent directory id ${req.params.id}.`,
        });
      }
    }
  } catch (err) {
    hasError = true;
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Directory Product with id ${req.params.id}.`,
      });
      return;
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Product with id " + req.params.id,
      });
    }
  }
  try {
    id = parseInt(req.params.id);
    const directoryProduct = await DirectoryProduct.findById(id);
    try {
      await DirectoryProduct.remove(id);
      try {
        await DirectoryProduct.normalizeOrdinalNumberDown(directoryProduct.stt);
        res.send({ message: `Directory Product was deleted successfully!` });
      } catch (err) {
        if (err.kind === "select_max_error") {
          res.status(500).send({
            message:
              err.content.message ||
              "Error select Directory Product Ordinal Number max",
          });
        } else if (err.kind === "not_found_max") {
          res.status(404).send({
            message: "Not found Directory Product Ordinal Number max",
          });
        } else if (err.kind === "update_loop_error") {
          res.status(500).send({
            message:
              err.content.message ||
              "Error update Directory Product Ordinal Number in loop",
          });
        } else if (err.kind === "not_found") {
          res.status(404).send({
            message: "Not found Directory Product with Ordinal Number",
          });
        }
      }
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Directory Product with id ${id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Directory Product with id " + id,
        });
      }
    }
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Product with id " + id,
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Product with id " + id,
      });
    }
  }
};

exports.ModeratorDirectoryProductSummon = async (req, res) => {
  let children = [],
    allId = [];
  children.push({
    id: req.params.id,
  });
  while (children.length) {
    let child = children.pop();
    allId.push(child.id);
    try {
      let childrenDirectory = await DirectoryProduct.findByParentDirectory(
        child.id
      );
      for (let i = 0; i < childrenDirectory.length; i++) {
        children.push(childrenDirectory[i]);
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Lỗi khi tìm các id danh mục sản phẩm!`,
        });
        return;
      }
    }
  }
  const products = await Product.findByDirectoryProductId(allId);
  let productIds = [];
  for (let i = 0; i < products.length; i++) {
    productIds.push(products[i].id);
  }
  await Product.updateByIds(
    {
      id_trang_thai: 16,
    },
    productIds
  );
  for (let i = 0; i < productIds.length; i++) {
    try {
      const warranty =
        await Warranty.getWarrantyIdByMaxWarrantyTimeAndProductId(
          productIds[i]
        );
      await Warranty.create({
        id_san_pham: productIds[i],
        lan_bao_hanh: warranty.lan_bao_hanh + 1,
        ngay_loi_can_trieu_hoi: await MyDate.getNow(),
      });
    } catch (err) {
      if (err.kind === "not_found") {
        await Warranty.create({
          id_san_pham: productIds[i],
          lan_bao_hanh: 1,
          ngay_loi_can_trieu_hoi: await MyDate.getNow(),
        });
      } else {
        res.status(500).send({
          message: `Lỗi khi triệu hồi sản phẩm!`,
        });
        return;
      }
    }
  }
  res.status(200).send({
    message: `Triệu hồi sản phẩm thành công!`,
  });
};

exports.ModeratorDirectoryProductionFacility = async (req, res) => {
  try {
    const directoryProductionFacilitys =
      await DirectoryProductionFacility.getAll();
    res.status(200).send(directoryProductionFacilitys);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving directory production facilitys.",
    });
  }
};

exports.ModeratorDirectoryProductionFacilityId = async (req, res) => {
  try {
    const allDirectoryProductionFacilitys =
      await DirectoryProductionFacility.getAll();
    if (req.params.type === "parentDirectory") {
      try {
        const childrenDirectoryProductionFacilityOrdinalNumber =
          await DirectoryProductionFacility.findOrdinalNumberByParentDirectoryId(
            req.params.directoryId
          );
        childrenDirectoryProductionFacilityOrdinalNumber.push(
          childrenDirectoryProductionFacilityOrdinalNumber[
            childrenDirectoryProductionFacilityOrdinalNumber.length - 1
          ] + 1
        );
        res.status(200).send([
          allDirectoryProductionFacilitys,
          {
            ordinalNumbers: childrenDirectoryProductionFacilityOrdinalNumber,
          },
        ]);
      } catch (err) {
        if (err.kind === "not_found") {
          try {
            const parentDirectoryProductionFacility =
              await DirectoryProductionFacility.findById(
                req.params.directoryId
              );
            res.status(200).send([
              allDirectoryProductionFacilitys,
              {
                ordinalNumbers: [parentDirectoryProductionFacility.stt + 1],
              },
            ]);
          } catch (err) {
            if (err.kind === "not_found") {
              res.status(200).send([
                allDirectoryProductionFacilitys,
                {
                  ordinalNumbers: [1],
                },
              ]);
            } else {
              res.status(500).send({
                message:
                  "Error retrieving parent directory production facility with directory id " +
                  req.params.directoryId,
              });
            }
          }
        } else {
          res.status(500).send({
            message:
              "Error retrieving children directory production facility with directory id " +
              req.params.directoryId,
          });
        }
      }
    } else if (req.params.type === "brotherDirectory") {
      try {
        const brotherDirectoryProductionFacility =
          await DirectoryProductionFacility.findById(req.params.directoryId);
        try {
          const brotherDirectoryProductionFacilityOrdinalNumbers =
            await DirectoryProductionFacility.findOrdinalNumberByParentDirectoryId(
              brotherDirectoryProductionFacility.id_danh_muc_cha
            );
          try {
            const parentOfBrotherDirectoryProductionFacility =
              await DirectoryProductionFacility.findById(
                brotherDirectoryProductionFacility.id_danh_muc_cha
              );
            try {
              const brotherOfParentOfBrotherDirectoryProductionFacilityOrdinalNumbers =
                await DirectoryProductionFacility.findOrdinalNumberByParentDirectoryId(
                  parentOfBrotherDirectoryProductionFacility.id_danh_muc_cha
                );
              for (
                let i = 0;
                i <
                brotherOfParentOfBrotherDirectoryProductionFacilityOrdinalNumbers.length;
                i++
              ) {
                if (
                  i + 1 !==
                  brotherOfParentOfBrotherDirectoryProductionFacilityOrdinalNumbers.length
                ) {
                  if (
                    parentOfBrotherDirectoryProductionFacility.stt ===
                    brotherOfParentOfBrotherDirectoryProductionFacilityOrdinalNumbers[
                      i
                    ]
                  ) {
                    brotherDirectoryProductionFacilityOrdinalNumbers.push(
                      brotherOfParentOfBrotherDirectoryProductionFacilityOrdinalNumbers[
                        i + 1
                      ]
                    );
                    break;
                  }
                } else {
                  try {
                    const maxOrdinalNumber =
                      await DirectoryProductionFacility.selectMaxOrdinalNumber();
                    brotherDirectoryProductionFacilityOrdinalNumbers.push(
                      maxOrdinalNumber + 1
                    );
                  } catch (err) {
                    if (err.kind === "not_found_max") {
                      res.status(404).send({
                        message:
                          "Not found Directory Production Facility ordinal number max",
                      });
                    } else {
                      res.status(500).send({
                        message:
                          "Error select Directory Production Facility ordinal number max",
                      });
                    }
                  }
                }
              }
            } catch (err) {
              res.status(500).send({
                message:
                  "Error retrieving brother of parent of brother directory production facilitys with directory id " +
                  parentOfBrotherDirectoryProductionFacility.id_danh_muc_cha,
              });
            }
          } catch (err) {
            if (err.kind === "not_found") {
              try {
                const maxOrdinalNumber =
                  await DirectoryProductionFacility.selectMaxOrdinalNumber();
                brotherDirectoryProductionFacilityOrdinalNumbers.push(
                  maxOrdinalNumber + 1
                );
              } catch (err) {
                if (err.kind === "not_found_max") {
                  res.status(404).send({
                    message:
                      "Not found Directory Production Facility ordinal number max",
                  });
                } else {
                  res.status(500).send({
                    message:
                      "Error select Directory Production Facility ordinal number max",
                  });
                }
              }
            } else {
              res.status(500).send({
                message:
                  "Error retrieving Directory Production Facility with id " +
                  brotherDirectoryProductionFacility.id_danh_muc_cha,
              });
            }
          }
          res.status(200).send([
            allDirectoryProductionFacilitys,
            {
              ordinalNumbers: brotherDirectoryProductionFacilityOrdinalNumbers,
            },
          ]);
        } catch (err) {
          res.status(500).send({
            message:
              "Error retrieving brother directory production facilitys with directory id " +
              brotherDirectoryProductionFacility.id_danh_muc_cha,
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([
            allDirectoryProductionFacilitys,
            {
              ordinalNumbers: [1],
            },
          ]);
        } else {
          res.status(500).send({
            message:
              "Error retrieving brother directory production facility with directory id " +
              req.params.directoryId,
          });
        }
      }
    } else {
      try {
        const childDirectoryProductionFacility =
          await DirectoryProductionFacility.findById(req.params.directoryId);
        try {
          var brotherDirectoryProductionFacilitys =
            await DirectoryProductionFacility.findByParentDirectory(
              childDirectoryProductionFacility.id_danh_muc_cha
            );
          res.status(200).send([
            allDirectoryProductionFacilitys,
            {
              ordinalNumbers: [brotherDirectoryProductionFacilitys[0].stt],
            },
          ]);
        } catch (err) {
          res.status(500).send({
            message:
              "Error retrieving brother directory production facilitys with directory id " +
              brotherDirectoryProductionFacilitys.id_danh_muc_cha,
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([
            allDirectoryProductionFacilitys,
            {
              ordinalNumbers: [1],
            },
          ]);
        } else {
          res.status(500).send({
            message:
              "Error retrieving child directory production facility with directory id " +
              req.params.directoryId,
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving directory production facilitys.",
    });
  }
};

exports.ModeratorDirectoryProductionFacilityCreate = async (req, res) => {
  let parentDirectoryT = 0;
  let hasError = false;
  try {
    const directoryProductionFacility =
      await DirectoryProductionFacility.findById(req.params.directoryId);
    if (req.params.type === "parentDirectory") {
      parentDirectoryT = req.params.directoryId;
    } else if (req.params.type === "brotherDirectory") {
      parentDirectoryT = directoryProductionFacility.id_danh_muc_cha;
    } else if (req.params.type === "childDirectory") {
      parentDirectoryT = directoryProductionFacility.id_danh_muc_cha;
    }
    if (hasError) {
      return;
    }
  } catch (err) {
    if (err.kind !== "not_found") {
      res.status(500).send({
        message:
          "Error retrieving directory production facility with directory id " +
          req.params.directoryId,
      });
    }
  }
  try {
    await DirectoryProductionFacility.normalizeOrdinalNumberUp(req.body.stt);
    try {
      const directoryProductionFacilityNew =
        await DirectoryProductionFacility.create(
          new DirectoryProductionFacility({
            stt: req.body.stt,
            id_danh_muc_cha: parentDirectoryT,
            ten_danh_muc_cssx: req.body.ten_danh_muc_cssx,
          })
        );
      if (req.params.type === "childDirectory") {
        try {
          await DirectoryProductionFacility.updateParentDirectoryByParentDirectory(
            parentDirectoryT,
            directoryProductionFacilityNew.id
          );
        } catch (err) {
          hasError = true;
          if (err.kind !== "not_found") {
            res.status(500).send({
              message:
                "Error updating Directory Production Facility with parent directory id " +
                parentDirectoryT,
            });
          }
        }
      }
      res.send({
        message: "Directory production facility was created successfully!",
      });
    } catch (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Directory production facility.",
      });
    }
  } catch (err) {
    if (err.kind === "select_max_error") {
      res.status(500).send({
        message:
          "Error select Directory Production Facility ordinal number max",
      });
    } else if (err.kind === "not_found_max") {
      res.status(404).send({
        message: "Not found Directory Production Facility ordinal number max",
      });
    } else if (err.kind === "update_loop_error") {
      res.status(500).send({
        message:
          "Error update Directory Production Facility ordinal number in loop",
      });
    } else if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Production Facility with ordinal number",
      });
    }
  }
};

exports.ModeratorDirectoryProductionFacilityDelete = async (req, res) => {
  let hasError = false;
  try {
    const directoryProductionFacility =
      await DirectoryProductionFacility.findById(req.params.id);
    try {
      await DirectoryProductionFacility.findByParentDirectory(req.params.id);
      try {
        await DirectoryProductionFacility.updateParentDirectoryByParentDirectory(
          req.params.id,
          directoryProductionFacility.id_danh_muc_cha
        );
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Production Facility with parent directory id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Production Facility with parent directory id ${req.params.id}.`,
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory production facilitys with parent directory id ${req.params.id}.`,
        });
      }
    }
  } catch (err) {
    hasError = true;
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Directory Production Facility with id ${req.params.id}.`,
      });
      return;
    } else {
      res.status(500).send({
        message:
          "Error retrieving Directory Production Facility with id " +
          req.params.id,
      });
    }
  }
  try {
    id = parseInt(req.params.id);
    const directoryProductionFacility =
      await DirectoryProductionFacility.findById(id);
    try {
      await DirectoryProductionFacility.remove(id);
      try {
        await DirectoryProductionFacility.normalizeOrdinalNumberDown(
          directoryProductionFacility.stt
        );
        res.send({
          message: `Directory Production Facility was deleted successfully!`,
        });
      } catch (err) {
        if (err.kind === "select_max_error") {
          res.status(500).send({
            message:
              "Error select Directory Production Facility Ordinal Number max",
          });
        } else if (err.kind === "not_found_max") {
          res.status(404).send({
            message:
              "Not found Directory Production Facility Ordinal Number max",
          });
        } else if (err.kind === "update_loop_error") {
          res.status(500).send({
            message:
              "Error update Directory Production Facility Ordinal Number in loop",
          });
        } else if (err.kind === "not_found") {
          res.status(404).send({
            message:
              "Not found Directory Production Facility with Ordinal Number",
          });
        }
      }
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Directory Production Facility with id ${id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Could not delete Directory Production Facility with id " + id,
        });
      }
    }
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Production Facility with id " + id,
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Production Facility with id " + id,
      });
    }
  }
};

exports.ModeratorDirectoryDistributionAgent = async (req, res) => {
  try {
    const directoryDistributionAgents =
      await DirectoryDistributionAgent.getAll();
    res.status(200).send(directoryDistributionAgents);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving directory distribution agents.",
    });
  }
};

exports.ModeratorDirectoryDistributionAgentId = async (req, res) => {
  try {
    const allDirectoryDistributionAgents =
      await DirectoryDistributionAgent.getAll();
    if (req.params.type === "parentDirectory") {
      try {
        const childrenDirectoryDistributionAgentOrdinalNumber =
          await DirectoryDistributionAgent.findOrdinalNumberByParentDirectoryId(
            req.params.directoryId
          );
        childrenDirectoryDistributionAgentOrdinalNumber.push(
          childrenDirectoryDistributionAgentOrdinalNumber[
            childrenDirectoryDistributionAgentOrdinalNumber.length - 1
          ] + 1
        );
        res.status(200).send([
          allDirectoryDistributionAgents,
          {
            ordinalNumbers: childrenDirectoryDistributionAgentOrdinalNumber,
          },
        ]);
      } catch (err) {
        if (err.kind === "not_found") {
          try {
            const parentDirectoryDistributionAgent =
              await DirectoryDistributionAgent.findById(req.params.directoryId);
            res.status(200).send([
              allDirectoryDistributionAgents,
              {
                ordinalNumbers: [parentDirectoryDistributionAgent.stt + 1],
              },
            ]);
          } catch (err) {
            if (err.kind === "not_found") {
              res.status(200).send([
                allDirectoryDistributionAgents,
                {
                  ordinalNumbers: [1],
                },
              ]);
            } else {
              res.status(500).send({
                message:
                  "Error retrieving parent directory distribution agent with directory id " +
                  req.params.directoryId,
              });
            }
          }
        } else {
          res.status(500).send({
            message:
              "Error retrieving children directory distribution agent with directory id " +
              req.params.directoryId,
          });
        }
      }
    } else if (req.params.type === "brotherDirectory") {
      try {
        const brotherDirectoryDistributionAgent =
          await DirectoryDistributionAgent.findById(req.params.directoryId);
        try {
          const brotherDirectoryDistributionAgentOrdinalNumbers =
            await DirectoryDistributionAgent.findOrdinalNumberByParentDirectoryId(
              brotherDirectoryDistributionAgent.id_danh_muc_cha
            );
          try {
            const parentOfBrotherDirectoryDistributionAgent =
              await DirectoryDistributionAgent.findById(
                brotherDirectoryDistributionAgent.id_danh_muc_cha
              );
            try {
              const brotherOfParentOfBrotherDirectoryDistributionAgentOrdinalNumbers =
                await DirectoryDistributionAgent.findOrdinalNumberByParentDirectoryId(
                  parentOfBrotherDirectoryDistributionAgent.id_danh_muc_cha
                );
              for (
                let i = 0;
                i <
                brotherOfParentOfBrotherDirectoryDistributionAgentOrdinalNumbers.length;
                i++
              ) {
                if (
                  i + 1 !==
                  brotherOfParentOfBrotherDirectoryDistributionAgentOrdinalNumbers.length
                ) {
                  if (
                    parentOfBrotherDirectoryDistributionAgent.stt ===
                    brotherOfParentOfBrotherDirectoryDistributionAgentOrdinalNumbers[
                      i
                    ]
                  ) {
                    brotherDirectoryDistributionAgentOrdinalNumbers.push(
                      brotherOfParentOfBrotherDirectoryDistributionAgentOrdinalNumbers[
                        i + 1
                      ]
                    );
                    break;
                  }
                } else {
                  try {
                    const maxOrdinalNumber =
                      await DirectoryDistributionAgent.selectMaxOrdinalNumber();
                    brotherDirectoryDistributionAgentOrdinalNumbers.push(
                      maxOrdinalNumber + 1
                    );
                  } catch (err) {
                    if (err.kind === "not_found_max") {
                      res.status(404).send({
                        message:
                          "Not found Directory Distribution Agent ordinal number max",
                      });
                    } else {
                      res.status(500).send({
                        message:
                          "Error select Directory Distribution Agent ordinal number max",
                      });
                    }
                  }
                }
              }
            } catch (err) {
              res.status(500).send({
                message:
                  "Error retrieving brother of parent of brother directory distribution agents with directory id " +
                  parentOfBrotherDirectoryDistributionAgent.id_danh_muc_cha,
              });
            }
          } catch (err) {
            if (err.kind === "not_found") {
              try {
                const maxOrdinalNumber =
                  await DirectoryDistributionAgent.selectMaxOrdinalNumber();
                brotherDirectoryDistributionAgentOrdinalNumbers.push(
                  maxOrdinalNumber + 1
                );
              } catch (err) {
                if (err.kind === "not_found_max") {
                  res.status(404).send({
                    message:
                      "Not found Directory Distribution Agent ordinal number max",
                  });
                } else {
                  res.status(500).send({
                    message:
                      "Error select Directory Distribution Agent ordinal number max",
                  });
                }
              }
            } else {
              res.status(500).send({
                message:
                  "Error retrieving Directory Distribution Agent with id " +
                  brotherDirectoryDistributionAgent.id_danh_muc_cha,
              });
            }
          }
          res.status(200).send([
            allDirectoryDistributionAgents,
            {
              ordinalNumbers: brotherDirectoryDistributionAgentOrdinalNumbers,
            },
          ]);
        } catch (err) {
          res.status(500).send({
            message:
              "Error retrieving brother directory distribution agents with directory name " +
              brotherDirectoryDistributionAgent.danh_muc_cha,
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([
            allDirectoryDistributionAgents,
            {
              ordinalNumbers: [1],
            },
          ]);
        } else {
          res.status(500).send({
            message:
              "Error retrieving brother directory distribution agent with directory name " +
              req.params.directoryName,
          });
        }
      }
    } else {
      try {
        const childDirectoryDistributionAgent =
          await DirectoryDistributionAgent.findById(req.params.directoryId);
        try {
          var brotherDirectoryDistributionAgents =
            await DirectoryDistributionAgent.findByParentDirectory(
              childDirectoryDistributionAgent.id_danh_muc_cha
            );
          res.status(200).send([
            allDirectoryDistributionAgents,
            {
              ordinalNumbers: [brotherDirectoryDistributionAgents[0].stt],
            },
          ]);
        } catch (err) {
          res.status(500).send({
            message:
              "Error retrieving brother directory distribution agents with directory id " +
              brotherDirectoryDistributionAgents.id_danh_muc_cha,
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([
            allDirectoryDistributionAgents,
            {
              ordinalNumbers: [1],
            },
          ]);
        } else {
          res.status(500).send({
            message:
              "Error retrieving child directory distribution agent with directory id " +
              req.params.directoryId,
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving directory distribution agents.",
    });
  }
};

exports.ModeratorDirectoryDistributionAgentCreate = async (req, res) => {
  let parentDirectoryT = 0;
  let hasError = false;
  try {
    const directoryDistributionAgent =
      await DirectoryDistributionAgent.findById(req.params.directoryId);
    if (req.params.type === "parentDirectory") {
      parentDirectoryT = req.params.directoryId;
    } else if (req.params.type === "brotherDirectory") {
      parentDirectoryT = directoryDistributionAgent.id_danh_muc_cha;
    } else if (req.params.type === "childDirectory") {
      parentDirectoryT = directoryDistributionAgent.id_danh_muc_cha;
    }
    if (hasError) {
      return;
    }
  } catch (err) {
    if (err.kind !== "not_found") {
      res.status(500).send({
        message:
          "Error retrieving directory distribution agent with directory id " +
          req.params.directoryId,
      });
    }
  }
  try {
    await DirectoryDistributionAgent.normalizeOrdinalNumberUp(req.body.stt);
    try {
      const directoryDistributionAgentNew =
        await DirectoryDistributionAgent.create(
          new DirectoryDistributionAgent({
            stt: req.body.stt,
            id_danh_muc_cha: parentDirectoryT,
            ten_danh_muc_dlpp: req.body.ten_danh_muc_dlpp,
          })
        );
      if (req.params.type === "childDirectory") {
        try {
          await DirectoryDistributionAgent.updateParentDirectoryByParentDirectory(
            parentDirectoryT,
            directoryDistributionAgentNew.id
          );
        } catch (err) {
          hasError = true;
          if (err.kind !== "not_found") {
            res.status(500).send({
              message:
                "Error updating Directory Distribution Agent with parent directory id " +
                directoryDistributionAgent.id_danh_muc_cha,
            });
          }
        }
      }
      res.send({
        message: "Directory distribution agent was created successfully!",
      });
    } catch (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Directory distribution agent.",
      });
    }
  } catch (err) {
    if (err.kind === "select_max_error") {
      res.status(500).send({
        message: "Error select Directory Distribution Agent ordinal number max",
      });
    } else if (err.kind === "not_found_max") {
      res.status(404).send({
        message: "Not found Directory Distribution Agent ordinal number max",
      });
    } else if (err.kind === "update_loop_error") {
      res.status(500).send({
        message:
          "Error update Directory Distribution Agent ordinal number in loop",
      });
    } else if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Distribution Agent with ordinal number",
      });
    }
  }
};

exports.ModeratorDirectoryDistributionAgentDelete = async (req, res) => {
  let hasError = false;
  try {
    const directoryDistributionAgent =
      await DirectoryDistributionAgent.findById(req.params.id);
    try {
      await DirectoryDistributionAgent.findByParentDirectory(req.params.id);
      try {
        await DirectoryDistributionAgent.updateParentDirectoryByParentDirectory(
          req.params.id,
          directoryDistributionAgent.id_danh_muc_cha
        );
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Distribution Agent with parent directory id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Distribution Agent with parent directory id ${req.params.id}.`,
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory distribution agents with parent directory id ${req.params.id}.`,
        });
      }
    }
  } catch (err) {
    hasError = true;
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Directory Distribution Agent with id ${req.params.id}.`,
      });
      return;
    } else {
      res.status(500).send({
        message:
          "Error retrieving Directory Distribution Agent with id " +
          req.params.id,
      });
    }
  }
  try {
    id = parseInt(req.params.id);
    const directoryDistributionAgent =
      await DirectoryDistributionAgent.findById(id);
    try {
      await DirectoryDistributionAgent.remove(id);
      try {
        await DirectoryDistributionAgent.normalizeOrdinalNumberDown(
          directoryDistributionAgent.stt
        );
        res.send({
          message: `Directory Distribution Agent was deleted successfully!`,
        });
      } catch (err) {
        if (err.kind === "select_max_error") {
          res.status(500).send({
            message:
              "Error select Directory Distribution Agent Ordinal Number max",
          });
        } else if (err.kind === "not_found_max") {
          res.status(404).send({
            message:
              "Not found Directory Distribution Agent Ordinal Number max",
          });
        } else if (err.kind === "update_loop_error") {
          res.status(500).send({
            message:
              "Error update Directory Distribution Agent Ordinal Number in loop",
          });
        } else if (err.kind === "not_found") {
          res.status(404).send({
            message:
              "Not found Directory Distribution Agent with Ordinal Number",
          });
        }
      }
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Directory Distribution Agent with id ${id}.`,
        });
      } else {
        res.status(500).send({
          message:
            "Could not delete Directory Distribution Agent with id " + id,
        });
      }
    }
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Distribution Agent with id " + id,
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Distribution Agent with id " + id,
      });
    }
  }
};

exports.ModeratorDirectoryWarrantyCenter = async (req, res) => {
  try {
    const directoryWarrantyCenters = await DirectoryWarrantyCenter.getAll();
    res.status(200).send(directoryWarrantyCenters);
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving directory warranty centers.",
    });
  }
};

exports.ModeratorDirectoryWarrantyCenterId = async (req, res) => {
  try {
    const allDirectoryWarrantyCenters = await DirectoryWarrantyCenter.getAll();
    if (req.params.type === "parentDirectory") {
      try {
        const childrenDirectoryWarrantyCenterOrdinalNumber =
          await DirectoryWarrantyCenter.findOrdinalNumberByParentDirectoryId(
            req.params.directoryId
          );
        childrenDirectoryWarrantyCenterOrdinalNumber.push(
          childrenDirectoryWarrantyCenterOrdinalNumber[
            childrenDirectoryWarrantyCenterOrdinalNumber.length - 1
          ] + 1
        );
        res.status(200).send([
          allDirectoryWarrantyCenters,
          {
            ordinalNumbers: childrenDirectoryWarrantyCenterOrdinalNumber,
          },
        ]);
      } catch (err) {
        if (err.kind === "not_found") {
          try {
            const parentDirectoryWarrantyCenter =
              await DirectoryWarrantyCenter.findById(req.params.directoryId);
            res.status(200).send([
              allDirectoryWarrantyCenters,
              {
                ordinalNumbers: [parentDirectoryWarrantyCenter.stt + 1],
              },
            ]);
          } catch (err) {
            if (err.kind === "not_found") {
              res.status(200).send([
                allDirectoryWarrantyCenters,
                {
                  ordinalNumbers: [1],
                },
              ]);
            } else {
              res.status(500).send({
                message:
                  "Error retrieving parent directory warranty center with directory id " +
                  req.params.directoryId,
              });
            }
          }
        } else {
          res.status(500).send({
            message:
              "Error retrieving children directory warranty center with directory id " +
              req.params.directoryId,
          });
        }
      }
    } else if (req.params.type === "brotherDirectory") {
      try {
        const brotherDirectoryWarrantyCenter =
          await DirectoryWarrantyCenter.findById(req.params.directoryId);
        try {
          const brotherDirectoryWarrantyCenterOrdinalNumbers =
            await DirectoryWarrantyCenter.findOrdinalNumberByParentDirectoryId(
              brotherDirectoryWarrantyCenter.id_danh_muc_cha
            );
          try {
            const parentOfBrotherDirectoryWarrantyCenter =
              await DirectoryWarrantyCenter.findById(
                brotherDirectoryWarrantyCenter.id_danh_muc_cha
              );
            try {
              const brotherOfParentOfBrotherDirectoryWarrantyCenterOrdinalNumbers =
                await DirectoryWarrantyCenter.findOrdinalNumberByParentDirectoryId(
                  parentOfBrotherDirectoryWarrantyCenter.id_danh_muc_cha
                );
              for (
                let i = 0;
                i <
                brotherOfParentOfBrotherDirectoryWarrantyCenterOrdinalNumbers.length;
                i++
              ) {
                if (
                  i + 1 !==
                  brotherOfParentOfBrotherDirectoryWarrantyCenterOrdinalNumbers.length
                ) {
                  if (
                    parentOfBrotherDirectoryWarrantyCenter.stt ===
                    brotherOfParentOfBrotherDirectoryWarrantyCenterOrdinalNumbers[
                      i
                    ]
                  ) {
                    brotherDirectoryWarrantyCenterOrdinalNumbers.push(
                      brotherOfParentOfBrotherDirectoryWarrantyCenterOrdinalNumbers[
                        i + 1
                      ]
                    );
                    break;
                  }
                } else {
                  try {
                    const maxOrdinalNumber =
                      await DirectoryWarrantyCenter.selectMaxOrdinalNumber();
                    brotherDirectoryWarrantyCenterOrdinalNumbers.push(
                      maxOrdinalNumber + 1
                    );
                  } catch (err) {
                    if (err.kind === "not_found_max") {
                      res.status(404).send({
                        message:
                          "Not found Directory Warranty Center ordinal number max",
                      });
                    } else {
                      res.status(500).send({
                        message:
                          "Error select Directory Warranty Center ordinal number max",
                      });
                    }
                  }
                }
              }
            } catch (err) {
              res.status(500).send({
                message:
                  "Error retrieving brother of parent of brother directory warranty centers with directory id " +
                  parentOfBrotherDirectoryWarrantyCenter.id_danh_muc_cha,
              });
            }
          } catch (err) {
            if (err.kind === "not_found") {
              try {
                const maxOrdinalNumber =
                  await DirectoryWarrantyCenter.selectMaxOrdinalNumber();
                brotherDirectoryWarrantyCenterOrdinalNumbers.push(
                  maxOrdinalNumber + 1
                );
              } catch (err) {
                if (err.kind === "not_found_max") {
                  res.status(404).send({
                    message:
                      "Not found Directory Warranty Center ordinal number max",
                  });
                } else {
                  res.status(500).send({
                    message:
                      "Error select Directory Warranty Center ordinal number max",
                  });
                }
              }
            } else {
              res.status(500).send({
                message:
                  "Error retrieving Directory Warranty Center with id " +
                  brotherDirectoryWarrantyCenter.id_danh_muc_cha,
              });
            }
          }
          res.status(200).send([
            allDirectoryWarrantyCenters,
            {
              ordinalNumbers: brotherDirectoryWarrantyCenterOrdinalNumbers,
            },
          ]);
        } catch (err) {
          res.status(500).send({
            message:
              "Error retrieving brother directory warranty centers with directory id " +
              brotherDirectoryWarrantyCenter.id_danh_muc_cha,
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([
            allDirectoryWarrantyCenters,
            {
              ordinalNumbers: [1],
            },
          ]);
        } else {
          res.status(500).send({
            message:
              "Error retrieving brother directory warranty center with directory id " +
              req.params.directoryId,
          });
        }
      }
    } else {
      try {
        const childDirectoryWarrantyCenter =
          await DirectoryWarrantyCenter.findById(req.params.directoryId);
        try {
          var brotherDirectoryWarrantyCenters =
            await DirectoryWarrantyCenter.findByParentDirectory(
              childDirectoryWarrantyCenter.id_danh_muc_cha
            );
          res.status(200).send([
            allDirectoryWarrantyCenters,
            {
              ordinalNumbers: [brotherDirectoryWarrantyCenters[0].stt],
            },
          ]);
        } catch (err) {
          res.status(500).send({
            message:
              "Error retrieving brother directory warranty centers with directory id " +
              brotherDirectoryWarrantyCenters.id_danh_muc_cha,
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([
            allDirectoryWarrantyCenters,
            {
              ordinalNumbers: [1],
            },
          ]);
        } else {
          res.status(500).send({
            message:
              "Error retrieving child directory warranty center with directory id " +
              req.params.directoryId,
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message ||
        "Some error occurred while retrieving directory warranty centers.",
    });
  }
};

exports.ModeratorDirectoryWarrantyCenterCreate = async (req, res) => {
  let parentDirectoryT = 0;
  let hasError = false;
  try {
    const directoryWarrantyCenter = await DirectoryWarrantyCenter.findById(
      req.params.directoryId
    );
    if (req.params.type === "parentDirectory") {
      parentDirectoryT = req.params.directoryId;
    } else if (req.params.type === "brotherDirectory") {
      parentDirectoryT = directoryWarrantyCenter.id_danh_muc_cha;
    } else if (req.params.type === "childDirectory") {
      parentDirectoryT = directoryWarrantyCenter.id_danh_muc_cha;
    }
    if (hasError) {
      return;
    }
  } catch (err) {
    if (err.kind !== "not_found") {
      res.status(500).send({
        message:
          "Error retrieving directory warranty center with directory id " +
          req.params.directoryId,
      });
    }
  }
  try {
    await DirectoryWarrantyCenter.normalizeOrdinalNumberUp(req.body.stt);
    try {
      const directoryWarrantyCenterNew = await DirectoryWarrantyCenter.create(
        new DirectoryWarrantyCenter({
          stt: req.body.stt,
          id_danh_muc_cha: parentDirectoryT,
          ten_danh_muc_ttbh: req.body.ten_danh_muc_ttbh,
        })
      );
      if (req.params.type === "childDirectory") {
        try {
          await DirectoryWarrantyCenter.updateParentDirectoryByParentDirectory(
            parentDirectoryT,
            directoryWarrantyCenterNew.id
          );
        } catch (err) {
          hasError = true;
          if (err.kind !== "not_found") {
            res.status(500).send({
              message:
                "Error updating Directory Warranty Center with parent directory id " +
                parentDirectoryT,
            });
          }
        }
      }
      res.send({
        message: "Directory warranty center was created successfully!",
      });
    } catch (err) {
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the Directory warranty center.",
      });
    }
  } catch (err) {
    if (err.kind === "select_max_error") {
      res.status(500).send({
        message: "Error select Directory Warranty Center ordinal number max",
      });
    } else if (err.kind === "not_found_max") {
      res.status(404).send({
        message: "Not found Directory Warranty Center ordinal number max",
      });
    } else if (err.kind === "update_loop_error") {
      res.status(500).send({
        message:
          "Error update Directory Warranty Center ordinal number in loop",
      });
    } else if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Warranty Center with ordinal number",
      });
    }
  }
};

exports.ModeratorDirectoryWarrantyCenterDelete = async (req, res) => {
  let hasError = false;
  try {
    const directoryWarrantyCenter = await DirectoryWarrantyCenter.findById(
      req.params.id
    );
    try {
      await DirectoryWarrantyCenter.findByParentDirectory(req.params.id);
      try {
        await DirectoryWarrantyCenter.updateParentDirectoryByParentDirectory(
          req.params.id,
          directoryWarrantyCenter.id_danh_muc_cha
        );
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Warranty Center with parent directory id ${req.params.id}.`,
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Warranty Center with parent directory id ${req.params.id}.`,
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory warranty centers with parent directory id ${req.params.id}.`,
        });
      }
    }
  } catch (err) {
    hasError = true;
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Directory Warranty Center with id ${req.params.id}.`,
      });
      return;
    } else {
      res.status(500).send({
        message:
          "Error retrieving Directory Warranty Center with id " + req.params.id,
      });
    }
  }
  try {
    id = parseInt(req.params.id);
    const directoryWarrantyCenter = await DirectoryWarrantyCenter.findById(id);
    try {
      await DirectoryWarrantyCenter.remove(id);
      try {
        await DirectoryWarrantyCenter.normalizeOrdinalNumberDown(
          directoryWarrantyCenter.stt
        );
        res.send({
          message: `Directory Warranty Center was deleted successfully!`,
        });
      } catch (err) {
        if (err.kind === "select_max_error") {
          res.status(500).send({
            message:
              "Error select Directory Warranty Center Ordinal Number max",
          });
        } else if (err.kind === "not_found_max") {
          res.status(404).send({
            message: "Not found Directory Warranty Center Ordinal Number max",
          });
        } else if (err.kind === "update_loop_error") {
          res.status(500).send({
            message:
              "Error update Directory Warranty Center Ordinal Number in loop",
          });
        } else if (err.kind === "not_found") {
          res.status(404).send({
            message: "Not found Directory Warranty Center with Ordinal Number",
          });
        }
      }
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Directory Warranty Center with id ${id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete Directory Warranty Center with id " + id,
        });
      }
    }
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Warranty Center with id " + id,
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Warranty Center with id " + id,
      });
    }
  }
};

exports.ModeratorProductFilterData = async (req, res) => {
  try {
    const [statuses, productionFacilitys, distributionAgents, warrantyCenters] =
      await Promise.all([
        Status.getAll(),
        ProductionFacility.getAll(),
        DistributionAgent.getAll(),
        WarrantyCenter.getAll(),
      ]);
    res.status(200).send({
      statuses: statuses,
      productionFacilitys: productionFacilitys,
      distributionAgents: distributionAgents,
      warrantyCenters: warrantyCenters,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found data.`,
      });
    } else {
      res.status(500).send({
        message: "Error retrieving data",
      });
    }
  }
};

exports.ModeratorProduct = async (req, res) => {
  try {
    let productIds;
    if (req.body.id_trung_tam_bh) {
      const data = await Warranty.getProductIdFromWarrantyCenterId(
        req.body.id_trung_tam_bh
      );
      productIds = [];
      for (let i = 0; i < data.length; i++) {
        productIds.push(data[i].id_san_pham);
      }
    }
    const products = await Product.getAll(
      req.body.id_trang_thai,
      req.body.id_co_so_sx,
      req.body.id_dai_ly,
      productIds
    );
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm!`,
      });
    } else {
      res.status(500).send({
        message: "Lỗi khi lấy sản phẩm!",
      });
    }
  }
};

exports.ProductionFacilityBoard = (req, res) => {
  res.status(200).send("Production Facility Content.");
};

exports.DistributionAgentBoard = (req, res) => {
  res.status(200).send("Distribution Agent Content.");
};

exports.DistributionAgentProduct = async (req, res) => {
  try {
    const products = await Product.getAll(2, null, req.id_dai_ly);
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm!`,
      });
    } else {
      res.status(500).send({
        message: "Lỗi khi lấy sản phẩm!",
      });
    }
  }
};

exports.DistributionAgentProductStatusUpdate = async (req, res) => {
  try {
    const products = await Product.getAll(null, null, null, req.body.ids);
    let dateIds = [];
    for (let i = 0; i < products.length; i++) {
      dateIds.push(products[i].id_ngay);
    }
    const now = await MyDate.getNow();
    await MyDate.updateByIds(
      {
        nam_tai_kho_dai_ly: now,
      },
      dateIds
    );
    await Product.updateByIds(
      {
        id_trang_thai: 3,
      },
      req.body.ids
    );
    res.status(200).send({
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không tìm thấy sản phẩm!`,
      });
    } else {
      res.status(500).send({
        message: "Lỗi khi cập nhật trạng thái sản phẩm!",
      });
    }
  }
};

exports.DistributionAgentCustomer = async (req, res) => {
  try {
    const customers = await Customer.findByNameAndDateOfBirth(
      req.params.name,
      req.params.dateOfBirth
    );
    res.status(200).send(customers);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không tìm thấy khách hàng với tên là ${req.params.name} và ngày sinh là ${req.params.dateOfBirth}!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi tìm kiếm khách hàng với tên là ${req.params.name} và ngày sinh là ${req.params.dateOfBirth}!`,
      });
    }
  }
};

exports.DistributionAgentProductSell = async (req, res) => {
  let id;
  if (req.body.ho_ten) {
    try {
      const newCustomer = await Customer.create(new Customer(req.body));
      id = newCustomer.id;
    } catch (err) {
      res.status(500).send({
        message: `Lỗi khi tạo khách hàng!`,
      });
    }
  } else {
    id = req.body.id_khach_hang;
  }
  try {
    const products = await Product.getAll(null, null, null, [req.body.id]);
    let dateIds = [];
    for (let i = 0; i < products.length; i++) {
      dateIds.push(products[i].id_ngay);
    }
    const now = await MyDate.getNow();
    await MyDate.updateByIds(
      {
        ngay_ban_cho_kh: now,
      },
      dateIds
    );
    await Product.updateByIds(
      {
        id_trang_thai: 7,
        id_khach_hang: id,
      },
      [req.body.id]
    );
    res.status(200).send({
      message: "Cập nhật thành công!",
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không tìm thấy sản phẩm với id ${req.body.id}!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi cập nhật trạng thái sản phẩm với id ${req.body.id}!`,
      });
    }
  }
};

exports.DistributionAgentProductError = async (req, res) => {
  try {
    req.params.id = parseInt(req.params.id);
    await Product.updateByIds(
      {
        id_trang_thai: 9,
      },
      [req.params.id]
    );
    try {
      const warranty =
        await Warranty.getWarrantyIdByMaxWarrantyTimeAndProductId(
          req.params.id
        );
      if (warranty.id) {
        if (warranty.ngay_dang_bao_hanh_tai_trung_tam) {
          await Warranty.create({
            id_san_pham: req.params.id,
            id_dai_ly: req.id_dai_ly,
            lan_bao_hanh: warranty.lan_bao_hanh + 1,
            ngay_loi_can_bao_hanh: await MyDate.getNow(),
          });
        } else {
          await Warranty.updateByIds(
            {
              id_dai_ly: req.id_dai_ly,
              ngay_loi_can_bao_hanh: await MyDate.getNow(),
            },
            [warranty.id]
          );
        }
      } else {
        await Warranty.create(
          new Warranty({
            id_san_pham: req.params.id,
            id_dai_ly: req.id_dai_ly,
          })
        );
        console.log("hehehê");
      }
    } catch (err) {
      if (err.kind === "not_found") {
        await Warranty.create(
          new Warranty({
            id_san_pham: req.params.id,
            id_dai_ly: req.id_dai_ly,
          })
        );
      } else {
        res.status(500).send({
          message: `Lỗi khi cập nhật trạng thái sản phẩm với id = ${req.params.id}!`,
        });
        return;
      }
    }
    res.status(200).send({
      message: "Cập nhật trạng thái thành công!",
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không tìm thấy sản phẩm với id = ${req.params.id}!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi cập nhật trạng thái sản phẩm với id = ${req.params.id}!`,
      });
    }
  }
};

exports.DistributionAgentProductWarrantyGetAll = async (req, res) => {
  try {
    const products = await Product.getAll(9);
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm cần bảo hành!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi đang tìm kiếm sản phẩm!`,
      });
    }
  }
};

exports.DistributionAgentWarrantyCenterPick = async (req, res) => {
  try {
    const allWWarrantyCenter = await WarrantyCenter.getAll();
    res.status(200).send(allWWarrantyCenter);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không tìm thấy trung tâm bảo hành!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi tìm kiếm trung tâm bảo hành!`,
      });
    }
  }
};

exports.DistributionAgentProductShippingToWarrantyCenter = async (req, res) => {
  try {
    await Product.updateByIds(
      {
        id_trang_thai: 4,
      },
      req.body.ids
    );
    let warrantyIds = [];
    for (let i = 0; i < req.body.ids.length; i++) {
      let warranty = await Warranty.getWarrantyIdByMaxWarrantyTimeAndProductId(
        req.body.ids[i]
      );
      warrantyIds.push(warranty.id);
    }
    await Warranty.updateByIds(
      {
        id_trung_tam_bh: req.body.id_trung_tam_bh,
        ngay_dang_den_trung_tam_bh: await MyDate.getNow(),
      },
      warrantyIds
    );
    res.status(200).send({
      message: `Cập nhật trạng thái thành công!`,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không tìm thấy!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi đang cập nhật trạng thái!`,
      });
    }
  }
};

exports.DistributionAgentProductWarrantyComplete = async (req, res) => {
  try {
    const warrantys = await Warranty.getWarrantyCompletedAndShippingProductId(
      req.id_dai_ly
    );
    let ids = [];
    for (let i = 0; i < warrantys.length; i++) {
      ids.push(warrantys[i].id_san_pham);
    }
    const products = await Product.getAll(null, null, null, ids);
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi đang tìm kiếm sản phẩm!`,
      });
    }
  }
};

exports.DistributionAgentProductWarrantyCompleteArrived = async (req, res) => {
  try {
    const products = await Product.getAll(null, null, null, req.body.ids);
    let completeProductIds = [],
      errProductIds = [],
      dateIds = [],
      completeWarrantyIds = [],
      errDateIds = [];
    for (let product of products) {
      dateIds.push(product.id_ngay);
    }
    const dates = await MyDate.getAll(dateIds);
    for (let i = 0; i < dates.length; i++) {
      if (dates[i].ngay_loi_khong_the_sua_chua) {
        errProductIds.push(req.body.ids[i]);
        errDateIds.push(products[i].id_ngay);
      } else {
        completeProductIds.push(req.body.ids[i]);
        let warranty =
          await Warranty.getWarrantyIdByMaxWarrantyTimeAndProductId(
            req.body.ids[i]
          );
        completeWarrantyIds.push(warranty.id);
      }
    }
    await Promise.all([
      Product.updateByIds(
        {
          id_trang_thai: 10,
        },
        completeProductIds
      ),
      Product.updateByIds(
        {
          id_trang_thai: 14,
        },
        errProductIds
      ),
      Warranty.updateByIds(
        {
          ngay_den_dai_ly: await MyDate.getNow(),
        },
        completeWarrantyIds
      ),
      MyDate.updateByIds(
        {
          ngay_loi_khong_the_sua_chua_o_dai_ly: await MyDate.getNow(),
        },
        errDateIds
      ),
    ]);
    res.status(200).send({
      message: `Cập nhật trạng thái thành công!`,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không tìm thấy!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi đang cập nhật sản phẩm!`,
      });
    }
  }
};

exports.DistributionAgentProductWarrantyCompleteArrivedGetAll = async (
  req,
  res
) => {
  try {
    const products = await Warranty.getWarrantyCompletedAndArrivedProductId(
      req.id_dai_ly
    );
    let productIds = [];
    for (let i = 0; i < products.length; i++) {
      productIds.push(products[i].id_san_pham);
    }
    const allProduct = await Product.getAll(null, null, null, productIds);
    let customerIds = [];
    for (let i = 0; i < allProduct.length; i++) {
      customerIds.push(allProduct[i].id_khach_hang);
    }
    const allCustomer = await Customer.getAll(customerIds);
    res.status(200).send({
      allProduct: allProduct,
      allCustomer: allCustomer,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm cần trả cho khách hàng!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi lấy sản phẩm!`,
      });
    }
  }
};

exports.DistributionAgentProductReturn = async (req, res) => {
  try {
    await Product.updateByIds(
      {
        id_trang_thai: 11,
      },
      [req.params.id]
    );
    let warranty = await Warranty.getWarrantyIdByMaxWarrantyTimeAndProductId(
      req.params.id
    );
    await Warranty.updateByIds(
      {
        ngay_tra_lai_kh: await MyDate.getNow(),
      },
      [warranty.id]
    );
    res.status(200).send({
      message: `Cập nhật trạng thái thành công!`,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không tìm thấy sản phẩm với id = ${req.params.id}!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi cập nhật trạng thái sản phẩm với id = ${req.params.id}!`,
      });
    }
  }
};

exports.DistributionAgentProductErrGetAll = async (req, res) => {
  try {
    const products = await Product.getAll(14);
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm cần chuyển về cơ sở sản xuất!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi lấy sản phẩm!`,
      });
    }
  }
};

exports.DistributionAgentProductMoveToProductionFacility = async (req, res) => {
  try {
    await Product.updateByIds(
      {
        id_trang_thai: 5,
      },
      req.body.ids
    );
    const products = await Product.getAll(null, null, null, req.body.ids);
    let dateIds = [];
    for (let i = 0; i < products.length; i++) {
      dateIds.push(products[i].id_ngay);
    }
    await MyDate.updateByIds(
      {
        ngay_chuyen_ve_cssx: await MyDate.getNow(),
      },
      dateIds
    );
    res.status(200).send({
      message: `Cập nhật trạng thái thành công!`,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không tìm thấy!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi cập nhật trạng thái sản phẩm với id yêu cầu!`,
      });
    }
  }
};

exports.DistributionAgentCustomerNewReplacementProduct = async (req, res) => {
  try {
    const warrantys =
      await Warranty.getFinalWarrantyAtDistributionAgentProductId(
        req.id_dai_ly
      );
    if (warrantys[0].id_san_pham) {
      console.log("hehehêh");
      const dates = await MyDate.getErrAndAtDistributionAgentDate();
      const products = await Product.getProductNeedNewReplacementProduct(
        warrantys,
        dates
      );
      let customerIds = [];
      for (let i = 0; i < products.length; i++) {
        customerIds.push(products[i].id_khach_hang);
      }
      const allCustomer = await Customer.getAll(customerIds);
      res.status(200).send({
        allProduct: products,
        allCustomer: allCustomer,
      });
    } else {
      res.status(404).send({
        message: `Không có sản phẩm cần thay mới cho khách hàng!`,
      });
    }
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm cần thay mới cho khách hàng!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi lấy sản phẩm!`,
      });
    }
  }
};

exports.DistributionAgentProductNewReplacementProduct = async (req, res) => {
  try {
    await Product.updateByIds(
      {
        id_khach_hang: null,
      },
      [req.body.id_cu]
    );
    await Product.updateByIds(
      {
        id_trang_thai: 15,
        id_khach_hang: req.body.id_khach_hang,
      },
      [req.body.id_moi]
    );
    const products = await Product.getAll(null, null, null, [req.body.id_moi]);
    await MyDate.updateByIds(
      {
        ngay_ban_giao_sp_moi: await MyDate.getNow(),
      },
      [products[0].id_ngay]
    );
    res.status(200).send({
      message: `Bàn giao sản phẩm mới thành công!`,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không tìm thấy!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi bàn giao sản phẩm mới!`,
      });
    }
  }
};

exports.DistributionAgentProductSummon = async (req, res) => {
  try {
    const warrantys = await Warranty.getSummonProductId();
    let productIds = [];
    for (let i = 0; i < warrantys.length; i++) {
      productIds.push(warrantys[i].id_san_pham);
    }
    const products = await Product.getAll(
      null,
      null,
      req.id_dai_ly,
      productIds
    );
    let customerIds = [],
      allProductHasCustomer = [],
      allProductHasNoCustomer = [],
      allCustomer = [];
    for (let i = 0; i < products.length; i++) {
      if (products[i].id_khach_hang) {
        allProductHasCustomer.push(products[i]);
        customerIds.push(products[i].id_khach_hang);
      } else {
        allProductHasNoCustomer.push(products[i]);
      }
    }
    if (customerIds.length) {
      allCustomer = await Customer.getAll(customerIds);
    }
    res.status(200).send({
      allProductHasCustomer: allProductHasCustomer,
      allProductHasNoCustomer: allProductHasNoCustomer,
      allCustomer: allCustomer,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm cần triệu hồi!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi lấy sản phẩm!`,
      });
    }
  }
};

exports.DistributionAgentProductStatisticalStatusShow = async (req, res) => {
  try {
    const status = await Status.getAll([2, 3, 4, 5, 7, 9, 10, 11, 14, 15, 16]);
    res.status(200).send(status);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có trạng thái!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi lấy trạng thái!`,
      });
    }
  }
};

exports.DistributionAgentProductStatisticalStatus = async (req, res) => {
  try {
    let products;
    req.params.statusId = parseInt(req.params.statusId);
    req.params.month = parseInt(req.params.month);
    req.params.quarter = parseInt(req.params.quarter);
    req.params.year = parseInt(req.params.year);
    if (req.params.month) {
      if (req.params.statusId === 2) {
        const dates = await MyDate.findByPropertyAndMonth(
          `chuyen_cho_dai_ly`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        let warrantys = [];
        try {
          warrantys = await Warranty.findByPropertyAndMonth(
            `id_dai_ly`,
            req.id_dai_ly,
            `ngay_dang_tra_ve_dai_ly`,
            req.params.month,
            req.params.year
          );
        } catch (err) {
          if (err.kind !== "not_found") {
            res.status(500).send({
              message: `Lỗi khi đăng ký!`,
            });
            return;
          }
        }
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds,
          productIds
        );
      } else if (req.params.statusId === 3) {
        const dates = await MyDate.findByPropertyAndMonth(
          `nam_tai_kho_dai_ly`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 4) {
        const warrantys = await Warranty.findByPropertyAndMonth(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_dang_den_trung_tam_bh`,
          req.params.month,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 5) {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_chuyen_ve_cssx`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 7) {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_ban_cho_kh`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 9) {
        const warrantys = await Warranty.findByPropertyAndMonth(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_loi_can_bao_hanh`,
          req.params.month,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 10) {
        const warrantys = await Warranty.findByPropertyAndMonth(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_den_dai_ly`,
          req.params.month,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 11) {
        const warrantys = await Warranty.findByPropertyAndMonth(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_tra_lai_kh`,
          req.params.month,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 14) {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_loi_khong_the_sua_chua_o_dai_ly`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        const allProduct = await Product.getAll(
          null,
          null,
          null,
          null,
          dateIds
        );
        let productIds = [];
        for (let i = 0; i < allProduct.length; i++) {
          productIds.push(allProduct[i].id);
        }
        const warrantys = await Warranty.findByProductIds(productIds);
        let productIdsFromWarrantys = [];
        for (let i = 0; i < warrantys.length; i++) {
          if (warrantys[i].id_dai_ly === req.id_dai_ly) {
            productIdsFromWarrantys.push(warrantys[i].id_san_pham);
          }
        }
        products = await Product.getAll(
          null,
          null,
          null,
          productIdsFromWarrantys
        );
      } else if (req.params.statusId === 15) {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_ban_giao_sp_moi`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 16) {
        const warrantys = await Warranty.findByPropertyAndMonth(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_loi_can_trieu_hoi`,
          req.params.month,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      }
    } else if (req.params.quarter) {
      if (req.params.statusId === 2) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `chuyen_cho_dai_ly`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        let warrantys = [];
        try {
          warrantys = await Warranty.findByPropertyAndQuarter(
            `id_dai_ly`,
            req.id_dai_ly,
            `ngay_dang_tra_ve_dai_ly`,
            req.params.quarter,
            req.params.year
          );
        } catch (err) {
          if (err.kind !== "not_found") {
            res.status(500).send({
              message: `Lỗi khi đăng ký!`,
            });
            return;
          }
        }
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds,
          productIds
        );
      } else if (req.params.statusId === 3) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `nam_tai_kho_dai_ly`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 4) {
        const warrantys = await Warranty.findByPropertyAndQuarter(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_dang_den_trung_tam_bh`,
          req.params.quarter,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 5) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `ngay_chuyen_ve_cssx`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 7) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `ngay_ban_cho_kh`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 9) {
        const warrantys = await Warranty.findByPropertyAndQuarter(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_loi_can_bao_hanh`,
          req.params.quarter,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 10) {
        const warrantys = await Warranty.findByPropertyAndQuarter(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_den_dai_ly`,
          req.params.quarter,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 11) {
        const warrantys = await Warranty.findByPropertyAndQuarter(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_tra_lai_kh`,
          req.params.quarter,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 14) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `ngay_loi_khong_the_sua_chua_o_dai_ly`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        const allProduct = await Product.getAll(
          null,
          null,
          null,
          null,
          dateIds
        );
        let productIds = [];
        for (let i = 0; i < allProduct.length; i++) {
          productIds.push(allProduct[i].id);
        }
        const warrantys = await Warranty.findByProductIds(productIds);
        let productIdsFromWarrantys = [];
        for (let i = 0; i < warrantys.length; i++) {
          if (warrantys[i].id_dai_ly === req.id_dai_ly) {
            productIdsFromWarrantys.push(warrantys[i].id_san_pham);
          }
        }
        products = await Product.getAll(
          null,
          null,
          null,
          productIdsFromWarrantys
        );
      } else if (req.params.statusId === 15) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `ngay_ban_giao_sp_moi`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 16) {
        const warrantys = await Warranty.findByPropertyAndQuarter(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_loi_can_trieu_hoi`,
          req.params.quarter,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      }
    } else {
      if (req.params.statusId === 2) {
        const dates = await MyDate.findByPropertyAndYear(
          `chuyen_cho_dai_ly`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        let warrantys = [];
        try {
          warrantys = await Warranty.findByPropertyAndYear(
            `id_dai_ly`,
            req.id_dai_ly,
            `ngay_dang_tra_ve_dai_ly`,
            req.params.year
          );
        } catch (err) {
          if (err.kind !== "not_found") {
            res.status(500).send({
              message: `Lỗi khi đăng ký!`,
            });
            return;
          }
        }
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds,
          productIds
        );
      } else if (req.params.statusId === 3) {
        const dates = await MyDate.findByPropertyAndYear(
          `nam_tai_kho_dai_ly`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 4) {
        const warrantys = await Warranty.findByPropertyAndYear(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_dang_den_trung_tam_bh`,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 5) {
        const dates = await MyDate.findByPropertyAndYear(
          `ngay_chuyen_ve_cssx`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 7) {
        const dates = await MyDate.findByPropertyAndYear(
          `ngay_ban_cho_kh`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 9) {
        const warrantys = await Warranty.findByPropertyAndYear(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_loi_can_bao_hanh`,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 10) {
        const warrantys = await Warranty.findByPropertyAndYear(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_den_dai_ly`,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 11) {
        const warrantys = await Warranty.findByPropertyAndYear(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_tra_lai_kh`,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 14) {
        const dates = await MyDate.findByPropertyAndYear(
          `ngay_loi_khong_the_sua_chua_o_dai_ly`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        const allProduct = await Product.getAll(
          null,
          null,
          null,
          null,
          dateIds
        );
        let productIds = [];
        for (let i = 0; i < allProduct.length; i++) {
          productIds.push(allProduct[i].id);
        }
        const warrantys = await Warranty.findByProductIds(productIds);
        let productIdsFromWarrantys = [];
        for (let i = 0; i < warrantys.length; i++) {
          if (warrantys[i].id_dai_ly === req.id_dai_ly) {
            productIdsFromWarrantys.push(warrantys[i].id_san_pham);
          }
        }
        products = await Product.getAll(
          null,
          null,
          null,
          productIdsFromWarrantys
        );
      } else if (req.params.statusId === 15) {
        const dates = await MyDate.findByPropertyAndYear(
          `ngay_ban_giao_sp_moi`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
      } else if (req.params.statusId === 16) {
        const warrantys = await Warranty.findByPropertyAndYear(
          `id_dai_ly`,
          req.id_dai_ly,
          `ngay_loi_can_trieu_hoi`,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      }
    }
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi lấy sản phẩm!`,
      });
    }
  }
};

exports.DistributionAgentProductStatisticalSell = async (req, res) => {
  let results = [];
  if (req.params.type === `month`) {
    for (let i = 1; i <= 12; i++) {
      try {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_ban_cho_kh`,
          i,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        const products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
        results.push(products.length);
      } catch (err) {
        if (err.kind === "not_found") {
          results.push(0);
        } else {
          res.status(500).send({
            message: `Lỗi khi lấy sản phẩm!`,
          });
          return;
        }
      }
    }
  }
  if (req.params.type === `quarter`) {
    for (let i = req.params.year - 2; i <= req.params.year; i++) {
      for (let j = 1; j <= 4; j++) {
        try {
          const dates = await MyDate.findByPropertyAndQuarter(
            `ngay_ban_cho_kh`,
            j,
            i
          );
          let dateIds = [];
          for (let i = 0; i < dates.length; i++) {
            dateIds.push(dates[i].id);
          }
          const products = await Product.getAll(
            null,
            null,
            req.id_dai_ly,
            null,
            dateIds
          );
          results.push(products.length);
        } catch (err) {
          if (err.kind === "not_found") {
            results.push(0);
          } else {
            res.status(500).send({
              message: `Lỗi khi lấy sản phẩm!`,
            });
            return;
          }
        }
      }
    }
  }
  if (req.params.type === `year`) {
    for (let i = req.params.year - 11; i <= req.params.year; i++) {
      try {
        const dates = await MyDate.findByPropertyAndYear(`ngay_ban_cho_kh`, i);
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        const products = await Product.getAll(
          null,
          null,
          req.id_dai_ly,
          null,
          dateIds
        );
        results.push(products.length);
      } catch (err) {
        if (err.kind === "not_found") {
          results.push(0);
        } else {
          res.status(500).send({
            message: `Lỗi khi lấy sản phẩm!`,
          });
          return;
        }
      }
    }
  }
  res.status(200).send(results);
};

exports.FacilityDirectoryProduct = async (req, res) => {
  let children = [],
    hasNoChild = [];
  children.push({
    id: 0,
  });
  while (children.length) {
    let child = children.pop();
    try {
      let childrenDirectory = await DirectoryProduct.findByParentDirectory(
        child.id
      );
      for (let i = 0; i < childrenDirectory.length; i++) {
        children.push(childrenDirectory[i]);
      }
    } catch (err) {
      if (err.kind === "not_found") {
        hasNoChild.push(child);
      } else {
        res.status(500).send({
          message: `Lỗi khi tìm các id danh mục sản phẩm!`,
        });
        return;
      }
    }
  }
  res.status(200).send(hasNoChild);
};

exports.FacilityProductStatisticalStatusShow = async (req, res) => {
  try {
    const status = await Status.getAll([1, 2, 5, 7, 8, 9, 13, 15, 16, 17]);
    res.status(200).send(status);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có trạng thái!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi lấy trạng thái!`,
      });
    }
  }
};

exports.GetAllAgent = async (req, res) => {
  try {
    const agents = await DistributionAgent.getAll();
    res.status(200).send(agents);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "không có danh sách đại lý",
      });
    } else {
      res.status(500).send({
        message: "lỗi khi truy vấn danh sách đại lý",
      });
    }
  }
};

exports.FacilitySpecifications = async (req, res) => {
  try {
    const products = await Product.findByDirectoryProductId([req.params.id]);
    res.status(200).send({
      id_thong_so: products[0].id_thong_so,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "Không có id thông số!",
      });
    } else {
      res.status(500).send({
        message: "lỗi khi tìm id thông số!",
      });
    }
  }
};

exports.WarrantyCenterProductStatisticalStatusShow = async (req, res) => {
  try {
    const status = await Status.getAll([4, 6, 12, 13]);
    res.status(200).send(status);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có trạng thái!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi lấy trạng thái!`,
      });
    }
  }
};

exports.WarrantyCenterProductStatisticalStatus = async (req, res) => {
  try {
    let products;
    req.params.statusId = parseInt(req.params.statusId);
    req.params.month = parseInt(req.params.month);
    req.params.quarter = parseInt(req.params.quarter);
    req.params.year = parseInt(req.params.year);
    if (req.params.month) {
      if (req.params.statusId === 4) {
        const warrantys = await Warranty.findByPropertyAndMonth(
          `id_trung_tam_bh`,
          req.id_trung_tam_bh,
          `ngay_dang_den_trung_tam_bh`,
          req.params.month,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 6) {
        const warrantys = await Warranty.findByPropertyAndMonth(
          `id_trung_tam_bh`,
          req.id_trung_tam_bh,
          `ngay_dang_bao_hanh_tai_trung_tam`,
          req.params.month,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 12) {
        const warrantys = await Warranty.findByPropertyAndMonth(
          `id_trung_tam_bh`,
          req.id_trung_tam_bh,
          `ngay_bao_hanh_xong`,
          req.params.month,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 13) {
        const dates = await MyDate.findByPropertyAndMonth(
          `ngay_loi_khong_the_sua_chua`,
          req.params.month,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        const allProduct = await Product.getAll(
          null,
          null,
          null,
          null,
          dateIds
        );
        let productIds = [];
        for (let i = 0; i < allProduct.length; i++) {
          productIds.push(allProduct[i].id);
        }
        const warrantys = await Warranty.findByProductIds(productIds);
        let productIdsFromWarrantys = [];
        for (let i = 0; i < warrantys.length; i++) {
          if (warrantys[i].id_trung_tam_bh === req.id_trung_tam_bh) {
            productIdsFromWarrantys.push(warrantys[i].id_san_pham);
          }
        }
        products = await Product.getAll(
          null,
          null,
          null,
          productIdsFromWarrantys
        );
      }
    } else if (req.params.quarter) {
      if (req.params.statusId === 4) {
        const warrantys = await Warranty.findByPropertyAndQuarter(
          `id_trung_tam_bh`,
          req.id_trung_tam_bh,
          `ngay_dang_den_trung_tam_bh`,
          req.params.quarter,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 6) {
        const warrantys = await Warranty.findByPropertyAndQuarter(
          `id_trung_tam_bh`,
          req.id_trung_tam_bh,
          `ngay_dang_bao_hanh_tai_trung_tam`,
          req.params.quarter,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 12) {
        const warrantys = await Warranty.findByPropertyAndQuarter(
          `id_trung_tam_bh`,
          req.id_trung_tam_bh,
          `ngay_bao_hanh_xong`,
          req.params.quarter,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 13) {
        const dates = await MyDate.findByPropertyAndQuarter(
          `ngay_loi_khong_the_sua_chua`,
          req.params.quarter,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        const allProduct = await Product.getAll(
          null,
          null,
          null,
          null,
          dateIds
        );
        let productIds = [];
        for (let i = 0; i < allProduct.length; i++) {
          productIds.push(allProduct[i].id);
        }
        const warrantys = await Warranty.findByProductIds(productIds);
        let productIdsFromWarrantys = [];
        for (let i = 0; i < warrantys.length; i++) {
          if (warrantys[i].id_trung_tam_bh === req.id_trung_tam_bh) {
            productIdsFromWarrantys.push(warrantys[i].id_san_pham);
          }
        }
        products = await Product.getAll(
          null,
          null,
          null,
          productIdsFromWarrantys
        );
      }
    } else {
      if (req.params.statusId === 4) {
        const warrantys = await Warranty.findByPropertyAndYear(
          `id_trung_tam_bh`,
          req.id_trung_tam_bh,
          `ngay_dang_den_trung_tam_bh`,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 6) {
        const warrantys = await Warranty.findByPropertyAndYear(
          `id_trung_tam_bh`,
          req.id_trung_tam_bh,
          `ngay_dang_bao_hanh_tai_trung_tam`,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 12) {
        const warrantys = await Warranty.findByPropertyAndYear(
          `id_trung_tam_bh`,
          req.id_trung_tam_bh,
          `ngay_bao_hanh_xong`,
          req.params.year
        );
        let productIds = [];
        for (let i = 0; i < warrantys.length; i++) {
          productIds.push(warrantys[i].id_san_pham);
        }
        products = await Product.getAll(null, null, null, productIds);
      } else if (req.params.statusId === 13) {
        const dates = await MyDate.findByPropertyAndYear(
          `ngay_loi_khong_the_sua_chua`,
          req.params.year
        );
        let dateIds = [];
        for (let i = 0; i < dates.length; i++) {
          dateIds.push(dates[i].id);
        }
        const allProduct = await Product.getAll(
          null,
          null,
          null,
          null,
          dateIds
        );
        let productIds = [];
        for (let i = 0; i < allProduct.length; i++) {
          productIds.push(allProduct[i].id);
        }
        const warrantys = await Warranty.findByProductIds(productIds);
        let productIdsFromWarrantys = [];
        for (let i = 0; i < warrantys.length; i++) {
          if (warrantys[i].id_trung_tam_bh === req.id_trung_tam_bh) {
            productIdsFromWarrantys.push(warrantys[i].id_san_pham);
          }
        }
        products = await Product.getAll(
          null,
          null,
          null,
          productIdsFromWarrantys
        );
      }
    }
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm!`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi lấy sản phẩm!`,
      });
    }
  }
};

exports.FacilityProductStatisticalErr = async (req, res) => {
  try {
    let errProducts = [];
    const products = await Product.getAll(
      null,
      req.params.productionFacilityId,
      req.params.distributionAgentId,
      null,
      null,
      null,
      req.params.directoryProductId
    );
    const warrantys = await Warranty.findErrProductIds();
    let productIds = [];
    for (let i = 0; i < warrantys.length; i++) {
      productIds.push(warrantys[i].id_san_pham);
    }
    errProducts = await Product.getAll(
      null,
      req.params.productionFacilityId,
      req.params.distributionAgentId,
      productIds,
      null,
      null,
      req.params.directoryProductId
    );
    res.status(200).send({
      result: (errProducts.length / products.length) * 100 + `%`,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(200).send({
        result: `0%`,
      });
    } else {
      res.status(500).send({
        message: `Lỗi khi lấy sản phẩm!`,
      });
    }
  }
};

exports.FacilityProductStatisticalErrShow = async (req, res) => {
  let children = [],
    hasNoChild = [];
  children.push({
    id: 0,
  });
  while (children.length) {
    let child = children.pop();
    try {
      let childrenDirectory = await DirectoryProduct.findByParentDirectory(
        child.id
      );
      for (let i = 0; i < childrenDirectory.length; i++) {
        children.push(childrenDirectory[i]);
      }
    } catch (err) {
      if (err.kind === "not_found") {
        hasNoChild.push(child);
      } else {
        res.status(500).send({
          message: `Lỗi khi tìm các id danh mục sản phẩm!`,
        });
        return;
      }
    }
  }
  try {
    const [productionFacilitys, distributionAgents] = await Promise.all([
      ProductionFacility.getAll(),
      DistributionAgent.getAll(),
    ]);
    res.status(200).send({
      directoryProducts: hasNoChild,
      productionFacilitys: productionFacilitys,
      distributionAgents: distributionAgents,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found data.`,
      });
    } else {
      res.status(500).send({
        message: "Error retrieving data",
      });
    }
  }
};

exports.WarrantyCenterBoard = (req, res) => {
  res.status(200).send("Warranty Center Content.");
};
