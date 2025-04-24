"use client";

import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

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
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);

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

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">User Requests</h2>
      <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-200">
        <table className="w-full text-sm text-gray-800 divide-y divide-gray-200">
          <thead className="bg-blue-500 text-white">
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
                      onClick={() => setSelectedRequest(request)}
                      className="text-blue-600 hover:underline"
                    >
                      Create Invoice
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
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Invoice Preview</h3>
            <p><strong>Customer:</strong> {selectedRequest["Customer-Name"]}</p>
            <p><strong>Email:</strong> {selectedRequest["User-Email"]}</p>
            <p><strong>Phone:</strong> {selectedRequest["Phone-Number"]}</p>
            <p><strong>Address:</strong> {selectedRequest["Address"]}</p>
            <p><strong>Courier:</strong> {selectedRequest["Courier"]}</p>
            <p>
              <strong>Product:</strong>{" "}
              {Array.isArray(selectedRequest["Product-Name"])
                ? selectedRequest["Product-Name"].join(", ")
                : selectedRequest["Product-Name"]}
            </p>
            <p><strong>Quantity:</strong> {selectedRequest["Quantity"]}</p>
            <p>
              <strong>Time:</strong>{" "}
              {new Date(selectedRequest["Time"].seconds * 1000).toLocaleString()}
            </p>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestTable;
