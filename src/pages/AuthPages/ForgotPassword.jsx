import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import PhoneInput from '@/components/PhoneInput'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/reset-password');
  };

  return (
    <>
    <AuthLayout 
    title='Forgot password?'
    description='Enter your phone number to continue'
    >
      <PhoneInput />
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
