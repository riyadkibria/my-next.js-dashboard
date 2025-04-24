"use client";

import React from "react";

interface SidebarProps {
  onSelect: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  return (
    <aside className="w-64 fixed top-0 left-0 h-screen bg-white border-r border-gray-200 shadow-lg flex flex-col z-20 p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h2>
      <nav className="flex flex-col gap-3">
        <button
          onClick={() => onSelect("requests")}
          className="text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          📋 Requests
        </button>
        <button
          onClick={() => onSelect("analytics")}
          className="text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          📊 Analytics
        </button>
        <button
          onClick={() => onSelect("finance")}
          className="text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          💰 Finance
        </button>
        <button
          onClick={() => onSelect("customers")}
          className="text-left px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
        >
          👥 Customers
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
