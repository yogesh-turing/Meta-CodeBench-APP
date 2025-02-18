function updateInventory(
    order,
    products,
    inventoryService,
    notificationService
  ) {
    if (!order || !order.items || !Array.isArray(order.items)) {
      console.error("Invalid order format");
      return { success: false, message: "Invalid order format" };
    }
  
    try {
      for (const item of order.items) {
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          console.error("Quantity must be a positive integer");
          return { success: false, message: "Quantity must be a positive integer" };
        }
  
        const product = products.find((p) => p.id === item.productId);
  
        if (!product) {
          console.error(`Product with ID ${item.productId} not found`);
          return {
            success: false,
            message: `Product with ID ${item.productId} not found`,
          };
        }
  
        if (product.stock < item.quantity) {
          console.warn(`Insufficient stock for product ${product.name}`);
          return {
            success: false,
            message: `Insufficient stock for product ${product.name}`,
          };
        }
  
        const oldStock = product.stock;
        const newStock = product.stock - item.quantity;
        product.stock = newStock;
  
        console.log(`Updated stock for product ${product.name}: ${oldStock} -> ${newStock}`);
  
        inventoryService.updateStock(product.id, newStock);
  
        if (newStock < 10) {
          notificationService.sendNotification(
            "low_stock",
            `Low stock alert: ${product.name} has ${newStock} units remaining`
          );
        }
      }
  
      notificationService.sendNotification(
        "inventory_update",
        `Inventory updated successfully for order ${order.orderId}`
      );
  
      return { success: true, message: "Inventory updated successfully" };
    } catch (error) {
      console.error("Error updating inventory:", error);
      return {
        success: false,
        message: "Error updating inventory: " + error.message,
      };
    }
  }
  
  const order = {
    orderId: "ORD-123",
    items: [
      { productId: "1", quantity: 2 },
      { productId: "2", quantity: 1 },
    ],
  };
  
  const products = [
    { id: "1", name: "T-Shirt", stock: 50 },
    { id: "2", name: "Jeans", stock: 25 },
  ];
  
  const inventoryService = {
    updateStock: (productId, newStock) => {
      console.log(`Updated product ${productId} to stock ${newStock}`);
    },
  };
  
  const notificationService = {
    sendNotification: (type, message) => {
      console.log(`Sending ${type} notification: ${message}`);
    },
  };
  
  updateInventory(order, products, inventoryService, notificationService);