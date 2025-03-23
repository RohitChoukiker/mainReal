"use client"

// import React, { useState } from 'react';

// const AgentForm: React.FC = () => {
//   const [formData, setFormData] = useState({
//     propertyAddress: '',
//     propertyType: '',
//     propertySize: '',
//     listingPrice: '',
//     mlsNumber: '',
//     buyerName: '',
//     buyerEmail: '',
//     buyerPhone: '',
//     buyerAddress: '',
//     sellerName: '',
//     sellerEmail: '',
//     sellerPhone: '',
//     sellerAddress: '',
//     transactionType: '',
//     transactionDate: '',
//     expectedClosingDate: '',
//     paymentMethod: '',
//     transactionCoordinator: '',
//   });

//   const [files, setFiles] = useState<File[]>([]);
//   const [transactionId, setTransactionId] = useState<string | null>(null);
//   const [showPopup, setShowPopup] = useState(false);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) {
//       setFiles(Array.from(e.target.files));
//     }
//   };

//   // AI-Suggested Documents Logic
//   const getSuggestedDocuments = () => {
//     const { propertyType, transactionType } = formData;
//     let suggestions = ['Purchase Agreement', 'Property Disclosure Statement', 'Title Report'];

//     if (transactionType === 'Buy') {
//       suggestions.push('Loan Pre-Approval Letter', 'Proof of Funds');
//     }
//     if (transactionType === 'Sell') {
//       suggestions.push('Inspection Report');
//     }
//     if (propertyType === 'Commercial') {
//       suggestions.push('Zoning Documents', 'Environmental Report');
//     }

//     return suggestions;
//   };

