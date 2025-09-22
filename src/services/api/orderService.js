// Order Service using Apper Backend Integration
// Table: order_c with proper field visibility compliance

export const orderService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "customer_info_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI-compatible format
      return response.data.map(order => ({
        Id: order.Id,
        items: this.parseItems(order.items_c),
        total: order.total_c || 0,
        status: order.status_c || 'pending',
        customerInfo: this.parseCustomerInfo(order.customer_info_c),
        createdAt: order.created_at_c || order.CreatedOn || new Date().toISOString(),
        tags: order.Tags || ''
      }));
    } catch (error) {
      console.error("Error fetching orders:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "Tags"}},
          {"field": {"Name": "items_c"}},
          {"field": {"Name": "total_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "customer_info_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };
      
      const response = await apperClient.getRecordById('order_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Order not found");
      }
      
      // Transform database fields to UI-compatible format
      const order = response.data;
      return {
        Id: order.Id,
        items: this.parseItems(order.items_c),
        total: order.total_c || 0,
        status: order.status_c || 'pending',
        customerInfo: this.parseCustomerInfo(order.customer_info_c),
        createdAt: order.created_at_c || order.CreatedOn || new Date().toISOString(),
        tags: order.Tags || ''
      };
    } catch (error) {
      console.error("Error fetching order:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(orderData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields as per field visibility rules
      const params = {
        records: [{
          Name: `Order ${Date.now()}`,
          Tags: orderData.tags || '',
          items_c: JSON.stringify(orderData.items || []),
          total_c: parseFloat(orderData.total) || 0,
          status_c: orderData.status || 'pending',
          customer_info_c: JSON.stringify(orderData.customerInfo || {}),
          created_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} orders:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdOrder = successful[0].data;
          return {
            Id: createdOrder.Id,
            items: this.parseItems(createdOrder.items_c),
            total: createdOrder.total_c || 0,
            status: createdOrder.status_c || 'pending',
            customerInfo: this.parseCustomerInfo(createdOrder.customer_info_c),
            createdAt: createdOrder.created_at_c || createdOrder.CreatedOn || new Date().toISOString(),
            tags: createdOrder.Tags || ''
          };
        }
      }
      
      throw new Error("Failed to create order");
    } catch (error) {
      console.error("Error creating order:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, orderData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields as per field visibility rules
      const params = {
        records: [{
          Id: parseInt(id),
          Name: orderData.name || `Order ${id}`,
          Tags: orderData.tags || '',
          items_c: JSON.stringify(orderData.items || []),
          total_c: parseFloat(orderData.total) || 0,
          status_c: orderData.status || 'pending',
          customer_info_c: JSON.stringify(orderData.customerInfo || {}),
          created_at_c: orderData.createdAt || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.updateRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} orders:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedOrder = successful[0].data;
          return {
            Id: updatedOrder.Id,
            items: this.parseItems(updatedOrder.items_c),
            total: updatedOrder.total_c || 0,
            status: updatedOrder.status_c || 'pending',
            customerInfo: this.parseCustomerInfo(updatedOrder.customer_info_c),
            createdAt: updatedOrder.created_at_c || updatedOrder.CreatedOn || new Date().toISOString(),
            tags: updatedOrder.Tags || ''
          };
        }
      }
      
      throw new Error("Failed to update order");
    } catch (error) {
      console.error("Error updating order:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord('order_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} orders:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting order:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  // Helper methods for parsing JSON fields
  parseItems(itemsString) {
    try {
      return itemsString ? JSON.parse(itemsString) : [];
    } catch (error) {
      console.error("Error parsing items:", error);
      return [];
    }
  },

  parseCustomerInfo(customerInfoString) {
    try {
      return customerInfoString ? JSON.parse(customerInfoString) : {};
    } catch (error) {
      console.error("Error parsing customer info:", error);
      return {};
    }
  }
};