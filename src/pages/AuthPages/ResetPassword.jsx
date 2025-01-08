import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import InputComponent from '@/components/InputComponent'
import PhoneInput from '@/components/PhoneInput'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'

export const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleContinue = () => {
    navigate('/reset-password-otp')
  }

  return (
    <>
    <AuthLayout 
    title='Reset your password'
    description='Effortlessly reset your password, providing a new one and confirming for enhanced security.'
    >
      <InputComponent password={true} type={showPassword ? "text" : "password"} placeholder="Password" />
      <InputComponent password={true} type={showPassword ? "text" : "password"} placeholder="Confirm password" />
      <ButtonComponent 
        variant="primary" 
        label={'Continue'} 
        buttonStyles='h-[52px] w-full'
        onClick={handleContinue} 
      />
    </AuthLayout>
    </>
  )
}
