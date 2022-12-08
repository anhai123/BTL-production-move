const User = require("../models/user.model.js");
const DirectoryProduct = require("../models/directoryProduct.model");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.ModeratorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.ModeratorAccount = (req, res) => {
  User.getAllByAccepted(0, (err, users) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    else res.status(200).send(users);
  });
};

exports.ModeratorAccept = (req, res) => {
  User.findById(req.params.id, (err, user) => {
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
      user.accepted = 1;
      User.updateById(req.params.id, new User(user), (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found User with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error updating User with id " + req.params.id
            });
          }
        } else {
          res.send({
            message: "User was updated successfully."
          });
        };
      });
    };
  });
};

exports.ModeratorReject = (req, res) => {
  User.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found User with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete User with id " + req.params.id
        });
      }
    } else res.send({ message: `User was deleted successfully!` });
  });
};

exports.ModeratorDirectoryProduct = (req, res) => {
  DirectoryProduct.getAll((err, directoryProducts) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving directory products."
      });
    else res.status(200).send(directoryProducts);
  });
};

exports.ModeratorDirectoryProductDependentType = (req, res) => {
  DirectoryProduct.getAll((err, directoryProducts) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving directory products."
      });
    else res.status(200).send(directoryProducts);
  });
};

exports.ModeratorDirectoryProductCreate = (req, res) => {
  let parentDirectoryT;
  let hasError = false;
  if (req.params.type === "parentDirectory") {
    parentDirectoryT = req.params.directoryName;
    DirectoryProduct.normalizeIdUp(req.body.id, (err, data) => {
      if (err) {
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
      } else {
        DirectoryProduct.create(new DirectoryProduct({
          id: req.body.id,
          parentDirectory: parentDirectoryT,
          directoryName: req.body.directoryName,
        }), (err, data) => {
          if (err)
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Directory product."
            });
          else { res.send({ message: "Directory product was created successfully!" }) };
        });
      }
    });
  } else if (req.params.type === "brotherDirectory") {
    DirectoryProduct.findByDirectoryName(req.params.directoryName, (err, brotherDirectoryProduct) => {
      if (err) {
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
      } else {
        parentDirectoryT = brotherDirectoryProduct.parentDirectory;
        DirectoryProduct.normalizeIdUp(req.body.id, (err, data) => {
          if (err) {
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
          } else {
            DirectoryProduct.create(new DirectoryProduct({
              id: req.body.id,
              parentDirectory: parentDirectoryT,
              directoryName: req.body.directoryName,
            }), (err, data) => {
              if (err)
                res.status(500).send({
                  message:
                    err.message || "Some error occurred while creating the Directory product."
                });
              else { res.send({ message: "Directory product was created successfully!" }) };
            });
          }
        });
      }
    });
  } else if (req.params.type === "childDirectory") {
    DirectoryProduct.findByDirectoryName(req.params.directoryName, (err, childDirectoryProduct) => {
      if (err) {
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
      } else {
        parentDirectoryT = childDirectoryProduct.parentDirectory;
        DirectoryProduct.updateParentDirectoryByParentDirectory(childDirectoryProduct.parentDirectory, req.body.directoryName, (err, data) => {
          if (err) {
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
          } else {
            DirectoryProduct.normalizeIdUp(req.body.id, (err, data) => {
              if (err) {
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
              } else {
                DirectoryProduct.create(new DirectoryProduct({
                  id: req.body.id,
                  parentDirectory: parentDirectoryT,
                  directoryName: req.body.directoryName,
                }), (err, data) => {
                  if (err)
                    res.status(500).send({
                      message:
                        err.message || "Some error occurred while creating the Directory product."
                    });
                  else { res.send({ message: "Directory product was created successfully!" }) };
                });
              }
            });
          };
        });
      }
    });
  }
};

