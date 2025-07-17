import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const OTPWithCountdown = ({ onOtpChange, onResendOtp, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Countdown timer effect
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple characters

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }

    // Call parent callback with complete OTP
    const otpString = newOtp.join("")
    if (onOtpChange) {
      onOtpChange(otpString)
    }
  }

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  // Handle resend OTP
  const handleResend = () => {
    if (onResendOtp) {
      onResendOtp()
    }
    setCountdown(60)
    setCanResend(false)
    setOtp(["", "", "", "", "", ""])
  }

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">Enter OTP</Label>

      {/* OTP Input Fields */}
      <div className="flex justify-center space-x-2">
        {otp.map((digit, index) => (
          <Input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-lg font-semibold"
          />
        ))}
      </div>

      {/* Resend OTP */}
      <div className="text-center">
        {canResend ? (
          <Button type="button" variant="link" onClick={handleResend} className="text-[#1F1F76] hover:text-[#1a1a66]">
            Resend OTP
          </Button>
        ) : (
          <p className="text-sm text-gray-600">Resend OTP in {countdown} seconds</p>
        )}
      </div>
    </div>
  )
}
