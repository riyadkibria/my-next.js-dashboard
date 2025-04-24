"use client";

import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Define the RequestData type
interface RequestData {
  id: string;
  "Customer-Name": string;
  "User-Email": string;
  "Phone-Number": string;
  Address: string;
  Courier: string;
  "Product-Name": string[] | string;
  Quantity: string;
  Time: { seconds: number };
}

const RequestTable = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceData, setSelectedInvoiceData] = useState<RequestData | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      const querySnapshot = await getDocs(collection(db, "user_request"));
      const requestsData: RequestData[] = [];
      querySnapshot.forEach((doc) => {
        requestsData.push({ id: doc.id, ...doc.data() } as RequestData);
      });
      setRequests(requestsData);
    };

    fetchRequests();
  }, []);

  const handleInvoiceClick = (request: RequestData) => {
    setSelectedInvoiceData(request);
    setIsModalOpen(true);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Requests</h2>
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-200">
        <table className="w-full text-sm text-gray-800 divide-y divide-gray-200">
          <thead className="bg-blue-500">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Customer</th>
              <th className="px-3 py-2 text-left font-medium">Email</th>
              <th className="px-3 py-2 text-left font-medium">Phone</th>
              <th className="px-3 py-2 text-left font-medium">Address</th>
              <th className="px-3 py-2 text-left font-medium">Courier</th>
              <th className="px-3 py-2 text-left font-medium">Product</th>
              <th className="px-3 py-2 text-left font-medium">Quantity</th>
              <th className="px-3 py-2 text-left font-medium">Time</th>
              <th className="px-3 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {requests.length > 0 ? (
              requests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-2">{request["Customer-Name"]}</td>
                  <td className="px-3 py-2">{request["User-Email"]}</td>
                  <td className="px-3 py-2">{request["Phone-Number"]}</td>
                  <td className="px-3 py-2">{request["Address"]}</td>
                  <td className="px-3 py-2">{request["Courier"]}</td>
                  <td className="px-3 py-2">
                    {Array.isArray(request["Product-Name"])
                      ? request["Product-Name"].join(", ")
                      : request["Product-Name"]}
                  </td>
                  <td className="px-3 py-2">{request["Quantity"]}</td>
                  <td className="px-3 py-2">
                    {new Date(request["Time"].seconds * 1000).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleInvoiceClick(request)}
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      <FaFileInvoice className="text-xl" /> Create Invoice
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-4 py-4 text-center text-gray-400">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceData && (
        <InvoiceModal
          data={selectedInvoiceData}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default RequestTable;

