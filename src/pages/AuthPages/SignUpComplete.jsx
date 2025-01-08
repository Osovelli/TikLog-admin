import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { AvatarUpload } from '@/components/AvatarUpload'
import { ButtonComponent } from '@/components/ButtonComponent'
import FormField from '@/components/_AuthComponents/FormField'
import InputComponent from '@/components/InputComponent'
import PhoneInput from '@/components/PhoneInput'
import React, { useState } from 'react'

export const SignupComplete = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        otherName: '',
        email: '',
        dateOfBirth: undefined,
        referralCode: '',
        agreeTerms: false,
      })

      const handleChange = (name) => (value) => {
        setFormData(prev => ({ ...prev, [name]: value }))
      }
    
      const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
        // Handle form submission
      }

      //Can set the avatar file to a state here
    const handleAvatarChange = (file) => {
      console.log('Avatar file:', file);
    };

  return (
    <>
    <AuthLayout 
    title="Let’s get to know you?"
    description="Let’s get to know you?"
    >
        <AvatarUpload onAvatarChange={handleAvatarChange} />
        <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-background rounded-lg shadow-sm">
            <FormField
                name="firstName"
                required
                placeholder="First name"
                className="shadow-sm"
                value={formData.firstName}
                onChange={handleChange('firstName')}
            />
            <FormField
                label=""
                name="lastName"
                required
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange('lastName')}
            />
            <FormField
                label=""
                name="otherName"
                required
                placeholder="Other name"
                value={formData.otherName}
                onChange={handleChange('otherName')}
            />
            <FormField
                label=""
                name="email"
                type="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange('email')}
            />
            <FormField
                label=""
                name="dateOfBirth"
                type="date"
                placeholder='Date of birth'
                required
                value={formData.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
            />
            <FormField
                label=""
                name="referralCode"
                placeholder="Referral code (if any)"
                value={formData.referralCode}
                onChange={handleChange('referralCode')}
            />
            <FormField
                label="I agree to the terms and conditions"
                name="agreeTerms"
                type="checkbox"
                value={formData.agreeTerms.toString()}
                onChange={(value) => handleChange('agreeTerms')(value === 'true')}
            />
            <ButtonComponent variant='primary' label='Submit' buttonStyles='w-full' />
        </form>
    </AuthLayout>
    </>
  )
}
