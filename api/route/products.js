const express = require("express");
const router = express.Router();

const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const ProductsController = require("../controllers/products");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/products/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fieldSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", checkAuth, ProductsController.products_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("image"),
  ProductsController.products_create_product
);

router.get("/:productId", checkAuth, ProductsController.products_get_by_id);

router.patch(
  "/:productId",
  checkAuth,
  upload.single("image"),
  ProductsController.products_update_product
);

router.delete(
  "/:productId",
  checkAuth,
  ProductsController.products_delete_by_id
);

module.exports = router;
