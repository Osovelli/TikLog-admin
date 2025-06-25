import { RichTextEditor } from "@/components/RichTextEditor"
import { useState, useEffect } from "react"
import useContentStore from "@/store/ContentStore"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, AlertCircle, Eye, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"

export const AboutUs = () => {
  const [content, setContent] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [showPreview, setShowPreview] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const {
    content: contentStore,
    loading,
    error,
    showErrorModal,
    saveContent,
    deleteContent,
    getContent,
    getContentByName,
    contentExists,
    closeErrorModal,
  } = useContentStore()

  const contentName = "about-us"
  const currentContent = getContentByName(contentName)
  const hasExistingContent = contentExists(contentName)

  // Load existing content on component mount
  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log("Loading content for:", contentName)
        const existingContent = await getContent(contentName)
        if (existingContent) {
          console.log("Found existing content:", existingContent)
          setContent(existingContent.description || "")
        } else {
          console.log("No existing content found for:", contentName)
        }
      } catch (error) {
        console.log("Error loading content:", error)
      } finally {
        setInitialLoad(false)
      }
    }

    loadContent()
  }, [getContent])

  // Debug: Log current content state
  useEffect(() => {
    console.log("Store state for", contentName, ":", {
      exists: hasExistingContent,
      content: currentContent,
      allContent: Object.keys(contentStore),
    })
  }, [currentContent, hasExistingContent, contentStore])

  const handleContentChange = (newContent) => {
    setContent(newContent)
    setHasChanges(true)
    if (showErrorModal) {
      closeErrorModal()
    }
  }

  const handleSave = async () => {
    if (!content.trim()) {
      toast.error("Content cannot be empty")
      return
    }

    try {
      console.log("Saving content:", {
        name: contentName,
        exists: hasExistingContent,
        action: hasExistingContent ? "UPDATE" : "CREATE",
      })

      const result = await saveContent(contentName, content)

      if (result) {
        setHasChanges(false)
        console.log("Content saved successfully:", result)
      }
    } catch (error) {
      console.error("Save failed:", error)
    }
  }

  const handleDelete = async () => {
    if (!hasExistingContent) {
      toast.error("No content to delete")
      return
    }

    try {
      console.log("Deleting content:", contentName)
      await deleteContent(contentName)

      // Clear local state after successful deletion
      setContent("")
      setHasChanges(false)
      setShowDeleteConfirm(false)

      console.log("Content deleted successfully")
    } catch (error) {
      console.error("Delete failed:", error)
    }
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  if (initialLoad) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">About Us</h1>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading content...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">About Us</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={togglePreview} className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            {showPreview ? "Edit" : "Preview"}
          </Button>

          {hasExistingContent && (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={loading}
              className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}

          <Button
            onClick={handleSave}
            disabled={!hasChanges || loading || !content.trim()}
            className="flex items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {hasExistingContent ? "Update" : "Create"} Content
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>Are you sure you want to delete this content? This action cannot be undone.</span>
              <div className="flex items-center gap-2 ml-4">
                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex items-center gap-1"
                >
                  {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  Delete
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Debug info - remove in production */}
      {/* {process.env.NODE_ENV === "development" && (
        <div className="bg-gray-100 p-2 rounded text-xs">
          <strong>Debug:</strong> Content Exists: {hasExistingContent.toString()} | Has Changes: {hasChanges.toString()}{" "}
          | Content Length: {content.length} | Action: {hasExistingContent ? "UPDATE" : "CREATE"}
        </div>
      )} */}

      {showErrorModal && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="ghost" size="sm" onClick={closeErrorModal} className="ml-2">
              ×
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {hasChanges && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>You have unsaved changes. Don't forget to save your work!</AlertDescription>
        </Alert>
      )}

      {showPreview ? (
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">Preview</h3>
            <div
              className="prose prose-sm max-w-none bg-white p-6 rounded border rich-text-preview"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          <RichTextEditor
            value={content}
            onChange={handleContentChange}
            maxLength={1245}
            placeholder="Tell your visitors about your company, your story, and what makes you unique..."
            disabled={loading}
          />
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
        <span>
          Last saved: {currentContent?.updatedAt ? new Date(currentContent.updatedAt).toLocaleString() : "Never"}
        </span>
        {hasChanges && <span className="text-orange-600 font-medium">Unsaved changes</span>}
      </div>

      {/* Custom styles for rich text preview to match editor formatting */}
      <style jsx>{`
        .rich-text-preview h1 {
          font-size: 2rem;
          font-weight: 700;
          line-height: 1.2;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #1f2937;
        }

        .rich-text-preview h2 {
          font-size: 1.5rem;
          font-weight: 600;
          line-height: 1.3;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: #374151;
        }

        .rich-text-preview h3 {
          font-size: 1.25rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #4b5563;
        }

        .rich-text-preview h4 {
          font-size: 1.125rem;
          font-weight: 600;
          line-height: 1.4;
          margin-top: 0.75rem;
          margin-bottom: 0.5rem;
          color: #6b7280;
        }

        .rich-text-preview h5 {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.5;
          margin-top: 0.75rem;
          margin-bottom: 0.25rem;
          color: #6b7280;
        }

        .rich-text-preview h6 {
          font-size: 0.875rem;
          font-weight: 600;
          line-height: 1.5;
          margin-top: 0.5rem;
          margin-bottom: 0.25rem;
          color: #9ca3af;
        }

        .rich-text-preview p {
          margin-bottom: 1rem;
          line-height: 1.6;
          color: #374151;
        }

        .rich-text-preview ul,
        .rich-text-preview ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }

        .rich-text-preview li {
          margin-bottom: 0.25rem;
          line-height: 1.6;
        }

        .rich-text-preview blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }

        .rich-text-preview strong {
          font-weight: 600;
        }

        .rich-text-preview em {
          font-style: italic;
        }

        .rich-text-preview a {
          color: #3b82f6;
          text-decoration: underline;
        }

        .rich-text-preview a:hover {
          color: #1d4ed8;
        }

        .rich-text-preview code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace;
          font-size: 0.875em;
        }

        .rich-text-preview pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1rem 0;
        }

        .rich-text-preview pre code {
          background-color: transparent;
          padding: 0;
        }
      `}</style>
    </div>
  )
}
