const { authJwt, validateData } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
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

  // Triệu hồi sản phẩm theo danh mục
  app.put(
    "/api/moderator/directory/product/summon/:id",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.ModeratorDirectoryProductSummon
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

  // Khi tìm thông tin khách hàng
  app.get(
    "/api/distribution-agent/customer/:name/:dateOfBirth",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentCustomer
  );

  // Cập nhật trạng thái sau khi bán sản phẩm
  app.put(
    "/api/distribution-agent/product/sell",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductSell
  );

  // Khi nhận lại sản phẩm cần bảo hành
  app.put(
    "/api/distribution-agent/product/error/:id",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductError
  );

  // Xem các sản phẩm cần đem đi bảo hành
  app.get(
    "/api/distribution-agent/product/warranty",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductWarrantyGetAll
  );

  // Khi chọn trung tâm bảo hành
  app.get(
    "/api/distribution-agent/warranty-center-pick",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentWarrantyCenterPick
  );

  // Cập nhật trạng thái đang đến trung tâm bảo hành
  app.put(
    "/api/distribution-agent/product/shipping-to-warranty-center",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductShippingToWarrantyCenter
  );

  // Khi nhận được sản phẩm bảo hành xong hoặc lỗi, không thể sửa chữa (hiện ra thông tin các sản phẩm đang gửi về)
  app.get(
    "/api/distribution-agent/product/warranty/complete",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductWarrantyComplete
  );

  // Cập nhật trạng thái của các sản phẩm sau khi bảo hành xong hoặc lỗi, không thể sửa chữa và đã về đến đại lý
  app.put(
    "/api/distribution-agent/product/warranty/complete/arrived",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductWarrantyCompleteArrived
  );

  // Xem các sản phẩm cần trả lại cho khách hàng
  app.get(
    "/api/distribution-agent/product/warranty/complete/arrived",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductWarrantyCompleteArrivedGetAll
  );

  // Cập nhật trạng thái của sản phẩm khi trả lại cho khách hàng
  app.put(
    "/api/distribution-agent/product/return/:id",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductReturn
  );

  // Xem các sản phẩm cần chuyển về cơ sở sản xuất
  app.get(
    "/api/distribution-agent/product/err",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductErrGetAll
  );

  // Cập nhật trạng thái của sản phẩm khi chuyển về cơ sở sản xuất
  app.put(
    "/api/distribution-agent/product/move-to-production-facility",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductMoveToProductionFacility
  );

  // Xem các khách hàng cần bàn giao lại sản phẩm mới thay thế
  app.get(
    "/api/distribution-agent/customer/new-replacement-product",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentCustomerNewReplacementProduct
  );

  // Cập nhật trạng thái của sản phẩm khi bàn giao lại sản phẩm mới thay thế
  app.put(
    "/api/distribution-agent/product/new-replacement-product",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductNewReplacementProduct
  );

  // Xem các sản phẩm cần triệu hồi
  app.get(
    "/api/distribution-agent/product/summon",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductSummon
  );

  // Khi chọn trạng thái để thống kê
  app.get(
    "/api/distribution-agent/product/statistical/status/show",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductStatisticalStatusShow
  );

  // Thống kê số liệu sản phẩm theo từng loại
  app.get(
    "/api/distribution-agent/product/statistical/status/:statusId/:month/:quarter/:year",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductStatisticalStatus
  );

  // Thống kê số lượng sản phẩm bán ra
  app.get(
    "/api/distribution-agent/product/statistical/sell/:type/:year",
    [authJwt.verifyToken, authJwt.isDistributionAgent],
    controller.DistributionAgentProductStatisticalSell
  );

  app.get(
    "/api/warranty-center",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterBoard
  );

  // Dữ liệu để chọn danh mục sp trong khi nhập sản phẩm vào kho cssx
  app.get(
    "/api/facility/directory/product",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityDirectoryProduct
  );

  // Dữ liệu để chọn danh mục sp trong khi nhập sản phẩm vào kho cssx
  app.get(
    "/api/facility/directory/product",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityDirectoryProduct
  );

  // Dữ liệu để chọn danh mục sp trong khi nhập sản phẩm vào kho cssx
  app.get(
    "/api/facility/directory/product",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityDirectoryProduct
  );
  app.get(
    "/api/facility/directory/product",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityDirectoryProduct
  );

  // Dữ liệu để chọn danh mục sp trong khi nhập sản phẩm vào kho cssx
  app.get(
    "/api/facility/directory/product",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityDirectoryProduct
  );

  // Dữ liệu để chọn danh mục sp trong khi nhập sản phẩm vào kho cssx
  app.get(
    "/api/facility/directory/product",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityDirectoryProduct
  );

  // Khi bấm chọn id danh mục sp thì sẽ có thông số gửi lên, ko có thì phải thêm mới thông số
  app.get(
    "/api/facility/specifications/:id",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilitySpecifications
  );

  //Lấy danh sách đại lý tồn tại
  app.get("/api/distribution-agent/directory", controller.GetAllAgent);
  // nhập sản phẩm
  app.post(
    "/api/facility/product/create",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityProductCreate
  );

  // lấy list đại lý
  app.get(
    "/api/distribution-agent/directory",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.GetAllAgent
  );

  // tất cả sản phẩm có thể xuất đi đại lý
  app.get(
    "/api/facility/product-new",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityProductNew
  );

  // xác nhận chuyển sản phẩm cho đại lý
  app.post(
    "/api/facility/product/deliver",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityProductDeliver
  );

  // xem sản phẩm lỗi đang chuyển về cơ sở sản xuất
  app.get(
    "/api/facility/product/faulty/all",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityProductFaulty
  );

  // bấm vào button xác nhận sản phẩm loi đã đến cơ sở sản xuất
  app.put(
    "/api/facility/product/faulty/receiv",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityProductFaultyReceive
  );

  // Khi chọn trạng thái để thống kê
  app.get(
    "/api/facility/product/statistical/status/show",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityProductStatisticalStatusShow
  );
  // khi bấm thống kê sản phẩm
  app.get(
    "/api/facility/product/statistical/status/:statusId/:month/:quarter/:year",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityProduct
  );

  //danh mục sp tất cả
  app.get(
    "/api/facility/directory/product",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityDirectoryProduct
  );
  // khi bấm xem sản phẩm đã bán
  app.get(
    "/api/facility/product/statistical/sold/:type/:year",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityProductSold
  );

  // Khi chọn danh mục sp, cssx và dlpp để thống kê tỉ lệ
  app.get(
    "/api/facility/product/statistical/err/show",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityProductStatisticalErrShow
  );

  // Thống kê tỉ lệ sản phẩm bị lỗi
  app.get(
    "/api/facility/product/statistical/err/:directoryProductId/:productionFacilityId/:distributionAgentId",
    [authJwt.verifyToken, authJwt.isProductionFacility],
    controller.FacilityProductStatisticalErr
  );

  // sản phẩm cần bảo hành
  app.get(
    "/api/warranty-center/products",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterProducts
  );

  // Khi bấm vào nút nhận bảo hành sản phẩm
  app.put(
    "/api/warranty-center/products/receiv",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterProductReceiv
  );

  // sản phẩm đang bảo hành
  app.get(
    "/api/warranty-center/products/under",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterProductUnder
  );

  // xác nhận sản phẩm bảo hành xong or lỗi
  app.post(
    "/api/warranty-center/product/finnish",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterUpdateStatus
  );

  // sản phẩm đã bảo hành xong
  app.get(
    "/api/warranty-center/products-finnish",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterProductsFinnish
  );

  // sản phẩm lỗi
  app.get(
    "/api/warranty-center/products-faulty",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterProductFaulty
  );

  // chuyển sản phẩm đến đại lý
  app.post(
    "/api/warranty-center/products/deliver",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterProductDeliver
  );

  // Khi chọn trạng thái để thống kê
  app.get(
    "/api/warranty-center/product/statistical/status/show",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterProductStatisticalStatusShow
  );

  // Thống kê số liệu sản phẩm theo từng loại
  app.get(
    "/api/warranty-center/product/statistical/status/:statusId/:month/:quarter/:year",
    [authJwt.verifyToken, authJwt.isWarrantyCenter],
    controller.WarrantyCenterProductStatisticalStatus
  );
};
