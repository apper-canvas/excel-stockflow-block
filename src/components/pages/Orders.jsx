import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Select from "@/components/atoms/Select";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await orderService.getAll();
      setOrders(data);
      setFilteredOrders(data);
    } catch (err) {
      setError("Failed to load orders. Please try again.");
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    let filtered = [...orders];

    if (statusFilter) {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchTerm) {
filtered = filtered.filter(order => 
        order.customerInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.Id.toString().includes(searchTerm)
      );
    }

    setFilteredOrders(filtered);
  }, [statusFilter, searchTerm, orders]);

const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const order = orders.find(o => o.Id === orderId);
      const updatedOrderData = {
        items: order.items,
        total: order.total,
        status: newStatus,
        customerInfo: order.customerInfo,
        createdAt: order.createdAt
      };
      await orderService.update(orderId, updatedOrderData);
      toast.success("Order status updated successfully!");
      loadOrders();
    } catch (error) {
      toast.error("Failed to update order status. Please try again.");
      console.error("Error updating order status:", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "completed": return "success";
      case "processing": return "info";
      case "shipped": return "info";
      case "pending": return "warning";
      case "cancelled": return "error";
      default: return "default";
    }
  };

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" }
  ];

  if (loading) {
    return <Loading message="Loading orders..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadOrders} />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="bg-gradient-to-r from-secondary-50 via-white to-primary-50 border-secondary-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2 flex items-center">
                <ApperIcon name="ShoppingCart" className="h-8 w-8 mr-3 text-primary-500" />
                Order Management
              </h1>
              <p className="text-secondary-600 text-lg">
                Process customer orders and track order fulfillment
              </p>
            </div>
            <Badge variant="info" size="lg">
              {filteredOrders.length} orders
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by customer name, email, or order ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="md:w-48"
            >
              <option value="">All Statuses</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Empty
          icon="ShoppingCart"
          title="No Orders Found"
          description={orders.length === 0 
            ? "No orders have been placed yet. Orders will appear here once customers start purchasing."
            : "No orders match your current filter criteria. Try adjusting your search or filters."
          }
          onAction={orders.length === 0 ? () => window.location.href = "/shop" : null}
          actionLabel="Browse Products"
        />
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.Id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  {/* Order Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-secondary-900 flex items-center">
                          <ApperIcon name="Package" className="h-5 w-5 mr-2 text-primary-500" />
                          Order #{order.Id}
                        </h3>
                        <p className="text-secondary-600">{formatDate(order.createdAt)}</p>
                      </div>
                      <Badge variant={getStatusVariant(order.status)} size="lg">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-secondary-900 mb-1">Customer</h4>
<p className="text-secondary-700">{order.customerInfo?.name || 'Unknown Customer'}</p>
                        <p className="text-secondary-600 text-sm">{order.customerInfo?.email || 'No email'}</p>
                        <p className="text-secondary-600 text-sm">{order.customerInfo?.phone || 'No phone'}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900 mb-1">Delivery Address</h4>
<p className="text-secondary-600 text-sm">{order.customerInfo?.address || 'No address'}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-secondary-900 mb-2">Order Items</h4>
                      <div className="space-y-1">
{order.items?.map((item, index) => (
                          <div key={index} className="flex justify-between items-center text-sm bg-secondary-50 p-2 rounded">
                            <span>{item.productName} × {item.quantity}</span>
                            <span className="font-medium">{formatPrice(item.total)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="lg:ml-6 flex flex-col items-end space-y-3">
                    <div className="text-right">
                      <p className="text-sm text-secondary-600">Total Amount</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-success-600 to-success-800 bg-clip-text text-transparent">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <Select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.Id, e.target.value)}
                        className="w-40"
                      >
                        {statusOptions.map(status => (
                          <option key={status.value} value={status.value}>
                            {status.label}
                          </option>
                        ))}
                      </Select>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <ApperIcon name="Eye" className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <ApperIcon name="Printer" className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;