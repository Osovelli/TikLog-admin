'use client'

import React, { useState } from 'react'
import { Bold, Italic, Underline, Heading1, List, ListOrdered, AlignLeft, Quote, Link2, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const ToolbarButton = ({ icon: Icon, isActive, onClick, tooltip }) => (
  <Button
    variant="ghost"
    size="icon"
    className={cn(
      "h-8 w-8 p-0 hover:bg-gray-100",
      isActive && "bg-gray-100 text-gray-900"
    )}
    onClick={onClick}
    title={tooltip}
  >
    <Icon className="h-4 w-4" />
  </Button>
);

export const RichTextEditor = ({ 
  initialValue = '', 
  onChange,
  maxLength,
  className 
}) => {
  const [content, setContent] = useState(initialValue)
  const [activeFormats, setActiveFormats] = useState([])

  const handleFormat = (format) => {
    document.execCommand(format)
    // Update active formats based on current selection
    const formats = [...activeFormats]
    const index = formats.indexOf(format)
    if (index === -1) {
      formats.push(format)
    } else {
      formats.splice(index, 1)
    }
    setActiveFormats(formats)
  }

  const handleChange = (e) => {
    const newContent = e.target.innerHTML
    setContent(newContent)
    onChange?.(newContent)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-1 border-b pb-4">
        <ToolbarButton
          icon={Bold}
          isActive={activeFormats.includes('bold')}
          onClick={() => handleFormat('bold')}
          tooltip="Bold"
        />
        <ToolbarButton
          icon={Italic}
          isActive={activeFormats.includes('italic')}
          onClick={() => handleFormat('italic')}
          tooltip="Italic"
        />
        <ToolbarButton
          icon={Underline}
          isActive={activeFormats.includes('underline')}
          onClick={() => handleFormat('underline')}
          tooltip="Underline"
        />
        <ToolbarButton
          icon={Heading1}
          isActive={activeFormats.includes('formatBlock')}
          onClick={() => handleFormat('formatBlock')}
          tooltip="Heading"
        />
        <ToolbarButton
          icon={List}
          isActive={activeFormats.includes('insertUnorderedList')}
          onClick={() => handleFormat('insertUnorderedList')}
          tooltip="Bullet List"
        />
        <ToolbarButton
          icon={ListOrdered}
          isActive={activeFormats.includes('insertOrderedList')}
          onClick={() => handleFormat('insertOrderedList')}
          tooltip="Numbered List"
        />
        <ToolbarButton
          icon={AlignLeft}
          isActive={activeFormats.includes('justifyLeft')}
          onClick={() => handleFormat('justifyLeft')}
          tooltip="Align Left"
        />
        <ToolbarButton
          icon={Quote}
          isActive={activeFormats.includes('formatBlock')}
          onClick={() => handleFormat('formatBlock')}
          tooltip="Quote"
        />
        <ToolbarButton
          icon={Link2}
          isActive={activeFormats.includes('createLink')}
          onClick={() => {
            const url = prompt('Enter URL:')
            if (url) document.execCommand('createLink', false, url)
          }}
          tooltip="Insert Link"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 hover:bg-gray-100"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div
        contentEditable
        className="min-h-[200px] rounded-lg border p-4 focus:outline-none focus:ring-2 focus:ring-gray-200"
        dangerouslySetInnerHTML={{ __html: content }}
        onInput={handleChange}
      />

      {maxLength && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>Total characters: {content.length}</div>
          <Button variant="outline">Save changes</Button>
        </div>
      )}
    </div>
  )
}