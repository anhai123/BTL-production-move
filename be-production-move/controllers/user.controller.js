const User = require("../models/user.model.js");
const Role = require("../models/role.model.js");
const DirectoryProduct = require("../models/directoryProduct.model");
const DirectoryProductionFacility = require("../models/directoryProductionFacility.model");
const DirectoryDistributionAgent = require("../models/directoryDistributionAgent.model");
const DirectoryWarrantyCenter = require("../models/directoryWarrantyCenter.model");
const Status = require("../models/status.model.js");
const ProductionFacility = require("../models/productionFacility.model");
const DistributionAgent = require("../models/distributionAgent.model");
const WarrantyCenter = require("../models/warrantyCenter.model");
const Product = require("../models/product.model");
const Warranty = require("../models/warranty.model");

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
          subject = await ProductionFacility.findById(id);
          cua = subject.ten_co_so;
        } else if (user.id_dai_ly) {
          id = user.id_dai_ly;
          subject = await DistributionAgent.findById(id);
          cua = subject.ten_dai_ly;
        } else {
          id = user.id_trung_tam_bh;
          subject = await WarrantyCenter.findById(id);
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
      let user = await User.findById(id);
      await User.remove(id);
      if (user.id_co_so_sx) {
        await ProductionFacility.remove(user.id_co_so_sx);
      } else if (user.id_dai_ly) {
        await DistributionAgent.remove(user.id_dai_ly);
      } else if (user.id_trung_tam_bh) {
        await WarrantyCenter.remove(user.id_trung_tam_bh);
      }
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found with id ${id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete with id " + id
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

exports.ModeratorDirectoryProductId = async (req, res) => {
  try {
    const allDirectoryProducts = await DirectoryProduct.getAll();
    if (req.params.type === "parentDirectory") {
      try {
        const childrenDirectoryProductOrdinalNumber = await DirectoryProduct.findOrdinalNumberByParentDirectoryId(req.params.directoryId);
        childrenDirectoryProductOrdinalNumber.push(childrenDirectoryProductOrdinalNumber[childrenDirectoryProductOrdinalNumber.length - 1] + 1)
        res.status(200).send([allDirectoryProducts, {
          ordinalNumbers: childrenDirectoryProductOrdinalNumber
        }]);
      } catch (err) {
        if (err.kind === "not_found") {
          try {
            const parentDirectoryProduct = await DirectoryProduct.findById(req.params.directoryId);
            res.status(200).send([allDirectoryProducts, {
              ordinalNumbers: [parentDirectoryProduct.stt + 1]
            }]);
          } catch (err) {
            if (err.kind === "not_found") {
              res.status(200).send([allDirectoryProducts, {
                ordinalNumbers: [1]
              }]);
            } else {
              res.status(500).send({
                message: "Error retrieving parent directory product with directory id " + req.params.directoryId
              });
            }
          }
        } else {
          res.status(500).send({
            message: "Error retrieving children directory product with directory id " + req.params.directoryId
          });
        }
      }
    } else if (req.params.type === "brotherDirectory") {
      try {
        const brotherDirectoryProduct = await DirectoryProduct.findById(req.params.directoryId);
        try {
          const brotherDirectoryProductOrdinalNumbers = await DirectoryProduct.findOrdinalNumberByParentDirectoryId(brotherDirectoryProduct.id_danh_muc_cha);
          try {
            const parentOfBrotherDirectoryProduct = await DirectoryProduct.findById(brotherDirectoryProduct.id_danh_muc_cha);
            try {
              const brotherOfParentOfBrotherDirectoryProductOrdinalNumbers = await DirectoryProduct.findOrdinalNumberByParentDirectoryId(parentOfBrotherDirectoryProduct.id_danh_muc_cha);
              for (let i = 0; i < brotherOfParentOfBrotherDirectoryProductOrdinalNumbers.length; i++) {
                if (i + 1 !== brotherOfParentOfBrotherDirectoryProductOrdinalNumbers.length) {
                  if (parentOfBrotherDirectoryProduct.stt === brotherOfParentOfBrotherDirectoryProductOrdinalNumbers[i]) {
                    brotherDirectoryProductOrdinalNumbers.push(brotherOfParentOfBrotherDirectoryProductOrdinalNumbers[i + 1]);
                    break;
                  }
                } else {
                  try {
                    const maxOrdinalNumber = await DirectoryProduct.selectMaxOrdinalNumber();
                    brotherDirectoryProductOrdinalNumbers.push(maxOrdinalNumber + 1);
                  } catch (err) {
                    if (err.kind === "not_found_max") {
                      res.status(404).send({
                        message: "Not found Directory Product ordinal number max"
                      });
                    } else {
                      res.status(500).send({
                        message: "Error select Directory Product ordinal number max"
                      });
                    }
                  }
                }
              }
            } catch (err) {
              res.status(500).send({
                message: "Error retrieving brother of parent of brother directory products with directory id " + parentOfBrotherDirectoryProduct.id_danh_muc_cha
              });
            }
          } catch (err) {
            if (err.kind === "not_found") {
              try {
                const maxOrdinalNumber = await DirectoryProduct.selectMaxOrdinalNumber();
                brotherDirectoryProductOrdinalNumbers.push(maxOrdinalNumber + 1);
              } catch (err) {
                if (err.kind === "not_found_max") {
                  res.status(404).send({
                    message: "Not found Directory Product ordinal number max"
                  });
                } else {
                  res.status(500).send({
                    message: "Error select Directory Product ordinal number max"
                  });
                }
              }
            } else {
              res.status(500).send({
                message: "Error retrieving Directory Product with id " + brotherDirectoryProduct.id_danh_muc_cha
              });
            }
          }
          res.status(200).send([allDirectoryProducts, {
            ordinalNumbers: brotherDirectoryProductOrdinalNumbers
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory products with directory id " + brotherDirectoryProduct.id_danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([allDirectoryProducts, {
            ordinalNumbers: [1]
          }]);
        } else {
          res.status(500).send({
            message: "Error retrieving brother directory product with directory id " + req.params.directoryId
          });
        }
      }
    } else {
      try {
        const childDirectoryProduct = await DirectoryProduct.findById(req.params.directoryId);
        try {
          var brotherDirectoryProducts = await DirectoryProduct.findByParentDirectory(childDirectoryProduct.id_danh_muc_cha);
          res.status(200).send([allDirectoryProducts, {
            ordinalNumbers: [brotherDirectoryProducts[0].stt]
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory products with directory id " + brotherDirectoryProducts.id_danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([allDirectoryProducts, {
            ordinalNumbers: [1]
          }]);
        } else {
          res.status(500).send({
            message: "Error retrieving child directory product with directory id " + id
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

exports.ModeratorDirectoryProductCreate = async (req, res) => {
  let parentDirectoryT = 0;
  let hasError = false;
  try {
    const directoryProduct = await DirectoryProduct.findById(req.params.directoryId);
    if (req.params.type === "parentDirectory") {
      parentDirectoryT = req.params.directoryId;
    } else if (req.params.type === "brotherDirectory") {
      parentDirectoryT = directoryProduct.id_danh_muc_cha;
    } else if (req.params.type === "childDirectory") {
      parentDirectoryT = directoryProduct.id_danh_muc_cha;
    }
    if (hasError) {
      return;
    }
  } catch (err) {
    if (err.kind !== "not_found") {
      res.status(500).send({
        message: "Error retrieving directory product with directory id " + req.params.directoryId
      });
    }
  }
  try {
    await DirectoryProduct.normalizeOrdinalNumberUp(req.body.stt);
    try {
      const directoryProductNew = await DirectoryProduct.create(new DirectoryProduct({
        stt: req.body.stt,
        id_danh_muc_cha: parentDirectoryT,
        ten_danh_muc_sp: req.body.ten_danh_muc_sp,
      }));
      if (req.params.type === "childDirectory") {
        try {
          await DirectoryProduct.updateParentDirectoryByParentDirectory(parentDirectoryT, directoryProductNew.id);
        } catch (err) {
          hasError = true;
          if (err.kind !== "not_found") {
            res.status(500).send({
              message: "Error updating Directory Product with parent directory id " + parentDirectoryT
            });
          }
        }
      }
      res.send({ message: "Directory product was created successfully!" });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Directory product."
      });
    }
  } catch (err) {
    if (err.kind === "select_max_error") {
      res.status(500).send({
        message: "Error select Directory Product ordinal number max"
      });
    } else if (err.kind === "not_found_max") {
      res.status(404).send({
        message: "Not found Directory Product ordinal number max"
      });
    } else if (err.kind === "update_loop_error") {
      res.status(500).send({
        message: "Error update Directory Product ordinal number in loop"
      });
    } else if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Product with ordinal number"
      });
    }
  }
};

exports.ModeratorDirectoryProductDelete = async (req, res) => {
  let hasError = false;
  try {
    const directoryProduct = await DirectoryProduct.findById(req.params.id);
    try {
      await DirectoryProduct.findByParentDirectory(req.params.id);
      try {
        await DirectoryProduct.updateParentDirectoryByParentDirectory(req.params.id, directoryProduct.id_danh_muc_cha);
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Product with parent directory id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Product with parent directory id ${req.params.id}.`
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory products with parent directory id ${req.params.id}.`
        });
      }
    }
  } catch (err) {
    hasError = true;
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Directory Product with id ${req.params.id}.`
      });
      return;
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Product with id " + req.params.id
      });
    }
  }
  try {
    id = parseInt(req.params.id);
    const directoryProduct = await DirectoryProduct.findById(id);
    try {
      await DirectoryProduct.remove(id);
      try {
        await DirectoryProduct.normalizeOrdinalNumberDown(directoryProduct.stt);
        res.send({ message: `Directory Product was deleted successfully!` });
      } catch (err) {
        if (err.kind === "select_max_error") {
          res.status(500).send({
            message: err.content.message || "Error select Directory Product Ordinal Number max"
          });
        } else if (err.kind === "not_found_max") {
          res.status(404).send({
            message: "Not found Directory Product Ordinal Number max"
          });
        } else if (err.kind === "update_loop_error") {
          res.status(500).send({
            message: err.content.message || "Error update Directory Product Ordinal Number in loop"
          });
        } else if (err.kind === "not_found") {
          res.status(404).send({
            message: "Not found Directory Product with Ordinal Number"
          });
        }
      }
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Directory Product with id ${id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Directory Product with id " + id
        });
      }
    }
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Product with id " + id
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Product with id " + id
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
        const childrenDirectoryProductionFacilityOrdinalNumber = await DirectoryProductionFacility.findOrdinalNumberByParentDirectoryId(req.params.directoryId);
        childrenDirectoryProductionFacilityOrdinalNumber.push(childrenDirectoryProductionFacilityOrdinalNumber[childrenDirectoryProductionFacilityOrdinalNumber.length - 1] + 1)
        res.status(200).send([allDirectoryProductionFacilitys, {
          ordinalNumbers: childrenDirectoryProductionFacilityOrdinalNumber
        }]);
      } catch (err) {
        if (err.kind === "not_found") {
          try {
            const parentDirectoryProductionFacility = await DirectoryProductionFacility.findById(req.params.directoryId);
            res.status(200).send([allDirectoryProductionFacilitys, {
              ordinalNumbers: [parentDirectoryProductionFacility.stt + 1]
            }]);
          } catch (err) {
            if (err.kind === "not_found") {
              res.status(200).send([allDirectoryProductionFacilitys, {
                ordinalNumbers: [1]
              }]);
            } else {
              res.status(500).send({
                message: "Error retrieving parent directory production facility with directory id " + req.params.directoryId
              });
            }
          }
        } else {
          res.status(500).send({
            message: "Error retrieving children directory production facility with directory id " + req.params.directoryId
          });
        }
      }
    } else if (req.params.type === "brotherDirectory") {
      try {
        const brotherDirectoryProductionFacility = await DirectoryProductionFacility.findById(req.params.directoryId);
        try {
          const brotherDirectoryProductionFacilityOrdinalNumbers = await DirectoryProductionFacility.findOrdinalNumberByParentDirectoryId(brotherDirectoryProductionFacility.id_danh_muc_cha);
          try {
            const parentOfBrotherDirectoryProductionFacility = await DirectoryProductionFacility.findById(brotherDirectoryProductionFacility.id_danh_muc_cha);
            try {
              const brotherOfParentOfBrotherDirectoryProductionFacilityOrdinalNumbers = await DirectoryProductionFacility.findOrdinalNumberByParentDirectoryId(parentOfBrotherDirectoryProductionFacility.id_danh_muc_cha);
              for (let i = 0; i < brotherOfParentOfBrotherDirectoryProductionFacilityOrdinalNumbers.length; i++) {
                if (i + 1 !== brotherOfParentOfBrotherDirectoryProductionFacilityOrdinalNumbers.length) {
                  if (parentOfBrotherDirectoryProductionFacility.stt === brotherOfParentOfBrotherDirectoryProductionFacilityOrdinalNumbers[i]) {
                    brotherDirectoryProductionFacilityOrdinalNumbers.push(brotherOfParentOfBrotherDirectoryProductionFacilityOrdinalNumbers[i + 1]);
                    break;
                  }
                } else {
                  try {
                    const maxOrdinalNumber = await DirectoryProductionFacility.selectMaxOrdinalNumber();
                    brotherDirectoryProductionFacilityOrdinalNumbers.push(maxOrdinalNumber + 1);
                  } catch (err) {
                    if (err.kind === "not_found_max") {
                      res.status(404).send({
                        message: "Not found Directory Production Facility ordinal number max"
                      });
                    } else {
                      res.status(500).send({
                        message: "Error select Directory Production Facility ordinal number max"
                      });
                    }
                  }
                }
              }
            } catch (err) {
              res.status(500).send({
                message: "Error retrieving brother of parent of brother directory production facilitys with directory id " + parentOfBrotherDirectoryProductionFacility.id_danh_muc_cha
              });
            }
          } catch (err) {
            if (err.kind === "not_found") {
              try {
                const maxOrdinalNumber = await DirectoryProductionFacility.selectMaxOrdinalNumber();
                brotherDirectoryProductionFacilityOrdinalNumbers.push(maxOrdinalNumber + 1);
              } catch (err) {
                if (err.kind === "not_found_max") {
                  res.status(404).send({
                    message: "Not found Directory Production Facility ordinal number max"
                  });
                } else {
                  res.status(500).send({
                    message: "Error select Directory Production Facility ordinal number max"
                  });
                }
              }
            } else {
              res.status(500).send({
                message: "Error retrieving Directory Production Facility with id " + brotherDirectoryProductionFacility.id_danh_muc_cha
              });
            }
          }
          res.status(200).send([allDirectoryProductionFacilitys, {
            ordinalNumbers: brotherDirectoryProductionFacilityOrdinalNumbers
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory production facilitys with directory id " + brotherDirectoryProductionFacility.id_danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([allDirectoryProductionFacilitys, {
            ordinalNumbers: [1]
          }]);
        } else {
          res.status(500).send({
            message: "Error retrieving brother directory production facility with directory id " + req.params.directoryId
          });
        }
      }
    } else {
      try {
        const childDirectoryProductionFacility = await DirectoryProductionFacility.findById(req.params.directoryId);
        try {
          var brotherDirectoryProductionFacilitys = await DirectoryProductionFacility.findByParentDirectory(childDirectoryProductionFacility.id_danh_muc_cha);
          res.status(200).send([allDirectoryProductionFacilitys, {
            ordinalNumbers: [brotherDirectoryProductionFacilitys[0].stt]
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory production facilitys with directory id " + brotherDirectoryProductionFacilitys.id_danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([allDirectoryProductionFacilitys, {
            ordinalNumbers: [1]
          }]);
        } else {
          res.status(500).send({
            message: "Error retrieving child directory production facility with directory id " + req.params.directoryId
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
  let parentDirectoryT = 0;
  let hasError = false;
  try {
    const directoryProductionFacility = await DirectoryProductionFacility.findById(req.params.directoryId);
    if (req.params.type === "parentDirectory") {
      parentDirectoryT = req.params.directoryId;
    } else if (req.params.type === "brotherDirectory") {
      parentDirectoryT = directoryProductionFacility.id_danh_muc_cha;
    } else if (req.params.type === "childDirectory") {
      parentDirectoryT = directoryProductionFacility.id_danh_muc_cha;
    }
    if (hasError) {
      return;
    }
  } catch (err) {
    if (err.kind !== "not_found") {
      res.status(500).send({
        message: "Error retrieving directory production facility with directory id " + req.params.directoryId
      });
    }
  }
  try {
    await DirectoryProductionFacility.normalizeOrdinalNumberUp(req.body.stt);
    try {
      const directoryProductionFacilityNew = await DirectoryProductionFacility.create(new DirectoryProductionFacility({
        stt: req.body.stt,
        id_danh_muc_cha: parentDirectoryT,
        ten_danh_muc_cssx: req.body.ten_danh_muc_cssx,
      }));
      if (req.params.type === "childDirectory") {
        try {
          await DirectoryProductionFacility.updateParentDirectoryByParentDirectory(parentDirectoryT, directoryProductionFacilityNew.id);
        } catch (err) {
          hasError = true;
          if (err.kind !== "not_found") {
            res.status(500).send({
              message: "Error updating Directory Production Facility with parent directory id " + parentDirectoryT
            });
          }
        }
      }
      res.send({ message: "Directory production facility was created successfully!" });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Directory production facility."
      });
    }
  } catch (err) {
    if (err.kind === "select_max_error") {
      res.status(500).send({
        message: "Error select Directory Production Facility ordinal number max"
      });
    } else if (err.kind === "not_found_max") {
      res.status(404).send({
        message: "Not found Directory Production Facility ordinal number max"
      });
    } else if (err.kind === "update_loop_error") {
      res.status(500).send({
        message: "Error update Directory Production Facility ordinal number in loop"
      });
    } else if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Production Facility with ordinal number"
      });
    }
  }
};

exports.ModeratorDirectoryProductionFacilityDelete = async (req, res) => {
  let hasError = false;
  try {
    const directoryProductionFacility = await DirectoryProductionFacility.findById(req.params.id);
    try {
      await DirectoryProductionFacility.findByParentDirectory(req.params.id);
      try {
        await DirectoryProductionFacility.updateParentDirectoryByParentDirectory(req.params.id, directoryProductionFacility.id_danh_muc_cha);
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Production Facility with parent directory id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Production Facility with parent directory id ${req.params.id}.`
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory production facilitys with parent directory id ${req.params.id}.`
        });
      }
    }
  } catch (err) {
    hasError = true;
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Directory Production Facility with id ${req.params.id}.`
      });
      return;
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Production Facility with id " + req.params.id
      });
    }
  }
  try {
    id = parseInt(req.params.id);
    const directoryProductionFacility = await DirectoryProductionFacility.findById(id);
    try {
      await DirectoryProductionFacility.remove(id);
      try {
        await DirectoryProductionFacility.normalizeOrdinalNumberDown(directoryProductionFacility.stt);
        res.send({ message: `Directory Production Facility was deleted successfully!` });
      } catch (err) {
        if (err.kind === "select_max_error") {
          res.status(500).send({
            message: "Error select Directory Production Facility Ordinal Number max"
          });
        } else if (err.kind === "not_found_max") {
          res.status(404).send({
            message: "Not found Directory Production Facility Ordinal Number max"
          });
        } else if (err.kind === "update_loop_error") {
          res.status(500).send({
            message: "Error update Directory Production Facility Ordinal Number in loop"
          });
        } else if (err.kind === "not_found") {
          res.status(404).send({
            message: "Not found Directory Production Facility with Ordinal Number"
          });
        }
      }
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Directory Production Facility with id ${id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Directory Production Facility with id " + id
        });
      }
    }
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Production Facility with id " + id
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Production Facility with id " + id
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
        const childrenDirectoryDistributionAgentOrdinalNumber = await DirectoryDistributionAgent.findOrdinalNumberByParentDirectoryId(req.params.directoryId);
        childrenDirectoryDistributionAgentOrdinalNumber.push(childrenDirectoryDistributionAgentOrdinalNumber[childrenDirectoryDistributionAgentOrdinalNumber.length - 1] + 1)
        res.status(200).send([allDirectoryDistributionAgents, {
          ordinalNumbers: childrenDirectoryDistributionAgentOrdinalNumber
        }]);
      } catch (err) {
        if (err.kind === "not_found") {
          try {
            const parentDirectoryDistributionAgent = await DirectoryDistributionAgent.findById(req.params.directoryId);
            res.status(200).send([allDirectoryDistributionAgents, {
              ordinalNumbers: [parentDirectoryDistributionAgent.stt + 1]
            }]);
          } catch (err) {
            if (err.kind === "not_found") {
              res.status(200).send([allDirectoryDistributionAgents, {
                ordinalNumbers: [1]
              }]);
            } else {
              res.status(500).send({
                message: "Error retrieving parent directory distribution agent with directory id " + req.params.directoryId
              });
            }
          }
        } else {
          res.status(500).send({
            message: "Error retrieving children directory distribution agent with directory id " + req.params.directoryId
          });
        }
      }
    } else if (req.params.type === "brotherDirectory") {
      try {
        const brotherDirectoryDistributionAgent = await DirectoryDistributionAgent.findById(req.params.directoryId);
        try {
          const brotherDirectoryDistributionAgentOrdinalNumbers = await DirectoryDistributionAgent.findOrdinalNumberByParentDirectoryId(brotherDirectoryDistributionAgent.id_danh_muc_cha);
          try {
            const parentOfBrotherDirectoryDistributionAgent = await DirectoryDistributionAgent.findById(brotherDirectoryDistributionAgent.id_danh_muc_cha);
            try {
              const brotherOfParentOfBrotherDirectoryDistributionAgentOrdinalNumbers = await DirectoryDistributionAgent.findOrdinalNumberByParentDirectoryId(parentOfBrotherDirectoryDistributionAgent.id_danh_muc_cha);
              for (let i = 0; i < brotherOfParentOfBrotherDirectoryDistributionAgentOrdinalNumbers.length; i++) {
                if (i + 1 !== brotherOfParentOfBrotherDirectoryDistributionAgentOrdinalNumbers.length) {
                  if (parentOfBrotherDirectoryDistributionAgent.stt === brotherOfParentOfBrotherDirectoryDistributionAgentOrdinalNumbers[i]) {
                    brotherDirectoryDistributionAgentOrdinalNumbers.push(brotherOfParentOfBrotherDirectoryDistributionAgentOrdinalNumbers[i + 1]);
                    break;
                  }
                } else {
                  try {
                    const maxOrdinalNumber = await DirectoryDistributionAgent.selectMaxOrdinalNumber();
                    brotherDirectoryDistributionAgentOrdinalNumbers.push(maxOrdinalNumber + 1);
                  } catch (err) {
                    if (err.kind === "not_found_max") {
                      res.status(404).send({
                        message: "Not found Directory Distribution Agent ordinal number max"
                      });
                    } else {
                      res.status(500).send({
                        message: "Error select Directory Distribution Agent ordinal number max"
                      });
                    }
                  }
                }
              }
            } catch (err) {
              res.status(500).send({
                message: "Error retrieving brother of parent of brother directory distribution agents with directory id " + parentOfBrotherDirectoryDistributionAgent.id_danh_muc_cha
              });
            }
          } catch (err) {
            if (err.kind === "not_found") {
              try {
                const maxOrdinalNumber = await DirectoryDistributionAgent.selectMaxOrdinalNumber();
                brotherDirectoryDistributionAgentOrdinalNumbers.push(maxOrdinalNumber + 1);
              } catch (err) {
                if (err.kind === "not_found_max") {
                  res.status(404).send({
                    message: "Not found Directory Distribution Agent ordinal number max"
                  });
                } else {
                  res.status(500).send({
                    message: "Error select Directory Distribution Agent ordinal number max"
                  });
                }
              }
            } else {
              res.status(500).send({
                message: "Error retrieving Directory Distribution Agent with id " + brotherDirectoryDistributionAgent.id_danh_muc_cha
              });
            }
          }
          res.status(200).send([allDirectoryDistributionAgents, {
            ordinalNumbers: brotherDirectoryDistributionAgentOrdinalNumbers
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory distribution agents with directory name " + brotherDirectoryDistributionAgent.danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([allDirectoryDistributionAgents, {
            ordinalNumbers: [1]
          }]);
        } else {
          res.status(500).send({
            message: "Error retrieving brother directory distribution agent with directory name " + req.params.directoryName
          });
        }
      }
    } else {
      try {
        const childDirectoryDistributionAgent = await DirectoryDistributionAgent.findById(req.params.directoryId);
        try {
          var brotherDirectoryDistributionAgents = await DirectoryDistributionAgent.findByParentDirectory(childDirectoryDistributionAgent.id_danh_muc_cha);
          res.status(200).send([allDirectoryDistributionAgents, {
            ordinalNumbers: [brotherDirectoryDistributionAgents[0].stt]
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory distribution agents with directory id " + brotherDirectoryDistributionAgents.id_danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([allDirectoryDistributionAgents, {
            ordinalNumbers: [1]
          }]);
        } else {
          res.status(500).send({
            message: "Error retrieving child directory distribution agent with directory id " + req.params.directoryId
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
  let parentDirectoryT = 0;
  let hasError = false;
  try {
    const directoryDistributionAgent = await DirectoryDistributionAgent.findById(req.params.directoryId);
    if (req.params.type === "parentDirectory") {
      parentDirectoryT = req.params.directoryId;
    } else if (req.params.type === "brotherDirectory") {
      parentDirectoryT = directoryDistributionAgent.id_danh_muc_cha;
    } else if (req.params.type === "childDirectory") {
      parentDirectoryT = directoryDistributionAgent.id_danh_muc_cha;
    }
    if (hasError) {
      return;
    }
  } catch (err) {
    if (err.kind !== "not_found") {
      res.status(500).send({
        message: "Error retrieving directory distribution agent with directory id " + req.params.directoryId
      });
    }
  }
  try {
    await DirectoryDistributionAgent.normalizeOrdinalNumberUp(req.body.stt);
    try {
      const directoryDistributionAgentNew = await DirectoryDistributionAgent.create(new DirectoryDistributionAgent({
        stt: req.body.stt,
        id_danh_muc_cha: parentDirectoryT,
        ten_danh_muc_dlpp: req.body.ten_danh_muc_dlpp,
      }));
      if (req.params.type === "childDirectory") {
        try {
          await DirectoryDistributionAgent.updateParentDirectoryByParentDirectory(parentDirectoryT, directoryDistributionAgentNew.id);
        } catch (err) {
          hasError = true;
          if (err.kind !== "not_found") {
            res.status(500).send({
              message: "Error updating Directory Distribution Agent with parent directory id " + directoryDistributionAgent.id_danh_muc_cha
            });
          }
        }
      }
      res.send({ message: "Directory distribution agent was created successfully!" });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Directory distribution agent."
      });
    }
  } catch (err) {
    if (err.kind === "select_max_error") {
      res.status(500).send({
        message: "Error select Directory Distribution Agent ordinal number max"
      });
    } else if (err.kind === "not_found_max") {
      res.status(404).send({
        message: "Not found Directory Distribution Agent ordinal number max"
      });
    } else if (err.kind === "update_loop_error") {
      res.status(500).send({
        message: "Error update Directory Distribution Agent ordinal number in loop"
      });
    } else if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Distribution Agent with ordinal number"
      });
    }
  }
};

