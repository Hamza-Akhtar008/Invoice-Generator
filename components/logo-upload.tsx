"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface LogoUploadProps {
  logo: string | null
  setLogo: (logo: string | null) => void
}

export function LogoUpload({ logo, setLogo }: LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setLogo(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogo(null)
  }

  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium">Company Logo</h3>
      <div className="flex justify-center">
        {logo ? (
          <div className="relative">
            <img
              src={logo || "/placeholder.svg"}
              alt="Company Logo"
              className="max-h-24 max-w-[200px] object-contain"
            />
            <button onClick={removeLogo} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            className={`border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center w-[200px] h-[100px] cursor-pointer ${
              isDragging ? "border-primary bg-primary/10" : "border-gray-300"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-6 w-6 text-gray-400 mb-2" />
            <p className="text-xs text-gray-500 text-center">Drag & drop or click to upload logo</p>
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="logo-upload" />
            <label htmlFor="logo-upload">
              <Button variant="ghost" size="sm" className="mt-1" asChild>
                <span>Browse</span>
              </Button>
            </label>
          </div>
        )}
      </div>
    </div>
  )
}
