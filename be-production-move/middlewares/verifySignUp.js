const db = require("../models");
const ROLES = db.ROLES;
const User = require("../models/user.model");

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // Username
  User.findByUserName(req.body.username, (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        // Email
        User.findByEmail(req.body.email, (err, user) => {
          if (err) {
            if (err.kind === "not_found") {
              next();
            } else {
              res.status(500).send({
                message: "Error retrieving User with email " + req.body.email
              });
            }
          } else {
            res.status(400).send({
              message: "Failed! Email is already in use!",
            });
            return;
          };
        });
      } else {
        res.status(500).send({
          message: "Error retrieving User with username " + req.body.username
        });
      }
    } else {
      res.status(400).send({
        message: "Failed! Username is already in use!",
      });
      return;
    };
  });
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
