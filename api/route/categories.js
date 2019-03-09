const express = require("express");
const router = express.Router();

const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const CategoriesController = require("../controllers/categories");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/categories/");
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

router.get("/", checkAuth, CategoriesController.categories_get_all);

router.post(
  "/",
  checkAuth,
  upload.single("image"),
  CategoriesController.categories_create_category
);


router.get("/:categoryId", checkAuth, CategoriesController.categories_get_by_id);

router.patch(
  "/:categoryId",
  checkAuth, upload.single("image"),
  CategoriesController.categories_update_category
);

router.delete(
  "/:categoryId",
  checkAuth,
  CategoriesController.categories_delete_by_id
);

module.exports = router;
