import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import StockIndicator from "@/components/molecules/StockIndicator";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { productService } from "@/services/api/productService";
import { useCart } from "@/hooks/useCart";
import { toast } from "react-toastify";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const { addItem, isInCart, getItemQuantity } = useCart();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await productService.getAll();
      // Only show products that are in stock for customers
      const availableProducts = data.filter(product => product.stock > 0);
      setProducts(availableProducts);
      setFilteredProducts(availableProducts);
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

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "stock":
          return b.stock - a.stock;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, categoryFilter, sortBy, products]);

  const categories = [...new Set(products.map(p => p.category))];

  const handleAddToCart = (product) => {
    if (product.stock <= 0) {
      toast.error("This product is out of stock");
      return;
    }

    addItem(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  if (loading) {
    return <Loading message="Loading products..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadProducts} />;
  }

  return (
    <div className="space-y-6">
      {/* Store Header */}
      <Card className="bg-gradient-to-r from-primary-50 via-white to-secondary-50 border-primary-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2 flex items-center">
                <ApperIcon name="Store" className="h-8 w-8 mr-3 text-primary-500" />
                StockFlow Store
              </h1>
              <p className="text-secondary-600 text-lg">
                Discover quality products at great prices
              </p>
            </div>
            <div className="hidden sm:block">
              <Badge variant="info" size="lg">
                {filteredProducts.length} products
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
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
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Stock Level</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <Empty
          icon="Store"
          title="No Products Available"
          description={products.length === 0 
            ? "We're currently updating our inventory. Please check back soon for amazing products!"
            : "No products match your search criteria. Try adjusting your filters or search terms."
          }
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchTerm("");
            setCategoryFilter("");
            setSortBy("name");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => {
            const inCart = isInCart(product.Id);
            const cartQuantity = getItemQuantity(product.Id);
            
            return (
              <Card key={product.Id} className="group hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="info" size="sm">
                      {product.category}
                    </Badge>
                    {inCart && (
                      <Badge variant="success" size="sm">
                        In Cart ({cartQuantity})
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-secondary-900 group-hover:text-primary-700 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                    {formatPrice(product.price)}
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-secondary-600 text-sm line-clamp-2">
                    {product.description}
                  </p>
                  
                  <StockIndicator 
                    stock={product.stock} 
                    threshold={product.lowStockThreshold}
                    showLabel={false}
                  />
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-secondary-600">Stock:</span>
                    <span className="font-medium text-secondary-900">
                      {product.stock} units
                    </span>
                  </div>

                  <Button
                    onClick={() => handleAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="w-full"
                    variant={product.stock <= 0 ? "outline" : "default"}
                  >
                    {product.stock <= 0 ? (
                      <>
                        <ApperIcon name="XCircle" className="h-4 w-4 mr-2" />
                        Out of Stock
                      </>
                    ) : (
                      <>
                        <ApperIcon name="ShoppingCart" className="h-4 w-4 mr-2" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Shop;