import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import InputComponent from '@/components/InputComponent'
import PhoneInput from '@/components/PhoneInput'
import useAuthStore from '@/store/authStore'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const ForgotPassword = () => {
  const [formData, setFormData] = useState({
      phone_number: '',
    });
  const navigate = useNavigate();

  const { loading, resetEmail } = useAuthStore();

  const handleInputChange = (e) => {
    setFormData(() => ({
      phone_number: e.target.value,
    }));
    //setEmail(e.target.value)
    console.log("phone number:", e.target.value)
  }

  const handleContinue = async (e) => {
    e.preventDefault();
    await resetEmail({phone_number: formData.phone_number});
  };

  return (
    <>
    <AuthLayout 
    title='Forgot password?'
    description='Enter your Phone number to continue'
    >
      {/* <PhoneInput />
      <ButtonComponent 
        variant="primary" 
        label={'Continue'} 
        buttonStyles='h-[52px] w-full'
        onClick={handleContinue}
        /> */}
        <InputComponent 
          type="phone" 
          placeholder="Enter your phone number" 
          onChange={handleInputChange} 
          value={formData.phone_number}
          disabled={loading}
          className="" 
        />
        <ButtonComponent
        label="Change Password"
        variant="primary"
        buttonStyles="h-[52px] w-full"
        onClick={handleContinue}
        disabled={""}
        />
    </AuthLayout>
    </>
  )
}
