const R = require("ramda");

class InventoryManagementSystem {
  constructor() {
    this.products = [];
  }

  addProduct(productId, name, description, quantity, price) {
    if (typeof productId !== "string" || typeof name !== "string" || typeof description !== "string") {
      throw new Error("Invalid product details");
    }

    if (typeof quantity !== "number" || typeof price !== "number") {
      throw new Error("Invalid product details");
    }

    if (quantity < 0 || price < 0) {
      throw new Error("Quantity and price must be non-negative");
    }

    const product = {
      productId,
      name,
      description,
      quantity,
      price,
    };

    this.products.push(product);
  }

  updateProductQuantity(productId, quantity) {
    if (typeof productId !== "string" || typeof quantity !== "number") {
      throw new Error("Invalid product details");
    }

    const productIndex = R.findIndex(
      R.propEq("productId", productId),
      this.products
    );

    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    if (quantity < 0) {
      throw new Error("Quantity must be a non-negative number");
    }

    this.products[productIndex].quantity = quantity;
  }

  applyDiscount(productId, discountPercentage) {
    if (typeof productId !== "string" || typeof discountPercentage !== "number") {
      throw new Error("Invalid product details");
    }

    const productIndex = R.findIndex(
      R.propEq("productId", productId),
      this.products
    );

    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    if (discountPercentage < 0 || discountPercentage > 100) {
      throw new Error("Invalid discount percentage");
    }

    const product = this.products[productIndex];
    product.price = product.price - (product.price * discountPercentage) / 100;
  }

  getProductById(productId) {
    if (typeof productId !== "string") {
      throw new Error("Invalid product details");
    }

    const product = R.find(R.propEq("productId", productId), this.products);

    if (!product) {
      throw new Error("Product not found");
    }

    return { ...product };
  }

  generateStockReport() {
    return R.map(
      R.pick(["productId", "name", "quantity", "price"]),
      this.products
    );
  }

  deleteProduct(productId) {
    if (typeof productId !== "string") {
      throw new Error("Invalid product details");
    }

    const productIndex = R.findIndex(
      R.propEq("productId", productId),
      this.products
    );

    if (productIndex === -1) {
      throw new Error("Product not found");
    }

    this.products.splice(productIndex, 1);
  }

  getLowStockProducts(threshold) {
    if (typeof threshold !== "number") {
      throw new Error("Invalid product details");
    }

    const lowStockProducts = R.filter(
      product => product.quantity < threshold,
      this.products
    );

    if (lowStockProducts.length === 0) {
      return "No low stock products";
    }

    return R.map(
      R.pick(["productId", "name", "quantity", "price"]),
      lowStockProducts
    );
  }
}

module.exports = { InventoryManagementSystem };