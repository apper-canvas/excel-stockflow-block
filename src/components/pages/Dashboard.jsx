import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import DashboardStats from "@/components/organisms/DashboardStats";
import ApperIcon from "@/components/ApperIcon";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <Card className="bg-gradient-to-r from-primary-50 via-white to-secondary-50 border-primary-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2">
                Welcome to StockFlow
              </h1>
              <p className="text-secondary-600 text-lg">
                Manage your inventory and track your business performance
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-4 rounded-2xl shadow-lg">
                <ApperIcon name="BarChart3" className="h-8 w-8 text-white" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Dashboard Statistics */}
      <DashboardStats />

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold text-secondary-900 flex items-center">
            <ApperIcon name="Zap" className="h-6 w-6 mr-3 text-primary-500" />
            Quick Actions
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <ApperIcon name="Plus" className="h-8 w-8 text-primary-600 mb-3" />
              <h3 className="font-semibold text-secondary-900 mb-1">Add Product</h3>
              <p className="text-sm text-secondary-600">Add new items to your inventory</p>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <ApperIcon name="Package" className="h-8 w-8 text-secondary-600 mb-3" />
              <h3 className="font-semibold text-secondary-900 mb-1">Manage Stock</h3>
              <p className="text-sm text-secondary-600">Update inventory levels</p>
            </div>
            
            <div className="p-6 bg-gradient-to-r from-success-50 to-success-100 rounded-xl border border-success-200 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <ApperIcon name="ShoppingCart" className="h-8 w-8 text-success-600 mb-3" />
              <h3 className="font-semibold text-secondary-900 mb-1">View Orders</h3>
              <p className="text-sm text-secondary-600">Process customer orders</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;