"use client"

interface PaymentSummaryProps {
  subtotal: number
  taxAmount: number
  taxPercentage: number
  grandTotal: number
  showGst: boolean
  posCharges: number
  showPosCharges: boolean
}

export function PaymentSummary({
  subtotal,
  taxAmount,
  taxPercentage,
  grandTotal,
  showGst,
  posCharges,
  showPosCharges,
}: PaymentSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2 border-t pt-2">
        <div className="flex justify-between py-1 text-sm">
          <span>Subtotal:</span>
          <span>{subtotal.toFixed(0)}</span>
        </div>
        {showGst && (
          <div className="flex justify-between py-1 text-sm">
            <span>Tax ({taxPercentage}%):</span>
            <span>{taxAmount.toFixed(0)}</span>
          </div>
        )}
        {showPosCharges && (
          <div className="flex justify-between py-1 text-sm">
            <span>POS Charges:</span>
            <span>{posCharges.toFixed(0)}</span>
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
