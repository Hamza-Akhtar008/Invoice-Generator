"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CompanyInfo } from "./invoice-generator"

interface CompanyDetailsProps {
  companyInfo: CompanyInfo
  setCompanyInfo: (info: CompanyInfo) => void
}

export function CompanyDetails({ companyInfo, setCompanyInfo }: CompanyDetailsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    })
  }

  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium">Company Information</h3>
      <div className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="company-name" className="text-sm">
            Company Name
          </Label>
          <Input
            id="company-name"
            name="name"
            value={companyInfo.name}
            onChange={handleChange}
            placeholder="Your Company Name"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="company-location" className="text-sm">
            Location
          </Label>
          <Input
            id="company-location"
            name="location"
            value={companyInfo.location}
            onChange={handleChange}
            placeholder="Company Address"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="company-phone" className="text-sm">
            Phone Number
          </Label>
          <Input
            id="company-phone"
            name="phone"
            value={companyInfo.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>
      </div>
    </div>
  )
}
