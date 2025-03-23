// components/Dashboard.js
import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Transaction Summary Card */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Transaction Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Transactions:</span>
              <span className="font-bold">150</span>
            </div>
            <div className="flex justify-between">
              <span>Pending:</span>
              <span className="font-bold text-yellow-500">25</span>
            </div>
            <div className="flex justify-between">
              <span>Closed:</span>
              <span className="font-bold text-green-500">125</span>
            </div>
          </div>
        </div>

        {/* Live Notifications Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Live Notifications</h2>
          <div className="space-y-4 max-h-64 overflow-y-auto">
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm">New task assigned: Review Contract #123</p>
              <span className="text-xs text-gray-500">2 mins ago</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm">Transaction #456 updated</p>
              <span className="text-xs text-gray-500">10 mins ago</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <p className="text-sm">Document approval needed for #789</p>
              <span className="text-xs text-gray-500">15 mins ago</span>
            </div>
          </div>
        </div>

        {/* AI-Powered Alerts */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">AI-Powered Alerts</h2>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 rounded-md text-red-700">
              <p className="text-sm">Missing documents for #901</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-md text-yellow-700">
              <p className="text-sm">Predicted delay in #234</p>
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white p-6 rounded-lg shadow-md md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
              Create New Transaction
            </button>
            <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition">
              Upload Documents
            </button>
            <button className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition">
              File Complaint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;