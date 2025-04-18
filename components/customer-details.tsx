"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { CustomerInfo } from "./invoice-generator"

interface CustomerDetailsProps {
  customerInfo: CustomerInfo
  setCustomerInfo: (info: CustomerInfo) => void
}

export function CustomerDetails({ customerInfo, setCustomerInfo }: CustomerDetailsProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo({
      ...customerInfo,
      [name]: value,
    })
  }

  return (
    <div className="space-y-2">
      <h3 className="text-base font-medium">Customer Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="customer-name" className="text-sm">
            Customer Name
          </Label>
          <Input
            id="customer-name"
            name="name"
            value={customerInfo.name}
            onChange={handleChange}
            placeholder="Customer Name"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="customer-phone" className="text-sm">
            Phone Number
          </Label>
          <Input
            id="customer-phone"
            name="phone"
            value={customerInfo.phone}
            onChange={handleChange}
            placeholder="Phone Number"
          />
        </div>
      </div>
    </div>
  )
}
