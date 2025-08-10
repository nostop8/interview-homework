const request = require("supertest");
const app = require("../app");
const { prismaClient } = require("../prisma/client");

describe("Products API Routes", () => {
  const productData = {
    name: "Test Product",
    quantity: 10,
    unitPrice: 25.99,
  };
  const nonExistentId = 99999;

  describe("POST /products", () => {
    it("should create a new product with valid data", async () => {
      const response = await request(app)
        .post("/products")
        .send(productData)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: productData.name,
        quantity: productData.quantity,
        unitPrice: productData.unitPrice,
      });
    });

    it("should return 400 for invalid product data", async () => {
      const invalidData = {
        name: "",
        quantity: -5,
        unitPrice: -10,
      };

      const response = await request(app)
        .post("/products")
        .send(invalidData)
        .expect(400);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["name"],
            message: expect.stringContaining("Too small"),
          }),
          expect.objectContaining({
            path: ["quantity"],
            message: expect.stringContaining("Too small"),
          }),
          expect.objectContaining({
            path: ["unitPrice"],
            message: expect.stringContaining("Too small"),
          }),
        ])
      );
    });

    it("should return 400 for missing required fields", async () => {
      const incompleteData = {
        name: "Test Product",
      };

      await request(app).post("/products").send(incompleteData).expect(400);
    });
  });

  describe("GET /products", () => {
    it("should return an empty array when no products exist", async () => {
      const response = await request(app).get("/products").expect(200);

      expect(response.body).toEqual([]);
    });

    it("should return all products when they exist", async () => {
      // Create test products
      const product1 = await prismaClient.product.create({
        data: { name: "Product 1", quantity: 5, unitPrice: 10.5 },
      });
      const product2 = await prismaClient.product.create({
        data: { name: "Product 2", quantity: 8, unitPrice: 15.75 },
      });

      const response = await request(app).get("/products").expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: product1.id, name: "Product 1" }),
          expect.objectContaining({ id: product2.id, name: "Product 2" }),
        ])
      );
    });
  });

  describe("GET /products/:id", () => {
    it("should return a specific product by ID", async () => {
      const product = await prismaClient.product.create({
        data: productData,
      });

      const response = await request(app)
        .get(`/products/${product.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: product.id,
        ...productData,
      });
    });

    it("should return 404 for non-existent product ID", async () => {
      const response = await request(app)
        .get(`/products/${nonExistentId}`)
        .expect(404);

      expect(response.body).toEqual({
        error: `Product with ID ${nonExistentId} not found`,
      });
    });
  });

  describe("PUT /products/:id", () => {
    it("should update an existing product", async () => {
      const product = await prismaClient.product.create({
        data: productData,
      });

      const updateData = {
        name: "Updated Product",
        quantity: 15,
        unitPrice: 25.5,
      };

      const response = await request(app)
        .put(`/products/${product.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        id: product.id,
        ...updateData,
      });

      const updatedProduct = await prismaClient.product.findUnique({
        where: { id: product.id },
      });
      expect(updatedProduct).toEqual(expect.objectContaining(updateData));
    });

    it("should return 404 when updating non-existent product", async () => {
      const updateData = {
        name: "Updated Product",
        quantity: 15,
        unitPrice: 25.5,
      };

      const response = await request(app)
        .put(`/products/${nonExistentId}`)
        .send(updateData)
        .expect(404);

      expect(response.body).toEqual({
        error: `Product with ID ${nonExistentId} not found`,
      });
    });

    it("should return 400 for invalid update data", async () => {
      const product = await prismaClient.product.create({
        data: { name: "Test Product", quantity: 5, unitPrice: 10.0 },
      });

      const invalidUpdateData = {
        name: "",
        quantity: -1,
        unitPrice: -5,
      };

      const response = await request(app)
        .put(`/products/${product.id}`)
        .send(invalidUpdateData)
        .expect(400);

      expect(response.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            path: ["name"],
            message: expect.stringContaining("Too small"),
          }),
          expect.objectContaining({
            path: ["quantity"],
            message: expect.stringContaining("Too small"),
          }),
          expect.objectContaining({
            path: ["unitPrice"],
            message: expect.stringContaining("Too small"),
          }),
        ])
      );
    });
  });

  describe("DELETE /products/:id", () => {
    it("should delete an existing product", async () => {
      const product = await prismaClient.product.create({
        data: productData,
      });

      await request(app).delete(`/products/${product.id}`).expect(204);

      const deletedProduct = await prismaClient.product.findUnique({
        where: { id: product.id },
      });
      expect(deletedProduct).toBeNull();
    });

    it("should return 404 when deleting non-existent product", async () => {
      const response = await request(app)
        .delete(`/products/${nonExistentId}`)
        .expect(404);

      expect(response.body).toEqual({
        error: `Product with ID ${nonExistentId} not found`,
      });
    });
  });
});
