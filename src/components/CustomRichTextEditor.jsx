import React, { useState, useRef, useEffect } from 'react'
import { Bold, Italic, Underline, Heading1, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Quote, Link2, Image, ChevronDown } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
)

const headingOptions = [
  { label: 'Heading 1', value: '1' },
  { label: 'Heading 2', value: '2' },
  { label: 'Heading 3', value: '3' },
  { label: 'Heading 4', value: '4' },
  { label: 'Heading 5', value: '5' },
  { label: 'Heading 6', value: '6' },
]

export const RichTextEditor = ({ 
  initialValue = '', 
  onChange,
  maxLength,
  className 
}) => {
  const [content, setContent] = useState(initialValue)
  const [activeFormats, setActiveFormats] = useState([])
  const editorRef = useRef(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (editorRef.current && !content) {
        editorRef.current.focus()
      }
    }
  }, [content])

  const saveSelection = () => {
    const selection = window.getSelection()
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const preSelectionRange = range.cloneRange()
      preSelectionRange.selectNodeContents(editorRef.current)
      preSelectionRange.setEnd(range.startContainer, range.startOffset)
      const start = preSelectionRange.toString().length

      return {
        start,
        end: start + range.toString().length,
        range: range.cloneRange()
      }
    }
    return null
  }

  const restoreSelection = (savedSel) => {
    if (savedSel) {
      const selection = window.getSelection()
      const range = document.createRange()
      range.setStart(editorRef.current, 0)
      let charCount = 0
      let foundStart = false
      let foundEnd = false

      function traverseNodes(node) {
        if (foundEnd) return

        if (node.nodeType === 3) {
          const nextCharCount = charCount + node.length
          if (!foundStart && savedSel.start >= charCount && savedSel.start <= nextCharCount) {
            range.setStart(node, savedSel.start - charCount)
            foundStart = true
          }
          if (!foundEnd && savedSel.end >= charCount && savedSel.end <= nextCharCount) {
            range.setEnd(node, savedSel.end - charCount)
            foundEnd = true
          }
          charCount = nextCharCount
        } else {
          for (let child of node.childNodes) {
            traverseNodes(child)
          }
        }
      }

      traverseNodes(editorRef.current)
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const handleFormat = (format, value) => {
    const savedSel = saveSelection()
    editorRef.current.focus()
    
    if (format === 'heading') {
      document.execCommand('formatBlock', false, `<h${value}>`)
    } else if (format === 'formatBlock') {
      document.execCommand(format, false, value)
    } else {
      document.execCommand(format, false, value)
    }

    updateActiveFormats()
    updateContent()
    restoreSelection(savedSel)
  }

  const handleImageUpload = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    
    input.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const selection = window.getSelection()
          const range = selection?.getRangeAt(0)
          
          if (range) {
            const wrapper = document.createElement('span')
            wrapper.contentEditable = 'false'
            wrapper.className = 'relative inline-block'
            
            const img = document.createElement('img')
            img.src = e.target?.result
            img.className = 'max-w-full h-auto rounded-lg'
            
            const deleteButton = document.createElement('button')
            deleteButton.type = 'button'
            deleteButton.className = 'absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm'
            deleteButton.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>'
            
            deleteButton.onclick = (e) => {
              e.preventDefault()
              wrapper.remove()
              updateContent()
            }
            
            wrapper.appendChild(img)
            wrapper.appendChild(deleteButton)
            
            range.deleteContents()
            range.insertNode(wrapper)
            
            range.setStartAfter(wrapper)
            range.setEndAfter(wrapper)
            selection.removeAllRanges()
            selection.addRange(range)
            
            updateContent()
          }
        }
        reader.readAsDataURL(file)
      }
    }
    
    input.click()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      const selection = window.getSelection()
      const range = selection.getRangeAt(0)
      let currentBlock = range.startContainer
      
      while (currentBlock && currentBlock.nodeType !== 1) {
        currentBlock = currentBlock.parentNode
      }
      
      if (currentBlock && /^H[1-6]$/i.test(currentBlock.nodeName)) {
        e.preventDefault()
        const p = document.createElement('p')
        p.innerHTML = '<br>'
        currentBlock.parentNode.insertBefore(p, currentBlock.nextSibling)
        
        const newRange = document.createRange()
        newRange.setStart(p, 0)
        newRange.collapse(true)
        
        selection.removeAllRanges()
        selection.addRange(newRange)
        
        updateContent()
      }
    }
  }

  const handleChange = () => {
    const savedSel = saveSelection()
    updateContent()
    updateActiveFormats()
    restoreSelection(savedSel)
  }

  const updateContent = () => {
    const newContent = editorRef.current.innerHTML
    setContent(newContent)
    onChange?.(newContent)
  }

  const updateActiveFormats = () => {
    const formats = []
    if (document.queryCommandState('bold')) formats.push('bold')
    if (document.queryCommandState('italic')) formats.push('italic')
    if (document.queryCommandState('underline')) formats.push('underline')
    setActiveFormats(formats)
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
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 h-8"
            >
              <Heading1 className="h-4 w-4" />
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {headingOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleFormat('heading', option.value)}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <ToolbarButton
          icon={List}
          isActive={document.queryCommandState('insertUnorderedList')}
          onClick={() => handleFormat('insertUnorderedList')}
          tooltip="Bullet List"
        />
        <ToolbarButton
          icon={ListOrdered}
          isActive={document.queryCommandState('insertOrderedList')}
          onClick={() => handleFormat('insertOrderedList')}
          tooltip="Numbered List"
        />
        <div className="flex gap-1">
          <ToolbarButton
            icon={AlignLeft}
            onClick={() => handleFormat('justifyLeft')}
            tooltip="Align Left"
          />
          <ToolbarButton
            icon={AlignCenter}
            onClick={() => handleFormat('justifyCenter')}
            tooltip="Align Center"
          />
          <ToolbarButton
            icon={AlignRight}
            onClick={() => handleFormat('justifyRight')}
            tooltip="Align Right"
          />
        </div>
        <ToolbarButton
          icon={Quote}
          onClick={() => handleFormat('formatBlock', '<blockquote>')}
          tooltip="Quote"
        />
        <ToolbarButton
          icon={Link2}
          onClick={() => {
            const url = prompt('Enter URL:')
            if (url) handleFormat('createLink', url)
          }}
          tooltip="Insert Link"
        />
        <ToolbarButton
          icon={Image}
          onClick={handleImageUpload}
          tooltip="Insert Image"
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] rounded-lg border p-4 focus:outline-none focus:ring-2 focus:ring-gray-200 [&_img]:max-w-full [&_img]:h-auto [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic"
        onInput={handleChange}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: content }}
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

export default RichTextEditor


/* import React, { useState } from 'react'
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
} */