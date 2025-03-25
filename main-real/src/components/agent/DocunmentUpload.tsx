 'use client'

 // pages/documents.tsx
 import React, { useState, useCallback } from 'react';
 import { useDropzone } from 'react-dropzone';
 import { FileText, Upload, AlertCircle } from 'lucide-react';
 
 interface Document {
   id: string;
   name: string;
   status: 'pending' | 'approved' | 'rejected';
   file: File;
   expiryDate?: Date;
   authenticity?: boolean;
   clientId: string;
   transactionId: string;
   documentType: 'title' | 'agreement' | 'id_proof' | 'other';
 }
 
 const DocumentsPage: React.FC = () => {
   const [documents, setDocuments] = useState<Document[]>([]);
   const [isVerifying, setIsVerifying] = useState(false);
   // Sample values for Client ID and Transaction ID
   const [clientId, setClientId] = useState('CLT-2025-001');
   const [transactionId, setTransactionId] = useState('TXN-2025-9876');
   const [docType, setDocType] = useState<Document['documentType']>('id_proof');
 
   // Handle file drop
   const onDrop = useCallback(async (acceptedFiles: File[]) => {
     if (!clientId || !transactionId) {
       alert('Please enter Client ID and Transaction ID first');
       return;
     }
 
     setIsVerifying(true);
     
     const newDocs = acceptedFiles.map(file => ({
       id: Math.random().toString(36).substring(2),
       name: file.name,
       status: 'pending' as const,
       file,
       clientId,
       transactionId,
       documentType: docType,
     }));
 
     setDocuments(prev => [...prev, ...newDocs]);
     
     // Simulate AI verification
     setTimeout(() => {
       verifyDocuments(newDocs);
       setIsVerifying(false);
     }, 2000);
   }, [clientId, transactionId, docType]);
 
   // AI Verification simulation
   const verifyDocuments = (docs: Document[]) => {
     setDocuments(prev => prev.map(doc => {
       if (docs.some(d => d.id === doc.id)) {
         return {
           ...doc,
           status: Math.random() > 0.2 ? 'approved' : 'rejected',
           expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
           authenticity: Math.random() > 0.1
         };
       }
       return doc;
     }));
   };
 
   const { getRootProps, getInputProps, isDragActive } = useDropzone({
     onDrop,
     accept: {
       'application/pdf': ['.pdf'],
       'image/jpeg': ['.jpg', '.jpeg'],
       'image/png': ['.png'],
       'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
     }
   });
 
   // Status Badge Component
   const StatusBadge = ({ status }: { status: Document['status'] }) => {
     const styles = {
       pending: 'bg-yellow-100 text-yellow-800',
       approved: 'bg-green-100 text-green-800',
       rejected: 'bg-red-100 text-red-800'
     };
     
     return (
       <span className={`px-2 py-1 rounded-full text-sm ${styles[status]}`}>
         {status.charAt(0).toUpperCase() + status.slice(1)}
       </span>
     );
   };
 
   return (
     <div className="container mx-auto p-4 max-w-4xl">
       <h1 className="text-2xl font-bold mb-6">Document Verification</h1>
 
       {/* Client and Transaction Info */}
       <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
             Client ID
           </label>
           <input
             type="text"
             value={clientId}
             onChange={(e) => setClientId(e.target.value)}
             className="w-full p-2 border rounded-md"
             placeholder="e.g., CLT-2025-001"
             required
           />
         </div>
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
             Transaction ID
           </label>
           <input
             type="text"
             value={transactionId}
             onChange={(e) => setTransactionId(e.target.value)}
             className="w-full p-2 border rounded-md"
             placeholder="e.g., TXN-2025-9876"
             required
           />
         </div>
         <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">
             Document Type
           </label>
           <select
             value={docType}
             onChange={(e) => setDocType(e.target.value as Document['documentType'])}
             className="w-full p-2 border rounded-md"
           >
             <option value="id_proof">ID Proof</option>
             <option value="title">Title Document</option>
             <option value="agreement">Agreement</option>
             <option value="other">Other</option>
           </select>
         </div>
       </div>
 
       {/* Drag & Drop Zone */}
       <div
         {...getRootProps()}
         className={`border-2 border-dashed rounded-lg p-8 text-center mb-6
           ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
       >
         <input {...getInputProps()} />
         <Upload className="mx-auto h-12 w-12 text-gray-400" />
         <p className="mt-2 text-sm text-gray-600">
           {isDragActive
             ? 'Drop the files here...'
             : 'Drag & drop files here, or click to select files'}
         </p>
         <p className="text-xs text-gray-500 mt-1">
           Supported formats: PDF, JPEG, PNG, DOCX
         </p>
       </div>
 
       {/* Document List */}
       {documents.length > 0 && (
         <div className="space-y-4">
           {documents.map(doc => (
             <div
               key={doc.id}
               className="flex items-center justify-between p-4 border rounded-lg"
             >
               <div className="flex items-center space-x-3">
                 <FileText className="h-6 w-6 text-gray-400" />
                 <div>
                   <p className="text-sm font-medium">{doc.name}</p>
                   <p className="text-xs text-gray-500">
                     Client: {doc.clientId} | Trans: {doc.transactionId} | Type: {doc.documentType}
                   </p>
                   {doc.expiryDate && (
                     <p className="text-xs text-gray-500">
                       Expires: {doc.expiryDate.toLocaleDateString()}
                     </p>
                   )}
                 </div>
               </div>
               <div className="flex items-center space-x-4">
                 <StatusBadge status={doc.status} />
                 {doc.status === 'rejected' && (
                   <button
                     onClick={() => {/* Handle re-upload */}}
                     className="text-sm text-blue-600 hover:underline"
                   >
                     Re-upload
                   </button>
                 )}
                 {doc.authenticity === false && (
                   <AlertCircle className="h-5 w-5 text-red-500" title="Authenticity failed" />
                 )}
               </div>
             </div>
           ))}
         </div>
       )}
 
       {/* Verification Status */}
       {isVerifying && (
         <div className="mt-4 text-center text-gray-600">
           Verifying documents with AI...
         </div>
       )}
     </div>
   );
 };
 
 export default DocumentsPage;