const User = require("../models/user.model");

checkDuplicateUsernameOrEmail = async (req, res, next) => {
  // Username
  try {
    await User.findByUserName(req.body.tai_khoan);
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
        message: "Error retrieving User with username " + req.body.tai_khoan
      });
    }
  }
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
};

module.exports = verifySignUp;
