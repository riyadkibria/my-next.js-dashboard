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
    // Manually trigger the print dialog with only the invoice content
    const printWindow = window.open('', '', 'width=600,height=600');
    printWindow?.document.write(`
      <html>
        <head>
          <style>
            body { font-family: 'Arial', sans-serif; margin: 40px; color: #333; background-color: #f7f7f7; }
            h1 { font-size: 28px; color: #2c3e50; margin-bottom: 20px; }
            h2 { font-size: 24px; color: #16a085; margin-bottom: 10px; }
            p { font-size: 16px; line-height: 1.6; margin-bottom: 15px; }
            .invoice { border: 1px solid #e1e1e1; background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
            .invoice-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
            .invoice-header div { max-width: 200px; }
            .invoice-header h2 { font-size: 32px; font-weight: bold; color: #16a085; }
            .invoice-header p { font-size: 16px; margin-bottom: 8px; }
            .invoice-detail { margin-top: 30px; }
            .invoice-detail p { font-size: 18px; font-weight: 500; }
            .invoice-detail div { margin-bottom: 12px; }
            .footer { margin-top: 30px; text-align: center; color: #888; font-size: 14px; }
            .invoice-table { width: 100%; margin-top: 30px; border-collapse: collapse; }
            .invoice-table th, .invoice-table td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            .invoice-table th { background-color: #16a085; color: white; }
            .invoice-table td { background-color: #fafafa; }
            .btn { padding: 10px 20px; background-color: #16a085; color: white; border: none; border-radius: 5px; cursor: pointer; }
            .btn:hover { background-color: #1abc9c; }
            .invoice-icon { font-size: 24px; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="invoice-header">
              <div>
                <h2>Invoice</h2>
                <p><strong>Customer:</strong> ${request["Customer-Name"]}</p>
                <p><strong>Email:</strong> ${request["User-Email"]}</p>
                <p><strong>Phone:</strong> ${request["Phone-Number"]}</p>
                <p><strong>Address:</strong> ${request["Address"]}</p>
              </div>
              <div>
                <h2>Order Summary</h2>
                <p><strong>Courier:</strong> ${request["Courier"]}</p>
                <p><strong>Quantity:</strong> ${request["Quantity"]}</p>
                <p><strong>Time:</strong> ${new Date(request["Time"].seconds * 1000).toLocaleString()}</p>
              </div>
            </div>

            <div class="invoice-detail">
              <p><strong>Products:</strong></p>
              <div>${Array.isArray(request["Product-Name"]) ? request["Product-Name"].join(", ") : request["Product-Name"]}</div>
            </div>

            <table class="invoice-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${Array.isArray(request["Product-Name"]) ? request["Product-Name"].join(", ") : request["Product-Name"]}</td>
                  <td>${request["Quantity"]}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              <p>Thank you for your order!</p>
            </div>
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
      <div className="w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">User Requests</h2>

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
                      {/* Replace text button with an invoice icon */}
                      <span
                        onClick={() => handlePrintInvoice(request)}
                        className="invoice-icon text-blue-600 cursor-pointer"
                        title="Generate Invoice"
                      >
                        📄
                      </span>
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
