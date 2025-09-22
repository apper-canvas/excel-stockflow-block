import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { productService } from "@/services/api/productService";
import { orderService } from "@/services/api/orderService";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockItems: 0,
    recentOrders: 0,
    totalRevenue: 0
  });
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [products, orders] = await Promise.all([
        productService.getAll(),
        orderService.getAll()
      ]);

      const lowStock = products.filter(p => p.stock <= p.lowStockThreshold);
      const recent = orders.slice(0, 5);
      const revenue = orders.reduce((sum, order) => sum + order.total, 0);

      setStats({
        totalProducts: products.length,
        lowStockItems: lowStock.length,
        recentOrders: orders.length,
        totalRevenue: revenue
      });

      setLowStockProducts(lowStock);
      setRecentOrders(recent);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: "Package",
      color: "from-primary-500 to-primary-600",
      bgColor: "from-primary-50 to-primary-100",
      textColor: "text-primary-700"
    },
    {
      title: "Low Stock Items",
      value: stats.lowStockItems,
      icon: "AlertTriangle",
      color: stats.lowStockItems > 0 ? "from-warning-500 to-warning-600" : "from-success-500 to-success-600",
      bgColor: stats.lowStockItems > 0 ? "from-warning-50 to-warning-100" : "from-success-50 to-success-100",
      textColor: stats.lowStockItems > 0 ? "text-warning-700" : "text-success-700"
    },
    {
      title: "Total Orders",
      value: stats.recentOrders,
      icon: "ShoppingCart",
      color: "from-secondary-500 to-secondary-600",
      bgColor: "from-secondary-50 to-secondary-100",
      textColor: "text-secondary-700"
    },
    {
      title: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: "DollarSign",
      color: "from-success-500 to-success-600",
      bgColor: "from-success-50 to-success-100",
      textColor: "text-success-700",
      isPrice: true
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-secondary-200 rounded mb-4"></div>
                <div className="h-8 bg-secondary-200 rounded mb-2"></div>
                <div className="h-3 bg-secondary-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <CardContent className="p-6">
              <div className={`bg-gradient-to-r ${stat.bgColor} rounded-2xl p-4 mb-4`}>
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl inline-block shadow-lg`}>
                  <ApperIcon name={stat.icon} className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-secondary-600">{stat.title}</h3>
                <p className={`text-2xl font-bold ${stat.textColor} ${!stat.isPrice ? "text-3xl" : ""}`}>
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Low Stock Alert & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-secondary-900 flex items-center">
                <ApperIcon name="AlertTriangle" className="h-5 w-5 mr-2 text-warning-500" />
                Low Stock Alert
              </h3>
              {stats.lowStockItems > 0 && (
                <Badge variant="warning" size="sm">
                  {stats.lowStockItems} items
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" className="h-12 w-12 text-success-500 mx-auto mb-3" />
                <p className="text-success-600 font-medium">All products are well stocked!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.slice(0, 5).map((product) => (
                  <div key={product.Id} className="flex items-center justify-between p-3 bg-gradient-to-r from-warning-50 to-warning-100 rounded-lg border border-warning-200">
                    <div>
                      <h4 className="font-medium text-secondary-900">{product.name}</h4>
                      <p className="text-sm text-secondary-600">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="warning" size="sm">
                        {product.stock} left
                      </Badge>
                    </div>
                  </div>
                ))}
                {lowStockProducts.length > 5 && (
                  <p className="text-sm text-secondary-500 text-center mt-4">
                    And {lowStockProducts.length - 5} more items...
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-secondary-900 flex items-center">
                <ApperIcon name="ShoppingCart" className="h-5 w-5 mr-2 text-primary-500" />
                Recent Orders
              </h3>
              {stats.recentOrders > 0 && (
                <Badge variant="info" size="sm">
                  {stats.recentOrders} orders
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="ShoppingCart" className="h-12 w-12 text-secondary-400 mx-auto mb-3" />
                <p className="text-secondary-600">No orders yet</p>
                <p className="text-sm text-secondary-500">Orders will appear here once customers start purchasing</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.Id} className="flex items-center justify-between p-3 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg border border-secondary-200">
                    <div>
                      <h4 className="font-medium text-secondary-900">Order #{order.Id}</h4>
                      <p className="text-sm text-secondary-600">{order.customerInfo.name}</p>
                      <p className="text-xs text-secondary-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-success-600">{formatPrice(order.total)}</p>
                      <Badge variant="info" size="sm">
                        {order.items.length} items
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardStats;