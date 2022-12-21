const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const DirectoryProduct = require("../models/directoryProduct.model");

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
        const role = await Role.findById(user.roleId);
        usersFix.push({
          id: user.id,
          username: user.username,
          email: user.email,
          role: role.name,
        });
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Role with id ${user.roleId}.`
          });
          return;
        } else {
          res.status(500).send({
            message: "Error retrieving Role with id " + user.roleId
          });
          return;
        }
      }
    }
    res.status(200).send(usersFix);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving users."
    });
  }
};

exports.ModeratorAccept = async (req, res) => {
  for (let id of req.body.ids) {
    try {
      const user = await User.findById(id);
      user.accepted = 1;
      await User.updateById(id, new User(user));
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${id}.`
        });
        return;
      } else {
        res.status(500).send({
          message: "Error retrieving User with id " + id
        });
        return;
      }
    };
  };
  res.send({
    message: "Users was updated successfully."
  });
};

exports.ModeratorReject = async (req, res) => {
  for (let id of req.body.ids) {
    try {
      await User.remove(id);
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + id
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
        err.message || "Some error occurred while retrieving directory products."
    });
  }
};

exports.ModeratorDirectoryProductCreate = async (req, res) => {
  let parentDirectoryT;
  let hasError = false;
  if (req.params.type === "parentDirectory") {
    parentDirectoryT = req.params.directoryName;
  } else if (req.params.type === "brotherDirectory") {
    try {
      const brotherDirectoryProduct = await DirectoryProduct.findByDirectoryName(req.params.directoryName);
      parentDirectoryT = brotherDirectoryProduct.parentDirectory;
    } catch (err) {
      hasError = true;
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found brother directory product with directory name ${req.params.directoryName}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving brother directory product with directory name " + req.params.directoryName
        });
      }
    }
  } else if (req.params.type === "childDirectory") {
    try {
      const childDirectoryProduct = await DirectoryProduct.findByDirectoryName(req.params.directoryName);
      parentDirectoryT = childDirectoryProduct.parentDirectory;
      try {
        await DirectoryProduct.updateParentDirectoryByParentDirectory(childDirectoryProduct.parentDirectory, req.body.directoryName);
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Product with parent directory name ${childDirectoryProduct.parentDirectory}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Directory Product with parent directory name " + childDirectoryProduct.parentDirectory
          });
        }
      }
    } catch (err) {
      hasError = true;
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found child directory product with directory name ${req.params.directoryName}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving child directory product with directory name " + req.params.directoryName
        });
      }
    }
  }
  if (hasError) {
    return;
  }
  try {
    await DirectoryProduct.normalizeIdUp(req.body.id);
    try {
      await DirectoryProduct.create(new DirectoryProduct({
        id: req.body.id,
        parentDirectory: parentDirectoryT,
        directoryName: req.body.directoryName,
      }));
      res.send({ message: "Directory product was created successfully!" });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Directory product."
      });
    }
  } catch (err) {
    if (err[0].kind === "select_max_error") {
      res.status(500).send([{
        message: "Error select Directory Product id max"
      }, err[1]]);
    } else if (err[0].kind === "not_found_max") {
      res.status(404).send([{
        message: "Not found Directory Product id max"
      }]);
    } else if (err[0].kind === "update_loop_error") {
      res.status(500).send([{
        message: "Error update Directory Product id in loop"
      }, err[1]]);
    } else if (err[0].kind === "not_found") {
      res.status(404).send([{
        message: "Not found Directory Product with id"
      }]);
    }
  }
};

