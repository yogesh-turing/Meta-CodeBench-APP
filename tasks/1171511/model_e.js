const R = require("ramda");

class InventoryManagementSystem {
  constructor() {
    this.products = [];
  }

  validateStringType(value, paramName) {
    if (typeof value !== "string") {
      throw new Error("Invalid product details");
    }
  }

  validateNumberType(value, paramName) {
    if (typeof value !== "number" || isNaN(value)) {
      throw new Error("Invalid product details");
    }
  }

  addProduct(productId, name, description, quantity, price) {
    this.validateStringType(productId);
    this.validateStringType(name);
    this.validateStringType(description);
    this.validateNumberType(quantity);
    this.validateNumberType(price);

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
    this.validateStringType(productId);
    this.validateNumberType(quantity);

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
    this.validateStringType(productId);
    this.validateNumberType(discountPercentage);

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
    const discountAmount = (product.price * discountPercentage) / 100;
    product.price = product.price - discountAmount;
  }

  getProductById(productId) {
    this.validateStringType(productId);

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
    this.validateStringType(productId);

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
    this.validateNumberType(threshold);

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