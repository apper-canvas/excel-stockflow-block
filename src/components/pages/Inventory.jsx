import { Card, CardContent, CardHeader } from "@/components/atoms/Card";
import ProductList from "@/components/organisms/ProductList";
import ApperIcon from "@/components/ApperIcon";

const Inventory = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <Card className="bg-gradient-to-r from-secondary-50 via-white to-primary-50 border-secondary-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900 mb-2 flex items-center">
                <ApperIcon name="Package" className="h-8 w-8 mr-3 text-primary-500" />
                Inventory Management
              </h1>
              <p className="text-secondary-600 text-lg">
                Manage your products, track stock levels, and organize your catalog
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Product Management */}
      <ProductList view="admin" />
    </div>
  );
};

export default Inventory;