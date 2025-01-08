import React from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function DeliveryList({ items, onEdit, onDelete }) {
  const total = items.reduce((sum, item) => sum + item.cost, 0)

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="border-b pb-4">
          <div className="flex justify-between items-start mb-1">
            <div>
              <h3 className="text-green-600 font-medium">Location {index + 1}</h3>
              <p className="font-medium">{item.location}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(item.id)}
                className="h-8 w-8 text-gray-500 hover:text-gray-700"
              >
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit location</span>
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(item.id)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete location</span>
              </Button>
            </div>
          </div>
          <p className="text-sm text-gray-500">{item.timestamp}</p>
          <p className="text-blue-600">N {item.cost.toLocaleString()}</p>
        </div>
      ))}
      
      {items.length > 0 && (
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center">
            <span className="text-gray-600">Total</span>
            <span className="text-gray-500 ml-2">({items.length} Items)</span>
          </div>
          <span className="text-blue-600 font-medium">NGN {total.toLocaleString()}</span>
        </div>
      )}
    </div>
  )
}