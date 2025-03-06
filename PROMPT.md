Base Code:
```javascript
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
```

Stack Trace:
```javascript
Inventory Management System
    ✕ should add a product correctly (1 ms)
    ✓ should throw error if adding product with invalid details (1 ms)
    ✕ should throw error if adding productid is of invalid type (1 ms)
    ✕ should throw error if product name is of invalid type
    ✕ should throw error if product description is of invalid type
    ✕ should throw error if product quantity is of invalid type
    ✕ should throw error if product price is of invalid type
    ✕ should update product quantity correctly
    ✓ should throw error if product not found while updating quantity
    ✕ should throw error if trying to update quantity with negative value (9 ms)
    ✕ should throw error if adding productid is of invalid type while updating (2 ms)
    ✕ should throw error if productid is of invalid type while updating (3 ms)
    ✕ should apply discount correctly
    ✓ should throw error if product not found while applying discount (1 ms)
    ✕ should throw error if discount percentage is invalid (1 ms)
    ✕ should throw error if productid is of invalid type while discount (1 ms)
    ✕ should throw error if discount percentage is of invalid type while discount (1 ms)
    ✓ should generate stock report (1 ms)
    ✕ should delete a product correctly
    ✕ should throw an error when product id is of invalid type while deleting
    ✓ should throw error if product not found while deleting (1 ms)
    ✕ should return low stock products (1 ms)
    ✓ should return empty array for low stock products if none are found

  ● Inventory Management System › should add a product correctly

    Product not found

      65 |
      66 |     if (!product) {
    > 67 |       throw new Error("Product not found");
         |             ^
      68 |     }
      69 |
      70 |     return product;

      at InventoryManagementSystem.getProductById (Solution.js:67:13)
      at Object.getProductById (WordCloud.test.js:13:25)

  ● Inventory Management System › should throw error if adding productid is of invalid type

    expect(received).toThrow(expected)

    Expected substring: "Invalid product details"

    Received function did not throw

      30 |     expect(() =>
      31 |       ims.addProduct(1, "Laptop", "A powerful laptop", 10, 1000)
    > 32 |     ).toThrow("Invalid product details");
         |       ^
      33 |   });
      34 |
      35 |   test("should throw error if product name is of invalid type", () => {

      at Object.toThrow (WordCloud.test.js:32:7)

  ● Inventory Management System › should throw error if product name is of invalid type

    expect(received).toThrow(expected)

    Expected substring: "Invalid product details"

    Received function did not throw

      36 |     expect(() =>
      37 |       ims.addProduct("1", 123, "A powerful laptop", 10, 1000)
    > 38 |     ).toThrow("Invalid product details");
         |       ^
      39 |   });
      40 |
      41 |   test("should throw error if product description is of invalid type", () => {

      at Object.toThrow (WordCloud.test.js:38:7)

  ● Inventory Management System › should throw error if product description is of invalid type

    expect(received).toThrow(expected)

    Expected substring: "Invalid product details"

    Received function did not throw

      40 |
      41 |   test("should throw error if product description is of invalid type", () => {
    > 42 |     expect(() => ims.addProduct("1", "Laptop", 12333, 10, 1000)).toThrow(
         |                                                                  ^
      43 |       "Invalid product details"
      44 |     );
      45 |   });

      at Object.toThrow (WordCloud.test.js:42:66)

  ● Inventory Management System › should throw error if product quantity is of invalid type

    expect(received).toThrow(expected)

    Expected substring: "Invalid product details"

    Received function did not throw

      46 |
      47 |   test("should throw error if product quantity is of invalid type", () => {
    > 48 |     expect(() => ims.addProduct("1", "Laptop", "Laptop", "sa", 1000)).toThrow(
         |                                                                       ^
      49 |       "Invalid product details"
      50 |     );
      51 |   });

      at Object.toThrow (WordCloud.test.js:48:71)

  ● Inventory Management System › should throw error if product price is of invalid type

    expect(received).toThrow(expected)

    Expected substring: "Invalid product details"

    Received function did not throw

      52 |
      53 |   test("should throw error if product price is of invalid type", () => {
    > 54 |     expect(() => ims.addProduct("1", "Laptop", "Laptop", 10, "sa")).toThrow(
         |                                                                     ^
      55 |       "Invalid product details"
      56 |     );
      57 |   });

      at Object.toThrow (WordCloud.test.js:54:69)

  ● Inventory Management System › should update product quantity correctly

    Product not found

      31 |
      32 |     if (productIndex === -1) {
    > 33 |       throw new Error("Product not found");
         |             ^
      34 |     }
      35 |
      36 |     if (quantity < 0) {

      at InventoryManagementSystem.updateProductQuantity (Solution.js:33:13)
      at Object.updateProductQuantity (WordCloud.test.js:61:9)

  ● Inventory Management System › should throw error if trying to update quantity with negative value

    expect(received).toThrow(expected)

    Expected substring: "Quantity must be a non-negative number"
    Received message:   "Product not found"

          31 |
          32 |     if (productIndex === -1) {
        > 33 |       throw new Error("Product not found");
             |             ^
          34 |     }
          35 |
          36 |     if (quantity < 0) {

          at InventoryManagementSystem.updateProductQuantity (Solution.js:33:13)
          at updateProductQuantity (WordCloud.test.js:75:22)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:75:54)

      73 |   test("should throw error if trying to update quantity with negative value", () => {
      74 |     ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    > 75 |     expect(() => ims.updateProductQuantity("1", -5)).toThrow(
         |                                                      ^
      76 |       "Quantity must be a non-negative number"
      77 |     );
      78 |   });

      at Object.toThrow (WordCloud.test.js:75:54)

  ● Inventory Management System › should throw error if adding productid is of invalid type while updating

    expect(received).toThrow(expected)

    Expected substring: "Invalid product details"
    Received message:   "Product not found"

          31 |
          32 |     if (productIndex === -1) {
        > 33 |       throw new Error("Product not found");
             |             ^
          34 |     }
          35 |
          36 |     if (quantity < 0) {

          at InventoryManagementSystem.updateProductQuantity (Solution.js:33:13)
          at updateProductQuantity (WordCloud.test.js:83:22)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:83:51)

      81 |     ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
      82 |
    > 83 |     expect(() => ims.updateProductQuantity(1, 5)).toThrow(
         |                                                   ^
      84 |       "Invalid product details"
      85 |     );
      86 |   });

      at Object.toThrow (WordCloud.test.js:83:51)

  ● Inventory Management System › should throw error if productid is of invalid type while updating

    expect(received).toThrow(expected)

    Expected substring: "Invalid product details"
    Received message:   "Product not found"

          31 |
          32 |     if (productIndex === -1) {
        > 33 |       throw new Error("Product not found");
             |             ^
          34 |     }
          35 |
          36 |     if (quantity < 0) {

          at InventoryManagementSystem.updateProductQuantity (Solution.js:33:13)
          at updateProductQuantity (WordCloud.test.js:91:22)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:91:53)

      89 |     ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
      90 |
    > 91 |     expect(() => ims.updateProductQuantity(1, "5")).toThrow(
         |                                                     ^
      92 |       "Invalid product details"
      93 |     );
      94 |   });

      at Object.toThrow (WordCloud.test.js:91:53)

  ● Inventory Management System › should apply discount correctly

    Product not found

      49 |
      50 |     if (productIndex === -1) {
    > 51 |       throw new Error("Product not found");
         |             ^
      52 |     }
      53 |
      54 |     if (discountPercentage < 0 || discountPercentage > 100) {

      at InventoryManagementSystem.applyDiscount (Solution.js:51:13)
      at Object.applyDiscount (WordCloud.test.js:98:9)

  ● Inventory Management System › should throw error if discount percentage is invalid

    expect(received).toThrow(expected)

    Expected substring: "Invalid discount percentage"
    Received message:   "Product not found"

          49 |
          50 |     if (productIndex === -1) {
        > 51 |       throw new Error("Product not found");
             |             ^
          52 |     }
          53 |
          54 |     if (discountPercentage < 0 || discountPercentage > 100) {

          at InventoryManagementSystem.applyDiscount (Solution.js:51:13)
          at applyDiscount (WordCloud.test.js:112:22)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:112:47)

      110 |   test("should throw error if discount percentage is invalid", () => {
      111 |     ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    > 112 |     expect(() => ims.applyDiscount("1", 110)).toThrow(
          |                                               ^
      113 |       "Invalid discount percentage"
      114 |     );
      115 |   });

      at Object.toThrow (WordCloud.test.js:112:47)

  ● Inventory Management System › should throw error if productid is of invalid type while discount

    expect(received).toThrow(expected)

    Expected substring: "Invalid product details"
    Received message:   "Product not found"

          49 |
          50 |     if (productIndex === -1) {
        > 51 |       throw new Error("Product not found");
             |             ^
          52 |     }
          53 |
          54 |     if (discountPercentage < 0 || discountPercentage > 100) {

          at InventoryManagementSystem.applyDiscount (Solution.js:51:13)
          at applyDiscount (WordCloud.test.js:120:22)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:120:45)

      118 |     ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
      119 |
    > 120 |     expect(() => ims.applyDiscount(1, 110)).toThrow("Invalid product details");
          |                                             ^
      121 |   });
      122 |
      123 |   test("should throw error if discount percentage is of invalid type while discount", () => {

      at Object.toThrow (WordCloud.test.js:120:45)

  ● Inventory Management System › should throw error if discount percentage is of invalid type while discount

    expect(received).toThrow(expected)

    Expected substring: "Invalid product details"
    Received message:   "Product not found"

          49 |
          50 |     if (productIndex === -1) {
        > 51 |       throw new Error("Product not found");
             |             ^
          52 |     }
          53 |
          54 |     if (discountPercentage < 0 || discountPercentage > 100) {

          at InventoryManagementSystem.applyDiscount (Solution.js:51:13)
          at applyDiscount (WordCloud.test.js:126:22)
          at Object.<anonymous> (node_modules/expect/build/toThrowMatchers.js:74:11)
          at Object.throwingMatcher [as toThrow] (node_modules/expect/build/index.js:320:21)
          at Object.toThrow (WordCloud.test.js:126:49)

      124 |     ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
      125 |
    > 126 |     expect(() => ims.applyDiscount("1", "110")).toThrow(
          |                                                 ^
      127 |       "Invalid product details"
      128 |     );
      129 |   });

      at Object.toThrow (WordCloud.test.js:126:49)

  ● Inventory Management System › should delete a product correctly

    Product not found

      87 |
      88 |     if (productIndex === -1) {
    > 89 |       throw new Error("Product not found");
         |             ^
      90 |     }
      91 |
      92 |     this.products.splice(productIndex, 1);

      at InventoryManagementSystem.deleteProduct (Solution.js:89:13)
      at Object.deleteProduct (WordCloud.test.js:144:9)

  ● Inventory Management System › should throw an error when product id is of invalid type while deleting

    Product not found

      87 |
      88 |     if (productIndex === -1) {
    > 89 |       throw new Error("Product not found");
         |             ^
      90 |     }
      91 |
      92 |     this.products.splice(productIndex, 1);

      at InventoryManagementSystem.deleteProduct (Solution.js:89:13)
      at Object.deleteProduct (WordCloud.test.js:151:9)

  ● Inventory Management System › should return low stock products

    expect(received).toEqual(expected) // deep equality

    - Expected  - 0
    + Received  + 1

    @@ -1,7 +1,8 @@
      Array [
        Object {
    +     "description": "A smartphone",
          "name": "Phone",
          "price": 500,
          "productId": "2",
          "quantity": 5,
        },

      165 |
      166 |     const lowStock = ims.getLowStockProducts(10);
    > 167 |     expect(lowStock).toEqual([
          |                      ^
      168 |       { productId: "2", name: "Phone", quantity: 5, price: 500 },
      169 |     ]);
      170 |   });

      at Object.toEqual (WordCloud.test.js:167:22)

Test Suites: 1 failed, 1 total
Tests:       17 failed, 6 passed, 23 total
Snapshots:   0 total
Time:        0.284 s, estimated 1 s
Ran all test suites.
```
Prompt:
Please fix the bugs in the code and ensure it works as per the details below:

