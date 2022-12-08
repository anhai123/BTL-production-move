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

isModerator = (req, res, next) => {
  User.findById(req.userId, (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.userId
        });
      }
    } else {
      if (user.roleId === 1) {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Moderator Role!"
      });
      return;
    };
  });
};

isProductionFacility = (req, res, next) => {
  User.findById(req.userId, (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.userId
        });
      }
    } else {
      if (user.roleId === 2) {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Production Facility Role!"
      });
      return;
    };
  });
};

isDistributionAgent = (req, res, next) => {
  User.findById(req.userId, (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.userId
        });
      }
    } else {
      if (user.roleId === 3) {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Distribution Agent Role!"
      });
      return;
    };
  });
};

isWarrantyCenter = (req, res, next) => {
  User.findById(req.userId, (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.userId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + req.userId
        });
      }
    } else {
      if (user.roleId === 4) {
        next();
        return;
      }

      res.status(403).send({
        message: "Require Warranty Center Role!"
      });
      return;
    };
  });
};

const authJwt = {
  verifyToken: verifyToken,
  isModerator: isModerator,
  isProductionFacility: isProductionFacility,
  isDistributionAgent: isDistributionAgent,
  isWarrantyCenter: isWarrantyCenter,
};
module.exports = authJwt;
