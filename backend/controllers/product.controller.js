const { createController } = require("../middlewares/response.middleware");
const service = require("../services/product.service");

async function createProduct(req, res) {
  const { name, quantity, unitPrice } = req.body;
  const product = await service.createProduct({ name, quantity, unitPrice });

  res.status(201);

  return product;
}

async function getAllProducts() {
  return service.getAllProducts();
}

async function getProduct(req) {
  const { id } = req.params;
  const product = await service.getProductById(parseInt(id, 10));

  return product;
}

async function updateProduct(req) {
  const { id } = req.params;
  const { name, quantity, unitPrice } = req.body;
  const product = await service.updateProduct({
    id: parseInt(id, 10),
    data: { name, quantity, unitPrice },
  });

  return product;
}

async function deleteProduct(req, res) {
  const { id } = req.params;
  await service.deleteProduct(parseInt(id, 10));

  res.status(204);
}

module.exports = {
  createProduct: createController(createProduct),
  getAllProducts: createController(getAllProducts),
  getProduct: createController(getProduct),
  updateProduct: createController(updateProduct),
  deleteProduct: createController(deleteProduct),
};
