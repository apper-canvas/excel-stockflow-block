import ordersData from "@/services/mockData/orders.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let orders = [...ordersData];

export const orderService = {
  async getAll() {
    await delay(300);
    return [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  async getById(id) {
    await delay(200);
    const order = orders.find(o => o.Id === parseInt(id));
    if (!order) {
      throw new Error("Order not found");
    }
    return { ...order };
  },

  async create(orderData) {
    await delay(500);
    const newId = Math.max(...orders.map(o => o.Id)) + 1;
    const newOrder = {
      Id: newId,
      ...orderData,
      createdAt: new Date().toISOString()
    };
    orders.push(newOrder);
    return { ...newOrder };
  },

  async update(id, orderData) {
    await delay(350);
    const index = orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    
    orders[index] = {
      ...orders[index],
      ...orderData,
      Id: parseInt(id)
    };
    
    return { ...orders[index] };
  },

  async delete(id) {
    await delay(300);
    const index = orders.findIndex(o => o.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Order not found");
    }
    
    orders.splice(index, 1);
    return true;
  }
};