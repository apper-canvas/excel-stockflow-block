import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { useCart } from "@/hooks/useCart";

const Header = ({ currentView, onViewChange }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCart();
  
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const adminNavItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/inventory", label: "Inventory", icon: "Package" },
    { path: "/orders", label: "Orders", icon: "ShoppingCart" }
  ];

  const customerNavItems = [
    { path: "/shop", label: "Shop", icon: "Store" },
    { path: "/cart", label: "Cart", icon: "ShoppingBag" }
  ];

  const navItems = currentView === "admin" ? adminNavItems : customerNavItems;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-gradient-to-r from-white via-primary-50 to-secondary-50 border-b border-secondary-200 shadow-lg sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-2 rounded-xl shadow-lg">
              <ApperIcon name="Package" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                StockFlow
              </h1>
              <p className="text-xs text-secondary-500 -mt-1">
                {currentView === "admin" ? "Admin Panel" : "Shop"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800 shadow-md"
                      : "text-secondary-600 hover:bg-gradient-to-r hover:from-secondary-50 hover:to-secondary-100 hover:text-secondary-800"
                  }`}
                >
                  <ApperIcon name={item.icon} className="h-4 w-4 mr-2" />
                  {item.label}
                  {item.label === "Cart" && cartItemCount > 0 && (
                    <Badge variant="error" size="sm" className="ml-2">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* View Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewChange(currentView === "admin" ? "customer" : "admin")}
              className="hidden sm:flex"
            >
              <ApperIcon 
                name={currentView === "admin" ? "Store" : "Settings"} 
                className="h-4 w-4 mr-2" 
              />
              {currentView === "admin" ? "Shop View" : "Admin View"}
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              <ApperIcon name={mobileMenuOpen ? "X" : "Menu"} className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-secondary-200">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800"
                      : "text-secondary-600 hover:bg-gradient-to-r hover:from-secondary-50 hover:to-secondary-100"
                  }`}
                >
                  <ApperIcon name={item.icon} className="h-5 w-5 mr-3" />
                  {item.label}
                  {item.label === "Cart" && cartItemCount > 0 && (
                    <Badge variant="error" size="sm" className="ml-auto">
                      {cartItemCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
            <div className="pt-3 border-t border-secondary-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onViewChange(currentView === "admin" ? "customer" : "admin");
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-center"
              >
                <ApperIcon 
                  name={currentView === "admin" ? "Store" : "Settings"} 
                  className="h-4 w-4 mr-2" 
                />
                Switch to {currentView === "admin" ? "Shop View" : "Admin View"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;