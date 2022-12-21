const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const User = require("../models/user.model");

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!",
    });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!",
      });
    }
    req.userId = decoded.id;
    next();
  });
};

isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.roleId === 1) {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Moderator Role!"
    });
    return;
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found User with id ${req.userId}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving User with id " + req.userId
      });
    }
  }
};

isProductionFacility = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.roleId === 2) {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Production Facility Role!"
    });
    return;
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found User with id ${req.userId}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving User with id " + req.userId
      });
    }
  }
};

isDistributionAgent = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.roleId === 3) {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Distribution Agent Role!"
    });
    return;
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found User with id ${req.userId}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving User with id " + req.userId
      });
    }
  }
};

isWarrantyCenter = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (user.roleId === 4) {
      next();
      return;
    }

    res.status(403).send({
      message: "Require Warranty Center Role!"
    });
    return;
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found User with id ${req.userId}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving User with id " + req.userId
      });
    }
  }
};

const authJwt = {
  verifyToken: verifyToken,
  isModerator: isModerator,
  isProductionFacility: isProductionFacility,
  isDistributionAgent: isDistributionAgent,
  isWarrantyCenter: isWarrantyCenter,
};
module.exports = authJwt;
