import { RichTextEditor } from '@/components/CustomRichTextEditor'
import React from 'react'


export const DeliveryAndReturnPolicy = () => {
  const handleSave = (content) => {
    // Handle saving content
    console.log('Saving about content:', content)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Delivery & Return Policy</h1>
      <RichTextEditor
        maxLength={1245}
        onChange={handleSave}
      />
    </div>
  )
}