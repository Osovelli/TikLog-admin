import React, { useState, useEffect } from "react"
import { Trash2, Plus, Pencil, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { CustomButton } from "@/components/CustomButton"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Modal from "@/components/ModalComponent"
import useFAQStore from "@/store/FAQStore"
import { toast } from "react-hot-toast"

const FAQ = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [localFaqs, setLocalFaqs] = useState([])
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Add FAQ Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newFaqData, setNewFaqData] = useState({
    question: "",
    answer: "",
  })
  const [isCreating, setIsCreating] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  const { faqs, loading, getAllFAQs, createFAQ, updateFAQ, deleteFAQ } = useFAQStore()

  // Fetch FAQs on component mount
  useEffect(() => {
    if (faqs === null) {
      getAllFAQs()
    }
  }, [faqs, getAllFAQs])

  // Update local state when backend data changes
  useEffect(() => {
    if (faqs?.data) {
      setLocalFaqs(
        faqs.data.map((faq) => ({
          id: faq._id,
          question: faq.question,
          answer: faq.answer,
          isNew: false,
        })),
      )
    }
  }, [faqs])

  // Validate add FAQ form
  const validateAddForm = () => {
    const errors = {}
    if (!newFaqData.question.trim()) {
      errors.question = "Question is required"
    }
    if (!newFaqData.answer.trim()) {
      errors.answer = "Answer is required"
    }
    if (newFaqData.question.trim().length < 10) {
      errors.question = "Question must be at least 10 characters long"
    }
    if (newFaqData.answer.trim().length < 10) {
      errors.answer = "Answer must be at least 10 characters long"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle opening add modal
  const handleAddFaq = () => {
    if (isEditing) {
      // Add to local state for editing mode
      const newFaq = {
        id: `temp_${Date.now()}`,
        question: "Question goes in here...",
        answer: "Answer goes in here...",
        isNew: true,
      }
      setLocalFaqs([...localFaqs, newFaq])
      setHasChanges(true)
    } else {
      // Open modal for adding new FAQ
      setIsAddModalOpen(true)
      setNewFaqData({ question: "", answer: "" })
      setFormErrors({})
    }
  }

  // Handle creating new FAQ
  const handleCreateFaq = async () => {
    if (!validateAddForm()) return

    setIsCreating(true)
    try {
      await createFAQ(newFaqData)
      setIsAddModalOpen(false)
      setNewFaqData({ question: "", answer: "" })
      // Refresh the FAQs list
      getAllFAQs()
      toast.success("FAQ created successfully")
    } catch (error) {
      console.error("Error creating FAQ:", error)
    } finally {
      setIsCreating(false)
    }
  }

  // Handle closing add modal
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
    setNewFaqData({ question: "", answer: "" })
    setFormErrors({})
  }

  const updateLocalFaq = (id, field, value) => {
    setLocalFaqs(localFaqs.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq)))
    setHasChanges(true)
  }

  const deleteLocalFaq = (id) => {
    setLocalFaqs(localFaqs.filter((faq) => faq.id !== id))
    setHasChanges(true)
  }

  const handleSaveChanges = async () => {
    setIsSaving(true)
    try {
      // Process all changes
      for (const faq of localFaqs) {
        if (faq.isNew) {
          // Create new FAQ
          await createFAQ({
            question: faq.question,
            answer: faq.answer,
          })
        } else {
          // Update existing FAQ
          await updateFAQ(faq.id, {
            question: faq.question,
            answer: faq.answer,
          })
        }
      }

      // Handle deletions (compare with original data)
      const originalIds = faqs?.data?.map((faq) => faq._id) || []
      const currentIds = localFaqs.filter((faq) => !faq.isNew).map((faq) => faq.id)
      const deletedIds = originalIds.filter((id) => !currentIds.includes(id))

      for (const id of deletedIds) {
        await deleteFAQ(id)
      }

      // Refresh data and exit edit mode
      await getAllFAQs()
      setIsEditing(false)
      setHasChanges(false)
      toast.success("FAQs updated successfully")
    } catch (error) {
      console.error("Error saving changes:", error)
      toast.error("Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    // Reset local state to backend data
    if (faqs?.data) {
      setLocalFaqs(
        faqs.data.map((faq) => ({
          id: faq._id,
          question: faq.question,
          answer: faq.answer,
          isNew: false,
        })),
      )
    }
    setIsEditing(false)
    setHasChanges(false)
  }

  // Show loading state
  if (loading && !faqs) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading FAQs...</span>
        </div>
      </div>
    )
  }

  // Display mode
  if (!isEditing) {
    const displayFaqs = faqs?.data || []

    return (
      <>
        <div className="space-y-6">
          <div className="flex justify-between items-center gap-2">
            <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
            <div className="flex flex-col md:flex-row gap-2">
              <Button onClick={handleAddFaq} className="bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ
              </Button>
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                className="bg-white text-black hover:bg-gray-200"
                disabled={loading || displayFaqs.length === 0}
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit FAQ
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            {displayFaqs.length > 0 ? (
              displayFaqs.map((faq, index) => (
                <React.Fragment key={faq._id}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <h3 className="text-gray-400 font-medium">{faq.question}</h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                  {index < displayFaqs.length - 1 && <Separator className="bg-gray-100" />}
                </React.Fragment>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <p>No FAQs available</p>
                <p className="text-sm mt-2">Click "Add FAQ" to create your first FAQ</p>
              </div>
            )}
          </div>
        </div>

        {/* Add FAQ Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          title="Add New FAQ"
          buttons={[
            {
              label: "Cancel",
              onClick: handleCloseAddModal,
              primary: false,
            },
            {
              label: isCreating ? "Creating..." : "Create FAQ",
              onClick: handleCreateFaq,
              primary: true,
              disabled: isCreating,
            },
          ]}
        >
          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-medium text-gray-700">
                Question
              </Label>
              <Input
                id="question"
                type="text"
                value={newFaqData.question}
                onChange={(e) => setNewFaqData({ ...newFaqData, question: e.target.value })}
                placeholder="Enter your question here..."
                className={formErrors.question ? "border-red-500" : ""}
                disabled={isCreating}
              />
              {formErrors.question && <p className="text-red-500 text-xs mt-1">{formErrors.question}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer" className="text-sm font-medium text-gray-700">
                Answer
              </Label>
              <Textarea
                id="answer"
                value={newFaqData.answer}
                onChange={(e) => setNewFaqData({ ...newFaqData, answer: e.target.value })}
                placeholder="Enter your answer here..."
                rows={4}
                className={formErrors.answer ? "border-red-500" : ""}
                disabled={isCreating}
              />
              {formErrors.answer && <p className="text-red-500 text-xs mt-1">{formErrors.answer}</p>}
            </div>
          </div>
        </Modal>
      </>
    )
  }

  // Edit mode
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Edit Frequently Asked Questions</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddFaq} variant="outline" disabled={isSaving}>
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {localFaqs.map((faq) => (
          <div key={faq.id} className="space-y-2 p-4 border rounded-lg bg-gray-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateLocalFaq(faq.id, "question", e.target.value)}
                className="flex-1 text-black border rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Question goes in here..."
                disabled={isSaving}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteLocalFaq(faq.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                disabled={isSaving}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <textarea
              value={faq.answer}
              onChange={(e) => updateLocalFaq(faq.id, "answer", e.target.value)}
              className="w-full text-black border rounded-lg p-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[100px]"
              placeholder="Answer goes in here..."
              disabled={isSaving}
            />
            {faq.isNew && (
              <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                New FAQ - will be created when saved
              </div>
            )}
          </div>
        ))}

        {localFaqs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No FAQs to edit</p>
            <p className="text-sm mt-2">Click "Add FAQ" to create a new one</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={handleCancelEdit} disabled={isSaving}>
            Cancel
          </Button>
          <CustomButton
            buttonVariant="primary"
            buttonSize="md"
            onClick={handleSaveChanges}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </CustomButton>
        </div>
      </div>
    </div>
  )
}

export default FAQ
