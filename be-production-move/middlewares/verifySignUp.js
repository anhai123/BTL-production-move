const db = require("../models");
const ROLES = db.ROLES;
const User = require("../models/user.model");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  try {
    await User.findByUserName(req.body.username);
    res.status(400).send({
      message: "Failed! Username is already in use!",
    });
    return;
  } catch (err) {
    if (err.kind === "not_found") {
      // Email
      try {
        await User.findByEmail(req.body.email);
        res.status(400).send({
          message: "Failed! Email is already in use!",
        });
        return;
      } catch (err) {
        if (err.kind === "not_found") {
          next();
        } else {
          res.status(500).send({
            message: "Error retrieving User with email " + req.body.email
          });
        }
      }
    } else {
      res.status(500).send({
        message: "Error retrieving User with username " + req.body.username
      });
    }
  }
};

checkRolesExisted = (req, res, next) => {
  if (req.body.role) {
    if (!ROLES.includes(req.body.role)) {
      res.status(400).send({
        message: "Failed! Role does not exist = " + req.body.role,
      });
      return;
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
  checkRolesExisted: checkRolesExisted,
};

module.exports = verifySignUp;
