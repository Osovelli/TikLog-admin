import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import InputComponent from '@/components/InputComponent'
import React, { useState } from 'react'

export const SignUpSuccess = () => {

  return (
    <>
    <AuthLayout
    authLogo={<img src='/Illustration.png' className='w-[4rem]'/>}
    title='Welcome to Tiklog!'
    description="Your account has been successfully created. You're now ready to send packages of any size, safely and in real-time, to your desired location."
    
    >
      <ButtonComponent variant="primary" label={'Login'} buttonStyles='h-[52px] w-full' />
    </AuthLayout>
    </>
  )
}