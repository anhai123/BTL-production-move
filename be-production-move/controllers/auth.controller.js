const config = require("../config/auth.config");
const User = require("../models/user.model");
const Role = require("../models/role.model");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  // Save User to Database
  try {
    const role = await Role.findByName(req.body.role);
    try {
      await User.create(new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        accepted: 0,
        roleId: role.id,
      }));
      res.send({ message: "User was registered successfully!" })
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the User."
      });
    }
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Role with name ${req.body.role}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Role with name " + req.body.role
      });
    }
  }
};

exports.signin = async (req, res) => {
  try {
    const user = await User.findByUserName(req.body.username);
    var passwordIsValid = bcrypt.compareSync(
      req.body.password,
      user.password,
    );

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    if (!user.accepted) {
      return res.status(401).send({
        accessToken: null,
        message: "Your account has not been accepted!",
      });
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    try {
      const role = await Role.findById(user.roleId);
      res.status(200).send({
        id: user.id,
        username: user.username,
        email: user.email,
        role: role.name,
        accessToken: token,
      });
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Role with id ${user.roleId}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Role with id " + user.roleId
        });
      }
    }
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found User with username ${req.body.username}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving User with username " + req.body.username
      });
    }
  }
};
