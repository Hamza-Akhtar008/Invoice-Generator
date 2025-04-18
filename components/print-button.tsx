"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import type { RefObject } from "react"

interface PrintButtonProps {
  targetRef: RefObject<HTMLDivElement>
}

export function PrintButton({ targetRef }: PrintButtonProps) {
  const handlePrint = () => {
    if (!targetRef.current) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const content = targetRef.current.innerHTML

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt</title>
          <style>
            body {
              font-family: monospace;
              padding: 0;
              margin: 0;
              width: 80mm;
              max-width: 80mm;
              font-size: 12px;
              line-height: 1.2;
            }
            .receipt-container {
              padding: 5mm;
            }
            img {
              max-width: 60mm;
            }
            p {
              margin: 2px 0;
            }
            .border-t {
              border-top: 1px solid black;
              padding-top: 2mm;
              margin-top: 2mm;
            }
            .border-b {
              border-bottom: 1px solid black;
              padding-bottom: 2mm;
              margin-bottom: 2mm;
            }
            .text-center {
              text-align: center;
            }
            .text-right {
              text-align: right;
            }
            .font-bold {
              font-weight: bold;
            }
            .flex {
              display: flex;
            }
            .justify-between {
              justify-content: space-between;
            }
            .items-end {
              align-items: flex-end;
            }
            .w-full {
              width: 100%;
            }
            .mb-4 {
              margin-bottom: 4mm;
            }
            .mb-2 {
              margin-bottom: 2mm;
            }
            .mt-2 {
              margin-top: 2mm;
            }
            .mt-4 {
              margin-top: 4mm;
            }
            .text-xs {
              font-size: 10px;
            }
            .flex-col {
              flex-direction: column;
            }
            @media print {
              body {
                width: 80mm;
                margin: 0;
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <div>${content}</div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `)

    printWindow.document.close()
  }

  return (
    <Button onClick={handlePrint} variant="outline">
      <Printer className="h-4 w-4 mr-2" />
      Print Receipt
    </Button>
  )
}