exports.ModeratorDirectoryProductId = async (req, res) => {
  try {
    const allDirectoryProducts = await DirectoryProduct.getAll();
    if (req.params.type === "parentDirectory") {
      try {
        const childrenDirectoryProductId = await DirectoryProduct.findIdByParentDirectory(req.params.directoryName);
        childrenDirectoryProductId.push(childrenDirectoryProductId[childrenDirectoryProductId.length - 1] + 1)
        res.status(200).send([allDirectoryProducts, {
          ids: childrenDirectoryProductId
        }]);
      } catch (err) {
        if (err.kind === "not_found") {
          try {
            const parentDirectoryProduct = await DirectoryProduct.findByDirectoryName(req.params.directoryName);
            res.status(200).send([allDirectoryProducts, {
              ids: [parentDirectoryProduct.id + 1]
            }]);
          } catch (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found parent directory product with directory name ${req.params.directoryName}.`
              });
            } else {
              res.status(500).send({
                message: "Error retrieving parent directory product with directory name " + req.params.directoryName
              });
            }
          }
        } else {
          res.status(500).send({
            message: "Error retrieving children directory product with directory name " + req.params.directoryName
          });
        }
      }
    } else if (req.params.type === "brotherDirectory") {
      try {
        const brotherDirectoryProduct = await DirectoryProduct.findByDirectoryName(req.params.directoryName);
        try {
          const brotherDirectoryProductIds = await DirectoryProduct.findIdByParentDirectory(brotherDirectoryProduct.parentDirectory);
          brotherDirectoryProductIds.push(brotherDirectoryProductIds[brotherDirectoryProductIds.length - 1] + 1);
          res.status(200).send([allDirectoryProducts, {
            id: brotherDirectoryProductIds
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory products with directory name " + brotherDirectoryProduct.parentDirectory
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found brother directory product with directory name ${req.params.directoryName}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving brother directory product with directory name " + req.params.directoryName
          });
        }
      }
    } else {
      try {
        const childDirectoryProduct = await DirectoryProduct.findByDirectoryName(req.params.directoryName);
        try {
          var brotherDirectoryProducts = await DirectoryProduct.findByParentDirectory(childDirectoryProduct.parentDirectory);
          res.status(200).send([allDirectoryProducts, {
            id: [brotherDirectoryProducts[0].id]
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory products with directory name " + brotherDirectoryProducts.parentDirectory
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found child directory product with directory name ${req.params.directoryName}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving child directory product with directory name " + req.params.directoryName
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving directory products."
    });
  }
};

exports.ModeratorDirectoryProductDelete = async (req, res) => {
  let hasError = false;
  try {
    const directoryProduct = await DirectoryProduct.findById(req.params.id);
    try {
      const childrenDirectoryProduct = await DirectoryProduct.findByParentDirectory(directoryProduct.directoryName);
      try {
        await DirectoryProduct.updateParentDirectoryByParentDirectory(directoryProduct.directoryName, directoryProduct.parentDirectory);
        try {
          const data = await DirectoryProduct.remove(req.params.id);
          try {
            const data = await DirectoryProduct.normalizeIdDown(req.params.id);
            res.send({ message: `Directory Product was deleted successfully!` });
          } catch (err) {
            if (err[0].kind === "select_max_error") {
              res.status(500).send([{
                message: "Error select Directory Product id max"
              }, err[1]]);
            } else if (err[0].kind === "not_found_max") {
              res.status(404).send([{
                message: "Not found Directory Product id max"
              }]);
            } else if (err[0].kind === "update_loop_error") {
              res.status(500).send([{
                message: "Error update Directory Product id in loop"
              }, err[1]]);
            } else if (err[0].kind === "not_found") {
              res.status(404).send([{
                message: "Not found Directory Product with id"
              }]);
            }
          }
        } catch (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Directory Product with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Directory Product with id " + req.params.id
            });
          }
        }
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Product with parent directory name ${directoryProduct.directoryName}.`
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Product with parent directory name ${directoryProduct.directoryName}.`
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory products with parent directory name ${directoryProduct.directoryName}.`
        });
      } else {
        try {
          const data = await DirectoryProduct.remove(req.params.id);
          try {
            await DirectoryProduct.normalizeIdDown(req.params.id);
            res.send({ message: `Directory Product was deleted successfully!` });
          } catch (err) {
            if (err[0].kind === "select_max_error") {
              res.status(500).send([{
                message: "Error select Directory Product id max"
              }, err[1]]);
            } else if (err[0].kind === "not_found_max") {
              res.status(404).send([{
                message: "Not found Directory Product id max"
              }]);
            } else if (err[0].kind === "update_loop_error") {
              res.status(500).send([{
                message: "Error update Directory Product id in loop"
              }, err[1]]);
            } else if (err[0].kind === "not_found") {
              res.status(404).send([{
                message: "Not found Directory Product with id"
              }]);
            }
          }
        } catch (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Directory Product with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Directory Product with id " + req.params.id
            });
          }
        }
      }
    }
  } catch (err) {
    hasError = true;
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Directory Product with id ${req.params.id}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Product with id " + req.params.id
      });
    }
  }
}

exports.ProductionFacilityBoard = (req, res) => {
  res.status(200).send("Production Facility Content.");
};

exports.DistributionAgentBoard = (req, res) => {
  res.status(200).send("Distribution Agent Content.");
};

exports.WarrantyCenterBoard = (req, res) => {
  res.status(200).send("Warranty Center Content.");
};