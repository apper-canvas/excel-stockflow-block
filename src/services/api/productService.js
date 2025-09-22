// Product Service using Apper Backend Integration
// Table: product_c with proper field visibility compliance

export const productService = {
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "low_stock_threshold_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "Id", "sorttype": "DESC"}]
      };
      
      const response = await apperClient.fetchRecords('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      // Transform database fields to UI-compatible format
      return response.data.map(product => ({
        Id: product.Id,
        name: product.name_c || product.Name || '',
        price: product.price_c || 0,
        stock: product.stock_c || 0,
        category: product.category_c || '',
        description: product.description_c || '',
        lowStockThreshold: product.low_stock_threshold_c || 0,
        createdAt: product.created_at_c || product.CreatedOn || new Date().toISOString(),
        tags: product.Tags || ''
      }));
    } catch (error) {
      console.error("Error fetching products:", error?.response?.data?.message || error.message);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "price_c"}},
          {"field": {"Name": "stock_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "low_stock_threshold_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };
      
      const response = await apperClient.getRecordById('product_c', parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (!response.data) {
        throw new Error("Product not found");
      }
      
      // Transform database fields to UI-compatible format
      const product = response.data;
      return {
        Id: product.Id,
        name: product.name_c || product.Name || '',
        price: product.price_c || 0,
        stock: product.stock_c || 0,
        category: product.category_c || '',
        description: product.description_c || '',
        lowStockThreshold: product.low_stock_threshold_c || 0,
        createdAt: product.created_at_c || product.CreatedOn || new Date().toISOString(),
        tags: product.Tags || ''
      };
    } catch (error) {
      console.error("Error fetching product:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async create(productData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include Updateable fields as per field visibility rules
      const params = {
        records: [{
          Name: productData.name || '',
          Tags: productData.tags || '',
          name_c: productData.name || '',
          price_c: parseFloat(productData.price) || 0,
          stock_c: parseInt(productData.stock) || 0,
          category_c: productData.category || '',
          description_c: productData.description || '',
          low_stock_threshold_c: parseInt(productData.lowStockThreshold) || 0,
          created_at_c: new Date().toISOString()
        }]
      };
      
      const response = await apperClient.createRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} products:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const createdProduct = successful[0].data;
          return {
            Id: createdProduct.Id,
            name: createdProduct.name_c || createdProduct.Name || '',
            price: createdProduct.price_c || 0,
            stock: createdProduct.stock_c || 0,
            category: createdProduct.category_c || '',
            description: createdProduct.description_c || '',
            lowStockThreshold: createdProduct.low_stock_threshold_c || 0,
            createdAt: createdProduct.created_at_c || createdProduct.CreatedOn || new Date().toISOString(),
            tags: createdProduct.Tags || ''
          };
        }
      }
      
      throw new Error("Failed to create product");
    } catch (error) {
      console.error("Error creating product:", error?.response?.data?.message || error.message);
      throw error;
    }
  },

  async update(id, productData) {
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
          Name: productData.name || '',
          Tags: productData.tags || '',
          name_c: productData.name || '',
          price_c: parseFloat(productData.price) || 0,
          stock_c: parseInt(productData.stock) || 0,
          category_c: productData.category || '',
          description_c: productData.description || '',
          low_stock_threshold_c: parseInt(productData.lowStockThreshold) || 0,
          created_at_c: productData.createdAt || new Date().toISOString()
        }]
      };
      
      const response = await apperClient.updateRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} products:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const updatedProduct = successful[0].data;
          return {
            Id: updatedProduct.Id,
            name: updatedProduct.name_c || updatedProduct.Name || '',
            price: updatedProduct.price_c || 0,
            stock: updatedProduct.stock_c || 0,
            category: updatedProduct.category_c || '',
            description: updatedProduct.description_c || '',
            lowStockThreshold: updatedProduct.low_stock_threshold_c || 0,
            createdAt: updatedProduct.created_at_c || updatedProduct.CreatedOn || new Date().toISOString(),
            tags: updatedProduct.Tags || ''
          };
        }
      }
      
      throw new Error("Failed to update product");
    } catch (error) {
      console.error("Error updating product:", error?.response?.data?.message || error.message);
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
      
      const response = await apperClient.deleteRecord('product_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} products:`, JSON.stringify(failed));
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting product:", error?.response?.data?.message || error.message);
      throw error;
    }
  }
};