exports.ModeratorDirectoryDistributionAgentDelete = async (req, res) => {
  let hasError = false;
  try {
    const directoryDistributionAgent = await DirectoryDistributionAgent.findById(req.params.id);
    try {
      await DirectoryDistributionAgent.findByParentDirectory(req.params.id);
      try {
        await DirectoryDistributionAgent.updateParentDirectoryByParentDirectory(req.params.id, directoryDistributionAgent.id_danh_muc_cha);
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Distribution Agent with parent directory id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Distribution Agent with parent directory id ${req.params.id}.`
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory distribution agents with parent directory id ${req.params.id}.`
        });
      }
    }
  } catch (err) {
    hasError = true;
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Directory Distribution Agent with id ${req.params.id}.`
      });
      return;
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Distribution Agent with id " + req.params.id
      });
    }
  }
  try {
    id = parseInt(req.params.id);
    const directoryDistributionAgent = await DirectoryDistributionAgent.findById(id);
    try {
      await DirectoryDistributionAgent.remove(id);
      try {
        await DirectoryDistributionAgent.normalizeOrdinalNumberDown(directoryDistributionAgent.stt);
        res.send({ message: `Directory Distribution Agent was deleted successfully!` });
      } catch (err) {
        if (err.kind === "select_max_error") {
          res.status(500).send({
            message: "Error select Directory Distribution Agent Ordinal Number max"
          });
        } else if (err.kind === "not_found_max") {
          res.status(404).send({
            message: "Not found Directory Distribution Agent Ordinal Number max"
          });
        } else if (err.kind === "update_loop_error") {
          res.status(500).send({
            message: "Error update Directory Distribution Agent Ordinal Number in loop"
          });
        } else if (err.kind === "not_found") {
          res.status(404).send({
            message: "Not found Directory Distribution Agent with Ordinal Number"
          });
        }
      }
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Directory Distribution Agent with id ${id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Directory Distribution Agent with id " + id
        });
      }
    }
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Distribution Agent with id " + id
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Distribution Agent with id " + id
      });
    }
  }
};

exports.ModeratorDirectoryWarrantyCenter = async (req, res) => {
  try {
    const directoryWarrantyCenters = await DirectoryWarrantyCenter.getAll();
    res.status(200).send(directoryWarrantyCenters);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving directory warranty centers."
    });
  }
};

exports.ModeratorDirectoryWarrantyCenterId = async (req, res) => {
  try {
    const allDirectoryWarrantyCenters = await DirectoryWarrantyCenter.getAll();
    if (req.params.type === "parentDirectory") {
      try {
        const childrenDirectoryWarrantyCenterOrdinalNumber = await DirectoryWarrantyCenter.findOrdinalNumberByParentDirectoryId(req.params.directoryId);
        childrenDirectoryWarrantyCenterOrdinalNumber.push(childrenDirectoryWarrantyCenterOrdinalNumber[childrenDirectoryWarrantyCenterOrdinalNumber.length - 1] + 1)
        res.status(200).send([allDirectoryWarrantyCenters, {
          ordinalNumbers: childrenDirectoryWarrantyCenterOrdinalNumber
        }]);
      } catch (err) {
        if (err.kind === "not_found") {
          try {
            const parentDirectoryWarrantyCenter = await DirectoryWarrantyCenter.findById(req.params.directoryId);
            res.status(200).send([allDirectoryWarrantyCenters, {
              ordinalNumbers: [parentDirectoryWarrantyCenter.stt + 1]
            }]);
          } catch (err) {
            if (err.kind === "not_found") {
              res.status(200).send([allDirectoryWarrantyCenters, {
                ordinalNumbers: [1]
              }]);
            } else {
              res.status(500).send({
                message: "Error retrieving parent directory warranty center with directory id " + req.params.directoryId
              });
            }
          }
        } else {
          res.status(500).send({
            message: "Error retrieving children directory warranty center with directory id " + req.params.directoryId
          });
        }
      }
    } else if (req.params.type === "brotherDirectory") {
      try {
        const brotherDirectoryWarrantyCenter = await DirectoryWarrantyCenter.findById(req.params.directoryId);
        try {
          const brotherDirectoryWarrantyCenterOrdinalNumbers = await DirectoryWarrantyCenter.findOrdinalNumberByParentDirectoryId(brotherDirectoryWarrantyCenter.id_danh_muc_cha);
          try {
            const parentOfBrotherDirectoryWarrantyCenter = await DirectoryWarrantyCenter.findById(brotherDirectoryWarrantyCenter.id_danh_muc_cha);
            try {
              const brotherOfParentOfBrotherDirectoryWarrantyCenterOrdinalNumbers = await DirectoryWarrantyCenter.findOrdinalNumberByParentDirectoryId(parentOfBrotherDirectoryWarrantyCenter.id_danh_muc_cha);
              for (let i = 0; i < brotherOfParentOfBrotherDirectoryWarrantyCenterOrdinalNumbers.length; i++) {
                if (i + 1 !== brotherOfParentOfBrotherDirectoryWarrantyCenterOrdinalNumbers.length) {
                  if (parentOfBrotherDirectoryWarrantyCenter.stt === brotherOfParentOfBrotherDirectoryWarrantyCenterOrdinalNumbers[i]) {
                    brotherDirectoryWarrantyCenterOrdinalNumbers.push(brotherOfParentOfBrotherDirectoryWarrantyCenterOrdinalNumbers[i + 1]);
                    break;
                  }
                } else {
                  try {
                    const maxOrdinalNumber = await DirectoryWarrantyCenter.selectMaxOrdinalNumber();
                    brotherDirectoryWarrantyCenterOrdinalNumbers.push(maxOrdinalNumber + 1);
                  } catch (err) {
                    if (err.kind === "not_found_max") {
                      res.status(404).send({
                        message: "Not found Directory Warranty Center ordinal number max"
                      });
                    } else {
                      res.status(500).send({
                        message: "Error select Directory Warranty Center ordinal number max"
                      });
                    }
                  }
                }
              }
            } catch (err) {
              res.status(500).send({
                message: "Error retrieving brother of parent of brother directory warranty centers with directory id " + parentOfBrotherDirectoryWarrantyCenter.id_danh_muc_cha
              });
            }
          } catch (err) {
            if (err.kind === "not_found") {
              try {
                const maxOrdinalNumber = await DirectoryWarrantyCenter.selectMaxOrdinalNumber();
                brotherDirectoryWarrantyCenterOrdinalNumbers.push(maxOrdinalNumber + 1);
              } catch (err) {
                if (err.kind === "not_found_max") {
                  res.status(404).send({
                    message: "Not found Directory Warranty Center ordinal number max"
                  });
                } else {
                  res.status(500).send({
                    message: "Error select Directory Warranty Center ordinal number max"
                  });
                }
              }
            } else {
              res.status(500).send({
                message: "Error retrieving Directory Warranty Center with id " + brotherDirectoryWarrantyCenter.id_danh_muc_cha
              });
            }
          }
          res.status(200).send([allDirectoryWarrantyCenters, {
            ordinalNumbers: brotherDirectoryWarrantyCenterOrdinalNumbers
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory warranty centers with directory id " + brotherDirectoryWarrantyCenter.id_danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([allDirectoryWarrantyCenters, {
            ordinalNumbers: [1]
          }]);
        } else {
          res.status(500).send({
            message: "Error retrieving brother directory warranty center with directory id " + req.params.directoryId
          });
        }
      }
    } else {
      try {
        const childDirectoryWarrantyCenter = await DirectoryWarrantyCenter.findById(req.params.directoryId);
        try {
          var brotherDirectoryWarrantyCenters = await DirectoryWarrantyCenter.findByParentDirectory(childDirectoryWarrantyCenter.id_danh_muc_cha);
          res.status(200).send([allDirectoryWarrantyCenters, {
            ordinalNumbers: [brotherDirectoryWarrantyCenters[0].stt]
          }]);
        } catch (err) {
          res.status(500).send({
            message: "Error retrieving brother directory warranty centers with directory id " + brotherDirectoryWarrantyCenters.id_danh_muc_cha
          });
        }
      } catch (err) {
        if (err.kind === "not_found") {
          res.status(200).send([allDirectoryWarrantyCenters, {
            ordinalNumbers: [1]
          }]);
        } else {
          res.status(500).send({
            message: "Error retrieving child directory warranty center with directory id " + req.params.directoryId
          });
        }
      }
    }
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving directory warranty centers."
    });
  }
};

exports.ModeratorDirectoryWarrantyCenterCreate = async (req, res) => {
  let parentDirectoryT = 0;
  let hasError = false;
  try {
    const directoryWarrantyCenter = await DirectoryWarrantyCenter.findById(req.params.directoryId);
    if (req.params.type === "parentDirectory") {
      parentDirectoryT = req.params.directoryId;
    } else if (req.params.type === "brotherDirectory") {
      parentDirectoryT = directoryWarrantyCenter.id_danh_muc_cha;
    } else if (req.params.type === "childDirectory") {
      parentDirectoryT = directoryWarrantyCenter.id_danh_muc_cha;
    }
    if (hasError) {
      return;
    }
  } catch (err) {
    if (err.kind !== "not_found") {
      res.status(500).send({
        message: "Error retrieving directory warranty center with directory id " + req.params.directoryId
      });
    }
  }
  try {
    await DirectoryWarrantyCenter.normalizeOrdinalNumberUp(req.body.stt);
    try {
      const directoryWarrantyCenterNew = await DirectoryWarrantyCenter.create(new DirectoryWarrantyCenter({
        stt: req.body.stt,
        id_danh_muc_cha: parentDirectoryT,
        ten_danh_muc_ttbh: req.body.ten_danh_muc_ttbh,
      }));
      if (req.params.type === "childDirectory") {
        try {
          await DirectoryWarrantyCenter.updateParentDirectoryByParentDirectory(parentDirectoryT, directoryWarrantyCenterNew.id);
        } catch (err) {
          hasError = true;
          if (err.kind !== "not_found") {
            res.status(500).send({
              message: "Error updating Directory Warranty Center with parent directory id " + parentDirectoryT
            });
          }
        }
      }
      res.send({ message: "Directory warranty center was created successfully!" });
    } catch (err) {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Directory warranty center."
      });
    }
  } catch (err) {
    if (err.kind === "select_max_error") {
      res.status(500).send({
        message: "Error select Directory Warranty Center ordinal number max"
      });
    } else if (err.kind === "not_found_max") {
      res.status(404).send({
        message: "Not found Directory Warranty Center ordinal number max"
      });
    } else if (err.kind === "update_loop_error") {
      res.status(500).send({
        message: "Error update Directory Warranty Center ordinal number in loop"
      });
    } else if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Warranty Center with ordinal number"
      });
    }
  }
};

exports.ModeratorDirectoryWarrantyCenterDelete = async (req, res) => {
  let hasError = false;
  try {
    const directoryWarrantyCenter = await DirectoryWarrantyCenter.findById(req.params.id);
    try {
      await DirectoryWarrantyCenter.findByParentDirectory(req.params.id);
      try {
        await DirectoryWarrantyCenter.updateParentDirectoryByParentDirectory(req.params.id, directoryWarrantyCenter.id_danh_muc_cha);
      } catch (err) {
        hasError = true;
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Directory Warranty Center with parent directory id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: `Error updating Directory Warranty Center with parent directory id ${req.params.id}.`
          });
        }
      }
    } catch (err) {
      if (err.kind !== "not_found") {
        res.status(500).send({
          message: `Error retrieving directory warranty centers with parent directory id ${req.params.id}.`
        });
      }
    }
  } catch (err) {
    hasError = true;
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found Directory Warranty Center with id ${req.params.id}.`
      });
      return;
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Warranty Center with id " + req.params.id
      });
    }
  }
  try {
    id = parseInt(req.params.id);
    const directoryWarrantyCenter = await DirectoryWarrantyCenter.findById(id);
    try {
      await DirectoryWarrantyCenter.remove(id);
      try {
        await DirectoryWarrantyCenter.normalizeOrdinalNumberDown(directoryWarrantyCenter.stt);
        res.send({ message: `Directory Warranty Center was deleted successfully!` });
      } catch (err) {
        if (err.kind === "select_max_error") {
          res.status(500).send({
            message: "Error select Directory Warranty Center Ordinal Number max"
          });
        } else if (err.kind === "not_found_max") {
          res.status(404).send({
            message: "Not found Directory Warranty Center Ordinal Number max"
          });
        } else if (err.kind === "update_loop_error") {
          res.status(500).send({
            message: "Error update Directory Warranty Center Ordinal Number in loop"
          });
        } else if (err.kind === "not_found") {
          res.status(404).send({
            message: "Not found Directory Warranty Center with Ordinal Number"
          });
        }
      }
    } catch (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Directory Warranty Center with id ${id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Directory Warranty Center with id " + id
        });
      }
    }
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: "Not found Directory Warranty Center with id " + id
      });
    } else {
      res.status(500).send({
        message: "Error retrieving Directory Warranty Center with id " + id
      });
    }
  }
};

