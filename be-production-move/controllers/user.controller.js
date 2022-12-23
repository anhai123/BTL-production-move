const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const DirectoryProduct = require("../models/directoryProduct.model");
const DirectoryProductionFacility = require("../models/directoryProductionFacility.model");
const DirectoryDistributionAgent = require("../models/directoryDistributionAgent.model");

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
        let subject, cua, id;
        if (user.id_co_so_sx) {
          id = user.id_co_so_sx;
          subject = await Role.findProductionFacility(id);
          cua = subject.ten_co_so;
        } else if (user.id_dai_ly) {
          id = user.id_dai_ly;
          subject = await Role.findDistributionAgent(id);
          cua = subject.ten_dai_ly;
        } else {
          id = user.id_trung_tam_bh;
          subject = await Role.findWarrantyCenter(id);
          cua = subject.ten_trung_tam;
        }
        usersFix.push({
          id: user.id,
          tai_khoan: user.tai_khoan,
          email: user.email,
          cua: cua,
        });
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found subject with id ${id}.`
          });
          return;
        } else {
          res.status(500).send({
            message: "Error retrieving subject with id " + id
          });
          return;
        }
      }
    }
    res.status(200).send(usersFix);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có tài khoản cần xử lý.`
      });
      return;
    } else {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
      return;
    }
  }
};

