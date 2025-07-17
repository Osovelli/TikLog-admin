import { useRef, useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CalendarIcon, MapPin, PencilIcon, Trash2, Upload, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import CountryCodeSelect from "../GetCountryCode"
import { ButtonComponent } from "../ButtonComponent"
import { useModal } from "@/lib/ModalContext"
import AddressForm from "./AddressForm"
import InputComponent from "@/components/InputComponent"
import useAuthStore from "@/store/authStore"

function ProfileHeader({ profilePicture, onProfilePictureChange }) {
  const fileInputRef = useRef(null)

  const handleUploadClick = (e) => {
    e.preventDefault()
    fileInputRef.current.click()
  }

  return (
    <div className="relative">
      <div className="h-48 w-full bg-sky-100 relative">
        <img src="Image-wrap.png" alt="Profile banner" className="w-full h-full object-contain" />
      </div>
      <div className="absolute bottom-12 left-8 transform translate-y-1/2">
        <div className="relative">
          <img
            src={profilePicture || "profile-pic.png"}
            alt="Profile picture"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
          <label htmlFor="profile-picture" className="absolute bottom-0 right-0 cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              id="profile-picture"
              accept="image/*"
              className="hidden"
              onChange={onProfilePictureChange}
            />
            <Button onClick={handleUploadClick} variant="ghost" size="icon" className="bg-white rounded-full shadow-md">
              <Upload className="h-4 w-4 text-gray-500" />
            </Button>
          </label>
        </div>
      </div>
      <div className="ml-48 pt-4">
        <h1 className="text-2xl font-semibold">John Doe Messi</h1>
        <p className="text-gray-500">johndoe@tiklog.com</p>
      </div>
    </div>
  )
}

function PersonalInfo() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    date: "",
    address: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("") // Clear error when user starts typing
    setSuccess(false) // Clear success when user makes changes
  }

  const handleDateChange = (date) => {
    setFormData({ ...formData, date })
    setError("")
    setSuccess(false)
  }

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true)
      setError("")

      // Validate required fields
      if (!formData.username || !formData.email || !formData.phone) {
        setError("Please fill in all required fields")
        return
      }

      // Prepare API payload
      const payload = {
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.date ? format(formData.date, "yyyy-MM-dd") : "",
        address: formData.address,
      }

      console.log("Updating profile with payload:", payload)

      // Make API call to update profile
      /* const response = await fetch("/api/profile/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }) */

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile")
      }

      setSuccess(true)
      console.log("Profile updated successfully:", data)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error("Profile update error:", error)
      setError(error.message || "Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mt-8 mb-8 flex flex-col md:flex-row px-4 md:gap-10 justify-between">
      <div className="">
        <h2 className="text-lg font-semibold">Personal info</h2>
        <p className="text-gray-500 mb-6">Update your photo and personal details.</p>
      </div>

      <div className="space-y-4 w-full md:w-1/2">
        {/* Success Alert */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Profile updated successfully!</AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="relative">
          <Input
            name="username"
            value={formData.username}
            placeholder="Enter username"
            onChange={handleInputChange}
            className="h-12"
            disabled={isLoading}
            required
          />
        </div>

        <div className="relative">
          <Input
            name="email"
            type="email"
            value={formData.email}
            placeholder="Enter email address"
            onChange={handleInputChange}
            className="h-12"
            disabled={isLoading}
            required
          />
        </div>

        <div className="flex gap-4">
          <CountryCodeSelect />
          <div className="relative flex-1">
            <Input
              name="phone"
              placeholder="08000000000"
              value={formData.phone}
              onChange={handleInputChange}
              className="h-12"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        <div className="relative">
          <Popover>
            <PopoverTrigger asChild>
              <div className="h-12 w-full rounded border px-3 flex items-center justify-between cursor-pointer">
                {formData.date ? format(formData.date, "dd - MM - yyyy") : "Select date of birth"}
                <CalendarIcon className="mr-2 h-4 w-4" />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={handleDateChange}
                initialFocus
                disabled={isLoading}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="relative">
          <Input
            name="address"
            value={formData.address}
            placeholder="Enter address"
            onChange={handleInputChange}
            className="h-12"
            disabled={isLoading}
          />
          <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleSaveChanges}
            disabled={isLoading}
            className="bg-[#1F1F76] hover:bg-[#1a1a66] h-12 px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChangePasswordForm() {
  const [formData, setFormData] = useState({
    otp: "",
    new_password: "",
    confirm_password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

   const { resendotp, resetEmail } = useAuthStore()

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
   /*  if (!/(?=.*[A-Z])/.test(password)) {
      return "Password must contain at least one uppercase letter"
    }
    if (!/(?=.*\d)/.test(password)) {
      return "Password must contain at least one number"
    }
    if (!/(?=.*[@$!%*?&])/.test(password)) {
      return "Password must contain at least one special character (@$!%*?&)"
    } */
    return ""
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setError("")
    setSuccess(false)

    // Real-time password validation
    if (name === "new_password") {
      const error = validatePassword(value)
      setPasswordError(error)

      // Check if passwords match when new password changes
      if (formData.confirm_password && value !== formData.confirm_password) {
        setConfirmPasswordError("Passwords do not match")
      } else if (formData.confirm_password && value === formData.confirm_password) {
        setConfirmPasswordError("")
      }
    }

    // Check if passwords match for confirm password
    if (name === "confirm_password") {
      if (value !== formData.new_password) {
        setConfirmPasswordError("Passwords do not match")
      } else {
        setConfirmPasswordError("")
      }
    }
  }

  const validateForm = () => {
    let isValid = true

    // Check if OTP is provided
    if (!formData.otp || formData.otp.length < 6) {
      setError("Please enter a valid 6-digit OTP")
      isValid = false
    }

    // Check if new password is provided and valid
    if (!formData.new_password) {
      setPasswordError("New password is required")
      isValid = false
    } else {
      const passwordValidationError = validatePassword(formData.new_password)
      if (passwordValidationError) {
        setPasswordError(passwordValidationError)
        isValid = false
      }
    }

    // Check if confirm password is provided
    if (!formData.confirm_password) {
      setConfirmPasswordError("Please confirm your password")
      isValid = false
    }

    // Check if passwords match
    if (formData.new_password !== formData.confirm_password) {
      setConfirmPasswordError("Passwords do not match")
      isValid = false
    }

    return isValid
  }

  const handleChangePassword = async () => {
    try {
      setIsLoading(true)
      setError("")
      setPasswordError("")
      setConfirmPasswordError("")

      // Validate form
      if (!validateForm()) {
        return
      }

      // Prepare API payload exactly as requested
      const payload = {
        otp: formData.otp,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      }

      console.log("Changing password with payload:", payload)

      // Make API call to change password
      /* const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }) */

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to change password")
      }

      setSuccess(true)
      console.log("Password changed successfully:", data)

      // Reset form after successful change
      setFormData({
        otp: "",
        new_password: "",
        confirm_password: "",
      })

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error("Password change error:", error)
      setError(error.message || "Failed to change password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async () => {
      await resetEmail('traviscameron332@gmail.com')
  }

  return (
    <div className="mt-8 mb-8 flex flex-col md:flex-row px-4 md:gap-10 justify-between">
      <div className="">
        <h2 className="text-lg font-semibold">Change Password</h2>
        <p className="text-gray-500 mb-6">Update your password for better security.</p>
      </div>

      <div className="space-y-6 w-full md:w-1/2">
        {/* Success Alert */}
        {success && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Password changed successfully! Please log in with your new password.
            </AlertDescription>
          </Alert>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* OTP Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">OTP Verification</label>
            <Button
              type="button"
              variant="link"
              onClick={handleSendOtp}
              className="text-[#1F1F76] hover:text-[#1a1a66] p-0 h-auto"
              disabled={isLoading}
            >
              Send OTP
            </Button>
          </div>
          <Input
            name="otp"
            type="text"
            placeholder="Enter 6-digit OTP"
            value={formData.otp}
            onChange={handleInputChange}
            className="h-12"
            maxLength={6}
            disabled={isLoading}
            required
          />
        </div>

        {/* New Password Field */}
        <InputComponent
          name="new_password"
          type="password"
          password={true}
          label="New Password"
          placeholder="Enter your new password"
          value={formData.new_password}
          onChange={handleInputChange}
          error={passwordError}
          disabled={isLoading}
          required
        />

        {/* Confirm Password Field */}
        <InputComponent
          name="confirm_password"
          type="password"
          password={true}
          label="Confirm New Password"
          placeholder="Confirm your new password"
          value={formData.confirm_password}
          onChange={handleInputChange}
          error={confirmPasswordError}
          disabled={isLoading}
          required
        />

        {/* Password Requirements */}
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium">Password must contain:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>At least 8 characters</li>
            <li>One lowercase letter (a-z)</li>
            {/* <li>One uppercase letter (A-Z)</li>
            <li>One number (0-9)</li>
            <li>One special character (@$!%*?&)</li> */}
          </ul>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleChangePassword}
            disabled={
              isLoading ||
              !formData.otp ||
              !formData.new_password ||
              !formData.confirm_password ||
              passwordError ||
              confirmPasswordError
            }
            className="bg-[#1F1F76] hover:bg-[#1a1a66] h-12 px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Changing Password...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

function AddressSection() {
  const { openModal, closeModal } = useModal()

  const handleAddNewAddress = () => {
    openModal({
      title: "New Address",
      content: <AddressForm />,
      buttons: [
        {
          label: "Add new",
          primary: true,
          onClick: () => {
            closeModal()
          },
        },
      ],
    })
  }

  const addresses = [
    { type: "Home", address: "56 Opebi road, Sabo Yaba." },
    { type: "Office", address: "56 Opebi road, Sabo Yaba." },
  ]

  return (
    <div className="mb-8 flex flex-col md:flex-row px-4 md:gap-10 justify-between">
      <div className="">
        <h2 className="text-lg font-semibold">Address</h2>
        <p className="text-gray-500 mb-6">Below is your address</p>
      </div>

      <div className="space-y-4 max-w-2xl md:w-1/2 w-full">
        {addresses.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-medium">{item.type}</h3>
                <span className="text-gray-500 text-sm p-2 shadow-sm border px-4">{item.address}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end gap-2 mt-6 max-w-2xl">
          <ButtonComponent label={"Add new"} variant={"white"} onClick={handleAddNewAddress} />
          <ButtonComponent label={"Save Changes"} variant={"primary"} />
        </div>
      </div>
    </div>
  )
}

export default function UserProfile() {
  const [profilePicture, setProfilePicture] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setProfilePicture(imageUrl)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-2xl font-semibold p-6">Profile</h1>

        <div className="bg-white rounded-lg border">
          <ProfileHeader profilePicture={profilePicture} onProfilePictureChange={handleProfilePictureChange} />

          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="profile" className="text-base">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="password" className="text-base">
                  Change Password
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-0">
                <PersonalInfo />
                <AddressSection />
              </TabsContent>

              <TabsContent value="password" className="space-y-0">
                <ChangePasswordForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
