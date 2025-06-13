"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash } from "lucide-react"
import type { Product } from "./invoice-generator"

interface ProductTableProps {
  products: Product[]
  setProducts: (products: Product[]) => void
  showItemTax: boolean
  taxPercentage: number
}

export function ProductTable({ products, setProducts, showItemTax, taxPercentage }: ProductTableProps) {
  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      name: "",
      quantity: 1,
      price: 0,
      total: 0,
    }
    setProducts([...products, newProduct])
  }

  const removeProduct = (id: string) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id))
    }
  }

  const updateProduct = (id: string, field: keyof Product, value: string | number) => {
    const updatedProducts = products.map((product) => {
      if (product.id === id) {
        const updatedProduct = { ...product, [field]: value }

        // Recalculate total whenever quantity or price changes
        if (field === "quantity" || field === "price") {
          updatedProduct.total = updatedProduct.quantity * updatedProduct.price

          // Calculate tax if needed
          if (showItemTax) {
            updatedProduct.tax = (updatedProduct.total * taxPercentage) / 100
          }
        }

        return updatedProduct
      }
      return product
    })

    setProducts(updatedProducts)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-medium">Products</h3>
        <Button onClick={addProduct} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" /> Add Product
        </Button>
      </div>

      <div className="space-y-2">
        {products.map((product, index) => (
          <div key={product.id} className="flex gap-2 items-start">
            <div className="flex-1">
              <Input
                value={product.name}
                onChange={(e) => updateProduct(product.id, "name", e.target.value)}
                placeholder="Product name"
                className="mb-1"
              />
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  value={product.quantity}
                  onChange={(e) => updateProduct(product.id, "quantity", Number.parseInt(e.target.value) || 0)}
                  placeholder="Qty"
                  className="w-20"
                />
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={product.price}
                  onChange={(e) => updateProduct(product.id, "price", Number.parseFloat(e.target.value) || 0)}
                  placeholder="Price"
                  className="flex-1"
                />
                {showItemTax && (
                  <div className="w-20 flex items-center justify-end text-sm text-gray-500">
                    Tax: {((product.price * taxPercentage) / 100).toFixed(0)}
                  </div>
                )}
                <div className="w-20 flex items-center justify-end font-medium text-sm">{product.total.toFixed(0)}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeProduct(product.id)}
              disabled={products.length === 1}
              className="mt-1"
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