function `addProduct` 
    -   Accept:
        -   `productId` (string)
        -   `name` (string)
        -   `description` (string)
        -   `quantity` (number)
        -   `price` (number)
    -   Requirements:
        -   Ensure `quantity` and `price` are non-negative. If either is invalid, throw an error: `"Quantity and price must be non-negative"`.
        -   Store the product in an array of products.

function `updateProductQuantity` 
    -   Accept:
        -   `productId` (string)
        -   `quantity` (number)
    -   Requirements:
        -   If any parameter is missing or invalid, throw an error: `"Invalid product details"`.
        -   If the `productId` does not exist, throw an error: `"Product not found"`.
        -   If `quantity` is negative, throw an error: `"Quantity must be a non-negative number"`.
        -   Update the product's `quantity`.

function `applyDiscount` :
    -   Accept:
        -   `productId` (string)
        -   `discountPercentage` (number)
    -   Requirements:
        -   If any parameter is missing or invalid, throw an error: `"Invalid product details"`.
        -   If the `productId` does not exist, throw an error: `"Product not found"`.
        -   If `discountPercentage` is not a valid number between 0 and 100, throw an error: `"Invalid discount percentage"`.
        -   Update the product's price based on the discount.

 function `getProductById` 
    -   Accept:
        -   `productId` (string)
    -   Requirements:
        -   If any parameter is missing or invalid, throw an error: `"Invalid product details"`.
        -   If the `productId` does not exist, throw an error: `"Product not found"`.
        -   Return the product's details as an object, including:
            -   `productId` (string)
            -   `name` (string)
            -   `description` (string)
            -   `quantity` (number)
            -   `price` (number)

