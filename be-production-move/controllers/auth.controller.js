const config = require("../config/auth.config");
const User = require("../models/user.model");
const ProductionFacility = require("../models/productionFacility.model");
const DistributionAgent = require("../models/distributionAgent.model");
const WarrantyCenter = require("../models/warrantyCenter.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save User to Database
  try {
    let id_co_so_sx, id_dai_ly, id_trung_tam_bh, facilities, hop_le = 0;
    if (req.body.id_vai_tro === 1) {
      try {
        await User.getAllByAccepted(1);
      } catch (err) {
        if (err.kind === "not_found") {
          hop_le = 1;
        } else {
          res.status(500).send({
            message: `Lỗi khi đăng ký!`,
          });
          return;
        }
      }
    } else if (req.body.id_vai_tro === 2) {
      facilities = await ProductionFacility.create(new ProductionFacility(req.body));
      id_co_so_sx = facilities.id;
    } else if (req.body.id_vai_tro === 3) {
      facilities = await DistributionAgent.create(new DistributionAgent(req.body));
      id_dai_ly = facilities.id;
    } else if (req.body.id_vai_tro === 4) {
      facilities = await WarrantyCenter.create(new WarrantyCenter(req.body));
      id_trung_tam_bh = facilities.id;
    }
    await User.create(new User({
      tai_khoan: req.body.tai_khoan,
      email: req.body.email,
      mat_khau: bcrypt.hashSync(req.body.mat_khau, 8),
      hop_le: hop_le,
      id_co_so_sx: id_co_so_sx,
      id_dai_ly: id_dai_ly,
      id_trung_tam_bh: id_trung_tam_bh,
    }));
    res.send({ message: "User was registered successfully!" })
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the User."
    });
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findByUserName(req.body.tai_khoan);
    var passwordIsValid = bcrypt.compareSync(
      req.body.mat_khau,
      user.mat_khau,
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    if (!user.hop_le) {
      return res.status(401).send({
        accessToken: null,
        message: "Your account has not been accepted!",
      });
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    let vai_tro;
    if (user.id_co_so_sx) {
      vai_tro = "Cơ sở sản xuất";
    } else if (user.id_dai_ly) {
      vai_tro = "Đại lý phân phối";
    } else if (user.id_trung_tam_bh) {
      vai_tro = "Trung tâm bảo hành";
    } else {
      vai_tro = "Ban điều hành";
    }
    res.status(200).send({
      id: user.id,
      tai_khoan: user.tai_khoan,
      email: user.email,
      vai_tro: vai_tro,
      accessToken: token,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found User with username ${req.body.tai_khoan}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving User with username " + req.body.tai_khoan
      });
    }
  }
};
