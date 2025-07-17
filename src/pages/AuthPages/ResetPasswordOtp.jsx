/* import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import OTPWithCountdown from '@/components/_AuthComponents/OTPWithCountdown'

export const ResetPasswordOtp = () => {
  return (
    <>
    <AuthLayout 
    title='Enter OTP Code'
    description='Check your messages for a code from us.'
    >
      <OTPWithCountdown />
    </AuthLayout>
    </>
  )
}
 */

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import InputComponent from "@/components/InputComponent"
import { OTPWithCountdown } from "@/components/_AuthComponents/ResetPasswordOtpCountdown"
import { AuthLayout } from "@/components/_AuthComponents/AuthLayout"

export const ResetPasswordOtp = ({ email, onSuccess, onBack }) => {
  // State management
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Validation states
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  // Password validation function
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long"
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "Password must contain at least one lowercase letter"
    }
    /* if (!/(?=.*[A-Z])/.test(password)) {
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

  // Handle password input change
  const handleNewPasswordChange = (e) => {
    const value = e.target.value
    setNewPassword(value)

    // Validate password
    const error = validatePassword(value)
    setPasswordError(error)

    // Check if passwords match when new password changes
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
    } else if (confirmPassword && value === confirmPassword) {
      setConfirmPasswordError("")
    }
  }

  // Handle confirm password input change
  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)

    // Check if passwords match
    if (value !== newPassword) {
      setConfirmPasswordError("Passwords do not match")
    } else {
      setConfirmPasswordError("")
    }
  }

  // Handle OTP change from OTPWithCountdown component
  const handleOtpChange = (otpValue) => {
    setOtp(otpValue)
    setError("") // Clear any previous errors when OTP changes
  }

  // Validate form before submission
  const validateForm = () => {
    let isValid = true

    // Check if OTP is provided
    if (!otp || otp.length < 6) {
      setError("Please enter a valid 6-digit OTP")
      isValid = false
    }

    // Check if new password is provided and valid
    if (!newPassword) {
      setPasswordError("New password is required")
      isValid = false
    } else {
      const passwordValidationError = validatePassword(newPassword)
      if (passwordValidationError) {
        setPasswordError(passwordValidationError)
        isValid = false
      }
    }

    // Check if confirm password is provided
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password")
      isValid = false
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match")
      isValid = false
    }

    return isValid
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    // Clear previous errors
    setError("")
    setPasswordError("")
    setConfirmPasswordError("")

    // Validate form
    if (!validateForm()) {
      return
    }

    // Construct request body
    const requestBody = {
      otp: otp,
      new_password: newPassword,
      confirm_password: confirmPassword,
    }

    console.log("Reset password request body:", requestBody)

    try {
      setIsLoading(true)

      // Make API call to reset password
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password")
      }

      console.log("Password reset successful:", data)
      setSuccess(true)

      // Call success callback after a short delay
      setTimeout(() => {
        if (onSuccess) {
          onSuccess(data)
        }
      }, 2000)
    } catch (error) {
      console.error("Password reset error:", error)
      setError(error.message || "An error occurred while resetting your password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle resend OTP
  const handleResendOtp = async () => {
    try {
      setError("")
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP")
      }

      console.log("OTP resent successfully")
    } catch (error) {
      console.error("Resend OTP error:", error)
      setError(error.message || "Failed to resend OTP. Please try again.")
    }
  }

  // Success state
  if (success) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">Password Reset Successful!</p>
          <p className="text-gray-600 mt-2">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
        </div>
      </div>
    )
  }

  return (
    <AuthLayout 
    title='Reset Your Password'
    description={`Enter the OTP sent to ${email || ""} and create a new password`}
    >
    <div className="w-full max-w-md mx-auto">
      <div className="mt-2 mb-20">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* OTP Input */}
          <div className="space-y-2">
            <OTPWithCountdown onOtpChange={handleOtpChange} onResendOtp={handleResendOtp} email={email} />
          </div>

          {/* New Password Input */}
          <InputComponent
            id="new_password"
            name="new_password"
            type="password"
            password={true}
            label="New Password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={handleNewPasswordChange}
            error={passwordError}
            disabled={isLoading}
            required
          />

          {/* Confirm Password Input */}
          <InputComponent
            id="confirm_password"
            name="confirm_password"
            type="password"
            password={true}
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
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

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#1F1F76] hover:bg-[#1a1a66]"
            disabled={isLoading || !otp || !newPassword || !confirmPassword || passwordError || confirmPasswordError}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>

          {/* Back Button */}
          {onBack && (
            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={onBack}
              disabled={isLoading}
            >
              Back to Login
            </Button>
          )}
        </form>
      </div>
    </div>
    </AuthLayout>
  )
}
