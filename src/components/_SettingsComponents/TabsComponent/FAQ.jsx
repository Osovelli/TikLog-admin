import React, { useState, useEffect } from "react"
import { Trash2, Plus, Pencil, Loader2, AlertCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Modal from "@/components/ModalComponent"
import useFAQStore from "@/store/FAQStore"
import { toast } from "react-hot-toast"

const FAQ = () => {
  const [faqs, setFaqs] = useState([])

  // Add FAQ Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newFaqData, setNewFaqData] = useState({
    question: "",
    answer: "",
  })
  const [isCreating, setIsCreating] = useState(false)
  const [addFormErrors, setAddFormErrors] = useState({})

  // Edit FAQ Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [editFaqData, setEditFaqData] = useState({
    question: "",
    answer: "",
  })
  const [isUpdating, setIsUpdating] = useState(false)
  const [editFormErrors, setEditFormErrors] = useState({})

  // Delete confirmation state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [faqToDelete, setFaqToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { faqs: storeFaqs, loading, getAllFAQs, createFAQ, updateFAQ, deleteFAQ } = useFAQStore()

  // Fetch FAQs on component mount
  useEffect(() => {
    if (storeFaqs === null) {
      getAllFAQs()
    }
  }, [storeFaqs, getAllFAQs])

  // Update local state when backend data changes
  useEffect(() => {
    if (storeFaqs?.data) {
      setFaqs(storeFaqs.data)
    }
  }, [storeFaqs])

  // Validate forms
  const validateForm = (data, setErrors) => {
    const errors = {}
    if (!data.question.trim()) {
      errors.question = "Question is required"
    } else if (data.question.trim().length < 10) {
      errors.question = "Question must be at least 10 characters long"
    }

    if (!data.answer.trim()) {
      errors.answer = "Answer is required"
    } else if (data.answer.trim().length < 10) {
      errors.answer = "Answer must be at least 10 characters long"
    }

    setErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Add FAQ handlers
  const handleOpenAddModal = () => {
    setIsAddModalOpen(true)
    setNewFaqData({ question: "", answer: "" })
    setAddFormErrors({})
  }

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
    setNewFaqData({ question: "", answer: "" })
    setAddFormErrors({})
  }

  const handleCreateFaq = async () => {
    if (!validateForm(newFaqData, setAddFormErrors)) return

    setIsCreating(true)
    try {
      await createFAQ(newFaqData)
      setIsAddModalOpen(false)
      setNewFaqData({ question: "", answer: "" })
      getAllFAQs() // Refresh the FAQs list
      toast.success("FAQ created successfully")
    } catch (error) {
      console.error("Error creating FAQ:", error)
      toast.error("Failed to create FAQ")
    } finally {
      setIsCreating(false)
    }
  }

  // Edit FAQ handlers
  const handleOpenEditModal = (faq) => {
    setEditingFaq(faq)
    setEditFaqData({
      question: faq.question,
      answer: faq.answer,
    })
    setEditFormErrors({})
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setEditingFaq(null)
    setEditFaqData({ question: "", answer: "" })
    setEditFormErrors({})
  }

  const handleUpdateFaq = async () => {
    if (!validateForm(editFaqData, setEditFormErrors)) return

    setIsUpdating(true)
    try {
      await updateFAQ(editingFaq._id, editFaqData)
      setIsEditModalOpen(false)
      setEditingFaq(null)
      setEditFaqData({ question: "", answer: "" })
      getAllFAQs() // Refresh the FAQs list
      toast.success("FAQ updated successfully")
    } catch (error) {
      console.error("Error updating FAQ:", error)
      toast.error("Failed to update FAQ")
    } finally {
      setIsUpdating(false)
    }
  }

  // Delete FAQ handlers
  const handleOpenDeleteConfirm = (faq) => {
    setFaqToDelete(faq)
    setDeleteConfirmOpen(true)
  }

  const handleCloseDeleteConfirm = () => {
    setDeleteConfirmOpen(false)
    setFaqToDelete(null)
  }

  const handleDeleteFaq = async () => {
    if (!faqToDelete) return

    setIsDeleting(true)
    try {
      await deleteFAQ(faqToDelete._id)
      setDeleteConfirmOpen(false)
      setFaqToDelete(null)
      getAllFAQs() // Refresh the FAQs list
      toast.success("FAQ deleted successfully")
    } catch (error) {
      console.error("Error deleting FAQ:", error)
      toast.error("Failed to delete FAQ")
    } finally {
      setIsDeleting(false)
    }
  }

  // Show loading state
  if (loading && !storeFaqs) {
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

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center gap-2">
          <h1 className="text-2xl font-bold">Frequently Asked Questions</h1>
          <Button onClick={handleOpenAddModal} className="bg-indigo-600 hover:bg-indigo-700" disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>

        <div className="space-y-6">
          {faqs.length > 0 ? (
            faqs.map((faq, index) => (
              <React.Fragment key={faq._id}>
                <div className="group relative">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-20">
                    <h3 className="text-gray-700 font-medium">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>

                  {/* Action buttons */}
                  <div className="absolute top-0 right-0 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditModal(faq)}
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2"
                      title="Edit FAQ"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenDeleteConfirm(faq)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {index < faqs.length - 1 && <Separator className="bg-gray-200" />}
              </React.Fragment>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">No FAQs available</p>
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
            disabled: isCreating,
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
            <Label htmlFor="add-question" className="text-sm font-medium text-gray-700">
              Question
            </Label>
            <Input
              id="add-question"
              type="text"
              value={newFaqData.question}
              onChange={(e) => setNewFaqData({ ...newFaqData, question: e.target.value })}
              placeholder="Enter your question here..."
              className={addFormErrors.question ? "border-red-500" : ""}
              disabled={isCreating}
            />
            {addFormErrors.question && <p className="text-red-500 text-xs mt-1">{addFormErrors.question}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="add-answer" className="text-sm font-medium text-gray-700">
              Answer
            </Label>
            <Textarea
              id="add-answer"
              value={newFaqData.answer}
              onChange={(e) => setNewFaqData({ ...newFaqData, answer: e.target.value })}
              placeholder="Enter your answer here..."
              rows={4}
              className={addFormErrors.answer ? "border-red-500" : ""}
              disabled={isCreating}
            />
            {addFormErrors.answer && <p className="text-red-500 text-xs mt-1">{addFormErrors.answer}</p>}
          </div>
        </div>
      </Modal>

      {/* Edit FAQ Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Edit FAQ"
        buttons={[
          {
            label: "Cancel",
            onClick: handleCloseEditModal,
            primary: false,
            disabled: isUpdating,
          },
          {
            label: isUpdating ? "Updating..." : "Update FAQ",
            onClick: handleUpdateFaq,
            primary: true,
            disabled: isUpdating,
          },
        ]}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <Label htmlFor="edit-question" className="text-sm font-medium text-gray-700">
              Question
            </Label>
            <Input
              id="edit-question"
              type="text"
              value={editFaqData.question}
              onChange={(e) => setEditFaqData({ ...editFaqData, question: e.target.value })}
              placeholder="Enter your question here..."
              className={editFormErrors.question ? "border-red-500" : ""}
              disabled={isUpdating}
            />
            {editFormErrors.question && <p className="text-red-500 text-xs mt-1">{editFormErrors.question}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-answer" className="text-sm font-medium text-gray-700">
              Answer
            </Label>
            <Textarea
              id="edit-answer"
              value={editFaqData.answer}
              onChange={(e) => setEditFaqData({ ...editFaqData, answer: e.target.value })}
              placeholder="Enter your answer here..."
              rows={4}
              className={editFormErrors.answer ? "border-red-500" : ""}
              disabled={isUpdating}
            />
            {editFormErrors.answer && <p className="text-red-500 text-xs mt-1">{editFormErrors.answer}</p>}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        title="Delete FAQ"
        buttons={[
          {
            label: "Cancel",
            onClick: handleCloseDeleteConfirm,
            primary: false,
            disabled: isDeleting,
          },
          {
            label: isDeleting ? "Deleting..." : "Delete",
            onClick: handleDeleteFaq,
            primary: true,
            disabled: isDeleting,
            className: "bg-red-600 hover:bg-red-700",
          },
        ]}
      >
        <div className="text-left">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>This action cannot be undone. The FAQ will be permanently deleted.</AlertDescription>
          </Alert>

          {faqToDelete && (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Question:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{faqToDelete.question}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Answer:</p>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{faqToDelete.answer}</p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  )
}

export default FAQ
