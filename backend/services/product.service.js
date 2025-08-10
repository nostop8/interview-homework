const { productSchema } = require("../schemas/product.schema");
const ValidationError = require("../misc/validation.error");
const NotFoundError = require("../misc/not-found.error");
const { prismaClient } = require("../prisma/client");

async function createProduct(data) {
  const validationResult = productSchema.safeParse(data);

  if (!validationResult.success) {
    throw new ValidationError({
      message: "Validation failed",
      issues: validationResult.error.issues,
    });
  }

  const product = await prismaClient.product.create({
    data: validationResult.data,
  });

  return product;
}

async function getAllProducts() {
  const products = await prismaClient.product.findMany();

  return products;
}

async function getProductById(id) {
  const product = await prismaClient.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new NotFoundError(`Product with ID ${id} not found`);
  }

  return product;
}

async function updateProduct({ id, data }) {
  const validationResult = productSchema.safeParse(data);

  if (!validationResult.success) {
    throw new ValidationError({
      message: "Validation failed",
      issues: validationResult.error.issues,
    });
  }

  try {
    const product = await prismaClient.product.update({
      where: { id },
      data: validationResult.data,
    });

    return product;
  } catch (error) {
    if (error.code === "P2025") {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    throw error;
  }
}

async function deleteProduct(id) {
  try {
    await prismaClient.product.delete({
      where: { id },
    });
  } catch (error) {
    if (error.code === "P2025") {
      throw new NotFoundError(`Product with ID ${id} not found`);
    }
    throw error;
  }
}

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
