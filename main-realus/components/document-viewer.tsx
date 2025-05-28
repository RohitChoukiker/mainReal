import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Download, ExternalLink } from "lucide-react";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentName: string;
  fileName?: string;
}

export function DocumentViewer({ isOpen, onClose, documentUrl, documentName, fileName }: DocumentViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerType, setViewerType] = useState<'native' | 'google' | 'pdfjs'>('native');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      setError(null);
      setViewerType('native');
    }
  }, [isOpen, documentUrl]);
  
  const switchToGoogleViewer = () => {
    setViewerType('google');
    setLoading(true);
    setError(null);
  };
  
  const switchToPdfJsViewer = () => {
    setViewerType('pdfjs');
    setLoading(true);
    setError(null);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = fileName || `${documentName}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenExternal = () => {
    window.open(documentUrl, '_blank');
  };

  const handleIframeLoad = () => {
    setLoading(false);
  };

  const handleIframeError = () => {
    setLoading(false);
    setError('Failed to load document. Please try opening it in a new tab.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-col gap-4">
          <div className="flex flex-row items-center justify-between">
            <DialogTitle>{documentName}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={handleDownload} title="Download document">
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleOpenExternal} title="Open in new tab">
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={onClose} title="Close">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {documentUrl.toLowerCase().endsWith('.pdf') && (
            <div className="flex items-center justify-center gap-2 text-sm">
              <span>Viewer:</span>
              <div className="flex border rounded-md overflow-hidden">
                <button 
                  className={`px-3 py-1 ${viewerType === 'native' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => setViewerType('native')}
                >
                  Native
                </button>
                <button 
                  className={`px-3 py-1 ${viewerType === 'pdfjs' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => setViewerType('pdfjs')}
                >
                  PDF.js
                </button>
                <button 
                  className={`px-3 py-1 ${viewerType === 'google' ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}`}
                  onClick={() => setViewerType('google')}
                >
                  Google
                </button>
              </div>
            </div>
          )}
        </DialogHeader>
        
        <div className="flex-1 min-h-[500px] relative border rounded-md overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center">
                <div className="animate-spin h-8 w-8 border-2 border-primary rounded-full border-t-transparent mx-auto mb-2"></div>
                <p>Loading document...</p>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center p-4">
                <p className="text-destructive mb-4">{error}</p>
                <div className="flex flex-col gap-2">
                  <Button onClick={handleOpenExternal}>Open in New Tab</Button>
                  {documentUrl.toLowerCase().endsWith('.pdf') && viewerType === 'native' && (
                    <>
                      <Button variant="outline" onClick={switchToGoogleViewer}>
                        Try Google Docs Viewer
                      </Button>
                      <Button variant="outline" onClick={switchToPdfJsViewer}>
                        Try PDF.js Viewer
                      </Button>
                    </>
                  )}
                  {documentUrl.toLowerCase().endsWith('.pdf') && viewerType === 'google' && (
                    <Button variant="outline" onClick={switchToPdfJsViewer}>
                      Try PDF.js Viewer
                    </Button>
                  )}
                  {documentUrl.toLowerCase().endsWith('.pdf') && viewerType === 'pdfjs' && (
                    <Button variant="outline" onClick={switchToGoogleViewer}>
                      Try Google Docs Viewer
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {documentUrl && (
            documentUrl.toLowerCase().endsWith('.pdf') ? (
              viewerType === 'native' ? (
                // Native PDF viewer using object tag
                <object
                  data={documentUrl}
                  type="application/pdf"
                  className="w-full h-full"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                >
                  <p>Unable to display PDF. <a href={documentUrl} target="_blank" rel="noopener noreferrer">Download</a> instead.</p>
                </object>
              ) : viewerType === 'google' ? (
                // Google Docs Viewer for PDFs
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(documentUrl)}&embedded=true`}
                  className="w-full h-full"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  title={documentName}
                  frameBorder="0"
                />
              ) : (
                // PDF.js viewer for PDFs
                <iframe 
                  src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(documentUrl)}`}
                  className="w-full h-full"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  title={documentName}
                  frameBorder="0"
                />
              )
            ) : (
              // For other file types, use iframe
              <iframe 
                src={documentUrl}
                className="w-full h-full"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={documentName}
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}