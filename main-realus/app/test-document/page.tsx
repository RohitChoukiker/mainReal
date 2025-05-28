"use client"

import React from 'react'
import { Button } from "@/components/ui/button"

export default function TestDocumentPage() {
  const testUrl = "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf"
  
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Document Test Page</h1>
      
      <div className="grid gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Direct Link</h2>
          <a 
            href={testUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Open PDF in New Tab
          </a>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Download Link</h2>
          <a 
            href={testUrl} 
            download="test-document.pdf"
            className="text-blue-600 hover:underline"
          >
            Download PDF
          </a>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Embedded PDF (Object Tag)</h2>
          <div className="border rounded-md p-2 h-[500px]">
            <object
              data={testUrl}
              type="application/pdf"
              className="w-full h-full"
            >
              <p>Unable to display PDF. <a href={testUrl} target="_blank" rel="noopener noreferrer">Download</a> instead.</p>
            </object>
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Embedded PDF (Iframe)</h2>
          <div className="border rounded-md p-2 h-[500px]">
            <iframe
              src={testUrl}
              className="w-full h-full"
              title="Test Document"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">Google Docs Viewer</h2>
          <div className="border rounded-md p-2 h-[500px]">
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(testUrl)}&embedded=true`}
              className="w-full h-full"
              title="Test Document (Google)"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-2">PDF.js Viewer</h2>
          <div className="border rounded-md p-2 h-[500px]">
            <iframe
              src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(testUrl)}`}
              className="w-full h-full"
              title="Test Document (PDF.js)"
            />
          </div>
        </div>
      </div>
    </div>
  )
}