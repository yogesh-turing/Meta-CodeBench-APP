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
        // Validate quantity is a positive integer
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          console.error(`Invalid quantity for product ID ${item.productId}`);
          return {
            success: false,
            message: `Invalid quantity for product ID ${item.productId}. Quantity must be a positive integer.`,
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
  
        // Log stock update
        console.log(
          `Stock updated for ${product.name}: ${oldStock} → ${newStock}`
        );
  
        // Update inventory service
        inventoryService.updateStock(product.id, newStock);
  
        // Check for low stock and send notification if needed
        if (newStock < 10) {
          notificationService.sendNotification(
            "low_stock",
            `Low stock alert: ${product.name} has only ${newStock} units remaining`
          );
        }
      }
  
      // Send notification about successful order processing
      notificationService.sendNotification(
        "inventory_update",
        `Successfully processed order ${order.orderId} and updated inventory for ${order.items.length} product(s)`
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
  
  module.exports = { updateInventory };