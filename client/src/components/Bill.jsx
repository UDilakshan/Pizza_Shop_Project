import React from "react";
import { jsPDF } from "jspdf";
import logo from "../assets/images/OtherImages/Logo.png";  // Ensure the path is correct

const Bill = ({ orderDetails, onClose }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    
    // Get current date and time
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    
    // Header Section: Add Logo
    const logoWidth = 40;
    const logoHeight = 40;
    doc.addImage(logo, "PNG", margin, margin, logoWidth, logoHeight);

    // Company details and title
    doc.setFontSize(16);
    doc.setFont("times", "bold");
    doc.text("O'Pizza", margin + logoWidth + 10, margin + 10);
    
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("15/2, 10th lane, Thalankavil Pillayar road,", margin + logoWidth + 10, margin + 20);
    doc.text("Thirunelvely-East, Jaffna", margin + logoWidth + 10, margin + 25);
    doc.text("Phone: +94 777134777", margin + logoWidth + 10, margin + 30);
    doc.text("Email: opizzashop@gmail.com", margin + logoWidth + 10, margin + 35);

    // Date and Time at Top-Right Corner
    const dateText = `Date: ${formattedDate}`;
    const timeText = `Time: ${formattedTime}`;
    const dateWidth = doc.getTextWidth(dateText);
    const timeWidth = doc.getTextWidth(timeText);
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text(dateText, pageWidth - margin - dateWidth, margin + 10);
    doc.text(timeText, pageWidth - margin - timeWidth, margin + 15);

    // Line Separator
    doc.setLineWidth(0.5);
    doc.line(margin, margin + 45, pageWidth - margin, margin + 45);

    // Order Details Section
    const yStart = margin + 55;
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("Order Details", margin, yStart);

    doc.setFont("times", "normal");
    const orderName = `Name: ${orderDetails.name || "N/A"}`;
    const orderAddress = `Address: ${orderDetails.address}`;
    const orderPhone = `Phone: ${orderDetails.phone || "N/A"}`;
    doc.text(orderName, margin, yStart + 10);
    doc.text(orderAddress, margin, yStart + 20);
    doc.text(orderPhone, margin, yStart + 30);

    // Items Table Section
    const tableStartY = yStart + 50;
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    doc.text("Items Purchased", margin, tableStartY);
    let currentY = tableStartY + 10;

    // Table Headers
    doc.setFontSize(10);
    doc.text("Item", margin, currentY);
    doc.text("Qty", pageWidth / 2 - 10, currentY);
    doc.text("Price", pageWidth - margin - 30, currentY, { align: "right" });
    currentY += 10;

    doc.setFont("times", "normal");
    orderDetails.cart.forEach((item, index) => {
      const itemText = item.product_name || "N/A";
      const itemQty = item.quantity || 0;
      const itemPrice = `Rs ${item.usualPrice * itemQty}/=`;

      doc.text(itemText, margin, currentY);
      doc.text(`${itemQty}`, pageWidth / 2 - 10, currentY);
      doc.text(itemPrice, pageWidth - margin - 30, currentY, { align: "right" });

      currentY += 10;
    });

    // Total Calculation Section
    const totalAmount = `Rs ${orderDetails.total}/=`;
    doc.setFont("times", "bold");
    doc.text(`Total: ${totalAmount}`, margin, currentY + 10);

    // Footer Section: Thank You Message
    const footerY = currentY + 20;
    doc.setFontSize(10);
    doc.setFont("times", "normal");
    doc.text("Thank you for shopping with us!", margin, footerY);
    doc.text("We look forward to serving you again!", margin, footerY + 5);

    // Save the PDF
    doc.save(`Bill_${new Date().toISOString()}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-[400px] w-full">
        <h2 className="text-xl font-semibold mb-4">Order Bill</h2>
        <div className="mb-4">
          <p><strong>Name:</strong> {orderDetails.name}</p>
          <p><strong>Address:</strong>{orderDetails.address}</p>
          <p><strong>Phone:</strong> {orderDetails.phone}</p>
        </div>
        <div className="mb-4">
          <h3 className="font-bold">Items:</h3>
          {orderDetails.cart.map((item, index) => (
            <p key={index}>
              {item.product_name} (x{item.quantity}): Rs {item.usualPrice * item.quantity}/=
            </p>
          ))}
        </div>
        <div className="mb-4">
          <p><strong>Total:</strong> Rs {orderDetails.total}/=</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="mr-4 bg-gray-300 px-4 py-2 rounded"
          >
            Close
          </button>
          <button
            onClick={generatePDF}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Bill;
