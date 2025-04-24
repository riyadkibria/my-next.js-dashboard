"use client"; // Add this to mark the component as client-side

import React from "react";
import Sidebar from "../components/sidebar";
import RequestTable from "../components/RequestTable"; // Import the RequestTable component

const DashboardPage = () => {
  const [selectedView, setSelectedView] = React.useState<string>("requests");

  const handleSelectView = (view: string) => {
    setSelectedView(view);
  };

  return (
    <div className="flex">
      {/* Sidebar (Fixed) */}
      <Sidebar onSelect={handleSelectView} />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4">User Dashboard</h1>

        {/* Conditional Rendering based on selected view */}
        {selectedView === "requests" && <RequestTable />}
        {selectedView === "analytics" && (
          <div>
            <h2>Analytics</h2>
            {/* Your analytics content */}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;




