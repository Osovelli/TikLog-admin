import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import InputComponent from '@/components/InputComponent'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'


export const ResetPasswordSuccess = () => {
  const navigate = useNavigate()

  const handleContinue = () => {
    navigate('/signin')
  }

  return (
    <>
    <AuthLayout
    authLogo={<img src='/Illustration.png' className='w-[4rem]'/>}
    title='Password Successfully reset'
    description='Your password has been successfully reset, ensuring secure access to your account.'
    
    >
      <ButtonComponent 
      variant="primary" 
      label={'Login'} 
      buttonStyles='h-[52px] w-full' 
      onClick={handleContinue}
      />
    </AuthLayout>
    </>
  )
}