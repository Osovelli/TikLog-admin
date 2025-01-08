import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import InputComponent from '@/components/InputComponent'
import PhoneInput from '@/components/PhoneInput'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <>
    <AuthLayout 
    title='Enter your phone number'
    description="Enter your phone number to continue We'll use this to keep your account secure."
    >
      <PhoneInput />
      <InputComponent password={true} type={showPassword ? "text" : "password"} placeholder="Password" />
      <InputComponent password={true} type={showPassword ? "text" : "password"} placeholder="Confirm password" />
      <ButtonComponent variant="primary" label={'Continue'} buttonStyles='h-[52px] w-full' />
      <div className="px-8 py-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Already have an account? <Link to={"/signin"} className="text-[#3B3B8F] hover:underline">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
    </>
  )
}
