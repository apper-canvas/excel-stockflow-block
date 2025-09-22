import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Modal from "@/components/atoms/Modal";
import FormField from "@/components/molecules/FormField";
import StockIndicator from "@/components/molecules/StockIndicator";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { productService } from "@/services/api/productService";

const ProductList = ({ view = "admin" }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockAdjustment, setStockAdjustment] = useState({ productId: null, quantity: "", isOpen: false });

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    lowStockThreshold: ""
  });

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      setError("Failed to load products. Please try again.");
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, products]);

  const categories = [...new Set(products.map(p => p.category))];

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      description: product.description,
      lowStockThreshold: product.lowStockThreshold.toString()
    });
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      description: "",
      lowStockThreshold: "10"
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e, isEdit = false) => {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category,
        description: formData.description,
        lowStockThreshold: parseInt(formData.lowStockThreshold)
      };

      if (isEdit && selectedProduct) {
        await productService.update(selectedProduct.Id, productData);
        toast.success("Product updated successfully!");
        setIsEditModalOpen(false);
      } else {
        await productService.create(productData);
        toast.success("Product added successfully!");
        setIsAddModalOpen(false);
      }

      loadProducts();
      setSelectedProduct(null);
    } catch (error) {
      toast.error("Failed to save product. Please try again.");
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    
    try {
      await productService.delete(product.Id);
      toast.success("Product deleted successfully!");
      loadProducts();
    } catch (error) {
      toast.error("Failed to delete product. Please try again.");
      console.error("Error deleting product:", error);
    }
  };

  const handleStockAdjustment = async () => {
    if (!stockAdjustment.quantity || !stockAdjustment.productId) return;

    try {
      const product = products.find(p => p.Id === stockAdjustment.productId);
      const newStock = Math.max(0, product.stock + parseInt(stockAdjustment.quantity));
      
      await productService.update(product.Id, { ...product, stock: newStock });
      toast.success("Stock updated successfully!");
      setStockAdjustment({ productId: null, quantity: "", isOpen: false });
      loadProducts();
    } catch (error) {
      toast.error("Failed to update stock. Please try again.");
      console.error("Error updating stock:", error);
    }
  };

  const openStockModal = (product) => {
    setStockAdjustment({ productId: product.Id, quantity: "", isOpen: true });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-secondary-200 rounded mb-2"></div>
              <div className="h-4 bg-secondary-200 rounded w-2/3"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="h-4 bg-secondary-200 rounded"></div>
                <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                <div className="h-8 bg-secondary-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <ApperIcon name="AlertCircle" className="h-12 w-12 text-error-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Unable to Load Products</h3>
          <p className="text-secondary-600 mb-4">{error}</p>
          <Button onClick={loadProducts}>
            <ApperIcon name="RefreshCw" className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (filteredProducts.length === 0 && !loading) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <ApperIcon name="Package" className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            {products.length === 0 ? "No Products Found" : "No Results"}
          </h3>
          <p className="text-secondary-600 mb-6">
            {products.length === 0 
              ? "Get started by adding your first product to the inventory."
              : "Try adjusting your search or filter criteria."
            }
          </p>
          {view === "admin" && products.length === 0 && (
            <Button onClick={handleAdd}>
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add First Product
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="md:w-48"
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </Select>
        {view === "admin" && (
          <Button onClick={handleAdd}>
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.Id} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-secondary-900 group-hover:text-primary-700 transition-colors">
                    {product.name}
                  </h3>
                  <Badge variant="info" size="sm" className="mt-1">
                    {product.category}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-secondary-600 text-sm">{product.description}</p>
              
              <StockIndicator 
                stock={product.stock} 
                threshold={product.lowStockThreshold}
                className="transition-all duration-300"
              />

              {view === "admin" && (
                <div className="flex flex-wrap gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(product)}
                    className="flex-1"
                  >
                    <ApperIcon name="Edit2" className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openStockModal(product)}
                    className="flex-1"
                  >
                    <ApperIcon name="Package" className="h-3 w-3 mr-1" />
                    Stock
                  </Button>
                  <Button
                    variant="error"
                    size="sm"
                    onClick={() => handleDelete(product)}
                    className="w-full mt-2"
                  >
                    <ApperIcon name="Trash2" className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Product Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        className="max-w-2xl"
      >
        <form onSubmit={(e) => handleSubmit(e, false)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Product Name"
              type="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormField
              label="Category"
              type="input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <FormField
              label="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <FormField
              label="Stock Quantity"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
            <FormField
              label="Low Stock Threshold"
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
              required
            />
          </div>
          <FormField
            label="Description"
            type="input"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
        className="max-w-2xl"
      >
        <form onSubmit={(e) => handleSubmit(e, true)} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Product Name"
              type="input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormField
              label="Category"
              type="input"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <FormField
              label="Price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
            <FormField
              label="Stock Quantity"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
            <FormField
              label="Low Stock Threshold"
              type="number"
              value={formData.lowStockThreshold}
              onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
              required
            />
          </div>
          <FormField
            label="Description"
            type="input"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <ApperIcon name="Save" className="h-4 w-4 mr-2" />
              Update Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* Stock Adjustment Modal */}
      <Modal
        isOpen={stockAdjustment.isOpen}
        onClose={() => setStockAdjustment({ productId: null, quantity: "", isOpen: false })}
        title="Adjust Stock"
      >
        <div className="p-6 space-y-4">
          <p className="text-secondary-600">
            Enter a positive number to add stock, or a negative number to remove stock.
          </p>
          <FormField
            label="Quantity Adjustment"
            type="number"
            placeholder="e.g., +10 or -5"
            value={stockAdjustment.quantity}
            onChange={(e) => setStockAdjustment({ ...stockAdjustment, quantity: e.target.value })}
          />
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setStockAdjustment({ productId: null, quantity: "", isOpen: false })}
            >
              Cancel
            </Button>
            <Button onClick={handleStockAdjustment}>
              <ApperIcon name="Package" className="h-4 w-4 mr-2" />
              Update Stock
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;