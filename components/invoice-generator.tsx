"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { LogoUpload } from "@/components/logo-upload"
import { CompanyDetails } from "@/components/company-details"
import { ProductTable } from "@/components/product-table"
import { PaymentSummary } from "@/components/payment-summary"
import { PrintButton } from "@/components/print-button"
import { DateTimePicker } from "@/components/date-time-picker"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Save, Trash } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export type Product = {
  id: string
  name: string
  quantity: number
  price: number // Price per unit
  tax?: number
  total: number // Total for this product (quantity * price)
}

export type CompanyInfo = {
  name: string
  location: string
  phone: string
  welcomeText: string
  thankYouNote: string
  showAddress: boolean
}

export type ReceiptOptions = {
  orderNumberPosition: "left" | "center" | "right"
  showProductBorders: boolean
  borderStyle: "solid" | "dashed" | "dotted"
  showItemTax: boolean
  fontFamily: string
  taxPercentage: number
  posCharges: number
  showPosCharges: boolean
  showGst: boolean
  showFbrLogo: boolean
  showQrCode: boolean
  showPoweredBy: boolean
  showContactInfo: boolean
  logoWidth: number
  logoHeight: number
}

export type CustomerInfo = {
  name: string
  phone: string
}

type InvoiceState = {
  companyInfo: CompanyInfo
  products: Product[]
  customerInfo: CustomerInfo
  receiptDate: string // Stored as ISO string
  options: ReceiptOptions
  logo: string | null
}

type SavedInvoice = {
  id: string
  name: string
  data: InvoiceState
}