exports.ModeratorProductFilterData = async (req, res) => {
  try {
    const [statuses, productionFacilitys, distributionAgents, warrantyCenters] = await Promise.all([Status.getAll(), ProductionFacility.getAll(), DistributionAgent.getAll(), WarrantyCenter.getAll()])
    res.status(200).send({
      statuses: statuses,
      productionFacilitys: productionFacilitys,
      distributionAgents: distributionAgents,
      warrantyCenters: warrantyCenters,
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Not found data.`
      });
    } else {
      res.status(500).send({
        message: "Error retrieving data"
      });
    }
  }
};

exports.ModeratorProduct = async (req, res) => {
  try {
    let productIds;
    if (req.body.id_trung_tam_bh) {
      productIds = await Warranty.getProductIdFromWarrantyCenterId(req.body.id_trung_tam_bh);
    }
    const products = await Product.getAll(req.body.id_trang_thai, req.body.id_co_so_sx, req.body.id_dai_ly, productIds);
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm!`
      });
    } else {
      res.status(500).send({
        message: "Lỗi khi lấy sản phẩm!"
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

exports.DistributionAgentProduct = async (req, res) => {
  try {
    const products = await Product.getAll(2, null, req.id_dai_ly);
    res.status(200).send(products);
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không có sản phẩm!`
      });
    } else {
      res.status(500).send({
        message: "Lỗi khi lấy sản phẩm!"
      });
    }
  }
};

exports.DistributionAgentProductStatusUpdate = async (req, res) => {
  try {
    await Product.updateStatusByIds(req.body.ids);
    res.status(200).send({
      message: 'Cập nhật trạng thái thành công!'
    });
  } catch (err) {
    if (err.kind === "not_found") {
      res.status(404).send({
        message: `Không tìm thấy sản phẩm!`
      });
    } else {
      res.status(500).send({
        message: "Lỗi khi cập nhật trạng thái sản phẩm!"
      });
    }
  }
};

exports.WarrantyCenterBoard = (req, res) => {
  res.status(200).send("Warranty Center Content.");
};