"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface GstCalculationProps {
  subtotal: number
  paymentMethod: "cash" | "card"
  setPaymentMethod: (method: "cash" | "card") => void
  gstAmount: number
  grandTotal: number
}

export function GstCalculation({
  subtotal,
  paymentMethod,
  setPaymentMethod,
  gstAmount,
  grandTotal,
}: GstCalculationProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-2 min-w-[200px]">
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

        <div className="space-y-2 min-w-[200px]">
          <div className="flex justify-between py-1 text-sm">
            <span>Subtotal:</span>
            <span>{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 text-sm">
            <span>GST ({paymentMethod === "cash" ? "16%" : "5%"}):</span>
            <span>{gstAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between py-1 font-bold border-t pt-2 text-sm">
            <span>Grand Total:</span>
            <span>{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
