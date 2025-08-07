const { z } = require("zod");

const productSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().nonnegative(),
  unitPrice: z.number().nonnegative(),
});

module.exports = { productSchema };
