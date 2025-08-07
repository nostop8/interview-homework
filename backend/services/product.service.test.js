const { prismaClient } = require("../prisma/client");
const NotFoundError = require("../misc/not-found.error");
const ValidationError = require("../misc/validation.error");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("./product.service");

describe("product.service", () => {
  const sampleProduct1 = {
    name: "Sample Product 1",
    quantity: 5,
    unitPrice: 50,
  };

  const sampleProduct2 = {
    name: "Sample Product 2",
    quantity: 0,
    unitPrice: 5.99,
  };

  describe("createProduct", () => {
    it("should create a product with valid data", async () => {
      const productData = {
        name: "Test Product",
        quantity: 10,
        unitPrice: 100,
      };
      const product = await createProduct(productData);
      expect(product).toEqual({
        id: expect.any(Number),
        name: "Test Product",
        quantity: 10,
        unitPrice: 100,
      });
    });

    it.each([
      ["name is missing", { name: "", quantity: 10, unitPrice: 100 }],
      [
        "quantity is negative",
        { name: "Test Product", quantity: -1, unitPrice: 100 },
      ],
      [
        "Unit Price is negative",
        { name: "Test Product", quantity: 10, unitPrice: -100 },
      ],
      [
        "Unit Price is invalid",
        { name: "Test Product", quantity: 10, unitPrice: "invalid" },
      ],
    ])("should throw ValidationError when %s", async (invalidData) => {
      await expect(createProduct(invalidData)).rejects.toThrow(ValidationError);
    });
  });

  describe("getAllProducts", () => {
    it("should return all products", async () => {
      await Promise.all([
        prismaClient.product.create({
          data: sampleProduct1,
        }),
        prismaClient.product.create({
          data: sampleProduct2,
        }),
      ]);

      const products = await getAllProducts();

      expect(products).toHaveLength(2);

      expect(products).toEqual(
        expect.arrayContaining([
          expect.objectContaining(sampleProduct1),
          expect.objectContaining(sampleProduct2),
        ])
      );
    });

    it("should return an empty array when no products exist", async () => {
      const products = await getAllProducts();
      expect(products).toEqual([]);
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      const createdProduct = await prismaClient.product.create({
        data: sampleProduct1,
      });

      const product = await getProductById(createdProduct.id);

      expect(product).toEqual(expect.objectContaining(sampleProduct1));
    });

    it("should throw NotFoundError if product does not exist", async () => {
      await expect(getProductById(999999)).rejects.toThrow(NotFoundError);
    });
  });

  describe("updateProduct", () => {
    it("should update a product with valid data", async () => {
      const createdProduct = await prismaClient.product.create({
        data: sampleProduct1,
      });

      const updatedData = {
        name: "Updated Product",
        quantity: 20,
        unitPrice: 200,
      };
      const updatedProduct = await updateProduct({
        id: createdProduct.id,
        data: updatedData,
      });

      expect(updatedProduct).toEqual(expect.objectContaining(updatedData));
    });

    it("should throw ValidationError for invalid update data", async () => {
      const createdProduct = await prismaClient.product.create({
        data: sampleProduct1,
      });

      const invalidUpdateData = { name: "", quantity: -5, unitPrice: -50 };
      await expect(
        updateProduct({ id: createdProduct.id, data: invalidUpdateData })
      ).rejects.toThrow(ValidationError);
    });

    it("should throw NotFoundError if product does not exist", async () => {
      const invalidId = 999999;
      const updateData = {
        name: "Nonexistent Product",
        quantity: 10,
        unitPrice: 100,
      };
      await expect(
        updateProduct({ id: invalidId, data: updateData })
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product by ID", async () => {
      const createdProduct = await prismaClient.product.create({
        data: sampleProduct1,
      });

      await deleteProduct(createdProduct.id);

      await expect(getProductById(createdProduct.id)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw NotFoundError if product does not exist", async () => {
      const invalidId = 999999;
      await expect(deleteProduct(invalidId)).rejects.toThrow(NotFoundError);
    });
  });
});
