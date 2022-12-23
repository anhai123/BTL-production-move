const { authJwt, validateData } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/all", controller.allAccess);

  app.get(
    "/api/moderator",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorBoard
  );

  app.get(
    "/api/moderator/account",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorAccount
  );

  app.put(
    "/api/moderator/account",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorAccept
  );

  app.delete(
    "/api/moderator/account",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorReject
  );

  // Xem tất cả danh mục sản phẩm
  app.get(
    "/api/moderator/directory/product",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProduct
  );

  // Khi bấm vào nút thêm mới
  app.get(
    "/api/moderator/directory/product/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProduct
  );

  // Khi chọn tên danh mục sản phẩm liên quan
  app.get(
    "/api/moderator/directory/product/create/:type/:directoryName",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProductId
  );

  // Khi submit tạo danh mục
  app.post(
    "/api/moderator/directory/product/:type/:directoryName",
    [authJwt.verifyToken, authJwt.isModerator, validateData.checkTypesExisted],
    controller.ModeratorDirectoryProductCreate
  );

  app.delete(
    "/api/moderator/directory/product/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProductDelete
  );

  // Xem tất cả danh mục cơ sở sản xuất
  app.get(
    "/api/moderator/directory/production-facility",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProductionFacility
  );

  // Khi bấm vào nút thêm mới danh mục cơ sở sản xuất
  app.get(
    "/api/moderator/directory/production-facility/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProductionFacility
  );

  // Khi chọn tên danh mục cơ sở sản xuất liên quan
  app.get(
    "/api/moderator/directory/production-facility/create/:type/:directoryName",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProductionFacilityId
  );

  // Khi submit tạo danh mục cơ sở sản xuất
  app.post(
    "/api/moderator/directory/production-facility/:type/:directoryName",
    [authJwt.verifyToken, authJwt.isModerator, validateData.checkTypesExisted],
    controller.ModeratorDirectoryProductionFacilityCreate
  );

  app.delete(
    "/api/moderator/directory/production-facility/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProductionFacilityDelete
  );

  // Xem tất cả danh mục đại lý phân phối
  app.get(
    "/api/moderator/directory/distribution-agent",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryDistributionAgent
  );
// here
  // Khi bấm vào nút thêm mới danh mục đại lý phân phối
  app.get(
    "/api/moderator/directory/production-facility/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProductionFacility
  );

  // Khi chọn tên danh mục cơ sở sản xuất liên quan
  app.get(
    "/api/moderator/directory/production-facility/create/:type/:directoryName",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProductionFacilityId
  );

  // Khi submit tạo danh mục cơ sở sản xuất
  app.post(
    "/api/moderator/directory/production-facility/:type/:directoryName",
    [authJwt.verifyToken, authJwt.isModerator, validateData.checkTypesExisted],
    controller.ModeratorDirectoryProductionFacilityCreate
  );

  app.delete(
    "/api/moderator/directory/production-facility/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProductionFacilityDelete
  );

  app.get(
    "/api/production-facility",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.ProductionFacilityBoard
  );

  app.get(
    "/api/distribution-agent",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentBoard
  );

  app.get(
    "/api/warranty-center",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterBoard
  );
};