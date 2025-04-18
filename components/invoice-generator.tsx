"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LogoUpload } from "@/components/logo-upload"
import { CompanyDetails } from "@/components/company-details"
import { ProductTable } from "@/components/product-table"
import { PaymentSummary } from "@/components/payment-summary"
import { PrintButton } from "@/components/print-button"
import { DateTimePicker } from "@/components/date-time-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type Product = {
  id: string
  name: string
  quantity: number
  price: number
  total: number
}

export type CompanyInfo = {
  name: string
  location: string
  phone: string
  welcomeText: string
  thankYouNote: string
}

export type CustomerInfo = {
  name: string
  phone: string
}

export function InvoiceGenerator() {
  const [logo, setLogo] = useState<string | null>(null)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    location: "",
    phone: "",
    welcomeText: "Welcome to",
    thankYouNote: "Thank You",
  })
  const [products, setProducts] = useState<Product[]>([{ id: "1", name: "", quantity: 1, price: 0, total: 0 }])
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash")
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
  })
  const [receiptDate, setReceiptDate] = useState<Date>(new Date())
  const invoiceRef = useRef<HTMLDivElement>(null)

  const formattedDate = receiptDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  const formattedTime = receiptDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })

  const subtotal = products.reduce((sum, product) => sum + product.total, 0)
  const gstRate = paymentMethod === "cash" ? 0.16 : 0.05
  const gstAmount = subtotal * gstRate
  const grandTotal = subtotal + gstAmount

  const orderNumber = Math.floor(10000 + Math.random() * 90000)

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    })
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Receipt Generator</h1>
            <PrintButton targetRef={invoiceRef} />
          </div>

          <div className="mb-4">
            <CompanyDetails companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />
          </div>

          <div className="mb-4">
            <LogoUpload logo={logo} setLogo={setLogo} />
          </div>

          <div className="mb-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="customer-name" className="text-sm">
                    Customer Name
                  </Label>
                  <Input
                    id="customer-name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    placeholder="Customer Name"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="customer-phone" className="text-sm">
                    Phone Number
                  </Label>
                  <Input
                    id="customer-phone"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    placeholder="Phone Number"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Receipt Date & Time</h3>
              <DateTimePicker date={receiptDate} setDate={setReceiptDate} />
            </div>
          </div>

          <div className="mb-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Welcome & Thank You Text</h3>
              <div className="space-y-1">
                <Label htmlFor="welcome-text" className="text-sm">
                  Welcome Text
                </Label>
                <Input
                  id="welcome-text"
                  name="welcomeText"
                  value={companyInfo.welcomeText}
                  onChange={handleCompanyInfoChange}
                  placeholder="Welcome to"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="thank-you-note" className="text-sm">
                  Thank You Note
                </Label>
                <Input
                  id="thank-you-note"
                  name="thankYouNote"
                  value={companyInfo.thankYouNote}
                  onChange={handleCompanyInfoChange}
                  placeholder="Thank You"
                />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <ProductTable products={products} setProducts={setProducts} />
          </div>

          <div>
            <PaymentSummary
              subtotal={subtotal}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              gstAmount={gstAmount}
              grandTotal={grandTotal}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview of the receipt */}
      <div ref={invoiceRef} className="hidden">
        <div className="receipt-container font-mono text-sm max-w-md mx-auto bg-white p-4">
          {/* Header */}
          <div className="text-center mb-4">
            <p className="font-bold">
              {companyInfo.welcomeText} {companyInfo.name || "Your Company"}
            </p>
            {logo && <img src={logo || "/placeholder.svg"} alt="Company Logo" className="h-16 mx-auto my-2" />}
            <p>{companyInfo.location || "Company Location"}</p>

            {/* Customer Details at top right */}
            {(customerInfo.name || customerInfo.phone) && (
              <div className="text-right mt-2">
                <p className="font-bold">Customer Detail</p>
                <p>
                  {customerInfo.name} {customerInfo.phone && `(${customerInfo.phone})`}
                </p>
              </div>
            )}

            <p className="font-bold mt-2">ORDER NUMBER: {orderNumber}</p>
            <div className="flex justify-between mt-2">
              <span>Date: {formattedDate}</span>
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-b border-black py-1 mb-2">
            <div className="flex justify-between text-xs">
              <span>No # Item</span>
              <span>Amount</span>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-4">
            {products.map((product, index) => (
              <div key={product.id} className="flex justify-between">
                <span>
                 {product.quantity} {product.name} 
                </span>
                <span>{product.total.toFixed(0)}</span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-black mb-2"></div>

          {/* Payment Summary */}
          <div className="flex flex-col items-end mb-4">
            <div className="flex justify-between w-full">
              <span>Sub Total:</span>
              <span>{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex justify-between w-full">
              <span>GST ({paymentMethod === "cash" ? "16%" : "5%"}):</span>
              <span>{gstAmount.toFixed(0)}</span>
            </div>
            <div className="flex justify-between w-full font-bold">
              <span>GRAND TOTAL:</span>
              <span>{grandTotal.toFixed(0)}</span>
            </div>
          </div>

          {/* Thank You */}
          <div className="text-center mb-4">
            <p className="font-bold">{companyInfo.thankYouNote}</p>
            <p className="text-xs mt-4">Powered By {companyInfo.name || "Your Company"}</p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs border-t border-black pt-2">
            <p>Contact us: {companyInfo.phone || "Your Phone"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