//   const generateTransactionId = () => {
//     return `TXN-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${Date.now()}`;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const newTransactionId = generateTransactionId();
//     setTransactionId(newTransactionId);
//     setShowPopup(true);
//     console.log('Form Data:', formData);
//     console.log('Uploaded Files:', files);
//     console.log('Transaction ID:', newTransactionId);
//     // Add your API submission logic here
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     setFormData({
//       propertyAddress: '',
//       propertyType: '',
//       propertySize: '',
//       listingPrice: '',
//       mlsNumber: '',
//       buyerName: '',
//       buyerEmail: '',
//       buyerPhone: '',
//       buyerAddress: '',
//       sellerName: '',
//       sellerEmail: '',
//       sellerPhone: '',
//       sellerAddress: '',
//       transactionType: '',
//       transactionDate: '',
//       expectedClosingDate: '',
//       paymentMethod: '',
//       transactionCoordinator: '',
//     });
//     setFiles([]);
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
//       <h1 className="text-2xl font-bold mb-6 text-center">Transaction Form</h1>
//       <form onSubmit={handleSubmit} className="space-y-8">
//         {/* Property Details */}
//         <section>
//           <h2 className="text-xl font-semibold mb-4">Property Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium mb-1" htmlFor="propertyAddress">
//                 Property Address
//               </label>
//               <textarea
//                 id="propertyAddress"
//                 name="propertyAddress"
//                 value={formData.propertyAddress}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows={2}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="propertyType">
//                 Property Type
//               </label>
//               <select
//                 id="propertyType"
//                 name="propertyType"
//                 value={formData.propertyType}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="House">House</option>
//                 <option value="Apartment">Apartment</option>
//                 <option value="Commercial">Commercial</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="propertySize">
//                 Property Size (Sq. Ft.)
//               </label>
//               <input
//                 type="number"
//                 id="propertySize"
//                 name="propertySize"
//                 value={formData.propertySize}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="listingPrice">
//                 Listing Price
//               </label>
//               <input
//                 type="number"
//                 id="listingPrice"
//                 name="listingPrice"
//                 value={formData.listingPrice}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="mlsNumber">
//                 MLS Number (Optional)
//               </label>
//               <input
//                 type="text"
//                 id="mlsNumber"
//                 name="mlsNumber"
//                 value={formData.mlsNumber}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//         </section>

//         {/* Buyer Info */}
//         <section>
//           <h2 className="text-xl font-semibold mb-4">Buyer Info</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="buyerName">
//                 Buyer Name
//               </label>
//               <input
//                 type="text"
//                 id="buyerName"
//                 name="buyerName"
//                 value={formData.buyerName}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="buyerEmail">
//                 Buyer Email
//               </label>
//               <input
//                 type="email"
//                 id="buyerEmail"
//                 name="buyerEmail"
//                 value={formData.buyerEmail}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="buyerPhone">
//                 Buyer Phone Number
//               </label>
//               <input
//                 type="tel"
//                 id="buyerPhone"
//                 name="buyerPhone"
//                 value={formData.buyerPhone}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium mb-1" htmlFor="buyerAddress">
//                 Buyer Address
//               </label>
//               <textarea
//                 id="buyerAddress"
//                 name="buyerAddress"
//                 value={formData.buyerAddress}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows={2}
//                 required
//               />
//             </div>
//           </div>
//         </section>

//         {/* Seller Info */}
//         <section>
//           <h2 className="text-xl font-semibold mb-4">Seller Info</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="sellerName">
//                 Seller Name
//               </label>
//               <input
//                 type="text"
//                 id="sellerName"
//                 name="sellerName"
//                 value={formData.sellerName}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="sellerEmail">
//                 Seller Email
//               </label>
//               <input
//                 type="email"
//                 id="sellerEmail"
//                 name="sellerEmail"
//                 value={formData.sellerEmail}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="sellerPhone">
//                 Seller Phone Number
//               </label>
//               <input
//                 type="tel"
//                 id="sellerPhone"
//                 name="sellerPhone"
//                 value={formData.sellerPhone}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium mb-1" htmlFor="sellerAddress">
//                 Seller Address
//               </label>
//               <textarea
//                 id="sellerAddress"
//                 name="sellerAddress"
//                 value={formData.sellerAddress}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 rows={2}
//                 required
//               />
//             </div>
//           </div>
//         </section>

//         {/* Transaction Details */}
//         <section>
//           <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="transactionType">
//                 Transaction Type
//               </label>
//               <select
//                 id="transactionType"
//                 name="transactionType"
//                 value={formData.transactionType}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               >
//                 <option value="">Select Type</option>
//                 <option value="Buy">Buy</option>
//                 <option value="Sell">Sell</option>
//                 <option value="Rent">Rent</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="transactionDate">
//                 Transaction Date
//               </label>
//               <input
//                 type="date"
//                 id="transactionDate"
//                 name="transactionDate"
//                 value={formData.transactionDate}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="expectedClosingDate">
//                 Expected Closing Date
//               </label>
//               <input
//                 type="date"
//                 id="expectedClosingDate"
//                 name="expectedClosingDate"
//                 value={formData.expectedClosingDate}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-1" htmlFor="paymentMethod">
//                 Payment Method
//               </label>
//               <select
//                 id="paymentMethod"
//                 name="paymentMethod"
//                 value={formData.paymentMethod}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               >
//                 <option value="">Select Method</option>
//                 <option value="Cash">Cash</option>
//                 <option value="Mortgage">Mortgage</option>
//                 <option value="Other">Other</option>
//               </select>
//             </div>
//             <div className="md:col-span-2">
//               <label className="block text-sm font-medium mb-1" htmlFor="transactionCoordinator">
//                 Assigned Transaction Coordinator (Optional)
//               </label>
//               <input
//                 type="text"
//                 id="transactionCoordinator"
//                 name="transactionCoordinator"
//                 value={formData.transactionCoordinator}
//                 onChange={handleInputChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//         </section>

//         {/* AI-Suggested Required Documents */}
//         <section>
//           <h2 className="text-xl font-semibold mb-4">AI-Suggested Required Documents</h2>
//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-1">Upload Documents</label>
//               <input
//                 type="file"
//                 multiple
//                 accept=".pdf,.doc,.docx,.jpg,.png"
//                 onChange={handleFileChange}
//                 className="w-full p-2 border rounded-md"
//               />
//               <p className="text-sm text-gray-500 mt-1">
//                 Suggested Documents: {getSuggestedDocuments().join(', ')}
//               </p>
//             </div>
//             {files.length > 0 && (
//               <ul className="list-disc pl-5 text-sm text-gray-700">
//                 {files.map((file, index) => (
//                   <li key={index}>{file.name}</li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </section>

//         {/* Submit Button */}
//         <div className="text-center">
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
//           >
//             Submit Transaction
//           </button>
//         </div>
//       </form>

//       {/* Success Confirmation Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
//             <h2 className="text-xl font-bold mb-4">Transaction Created Successfully! 🎉</h2>
//             <p className="text-gray-700 mb-4">
//               Your Transaction ID: <span className="font-semibold">{transactionId}</span>
//             </p>
//             <button
//               onClick={closePopup}
//               className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AgentForm;










import React, { useState } from 'react';

const AgentForm: React.FC = () => {
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientAddress: '',
    propertyAddress: '',
    propertyType: '',
    propertySize: '',
    listingPrice: '',
    mlsNumber: '',
    transactionType: '',
    transactionDate: '',
    expectedClosingDate: '',
    paymentMethod: '',
    transactionCoordinator: '',
  });

  const [files, setFiles] = useState<File[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Uploaded Files:', files);
    // Add your form submission logic here (e.g., API call)
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Agent Transaction Form</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Client Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Client Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="clientName">Client Name</label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="clientEmail">Client Email</label>
              <input
                type="email"
                id="clientEmail"
                name="clientEmail"
                value={formData.clientEmail}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="clientPhone">Client Phone Number</label>
              <input
                type="tel"
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="clientAddress">Client Address</label>
              <textarea
                id="clientAddress"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                required
              />
            </div>
          </div>
        </section>

        {/* Property Details */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Property Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="propertyAddress">Property Address</label>
              <textarea
                id="propertyAddress"
                name="propertyAddress"
                value={formData.propertyAddress}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="propertyType">Property Type</label>
              <select
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="House">House</option>
                <option value="Apartment">Apartment</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="propertySize">Property Size (Sq. Ft.)</label>
              <input
                type="number"
                id="propertySize"
                name="propertySize"
                value={formData.propertySize}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="listingPrice">Listing Price</label>
              <input
                type="number"
                id="listingPrice"
                name="listingPrice"
                value={formData.listingPrice}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="mlsNumber">MLS Number (Optional)</label>
              <input
                type="text"
                id="mlsNumber"
                name="mlsNumber"
                value={formData.mlsNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Transaction Details */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Transaction Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="transactionType">Transaction Type</label>
              <select
                id="transactionType"
                name="transactionType"
                value={formData.transactionType}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Type</option>
                <option value="Buy">Buy</option>
                <option value="Sell">Sell</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="transactionDate">Transaction Date</label>
              <input
                type="date"
                id="transactionDate"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="expectedClosingDate">Expected Closing Date</label>
              <input
                type="date"
                id="expectedClosingDate"
                name="expectedClosingDate"
                value={formData.expectedClosingDate}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="paymentMethod">Payment Method</label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Method</option>
                <option value="Cash">Cash</option>
                <option value="Mortgage">Mortgage</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1" htmlFor="transactionCoordinator">Assigned Transaction Coordinator (Optional)</label>
              <input
                type="text"
                id="transactionCoordinator"
                name="transactionCoordinator"
                value={formData.transactionCoordinator}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </section>

        {/* Required Documents Upload */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Required Documents Upload</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Upload Documents</label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.png"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-md"
              />
              <p className="text-sm text-gray-500 mt-1">
                Accepted files: Purchase Agreement, Loan Pre-Approval Letter, Proof of Funds, Inspection Report, Property Disclosure Statement, Title Report
              </p>
            </div>
            {files.length > 0 && (
              <ul className="list-disc pl-5 text-sm text-gray-700">
                {files.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Submit Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentForm;