import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ErrorPage = () => {
  const [searchParams] = useSearchParams();
  const errorMessage = searchParams.get('message') || 'An authentication error occurred';
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div className="w-full max-w-md p-8 bg-gradient-to-br from-white to-secondary-50 rounded-2xl shadow-2xl text-center border border-secondary-200">
        <div className="mb-6">
          <div className="bg-gradient-to-br from-error-500 to-error-600 p-3 rounded-2xl shadow-lg mx-auto w-fit">
            <ApperIcon name="AlertTriangle" className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-error-600 mb-4">Authentication Error</h1>
        <p className="text-secondary-700 mb-6">{errorMessage}</p>
        <Button asChild className="w-full">
          <Link to="/login">
            <ApperIcon name="ArrowLeft" className="h-4 w-4 mr-2" />
            Return to Login
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;