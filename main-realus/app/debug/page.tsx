"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  const [localStorageData, setLocalStorageData] = useState<Record<string, string>>({})
  
  useEffect(() => {
    // Get all localStorage items
    const items: Record<string, string> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        items[key] = localStorage.getItem(key) || ''
      }
    }
    setLocalStorageData(items)
  }, [])
  
  const clearLocalStorage = () => {
    localStorage.clear()
    setLocalStorageData({})
  }
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Debug Information</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>LocalStorage Data</CardTitle>
          <CardDescription>
            Current data stored in localStorage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(localStorageData).length === 0 ? (
            <p>No data in localStorage</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(localStorageData).map(([key, value]) => (
                <div key={key} className="border p-4 rounded">
                  <h3 className="font-bold">{key}</h3>
                  <pre className="bg-gray-100 p-2 mt-2 rounded overflow-auto max-h-40">
                    {typeof value === 'string' && value.startsWith('{') 
                      ? JSON.stringify(JSON.parse(value), null, 2) 
                      : value}
                  </pre>
                </div>
              ))}
              
              <Button variant="destructive" onClick={clearLocalStorage}>
                Clear LocalStorage
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}