export function InvoiceGenerator() {
  const { toast } = useToast()
  const [logo, setLogo] = useState<string | null>(null)
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: "",
    location: "",
    phone: "",
    welcomeText: "Welcome to",
    thankYouNote: "Thank You",
    showAddress: true,
  })
  const [products, setProducts] = useState<Product[]>([{ id: "1", name: "", quantity: 1, price: 0, total: 0 }])
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    phone: "",
  })
  const [receiptDate, setReceiptDate] = useState<Date>(new Date())
  const [options, setOptions] = useState<ReceiptOptions>({
    orderNumberPosition: "center",
    showProductBorders: false,
    borderStyle: "solid",
    showItemTax: false,
    fontFamily: "monospace",
    taxPercentage: 16,
    posCharges: 0,
    showPosCharges: false,
    showGst: true,
    showFbrLogo: true,
    showQrCode: true,
    showPoweredBy: true,
    showContactInfo: true,
    logoWidth: 150,
    logoHeight: 60,
  })
  const [savedInvoices, setSavedInvoices] = useState<SavedInvoice[]>([])
  const [selectedSavedInvoiceId, setSelectedSavedInvoiceId] = useState<string | null>(null)

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
  const taxAmount = options.showGst ? (subtotal * options.taxPercentage) / 100 : 0
  const posChargesAmount = options.showPosCharges ? options.posCharges : 0
  const grandTotal = subtotal + taxAmount + posChargesAmount

  const orderNumber = Math.floor(10000 + Math.random() * 90000)

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    })
  }

  const updateOption = (option: keyof ReceiptOptions, value: any) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [option]: value,
    }))
  }

  const toggleCompanyInfoOption = (option: keyof CompanyInfo, value: boolean) => {
    setCompanyInfo({
      ...companyInfo,
      [option]: value,
    })
  }

  // Calculate tax for each product if showItemTax is enabled
  const calculateProductTax = useCallback(
    (product: Product) => {
      if (options.showItemTax && options.showGst) {
        return (product.total * options.taxPercentage) / 100
      }
      return 0
    },
    [options.showItemTax, options.showGst, options.taxPercentage],
  )

  // Update products with tax values when tax options change
  useEffect(() => {
    if (options.showItemTax && options.showGst) {
      const updatedProducts = products.map((product) => ({
        ...product,
        tax: calculateProductTax(product),
      }))
      setProducts(updatedProducts)
    } else if (products.some((p) => p.tax !== undefined)) {
      // Remove tax property if showItemTax or showGst is false
      const updatedProducts = products.map((product) => {
        const { tax, ...rest } = product
        return rest
      })
      setProducts(updatedProducts)
    }
  }, [options.showItemTax, options.showGst, options.taxPercentage, calculateProductTax])

  // Load saved invoices from localStorage on mount
  useEffect(() => {
    try {
      const storedInvoices = localStorage.getItem("savedInvoices")
      if (storedInvoices) {
        setSavedInvoices(JSON.parse(storedInvoices))
      }
    } catch (error) {
      console.error("Failed to load invoices from localStorage", error)
      toast({
        title: "Error",
        description: "Failed to load saved invoices.",
        variant: "destructive",
      })
    }
  }, [])

  const saveCurrentInvoice = () => {
    const invoiceName = prompt("Enter a name for this invoice:")
    if (invoiceName) {
      const currentInvoiceState: InvoiceState = {
        companyInfo,
        products,
        customerInfo,
        receiptDate: receiptDate.toISOString(), // Convert Date to ISO string
        options,
        logo,
      }
      const newSavedInvoice: SavedInvoice = {
        id: Date.now().toString(),
        name: invoiceName,
        data: currentInvoiceState,
      }
      const updatedSavedInvoices = [...savedInvoices, newSavedInvoice]
      setSavedInvoices(updatedSavedInvoices)
      localStorage.setItem("savedInvoices", JSON.stringify(updatedSavedInvoices))
      toast({
        title: "Success",
        description: `Invoice "${invoiceName}" saved!`,
      })
    }
  }

  const loadInvoice = (id: string) => {
    const invoiceToLoad = savedInvoices.find((inv) => inv.id === id)
    if (invoiceToLoad) {
      const data = invoiceToLoad.data
      setCompanyInfo(data.companyInfo)
      setProducts(data.products)
      setCustomerInfo(data.customerInfo)
      setReceiptDate(new Date(data.receiptDate)) // Convert ISO string back to Date
      setOptions(data.options)
      setLogo(data.logo)
      setSelectedSavedInvoiceId(id)
      toast({
        title: "Success",
        description: `Invoice "${invoiceToLoad.name}" loaded!`,
      })
    }
  }

  const deleteInvoice = (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      const updatedSavedInvoices = savedInvoices.filter((inv) => inv.id !== id)
      setSavedInvoices(updatedSavedInvoices)
      localStorage.setItem("savedInvoices", JSON.stringify(updatedSavedInvoices))
      if (selectedSavedInvoiceId === id) {
        setSelectedSavedInvoiceId(null)
      }
      toast({
        title: "Success",
        description: "Invoice deleted.",
      })
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold">Receipt Generator</h1>
            <PrintButton targetRef={invoiceRef} options={options} />
          </div>

          <div className="mb-4">
            <CompanyDetails companyInfo={companyInfo} setCompanyInfo={setCompanyInfo} />
          </div>

          <div className="mb-4">
            <LogoUpload
              logo={logo}
              setLogo={setLogo}
              logoWidth={options.logoWidth}
              setLogoWidth={(value) => updateOption("logoWidth", value)}
              logoHeight={options.logoHeight}
              setLogoHeight={(value) => updateOption("logoHeight", value)}
            />
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
            <div className="space-y-2">
              <h3 className="text-base font-medium">Company Display Options</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-address"
                    checked={companyInfo.showAddress}
                    onCheckedChange={(value) => toggleCompanyInfoOption("showAddress", value)}
                  />
                  <Label htmlFor="show-address">Show company address</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-powered-by"
                    checked={options.showPoweredBy}
                    onCheckedChange={(value) => updateOption("showPoweredBy", value)}
                  />
                  <Label htmlFor="show-powered-by">Show "Powered By" text</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-contact-info"
                    checked={options.showContactInfo}
                    onCheckedChange={(value) => updateOption("showContactInfo", value)}
                  />
                  <Label htmlFor="show-contact-info">Show contact information</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Order Number Position</h3>
              <Select
                value={options.orderNumberPosition}
                onValueChange={(value) => updateOption("orderNumberPosition", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Font Selection</h3>
              <Select value={options.fontFamily} onValueChange={(value) => updateOption("fontFamily", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monospace">Monospace</SelectItem>
                  <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                  <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                  <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                  <SelectItem value="Georgia, serif">Georgia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Tax & Charges</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-gst"
                    checked={options.showGst}
                    onCheckedChange={(value) => updateOption("showGst", value)}
                  />
                  <Label htmlFor="show-gst">Show tax calculation</Label>
                </div>
                {options.showGst && (
                  <div className="space-y-1">
                    <Label htmlFor="tax-percentage" className="text-sm">
                      Tax Percentage (%)
                    </Label>
                    <Input
                      id="tax-percentage"
                      type="number"
                      min="0"
                      step="0.1"
                      value={options.taxPercentage}
                      onChange={(e) => updateOption("taxPercentage", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-item-tax"
                    checked={options.showItemTax}
                    onCheckedChange={(value) => updateOption("showItemTax", value)}
                    disabled={!options.showGst}
                  />
                  <Label htmlFor="show-item-tax">Show per-item tax column</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-pos-charges"
                    checked={options.showPosCharges}
                    onCheckedChange={(value) => updateOption("showPosCharges", value)}
                  />
                  <Label htmlFor="show-pos-charges">Add POS charges</Label>
                </div>
                {options.showPosCharges && (
                  <div className="space-y-1">
                    <Label htmlFor="pos-charges" className="text-sm">
                      POS Charges Amount
                    </Label>
                    <Input
                      id="pos-charges"
                      type="number"
                      min="0"
                      step="1"
                      value={options.posCharges}
                      onChange={(e) => updateOption("posCharges", Number.parseFloat(e.target.value) || 0)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="space-y-2">
              <h3 className="text-base font-medium">Display Options</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="product-borders"
                    checked={options.showProductBorders}
                    onCheckedChange={(value) => updateOption("showProductBorders", value)}
                  />
                  <Label htmlFor="product-borders">Show borders around products</Label>
                </div>
                {options.showProductBorders && (
                  <div className="space-y-1 ml-6">
                    <Label htmlFor="border-style" className="text-sm">
                      Border Style
                    </Label>
                    <Select
                      value={options.borderStyle}
                      onValueChange={(value) => updateOption("borderStyle", value as "solid" | "dashed" | "dotted")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                        <SelectItem value="dotted">Dotted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-fbr-logo"
                    checked={options.showFbrLogo}
                    onCheckedChange={(value) => updateOption("showFbrLogo", value)}
                  />
                  <Label htmlFor="show-fbr-logo">Show FBR logo</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-qr-code"
                    checked={options.showQrCode}
                    onCheckedChange={(value) => updateOption("showQrCode", value)}
                  />
                  <Label htmlFor="show-qr-code">Show QR code</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <ProductTable
              products={products}
              setProducts={setProducts}
              showItemTax={options.showItemTax && options.showGst}
              taxPercentage={options.taxPercentage}
            />
          </div>

          <div>
            <PaymentSummary
              subtotal={subtotal}
              taxAmount={taxAmount}
              taxPercentage={options.taxPercentage}
              grandTotal={grandTotal}
              showGst={options.showGst}
              posCharges={posChargesAmount}
              showPosCharges={options.showPosCharges}
            />
          </div>

          <div className="mb-4 space-y-2 border-t pt-4">
            <h3 className="text-base font-medium">Save / Load Invoice</h3>
            <div className="flex gap-2">
              <Button onClick={saveCurrentInvoice} className="flex-1">
                <Save className="h-4 w-4 mr-2" /> Save Current
              </Button>
              <Select value={selectedSavedInvoiceId || ""} onValueChange={loadInvoice}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Load Saved Invoice" />
                </SelectTrigger>
                <SelectContent>
                  {savedInvoices.length === 0 && (
                    <SelectItem value="no-invoices" disabled>
                      No saved invoices
                    </SelectItem>
                  )}
                  {savedInvoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedSavedInvoiceId && (
              <Button
                variant="destructive"
                onClick={() => deleteInvoice(selectedSavedInvoiceId)}
                className="w-full mt-2"
              >
                <Trash className="h-4 w-4 mr-2" /> Delete Selected
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Preview of the receipt */}
      <div ref={invoiceRef} className="hidden">
        <div
          className="receipt-container text-md max-w-md mx-auto bg-white p-4"
          style={{ fontFamily: options.fontFamily }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <p className="font-bold text-lg">{companyInfo.welcomeText}</p>
            {logo && (
              <img
                src={logo || "/placeholder.svg"}
                alt="Company Logo"
                style={{
                  height: `${options.logoHeight}px`,
                  width: `${options.logoWidth}px`,
                  objectFit: "contain",
                  margin: "8px auto",
                }}
              />
            )}
            <p className="font-bold text-lg">{companyInfo.name || "Your Company"}</p>
            {companyInfo.showAddress && <p>{companyInfo.location || "Company Location"}</p>}

            {/* Customer Details at top right - without title */}
            {(customerInfo.name || customerInfo.phone) && (
              <div className="text-right mt-2">
                <p>
                  {customerInfo.name} {customerInfo.phone && `(${customerInfo.phone})`}
                </p>
              </div>
            )}

            {/* Order Number with position options */}
            <div
              className={`mt-2 ${
                options.orderNumberPosition === "left"
                  ? "text-left"
                  : options.orderNumberPosition === "right"
                    ? "text-right"
                    : "text-center"
              }`}
            >
              <p className="font-bold">ORDER NUMBER: {orderNumber}</p>
            </div>

            <div className="flex justify-between mt-2">
              <span>Date: {formattedDate}</span>
              <span>{formattedTime}</span>
            </div>
          </div>

          {/* Products Table with or without borders */}
          {options.showProductBorders ? (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: `1px ${options.borderStyle} #000`,
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      border: `1px ${options.borderStyle} #000`,
                      padding: "4px",
                      textAlign: "left",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      border: `1px ${options.borderStyle} #000`,
                      padding: "4px",
                      textAlign: "right",
                    }}
                  >
                    Price
                  </th>
                  <th
                    style={{
                      border: `1px ${options.borderStyle} #000`,
                      padding: "4px",
                      textAlign: "center",
                    }}
                  >
                    Qty
                  </th>
                  {options.showItemTax && options.showGst && (
                    <th
                      style={{
                        border: `1px ${options.borderStyle} #000`,
                        padding: "4px",
                        textAlign: "right",
                      }}
                    >
                      Tax
                    </th>
                  )}
                  <th
                    style={{
                      border: `1px ${options.borderStyle} #000`,
                      padding: "4px",
                      textAlign: "right",
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={product.id}>
                    <td
                      style={{
                        border: `1px ${options.borderStyle} #000`,
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        border: `1px ${options.borderStyle} #000`,
                        padding: "4px",
                        textAlign: "left",
                      }}
                    >
                      {product.name}
                    </td>
                    <td
                      style={{
                        border: `1px ${options.borderStyle} #000`,
                        padding: "4px",
                        textAlign: "right",
                      }}
                    >
                      {product.price.toFixed(0)}
                    </td>
                    <td
                      style={{
                        border: `1px ${options.borderStyle} #000`,
                        padding: "4px",
                        textAlign: "center",
                      }}
                    >
                      {product.quantity}
                    </td>
                    {options.showItemTax && options.showGst && (
                      <td
                        style={{
                          border: `1px ${options.borderStyle} #000`,
                          padding: "4px",
                          textAlign: "right",
                        }}
                      >
                        {calculateProductTax(product).toFixed(0)}
                      </td>
                    )}
                    <td
                      style={{
                        border: `1px ${options.borderStyle} #000`,
                        padding: "4px",
                        textAlign: "right",
                      }}
                    >
                      {product.total.toFixed(0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div style={{ fontSize: "14px" }}>
              {/* Divider */}
              <div className="border-t border-b border-black py-1 mb-2">
                <div className="flex justify-between text-sm">
                  <span>No # Item</span>
                  <div className="flex" style={{ gap: options.showItemTax && options.showGst ? "16px" : "0" }}>
                    <span style={{ minWidth: "40px", textAlign: "right" }}>Price</span>
                    {options.showItemTax && options.showGst && (
                      <span style={{ minWidth: "40px", textAlign: "right" }}>Tax</span>
                    )}
                    <span style={{ minWidth: "60px", textAlign: "right" }}>Total</span>
                  </div>
                </div>
              </div>

              {/* Order Items without borders */}
              <div className="mb-4">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span>
                    {product.name} × {product.quantity}
                    </span>
                    <div style={{ display: "flex", gap: options.showItemTax && options.showGst ? "16px" : "0" }}>
                      <span style={{ minWidth: "40px", textAlign: "right" }}>{product.price.toFixed(0)}</span>
                      {options.showItemTax && options.showGst && (
                        <span style={{ minWidth: "40px", textAlign: "right" }}>
                          {calculateProductTax(product).toFixed(0)}
                        </span>
                      )}
                      <span style={{ minWidth: "60px", textAlign: "right" }}>{product.total.toFixed(0)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-black mb-2"></div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="flex flex-col items-end mb-4" style={{ fontSize: "14px" }}>
            <div className="flex justify-between w-full">
              <span>Sub Total:</span>
              <span>{subtotal.toFixed(0)}</span>
            </div>
            {options.showGst && (
              <div className="flex justify-between w-full">
                <span>Tax ({options.taxPercentage}%):</span>
                <span>{taxAmount.toFixed(0)}</span>
              </div>
            )}
            {options.showPosCharges && (
              <div className="flex justify-between w-full">
                <span>POS Charges:</span>
                <span>{posChargesAmount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between w-full font-bold">
              <span>GRAND TOTAL:</span>
              <span>{grandTotal.toFixed(0)}</span>
            </div>
          </div>

          {/* Images at the bottom - with no space between */}
          {(options.showFbrLogo || options.showQrCode) && (
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              {options.showFbrLogo && (
                <img
                  src="/images/fbr-logo.png"
                  alt="FBR Logo"
                  style={{
                    width: options.showQrCode ? "45%" : "90%",
                    maxHeight: "60px",
                    objectFit: "contain",
                    filter: "grayscale(100%)",
                  }}
                />
              )}
              {options.showQrCode && (
                <img
                  src="/images/qr-code.png"
                  alt="QR Code"
                  style={{
                    width: options.showFbrLogo ? "45%" : "90%",
                    maxHeight: "80px",
                    objectFit: "contain",
                  }}
                />
              )}
            </div>
          )}

          {/* Thank You */}
          <div className="text-center mb-4">
            <p className="font-bold text-lg">{companyInfo.thankYouNote}</p>
            {options.showPoweredBy && <p className="text-sm mt-4">Powered By {companyInfo.name || "Your Company"}</p>}
          </div>

          {/* Footer */}
          {options.showContactInfo && (
            <div className="text-center text-sm border-t border-black pt-2">
              <p>Contact us: {companyInfo.phone || "Your Phone"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
