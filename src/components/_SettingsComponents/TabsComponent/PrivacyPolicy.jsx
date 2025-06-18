/* import { RichTextEditor } from '@/components/CustomRichTextEditor'
import React from 'react'


export const PrivacyPolicy = () => {
  const handleSave = (content) => {
    // Handle saving content
    console.log('Saving about content:', content)
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Privacy Policy</h1>
      <RichTextEditor
        maxLength={1245}
        onChange={handleSave}
      />
    </div>
  )
} */

import { RichTextEditor } from "@/components/RichTextEditor"
import { useState, useEffect } from "react"
import useContentStore from "@/store/ContentStore"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Save, AlertCircle, Eye, Trash2 } from "lucide-react"
import { toast } from "react-hot-toast"
import { ContentTemplateSelector } from "../ContentTemplateSelector"

export const PrivacyPolicy = () => {
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

  const contentName = "privacy-policy"
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
        <h1 className="text-2xl font-bold">Privacy Policy</h1>
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
        <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
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
              className="prose prose-sm max-w-none bg-white p-6 rounded border"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border">
          {!hasExistingContent && !content && (
            <ContentTemplateSelector
              contentName={contentName}
              onUseTemplate={(template) => {
                setContent(template)
                setHasChanges(true)
              }}
              disabled={loading}
            />
          )}
          <RichTextEditor
            value={content}
            onChange={handleContentChange}
            maxLength={2000}
            placeholder="Enter your terms and conditions. Be clear about user rights, responsibilities, and legal requirements..."
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
    </div>
  )
}
