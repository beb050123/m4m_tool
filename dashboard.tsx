"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { convertXmlToJson } from "@/lib/xml-to-json"
import { countries } from "@/lib/countries"

export default function Dashboard() {
  const [xmlContent, setXmlContent] = useState("")
  const [jsonResult, setJsonResult] = useState("")
  const [country, setCountry] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/auth")
    }
  }, [router])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setXmlContent(content)
    }
    reader.readAsText(file)
  }

  const handleConvert = async () => {
    if (!xmlContent) return

    setIsLoading(true)
    try {
      const result = await convertXmlToJson(xmlContent, country)
      setJsonResult(JSON.stringify(result, null, 2))
    } catch (error) {
      setJsonResult(`Error: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">XML to JSON Converter</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upload XML</CardTitle>
              <CardDescription>Upload an XML file to convert to JSON</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Upload XML File</Label>
                <div className="mt-1">
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xml"
                    onChange={handleFileUpload}
                    className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 file:mr-4 file:rounded-l-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Select Country</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((c) => (
                      <SelectItem key={c.code} value={c.code}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {xmlContent && (
                <div className="space-y-2">
                  <Label htmlFor="xml-content">XML Content</Label>
                  <Textarea
                    id="xml-content"
                    value={xmlContent}
                    onChange={(e) => setXmlContent(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                  />
                </div>
              )}

              <Button onClick={handleConvert} disabled={!xmlContent || isLoading} className="w-full">
                {isLoading ? "Converting..." : "Convert to JSON"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>JSON Result</CardTitle>
              <CardDescription>The converted JSON will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={jsonResult}
                readOnly
                rows={20}
                className="font-mono text-sm"
                placeholder="JSON output will appear here after conversion"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