exports.ModeratorDirectoryProductId = (req, res) => {
  DirectoryProduct.getAll((err, allDirectoryProducts) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving directory products."
      });
    else {
      if (req.params.type === "parentDirectory") {
        DirectoryProduct.findIdByParentDirectory(req.params.directoryName, (err, childrenDirectoryProductId) => {
          if (err) {
            if (err.kind === "not_found") {
              DirectoryProduct.findByDirectoryName(req.params.directoryName, (err, parentDirectoryProduct) => {
                if (err) {
                  if (err.kind === "not_found") {
                    res.status(404).send({
                      message: `Not found parent directory product with directory name ${req.params.directoryName}.`
                    });
                  } else {
                    res.status(500).send({
                      message: "Error retrieving parent directory product with directory name " + req.params.directoryName
                    });
                  }
                } else {
                  res.status(200).send([allDirectoryProducts, {
                    id: [parentDirectoryProduct.id + 1]
                  }]);
                }
              });
            } else {
              res.status(500).send({
                message: "Error retrieving children directory product with directory name " + req.params.directoryName
              });
            }
          }
          else {
            res.status(200).send([allDirectoryProducts, {
              id: [childrenDirectoryProductId, childrenDirectoryProductId[childrenDirectoryProductId.length - 1].id + 1]
            }]);
          }
        });
      } else if (req.params.type === "brotherDirectory") {
        DirectoryProduct.findByDirectoryName(req.params.directoryName, (err, brotherDirectoryProduct) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found brother directory product with directory name ${req.params.directoryName}.`
              });
            } else {
              res.status(500).send({
                message: "Error retrieving brother directory product with directory name " + req.params.directoryName
              });
            }
          } else {
            DirectoryProduct.findIdByParentDirectory(brotherDirectoryProduct.parentDirectory, (err, brotherDirectoryProductIds) => {
              if (err) {
                res.status(500).send({
                  message: "Error retrieving brother directory products with directory name " + brotherDirectoryProduct.parentDirectory
                });
              }
              else {
                res.status(200).send([allDirectoryProducts, {
                  id: [brotherDirectoryProductIds, brotherDirectoryProductIds[brotherDirectoryProductIds.length - 1].id + 1]
                }]);
              }
            });
          }
        });
      } else {
        DirectoryProduct.findByDirectoryName(req.params.directoryName, (err, childDirectoryProduct) => {
          if (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found child directory product with directory name ${req.params.directoryName}.`
              });
            } else {
              res.status(500).send({
                message: "Error retrieving child directory product with directory name " + req.params.directoryName
              });
            }
          } else {
            DirectoryProduct.findByParentDirectory(childDirectoryProduct.parentDirectory, (err, brotherDirectoryProducts) => {
              if (err) {
                res.status(500).send({
                  message: "Error retrieving brother directory products with directory name " + brotherDirectoryProduct.parentDirectory
                });
              }
              else {
                res.status(200).send([allDirectoryProducts, {
                  id: [brotherDirectoryProducts[0].id]
                }]);
              }
            });
          }
        });
      }
    }
  });
};

exports.ModeratorDirectoryProductDelete = (req, res) => {
  let hasError = false;
  DirectoryProduct.findById(req.params.id, (err, directoryProduct) => {
    if (err) {
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
    } else {
      DirectoryProduct.findByParentDirectory(directoryProduct.directoryName, (err, childrenDirectoryProduct) => {
        if (err) {
          if (err.kind !== "not_found") {
            res.status(500).send({
              message: `Error retrieving directory products with parent directory name ${directoryProduct.directoryName}.`
            });
          } else {
            DirectoryProduct.remove(req.params.id, (err, data) => {
              if (err) {
                if (err.kind === "not_found") {
                  res.status(404).send({
                    message: `Not found Directory Product with id ${req.params.id}.`
                  });
                } else {
                  res.status(500).send({
                    message: "Could not delete Directory Product with id " + req.params.id
                  });
                }
              } else {
                DirectoryProduct.normalizeIdDown(req.params.id, (err, data) => {
                  if (err) {
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
                  } else {
                    res.send({ message: `Directory Product was deleted successfully!` });
                  }
                });
              }
            });
          }
        }
        else {
          DirectoryProduct.updateParentDirectoryByParentDirectory(directoryProduct.directoryName, directoryProduct.parentDirectory, (err, data) => {
            if (err) {
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
            } else {
              DirectoryProduct.remove(req.params.id, (err, data) => {
                if (err) {
                  if (err.kind === "not_found") {
                    res.status(404).send({
                      message: `Not found Directory Product with id ${req.params.id}.`
                    });
                  } else {
                    res.status(500).send({
                      message: "Could not delete Directory Product with id " + req.params.id
                    });
                  }
                } else {
                  DirectoryProduct.normalizeIdDown(req.params.id, (err, data) => {
                    if (err) {
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
                    } else {
                      res.send({ message: `Directory Product was deleted successfully!` });
                    }
                  });
                }
              });
            }
          });
        }
      });
    };
  });
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