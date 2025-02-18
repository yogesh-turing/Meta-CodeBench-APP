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
        // Validate that the quantity is a positive integer
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          console.error(`Invalid quantity for product ${item.productId}`);
          return {
            success: false,
            message: `Invalid quantity for product ${item.productId}`,
          };
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
  
        // Log the stock update for the product
        console.log(
          `Updated stock for product ${product.name}: ${oldStock} -> ${newStock}`
        );
  
        // Simulate a database update via an inventory service
        inventoryService.updateStock(product.id, newStock);
  
        // Check if the new stock level is below a threshold (e.g., 10 units)
        if (newStock < 10) {
          notificationService.sendNotification(
            "low_stock",
            `Low stock alert for product ${product.name}: ${newStock} units remaining`
          );
        }
      }
  
      // Send a notification about the successful inventory update for the entire order
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