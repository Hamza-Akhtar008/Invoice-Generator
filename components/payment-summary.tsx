"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface PaymentSummaryProps {
  subtotal: number
  paymentMethod: "cash" | "card"
  setPaymentMethod: (method: "cash" | "card") => void
  gstAmount: number
  grandTotal: number
  showGst: boolean
}

export function PaymentSummary({
  subtotal,
  paymentMethod,
  setPaymentMethod,
  gstAmount,
  grandTotal,
  showGst,
}: PaymentSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="payment-method" className="text-sm">
          Payment Method
        </Label>
        <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as "cash" | "card")}>
          <SelectTrigger id="payment-method">
            <SelectValue placeholder="Select payment method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cash">Cash (16% GST)</SelectItem>
            <SelectItem value="card">Card (5% GST)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 border-t pt-2">
        <div className="flex justify-between py-1 text-sm">
          <span>Subtotal:</span>
          <span>{subtotal.toFixed(0)}</span>
        </div>
        {showGst && (
          <div className="flex justify-between py-1 text-sm">
            <span>GST ({paymentMethod === "cash" ? "16%" : "5%"}):</span>
            <span>{gstAmount.toFixed(0)}</span>
          </div>
        )}
        <div className="flex justify-between py-1 font-bold border-t pt-2 text-sm">
          <span>Grand Total:</span>
          <span>{grandTotal.toFixed(0)}</span>
        </div>
      </div>
    </div>
  )
}
