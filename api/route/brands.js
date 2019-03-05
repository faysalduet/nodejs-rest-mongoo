const express = require("express");
const router = express.Router();

const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const BrandsController = require("../controllers/brands");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/brands/");
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

router.get("/", checkAuth, BrandsController.brands_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("brandImage"),
  BrandsController.brands_create_brand
);


router.get("/:brandId", checkAuth, BrandsController.brands_get_by_id);

router.patch(
  "/:brandId",
  checkAuth,
  BrandsController.brands_update_brand
);

router.delete(
  "/:brandId",
  checkAuth,
  BrandsController.brands_delete_by_id
);

module.exports = router;
