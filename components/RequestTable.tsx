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

  const handlePrintInvoice = (request: RequestData) => {
    setSelectedRequest(request);

    // Manually trigger the print dialog with only the invoice content
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow?.document.write(`
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { font-size: 24px; margin-bottom: 10px; }
            p { font-size: 16px; margin-bottom: 8px; }
            .invoice { border: 1px solid #ddd; padding: 20px; margin-bottom: 20px; }
            .invoice p { font-size: 14px; margin: 4px 0; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <h1>Invoice</h1>
            <p><strong>Customer:</strong> ${request["Customer-Name"]}</p>
            <p><strong>Email:</strong> ${request["User-Email"]}</p>
            <p><strong>Phone:</strong> ${request["Phone-Number"]}</p>
            <p><strong>Address:</strong> ${request["Address"]}</p>
            <p><strong>Product:</strong> ${
              Array.isArray(request["Product-Name"])
                ? request["Product-Name"].join(", ")
                : request["Product-Name"]
            }</p>
            <p><strong>Quantity:</strong> ${request["Quantity"]}</p>
            <p><strong>Time:</strong> ${new Date(request["Time"].seconds * 1000).toLocaleString()}</p>
          </div>
          <script>
            window.print();
            window.onafterprint = function () { window.close(); };
          </script>
        </body>
      </html>
    `);
  };

  return (
    <>
      {/* Main Page Content */}
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Requests</h2>

        {/* Request Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-200">
          <table className="w-full text-sm text-gray-800 divide-y divide-gray-200">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-3 py-2">Customer</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone</th>
                <th className="px-3 py-2">Address</th>
                <th className="px-3 py-2">Courier</th>
                <th className="px-3 py-2">Product</th>
                <th className="px-3 py-2">Quantity</th>
                <th className="px-3 py-2">Time</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr key={request.id}>
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
                        onClick={() => handlePrintInvoice(request)}
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
      </div>
    </>
  );
};

export default RequestTable;

