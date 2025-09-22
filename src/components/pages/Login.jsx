import { useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '@/App';
import ApperIcon from '@/components/ApperIcon';

function Login() {
  const { isInitialized } = useContext(AuthContext);
  
  useEffect(() => {
    if (isInitialized) {
      // Show login UI in this component
      const { ApperUI } = window.ApperSDK;
      ApperUI.showLogin("#authentication");
    }
  }, [isInitialized]);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-gradient-to-br from-white to-secondary-50 rounded-2xl shadow-2xl border border-secondary-200">
        <div className="flex flex-col gap-6 items-center justify-center">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-3 rounded-2xl shadow-lg">
            <ApperIcon name="Package" className="h-8 w-8 text-white" />
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <div className="text-center text-2xl xl:text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              StockFlow
            </div>
            <div className="text-center text-sm text-secondary-500 mt-2">
              Welcome back, please sign in to continue
            </div>
          </div>
        </div>
        <div id="authentication" />
        <div className="text-center mt-6">
          <p className="text-sm text-secondary-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-700 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;