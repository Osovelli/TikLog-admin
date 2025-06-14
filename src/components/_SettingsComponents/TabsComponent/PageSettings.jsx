import { useState, useEffect } from "react"
import { Table } from "@/components/Table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Modal from "@/components/ModalComponent"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

// Mock store - replace with your actual store
const usePageStore = () => {
  const [pages, setPages] = useState([
    {
      _id: "1",
      title: "About Us",
      slug: "about-us",
      content: "Learn more about our company and mission.",
      status: "Published",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      _id: "2",
      title: "Contact",
      slug: "contact",
      content: "Get in touch with our team.",
      status: "Published",
      createdAt: "2024-01-10T14:20:00Z",
      updatedAt: "2024-01-10T14:20:00Z",
    },
    {
      _id: "3",
      title: "Services",
      slug: "services",
      content: "Discover our range of services.",
      status: "Draft",
      createdAt: "2024-01-05T09:15:00Z",
      updatedAt: "2024-01-05T09:15:00Z",
    },
  ])
  const [loading, setLoading] = useState(false)

  const getAllPages = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const createPage = async (pageData) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newPage = {
        _id: Date.now().toString(),
        ...pageData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setPages((prev) => [...prev, newPage])
      setLoading(false)
      toast.success("Page created successfully")
    }, 1000)
  }

  const updatePage = async (pageId, pageData) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setPages((prev) =>
        prev.map((page) =>
          page._id === pageId ? { ...page, ...pageData, updatedAt: new Date().toISOString() } : page,
        ),
      )
      setLoading(false)
      toast.success("Page updated successfully")
    }, 1000)
  }

  const deletePage = async (pageId) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setPages((prev) => prev.filter((page) => page._id !== pageId))
      setLoading(false)
      toast.success("Page deleted successfully")
    }, 1000)
  }

  return {
    pages: { data: pages },
    loading,
    getAllPages,
    createPage,
    updatePage,
    deletePage,
  }
}

const PageSettings = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPage, setSelectedPage] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    status: "Draft",
  })
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { pages, loading, getAllPages, createPage, updatePage, deletePage } = usePageStore()

  useEffect(() => {
    getAllPages()
  }, [])

  const columns = [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created" },
    { key: "updatedAt", label: "Last Updated" },
  ]

  const validateForm = () => {
    const errors = {}
    if (!formData.title.trim()) errors.title = "Title is required"
    if (!formData.slug.trim()) errors.slug = "Slug is required"
    if (!formData.content.trim()) errors.content = "Content is required"
    if (formData.title.length < 3) errors.title = "Title must be at least 3 characters"
    if (formData.slug.length < 3) errors.slug = "Slug must be at least 3 characters"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }))
  }

  const handleAddPage = () => {
    setFormData({ title: "", slug: "", content: "", status: "Draft" })
    setFormErrors({})
    setIsAddModalOpen(true)
  }

  const handleEditPage = (page) => {
    setSelectedPage(page)
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content,
      status: page.status,
    })
    setFormErrors({})
    setIsEditModalOpen(true)
  }

  const handleDeletePage = (page) => {
    setSelectedPage(page)
    setIsDeleteModalOpen(true)
  }

  const handleCreatePage = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await createPage(formData)
      setIsAddModalOpen(false)
      getAllPages()
    } catch (error) {
      toast.error("Failed to create page")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdatePage = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await updatePage(selectedPage._id, formData)
      setIsEditModalOpen(false)
      getAllPages()
    } catch (error) {
      toast.error("Failed to update page")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    setIsSubmitting(true)
    try {
      await deletePage(selectedPage._id)
      setIsDeleteModalOpen(false)
      getAllPages()
    } catch (error) {
      toast.error("Failed to delete page")
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderCustomCell = (key, value, row) => {
    if (key === "status") {
      const statusColors = {
        Published: "bg-green-100 text-green-800 border-green-200",
        Draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
        Archived: "bg-gray-100 text-gray-800 border-gray-200",
      }

      return <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[value]}`}>{value}</span>
    }

    if (key === "createdAt" || key === "updatedAt") {
      return new Date(value).toLocaleDateString()
    }

    if (key === "slug") {
      return <code className="bg-gray-100 px-2 py-1 rounded text-sm">/{value}</code>
    }

    return value
  }

  const ActionButtons = ({ row }) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleEditPage(row)}
        className="text-blue-600 hover:text-blue-800"
        title="Edit Page"
      >
        <Edit size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleDeletePage(row)}
        className="text-red-600 hover:text-red-800"
        title="Delete Page"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  )

  const transformedPages =
    pages?.data?.map((page) => ({
      ...page,
      id: page._id,
    })) || []

  if (loading && !pages?.data) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading pages...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Page Management</h2>
          <p className="text-sm text-gray-600 mt-1">Manage your website pages and content</p>
        </div>
        <Button onClick={handleAddPage} className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Page
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={transformedPages}
          renderCustomCell={renderCustomCell}
          renderActions={(row) => <ActionButtons row={row} />}
          showSearch={true}
          itemsPerPage={10}
        />
      </div>

      {/* Add Page Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Page"
        buttons={[
          {
            label: "Cancel",
            onClick: () => setIsAddModalOpen(false),
            primary: false,
          },
          {
            label: isSubmitting ? "Creating..." : "Create Page",
            onClick: handleCreatePage,
            primary: true,
            disabled: isSubmitting,
          },
        ]}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter page title"
              className={formErrors.title ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {formErrors.title && <p className="text-red-500 text-xs">{formErrors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="page-url-slug"
              className={formErrors.slug ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {formErrors.slug && <p className="text-red-500 text-xs">{formErrors.slug}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter page content"
              rows={4}
              className={formErrors.content ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {formErrors.content && <p className="text-red-500 text-xs">{formErrors.content}</p>}
          </div>
        </div>
      </Modal>

      {/* Edit Page Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Page"
        buttons={[
          {
            label: "Cancel",
            onClick: () => setIsEditModalOpen(false),
            primary: false,
          },
          {
            label: isSubmitting ? "Updating..." : "Update Page",
            onClick: handleUpdatePage,
            primary: true,
            disabled: isSubmitting,
          },
        ]}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Page Title</Label>
            <Input
              id="edit-title"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter page title"
              className={formErrors.title ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {formErrors.title && <p className="text-red-500 text-xs">{formErrors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-slug">URL Slug</Label>
            <Input
              id="edit-slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="page-url-slug"
              className={formErrors.slug ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {formErrors.slug && <p className="text-red-500 text-xs">{formErrors.slug}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-status">Status</Label>
            <select
              id="edit-status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isSubmitting}
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter page content"
              rows={4}
              className={formErrors.content ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {formErrors.content && <p className="text-red-500 text-xs">{formErrors.content}</p>}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Page"
        buttons={[
          {
            label: "Cancel",
            onClick: () => setIsDeleteModalOpen(false),
            primary: false,
          },
          {
            label: isSubmitting ? "Deleting..." : "Delete",
            onClick: handleConfirmDelete,
            primary: true,
            style: "bg-red-600 hover:bg-red-700 text-white",
            disabled: isSubmitting,
          },
        ]}
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <p className="text-gray-600">
            Are you sure you want to delete the page <strong>"{selectedPage?.title}"</strong>?
          </p>
          <p className="text-sm text-gray-500 mt-2">This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  )
}

export default PageSettings
