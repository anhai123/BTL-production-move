const db = require("../models");
const TYPES = db.TYPES;
const User = require("../models/user.model");

checkTypesExisted = (req, res, next) => {
  if (req.params.type) {
    if (!TYPES.includes(req.params.type)) {
      res.status(400).send({
        message: "Failed! Type does not exist = " + req.params.type,
      });
      return;
    }
  }

  next();
};

const validateData = {
  checkTypesExisted: checkTypesExisted,
};

module.exports = validateData;