the function `generateStockReport()` 
    -   Requirements:
        -   Return an array of objects containing the following:
            -   `productId` (string)
            -   `name` (string)
            -   `quantity` (number)
            -   `price` (number)

function `deleteProduct`
    -   Accept:
        -   `productId` (string)
    -   Requirements:
        -   If the `productId` does not exist, throw an error: `"Product not found"`.
        -   Delete the product from the inventory.

 function `getLowStockProducts`
    -   Accept:
        -   `threshold` (number)
    -   Requirements:
        -   Return an array of products with stock below the threshold.
        -   Each product object should contain:
            -   `productId` (string)
            -   `name` (string)
            -   `quantity` (number)
        -   If there are no products below the threshold, return: `"No low stock products"`.

Note:   
-  If any parameter is of invalid type in above functions, throw an error: `"Invalid product details"`


Below are the test cases in which it is failing:
```javascript

test("should add a product correctly", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    const product = ims.getProductById("1");
    expect(product).toEqual({
      productId: "1",
      name: "Laptop",
      description: "A powerful laptop",
      quantity: 10,
      price: 1000,
    });
  });

 test("should throw error if adding productid is of invalid type", () => {
    expect(() =>
      ims.addProduct(1, "Laptop", "A powerful laptop", 10, 1000)
    ).toThrow("Invalid product details");
  });


  test("should throw error if product name is of invalid type", () => {
    expect(() =>
      ims.addProduct("1", 123, "A powerful laptop", 10, 1000)
    ).toThrow("Invalid product details");
  });

  test("should throw error if product description is of invalid type", () => {
    expect(() => ims.addProduct("1", "Laptop", 12333, 10, 1000)).toThrow(
      "Invalid product details"
    );
  });

  test("should throw error if product quantity is of invalid type", () => {
    expect(() => ims.addProduct("1", "Laptop", "Laptop", "sa", 1000)).toThrow(
      "Invalid product details"
    );
  });
test("should throw error if product price is of invalid type", () => {
    expect(() => ims.addProduct("1", "Laptop", "Laptop", 10, "sa")).toThrow(
      "Invalid product details"
    );
  });

  test("should update product quantity correctly", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    ims.updateProductQuantity("1", 20);

    const product = ims.getProductById("1");
    expect(product.quantity).toBe(20);
  });
test("should throw error if trying to update quantity with negative value", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    expect(() => ims.updateProductQuantity("1", -5)).toThrow(
      "Quantity must be a non-negative number"
    );
  });

  test("should throw error if adding productid is of invalid type while updating", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    expect(() => ims.updateProductQuantity(1, 5)).toThrow(
      "Invalid product details"
    );
  });

  test("should throw error if productid is of invalid type while updating", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    expect(() => ims.updateProductQuantity(1, "5")).toThrow(
      "Invalid product details"
    );
  });

  test("should apply discount correctly", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    ims.applyDiscount("1", 10);

    const product = ims.getProductById("1");
    expect(product.price).toBe(900); // 1000 - 10% = 900
  });

test("should throw error if discount percentage is invalid", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    expect(() => ims.applyDiscount("1", 110)).toThrow(
      "Invalid discount percentage"
    );
  });

  test("should throw error if productid is of invalid type while discount", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    expect(() => ims.applyDiscount(1, 110)).toThrow("Invalid product details");
  });

  test("should throw error if discount percentage is of invalid type while discount", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    expect(() => ims.applyDiscount("1", "110")).toThrow(
      "Invalid product details"
    );
  });

test("should delete a product correctly", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    ims.deleteProduct("1");

    expect(() => ims.getProductById("1")).toThrow("Product not found");
  });

  test("should throw an error when product id is of invalid type while deleting", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);

    expect(() => ims.deleteProduct(1)).toThrow("Invalid product details");
  });

test("should return low stock products", () => {
    ims.addProduct("1", "Laptop", "A powerful laptop", 10, 1000);
    ims.addProduct("2", "Phone", "A smartphone", 5, 500);

    const lowStock = ims.getLowStockProducts(10);
    expect(lowStock).toEqual([
      { productId: "2", name: "Phone", quantity: 5, price: 500 },
    ]);
  });
```