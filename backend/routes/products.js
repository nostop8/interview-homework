var express = require("express");
var router = express.Router();

const { responseErrorHandler } = require("../middlewares/response.middleware");
const {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/:id", getProduct);
router.put("/:id", updateProduct);
router.delete('/:id', deleteProduct);

router.use(responseErrorHandler);

module.exports = router;
