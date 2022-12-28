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
    "/api/moderator/directory/product/create/:type/:directoryId",
    [authJwt.verifyToken, authJwt.isModerator, validateData.checkTypesExisted],
    controller.ModeratorDirectoryProductId
  );

  // Khi submit tạo danh mục
  app.post(
    "/api/moderator/directory/product/:type/:directoryId",
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
    "/api/moderator/directory/production-facility/create/:type/:directoryId",
    [authJwt.verifyToken, authJwt.isModerator, validateData.checkTypesExisted],
    controller.ModeratorDirectoryProductionFacilityId
  );

  // Khi submit tạo danh mục cơ sở sản xuất
  app.post(
    "/api/moderator/directory/production-facility/:type/:directoryId",
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

  // Khi bấm vào nút thêm mới danh mục đại lý phân phối
  app.get(
    "/api/moderator/directory/distribution-agent/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryDistributionAgent
  );

  // Khi chọn tên danh mục đại lý phân phối liên quan
  app.get(
    "/api/moderator/directory/distribution-agent/create/:type/:directoryId",
    [authJwt.verifyToken, authJwt.isModerator, validateData.checkTypesExisted],
    controller.ModeratorDirectoryDistributionAgentId
  );

  // Khi submit tạo danh mục đại lý phân phối
  app.post(
    "/api/moderator/directory/distribution-agent/:type/:directoryId",
    [authJwt.verifyToken, authJwt.isModerator, validateData.checkTypesExisted],
    controller.ModeratorDirectoryDistributionAgentCreate
  );

  app.delete(
    "/api/moderator/directory/distribution-agent/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryDistributionAgentDelete
  );

  // Xem tất cả danh mục trung tâm bảo hành
  app.get(
    "/api/moderator/directory/warranty-center",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryWarrantyCenter
  );

  // Khi bấm vào nút thêm mới danh mục trung tâm bảo hành
  app.get(
    "/api/moderator/directory/warranty-center/create",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryWarrantyCenter
  );

  // Khi chọn tên danh mục trung tâm bảo hành liên quan
  app.get(
    "/api/moderator/directory/warranty-center/create/:type/:directoryId",
    [authJwt.verifyToken, authJwt.isModerator, validateData.checkTypesExisted],
    controller.ModeratorDirectoryWarrantyCenterId
  );

  // Khi submit tạo danh mục trung tâm bảo hành
  app.post(
    "/api/moderator/directory/warranty-center/:type/:directoryId",
    [authJwt.verifyToken, authJwt.isModerator, validateData.checkTypesExisted],
    controller.ModeratorDirectoryWarrantyCenterCreate
  );

  app.delete(
    "/api/moderator/directory/warranty-center/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryWarrantyCenterDelete
  );

  // Khi bấm vào nút thống kê sản phẩm
  app.get(
    "/api/moderator/product",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorProductFilterData
  );

  // Khi bấm xem sản phẩm
  app.post(
    "/api/moderator/product",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorProduct
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
    "/api/distribution-agent/product",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProduct
  );

  app.put(
    "/api/distribution-agent/product",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductStatusUpdate
  );

  app.get(
    "/api/warranty-center",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterBoard
  );

  // nhập sản phẩm
  app.post("/api/facility/:id/product/create", [authJwt.verifyToken, authJwt.isProductionFacility], controller.FacilityProductCreate);

  // tất cả sản phẩm có thể xuất đi đại lý
  app.get("/api/facility/:id/product-new", [authJwt.verifyToken, authJwt.isProductionFacility], controller.FacilityProductNew);

  // xác nhận chuyển sản phẩm cho đại lý
  app.post("/api/facility/:id/product/deliver", controller.FacilityProductDeliver);

  
  // xem sản phẩm lỗi đang chuyển về cơ sở sản xuất
  app.get("/api/facility/:id/product/faulty/all", controller.FacilityProductFaulty);

  // bấm vào button xác nhận sản phẩm  loi đã đến cơ sở sản xuất
  app.put("/api/facility/:id/product/faulty/receiv", controller.FacilityProductFaultyReceive);

  // khi bấm thống kê sản phẩm
  app.post("/api/facility/:id/product", controller.FacilityProduct);
    
  // khi bấm xem sản phẩm đã bán
  app.post("/api/facility/:id/product/sold", controller.FacilityProductSold);
  
};