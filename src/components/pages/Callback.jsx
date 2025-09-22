import React, { useEffect } from 'react'

const Callback = () => {
  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    ApperUI.showSSOVerify("#authentication-callback");
  }, []);
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <div id="authentication-callback"></div>
    </div>
  )
}

export default Callback