import { useState, useRef, useEffect, useMemo, Suspense, lazy } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import "react-quill/dist/quill.snow.css"

// Lazy load ReactQuill for better performance
const ReactQuill = lazy(() => import("react-quill"))

const QuillEditor = ({ value, onChange, modules, formats, placeholder, disabled, quillRef }) => {
  return (
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value}
      onChange={onChange}
      modules={modules}
      formats={formats}
      placeholder={placeholder}
      readOnly={disabled}
      style={{
        minHeight: "200px",
      }}
    />
  )
}

export const RichTextEditor = ({
  value = "",
  onChange,
  maxLength = 2000,
  placeholder = "Start writing...",
  className = "",
  disabled = false,
}) => {
  const [editorValue, setEditorValue] = useState(value)
  const [characterCount, setCharacterCount] = useState(0)
  const [error, setError] = useState("")
  const quillRef = useRef(null)

  // Update editor value when prop changes
  useEffect(() => {
    setEditorValue(value)
  }, [value])

  // Calculate character count (strip HTML tags)
  const getTextLength = (html) => {
    const div = document.createElement("div")
    div.innerHTML = html
    return div.textContent || div.innerText || ""
  }

  // Handle editor change
  const handleChange = (content, delta, source, editor) => {
    const textLength = getTextLength(content).length

    if (textLength > maxLength) {
      setError(`Content exceeds maximum length of ${maxLength} characters`)
      return
    }

    setError("")
    setEditorValue(content)
    setCharacterCount(textLength)

    if (onChange) {
      onChange(content)
    }
  }

  // Custom image handler
  const imageHandler = () => {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click()

    input.onchange = async () => {
      const file = input.files[0]
      if (file) {
        // Convert to base64 for demo purposes
        // In production, you'd upload to your server/cloud storage
        const reader = new FileReader()
        reader.onload = () => {
          const quill = quillRef.current?.getEditor()
          if (quill) {
            const range = quill.getSelection()
            quill.insertEmbed(range?.index || 0, "image", reader.result)
          }
        }
        reader.readAsDataURL(file)
      }
    }
  }

  // Quill modules configuration
  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["blockquote", "code-block"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  )

  // Quill formats
  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "color",
    "background",
    "align",
    "code-block",
  ]

  return (
    <div className={`space-y-2 ${className}`}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8 min-h-[200px]">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading editor...</span>
            </div>
          }
        >
          <QuillEditor
            value={editorValue}
            onChange={handleChange}
            modules={modules}
            formats={formats}
            placeholder={placeholder}
            disabled={disabled}
            quillRef={quillRef}
          />
        </Suspense>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>
          Characters: {characterCount}/{maxLength}
        </span>
        {characterCount > maxLength * 0.9 && <span className="text-orange-600">Approaching character limit</span>}
      </div>

      <style jsx global>{`
        .ql-editor {
          min-height: 200px;
          font-size: 14px;
          line-height: 1.6;
        }
        
        .ql-toolbar {
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid #e5e7eb;
          background-color: #f9fafb;
        }
        
        .ql-container {
          border: none;
          font-family: inherit;
        }
        
        .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
        
        .ql-toolbar .ql-stroke {
          fill: none;
          stroke: #374151;
        }
        
        .ql-toolbar .ql-fill {
          fill: #374151;
          stroke: none;
        }
        
        .ql-toolbar .ql-picker-label {
          color: #374151;
        }
        
        .ql-toolbar button:hover,
        .ql-toolbar button:focus {
          color: #1f2937;
        }
        
        .ql-toolbar button.ql-active {
          color: #3b82f6;
        }
        
        .ql-toolbar .ql-picker-options {
          background-color: white;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}
