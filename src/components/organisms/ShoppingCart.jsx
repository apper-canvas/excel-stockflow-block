import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Input from "@/components/atoms/Input";
import Modal from "@/components/atoms/Modal";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";
import { orderService } from "@/services/api/orderService";
import { toast } from "react-toastify";

const ShoppingCart = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotal, getItemCount } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
const orderData = {
        items: items.map(item => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        total: getTotal(),
        status: "pending",
        customerInfo
      };

      await orderService.create(orderData);
      
      toast.success("Order placed successfully! Thank you for your purchase.");
      clearCart();
      setIsCheckoutOpen(false);
      setCustomerInfo({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Error placing order:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <ApperIcon name="ShoppingBag" className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">Your Cart is Empty</h3>
          <p className="text-secondary-600 mb-6">
            Discover amazing products and add them to your cart to get started.
          </p>
          <Button onClick={() => window.history.back()}>
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cart Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-secondary-900 flex items-center">
              <ApperIcon name="ShoppingBag" className="h-6 w-6 mr-3" />
              Shopping Cart
            </h2>
            <Badge variant="info" size="lg">
              {getItemCount()} {getItemCount() === 1 ? "item" : "items"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.productId} className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-secondary-900">{item.name}</h3>
                  <p className="text-secondary-600 text-sm mb-3">{item.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                      {formatPrice(item.price)}
                    </span>
                    <Badge variant="info" size="sm">{item.category}</Badge>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                      className="h-8 w-8"
                    >
                      <ApperIcon name="Minus" className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.productId, parseInt(e.target.value) || 1)}
                      className="w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                      className="h-8 w-8"
                    >
                      <ApperIcon name="Plus" className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[100px]">
                    <p className="text-xl font-bold text-secondary-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="error"
                    size="icon"
                    onClick={() => removeItem(item.productId)}
                    className="h-8 w-8"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cart Summary */}
      <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-secondary-900">Order Summary</h3>
              <p className="text-secondary-600">Review your items before checkout</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-secondary-600 mb-1">Total Amount</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                {formatPrice(getTotal())}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              variant="outline" 
              onClick={clearCart}
              className="flex-1 sm:flex-initial"
            >
              <ApperIcon name="Trash2" className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
            <Button 
              onClick={() => setIsCheckoutOpen(true)}
              className="flex-1"
              size="lg"
            >
              <ApperIcon name="CreditCard" className="h-4 w-4 mr-2" />
              Proceed to Checkout
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Checkout Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Checkout"
        className="max-w-2xl"
      >
        <form onSubmit={handleCheckout} className="p-6 space-y-6">
          <div className="bg-gradient-to-r from-secondary-50 to-primary-50 p-4 rounded-lg">
            <h4 className="font-semibold text-secondary-900 mb-2">Order Summary</h4>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span>{item.name} × {item.quantity}</span>
                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-secondary-200 mt-3 pt-3">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  {formatPrice(getTotal())}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-secondary-900">Customer Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Full Name"
                type="input"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                required
              />
              <FormField
                label="Email"
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                required
              />
              <FormField
                label="Phone"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                required
              />
            </div>
            <FormField
              label="Address"
              type="input"
              value={customerInfo.address}
              onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-secondary-200">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsCheckoutOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <ApperIcon name="Loader2" className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ApperIcon name="CreditCard" className="h-4 w-4 mr-2" />
                  Place Order
                </>
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ShoppingCart;