exports.ModeratorAccept = async (req, res) => {
  for (let id of req.body.ids) {
    try {
      const user = await User.findById(id);
      user.hop_le = 1;
      await User.updateById(user);
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
      parentDirectoryT = brotherDirectoryProduct.danh_muc_cha;
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
      parentDirectoryT = childDirectoryProduct.danh_muc_cha;
      try {
        await DirectoryProduct.updateParentDirectoryByParentDirectory(childDirectoryProduct.danh_muc_cha, req.body.ten_danh_muc_sp);
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Product with parent directory name ${childDirectoryProduct.danh_muc_cha}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Directory Product with parent directory name " + childDirectoryProduct.danh_muc_cha
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
        danh_muc_cha: parentDirectoryT,
        ten_danh_muc_sp: req.body.ten_danh_muc_sp,
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
          const brotherDirectoryProductIds = await DirectoryProduct.findIdByParentDirectory(brotherDirectoryProduct.danh_muc_cha);
          brotherDirectoryProductIds.push(brotherDirectoryProductIds[brotherDirectoryProductIds.length - 1] + 1);
          res.status(200).send([allDirectoryProducts, {
            id: brotherDirectoryProductIds
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory products with directory name " + brotherDirectoryProduct.danh_muc_cha
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
          var brotherDirectoryProducts = await DirectoryProduct.findByParentDirectory(childDirectoryProduct.danh_muc_cha);
          res.status(200).send([allDirectoryProducts, {
            id: [brotherDirectoryProducts[0].id]
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory products with directory name " + brotherDirectoryProducts.danh_muc_cha
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
      const childrenDirectoryProduct = await DirectoryProduct.findByParentDirectory(directoryProduct.ten_danh_muc_sp);
      try {
        await DirectoryProduct.updateParentDirectoryByParentDirectory(directoryProduct.ten_danh_muc_sp, directoryProduct.danh_muc_cha);
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
            message: `Not found Directory Product with parent directory name ${directoryProduct.ten_danh_muc_sp}.`
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Product with parent directory name ${directoryProduct.ten_danh_muc_sp}.`
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory products with parent directory name ${directoryProduct.ten_danh_muc_sp}.`
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
};

exports.ModeratorDirectoryProductionFacility = async (req, res) => {
  try {
    const directoryProductionFacilitys = await DirectoryProductionFacility.getAll();
    res.status(200).send(directoryProductionFacilitys);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving directory production facilitys."
    });
  }
};

exports.ModeratorDirectoryProductionFacilityId = async (req, res) => {
  try {
    const allDirectoryProductionFacilitys = await DirectoryProductionFacility.getAll();
    if (req.params.type === "parentDirectory") {
      try {
        const childrenDirectoryProductionFacilityId = await DirectoryProductionFacility.findIdByParentDirectory(req.params.directoryName);
        childrenDirectoryProductionFacilityId.push(childrenDirectoryProductionFacilityId[childrenDirectoryProductionFacilityId.length - 1] + 1)
        res.status(200).send([allDirectoryProductionFacilitys, {
          ids: childrenDirectoryProductionFacilityId
        }]);
      } catch (err) {
        if (err.kind === "not_found") {
          try {
            const parentDirectoryProductionFacility = await DirectoryProductionFacility.findByDirectoryName(req.params.directoryName);
            res.status(200).send([allDirectoryProductionFacilitys, {
              ids: [parentDirectoryProductionFacility.id + 1]
            }]);
          } catch (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found parent directory production facility with directory name ${req.params.directoryName}.`
              });
            } else {
              res.status(500).send({
                message: "Error retrieving parent directory production facility with directory name " + req.params.directoryName
              });
            }
          }
        } else {
          res.status(500).send({
            message: "Error retrieving children directory production facility with directory name " + req.params.directoryName
          });
        }
      }
    } else if (req.params.type === "brotherDirectory") {
      try {
        const brotherDirectoryProductionFacility = await DirectoryProductionFacility.findByDirectoryName(req.params.directoryName);
        try {
          const brotherDirectoryProductionFacilityIds = await DirectoryProductionFacility.findIdByParentDirectory(brotherDirectoryProductionFacility.danh_muc_cha);
          brotherDirectoryProductionFacilityIds.push(brotherDirectoryProductionFacilityIds[brotherDirectoryProductionFacilityIds.length - 1] + 1);
          res.status(200).send([allDirectoryProductionFacilitys, {
            id: brotherDirectoryProductionFacilityIds
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory production facilitys with directory name " + brotherDirectoryProductionFacility.danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found brother directory production facility with directory name ${req.params.directoryName}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving brother directory production facility with directory name " + req.params.directoryName
          });
        }
      }
    } else {
      try {
        const childDirectoryProductionFacility = await DirectoryProductionFacility.findByDirectoryName(req.params.directoryName);
        try {
          var brotherDirectoryProductionFacilitys = await DirectoryProductionFacility.findByParentDirectory(childDirectoryProductionFacility.danh_muc_cha);
          res.status(200).send([allDirectoryProductionFacilitys, {
            id: [brotherDirectoryProductionFacilitys[0].id]
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory production facilitys with directory name " + brotherDirectoryProductionFacilitys.danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found child directory production facility with directory name ${req.params.directoryName}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving child directory production facility with directory name " + req.params.directoryName
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving directory production facilitys."
    });
  }
};

exports.ModeratorDirectoryProductionFacilityCreate = async (req, res) => {
  let parentDirectoryT;
  let hasError = false;
  if (req.params.type === "parentDirectory") {
    parentDirectoryT = req.params.directoryName;
  } else if (req.params.type === "brotherDirectory") {
    try {
      const brotherDirectoryProductionFacility = await DirectoryProductionFacility.findByDirectoryName(req.params.directoryName);
      parentDirectoryT = brotherDirectoryProductionFacility.danh_muc_cha;
    } catch (err) {
      hasError = true;
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found brother directory production facility with directory name ${req.params.directoryName}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving brother directory production facility with directory name " + req.params.directoryName
        });
      }
    }
  } else if (req.params.type === "childDirectory") {
    try {
      const childDirectoryProductionFacility = await DirectoryProductionFacility.findByDirectoryName(req.params.directoryName);
      parentDirectoryT = childDirectoryProductionFacility.danh_muc_cha;
      try {
        await DirectoryProductionFacility.updateParentDirectoryByParentDirectory(childDirectoryProductionFacility.danh_muc_cha, req.body.ten_danh_muc_cssx);
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Production Facility with parent directory name ${childDirectoryProductionFacility.danh_muc_cha}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Directory Production Facility with parent directory name " + childDirectoryProductionFacility.danh_muc_cha
          });
        }
      }
    } catch (err) {
      hasError = true;
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found child directory production facility with directory name ${req.params.directoryName}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving child directory production facility with directory name " + req.params.directoryName
        });
      }
    }
  }
  if (hasError) {
    return;
  }
  try {
    await DirectoryProductionFacility.normalizeIdUp(req.body.id);
    try {
      await DirectoryProductionFacility.create(new DirectoryProductionFacility({
        id: req.body.id,
        danh_muc_cha: parentDirectoryT,
        ten_danh_muc_cssx: req.body.ten_danh_muc_cssx,
      }));
      res.send({ message: "Directory production facility was created successfully!" });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Directory production facility."
      });
    }
  } catch (err) {
    if (err[0].kind === "select_max_error") {
      res.status(500).send([{
        message: "Error select Directory Production Facility id max"
      }, err[1]]);
    } else if (err[0].kind === "not_found_max") {
      res.status(404).send([{
        message: "Not found Directory Production Facility id max"
      }]);
    } else if (err[0].kind === "update_loop_error") {
      res.status(500).send([{
        message: "Error update Directory Production Facility id in loop"
      }, err[1]]);
    } else if (err[0].kind === "not_found") {
      res.status(404).send([{
        message: "Not found Directory Production Facility with id"
      }]);
    }
  }
};

exports.ModeratorDirectoryProductionFacilityDelete = async (req, res) => {
  let hasError = false;
  try {
    const directoryProductionFacility = await DirectoryProductionFacility.findById(req.params.id);
    try {
      const childrenDirectoryProductionFacility = await DirectoryProductionFacility.findByParentDirectory(directoryProductionFacility.ten_danh_muc_cssx);
      try {
        await DirectoryProductionFacility.updateParentDirectoryByParentDirectory(directoryProductionFacility.ten_danh_muc_cssx, directoryProductionFacility.danh_muc_cha);
        try {
          const data = await DirectoryProductionFacility.remove(req.params.id);
          try {
            const data = await DirectoryProductionFacility.normalizeIdDown(req.params.id);
            res.send({ message: `Directory Production Facility was deleted successfully!` });
          } catch (err) {
            if (err[0].kind === "select_max_error") {
              res.status(500).send([{
                message: "Error select Directory Production Facility id max"
              }, err[1]]);
            } else if (err[0].kind === "not_found_max") {
              res.status(404).send([{
                message: "Not found Directory Production Facility id max"
              }]);
            } else if (err[0].kind === "update_loop_error") {
              res.status(500).send([{
                message: "Error update Directory Production Facility id in loop"
              }, err[1]]);
            } else if (err[0].kind === "not_found") {
              res.status(404).send([{
                message: "Not found Directory Production Facility with id"
              }]);
            }
          }
        } catch (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Directory Production Facility with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Directory Production Facility with id " + req.params.id
            });
          }
        }
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Production Facility with parent directory name ${directoryProductionFacility.ten_danh_muc_cssx}.`
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Production Facility with parent directory name ${directoryProductionFacility.ten_danh_muc_cssx}.`
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory production facilitys with parent directory name ${directoryProductionFacility.ten_danh_muc_cssx}.`
        });
      } else {
        try {
          const data = await DirectoryProductionFacility.remove(req.params.id);
          try {
            await DirectoryProductionFacility.normalizeIdDown(req.params.id);
            res.send({ message: `Directory Production Facility was deleted successfully!` });
          } catch (err) {
            if (err[0].kind === "select_max_error") {
              res.status(500).send([{
                message: "Error select Directory Production Facility id max"
              }, err[1]]);
            } else if (err[0].kind === "not_found_max") {
              res.status(404).send([{
                message: "Not found Directory Production Facility id max"
              }]);
            } else if (err[0].kind === "update_loop_error") {
              res.status(500).send([{
                message: "Error update Directory Production Facility id in loop"
              }, err[1]]);
            } else if (err[0].kind === "not_found") {
              res.status(404).send([{
                message: "Not found Directory Production Facility with id"
              }]);
            }
          }
        } catch (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Directory Production Facility with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Directory Production Facility with id " + req.params.id
            });
          }
        }
      }
    }
  } catch (err) {
    hasError = true;
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Directory Production Facility with id ${req.params.id}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Production Facility with id " + req.params.id
      });
    }
  }
};

exports.ModeratorDirectoryDistributionAgent = async (req, res) => {
  try {
    const directoryDistributionAgents = await DirectoryDistributionAgent.getAll();
    res.status(200).send(directoryDistributionAgents);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving directory distribution agents."
    });
  }
};

