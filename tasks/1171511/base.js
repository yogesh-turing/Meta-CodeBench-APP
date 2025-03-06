const R = require("ramda");

class InventoryManagementSystem {
  constructor() {
    this.products = []; 
  }

  addProduct(productId, name, description, quantity, price) {
    if (!productId || !name || !description || quantity < 0 || price < 0) {
      throw new Error("Invalid product details");
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
    product.price -= (product.price * discountPercentage) / 100;
  }

  getProductById(productId) {
    const product = R.find(R.propEq("productId", productId), this.products);

    if (!product) {
      throw new Error("Product not found");
    }

    return product;
  }

  generateStockReport() {
    return R.map(
      R.pick(["productId", "name", "quantity", "price"]),
      this.products
    );
  }

  deleteProduct(productId) {
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
    return R.filter(
      R.propSatisfies(R.lt(R.__, threshold), "quantity"),
      this.products
    );
  }
}

module.exports = { InventoryManagementSystem };