exports.ModeratorDirectoryDistributionAgentId = async (req, res) => {
  try {
    const allDirectoryDistributionAgents = await DirectoryDistributionAgent.getAll();
    if (req.params.type === "parentDirectory") {
      try {
        const childrenDirectoryDistributionAgentId = await DirectoryDistributionAgent.findIdByParentDirectory(req.params.directoryName);
        childrenDirectoryDistributionAgentId.push(childrenDirectoryDistributionAgentId[childrenDirectoryDistributionAgentId.length - 1] + 1)
        res.status(200).send([allDirectoryDistributionAgents, {
          ids: childrenDirectoryDistributionAgentId
        }]);
      } catch (err) {
        if (err.kind === "not_found") {
          try {
            const parentDirectoryDistributionAgent = await DirectoryDistributionAgent.findByDirectoryName(req.params.directoryName);
            res.status(200).send([allDirectoryDistributionAgents, {
              ids: [parentDirectoryDistributionAgent.id + 1]
            }]);
          } catch (err) {
            if (err.kind === "not_found") {
              res.status(404).send({
                message: `Not found parent directory distribution agent with directory name ${req.params.directoryName}.`
              });
            } else {
              res.status(500).send({
                message: "Error retrieving parent directory distribution agent with directory name " + req.params.directoryName
              });
            }
          }
        } else {
          res.status(500).send({
            message: "Error retrieving children directory distribution agent with directory name " + req.params.directoryName
          });
        }
      }
    } else if (req.params.type === "brotherDirectory") {
      try {
        const brotherDirectoryDistributionAgent = await DirectoryDistributionAgent.findByDirectoryName(req.params.directoryName);
        try {
          const brotherDirectoryDistributionAgentIds = await DirectoryDistributionAgent.findIdByParentDirectory(brotherDirectoryDistributionAgent.danh_muc_cha);
          brotherDirectoryDistributionAgentIds.push(brotherDirectoryProductionFacilityIds[brotherDirectoryProductionFacilityIds.length - 1] + 1);
          res.status(200).send([allDirectoryDistributionAgents, {
            id: brotherDirectoryDistributionAgentIds
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory distribution agents with directory name " + brotherDirectoryDistributionAgent.danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found brother directory distribution agent with directory name ${req.params.directoryName}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving brother directory distribution agent with directory name " + req.params.directoryName
          });
        }
      }
    } else {
      try {
        const childDirectoryDistributionAgent = await DirectoryDistributionAgent.findByDirectoryName(req.params.directoryName);
        try {
          var brotherDirectoryDistributionAgents = await DirectoryDistributionAgent.findByParentDirectory(childDirectoryDistributionAgent.danh_muc_cha);
          res.status(200).send([allDirectoryDistributionAgents, {
            id: [brotherDirectoryDistributionAgents[0].id]
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory distribution agents with directory name " + brotherDirectoryDistributionAgents.danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found child directory distribution agent with directory name ${req.params.directoryName}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving child directory distribution agent with directory name " + req.params.directoryName
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving directory distribution agents."
    });
  }
};

exports.ModeratorDirectoryDistributionAgentCreate = async (req, res) => {
  let parentDirectoryT;
  let hasError = false;
  if (req.params.type === "parentDirectory") {
    parentDirectoryT = req.params.directoryName;
  } else if (req.params.type === "brotherDirectory") {
    try {
      const brotherDirectoryDistributionAgent = await DirectoryDistributionAgent.findByDirectoryName(req.params.directoryName);
      parentDirectoryT = brotherDirectoryDistributionAgent.danh_muc_cha;
    } catch (err) {
      hasError = true;
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found brother directory distribution agent with directory name ${req.params.directoryName}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving brother directory distribution agent with directory name " + req.params.directoryName
        });
      }
    }
  } else if (req.params.type === "childDirectory") {
    try {
      const childDirectoryDistributionAgent = await DirectoryDistributionAgent.findByDirectoryName(req.params.directoryName);
      parentDirectoryT = childDirectoryDistributionAgent.danh_muc_cha;
      try {
        await DirectoryDistributionAgent.updateParentDirectoryByParentDirectory(childDirectoryDistributionAgent.danh_muc_cha, req.body.ten_danh_muc_dlpp);
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Distribution Agent with parent directory name ${childDirectoryDistributionAgent.danh_muc_cha}.`
          });
        } else {
          res.status(500).send({
            message: "Error updating Directory Distribution Agent with parent directory name " + childDirectoryDistributionAgent.danh_muc_cha
          });
        }
      }
    } catch (err) {
      hasError = true;
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found child directory distribution agent with directory name ${req.params.directoryName}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving child directory distribution agent with directory name " + req.params.directoryName
        });
      }
    }
  }
  if (hasError) {
    return;
  }
  try {
    await DirectoryDistributionAgent.normalizeIdUp(req.body.id);
    try {
      await DirectoryDistributionAgent.create(new DirectoryDistributionAgent({
        id: req.body.id,
        danh_muc_cha: parentDirectoryT,
        ten_danh_muc_dlpp: req.body.ten_danh_muc_dlpp,
      }));
      res.send({ message: "Directory distribution agent was created successfully!" });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Directory distribution agent."
      });
    }
  } catch (err) {
    if (err[0].kind === "select_max_error") {
      res.status(500).send([{
        message: "Error select Directory Distribution Agent id max"
      }, err[1]]);
    } else if (err[0].kind === "not_found_max") {
      res.status(404).send([{
        message: "Not found Directory Distribution Agent id max"
      }]);
    } else if (err[0].kind === "update_loop_error") {
      res.status(500).send([{
        message: "Error update Directory Distribution Agent id in loop"
      }, err[1]]);
    } else if (err[0].kind === "not_found") {
      res.status(404).send([{
        message: "Not found Directory Distribution Agent with id"
      }]);
    }
  }
};

exports.ModeratorDirectoryDistributionAgentDelete = async (req, res) => {
  let hasError = false;
  try {
    const directoryDistributionAgent = await DirectoryDistributionAgent.findById(req.params.id);
    try {
      const childrenDirectoryDistributionAgent = await DirectoryDistributionAgent.findByParentDirectory(directoryDistributionAgent.ten_danh_muc_dlpp);
      try {
        await DirectoryDistributionAgent.updateParentDirectoryByParentDirectory(directoryDistributionAgent.ten_danh_muc_dlpp, directoryDistributionAgent.danh_muc_cha);
        try {
          const data = await DirectoryDistributionAgent.remove(req.params.id);
          try {
            const data = await DirectoryDistributionAgent.normalizeIdDown(req.params.id);
            res.send({ message: `Directory Distribution Agent was deleted successfully!` });
          } catch (err) {
            if (err[0].kind === "select_max_error") {
              res.status(500).send([{
                message: "Error select Directory Distribution Agent id max"
              }, err[1]]);
            } else if (err[0].kind === "not_found_max") {
              res.status(404).send([{
                message: "Not found Directory Distribution Agent id max"
              }]);
            } else if (err[0].kind === "update_loop_error") {
              res.status(500).send([{
                message: "Error update Directory Distribution Agent id in loop"
              }, err[1]]);
            } else if (err[0].kind === "not_found") {
              res.status(404).send([{
                message: "Not found Directory Distribution Agenty with id"
              }]);
            }
          }
        } catch (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Directory Distribution Agent with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Directory Distribution Agent with id " + req.params.id
            });
          }
        }
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Distribution Agent with parent directory name ${directoryDistributionAgent.ten_danh_muc_dlpp}.`
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Distribution Agent with parent directory name ${directoryDistributionAgent.ten_danh_muc_dlpp}.`
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory distribution agents with parent directory name ${directoryDistributionAgent.ten_danh_muc_dlpp}.`
        });
      } else {
        try {
          const data = await DirectoryDistributionAgent.remove(req.params.id);
          try {
            await DirectoryDistributionAgent.normalizeIdDown(req.params.id);
            res.send({ message: `Directory Distribution Agent was deleted successfully!` });
          } catch (err) {
            if (err[0].kind === "select_max_error") {
              res.status(500).send([{
                message: "Error select Directory Distribution Agent id max"
              }, err[1]]);
            } else if (err[0].kind === "not_found_max") {
              res.status(404).send([{
                message: "Not found Directory Distribution Agent id max"
              }]);
            } else if (err[0].kind === "update_loop_error") {
              res.status(500).send([{
                message: "Error update Directory Distribution Agent id in loop"
              }, err[1]]);
            } else if (err[0].kind === "not_found") {
              res.status(404).send([{
                message: "Not found Directory Distribution Agent with id"
              }]);
            }
          }
        } catch (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found Directory Distribution Agent with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Could not delete Directory Distribution Agent with id " + req.params.id
            });
          }
        }
      }
    }
  } catch (err) {
    hasError = true;
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Directory Distribution Agent with id ${req.params.id}.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Distribution Agent with id " + req.params.id
      });
    }
  }
};

exports.ProductionFacilityBoard = (req, res) => {
  res.status(200).send("Production Facility Content.");
};

exports.DistributionAgentBoard = (req, res) => {
  res.status(200).send("Distribution Agent Content.");
};

exports.WarrantyCenterBoard = (req, res) => {
  res.status(200).send("Warranty Center Content.");
};