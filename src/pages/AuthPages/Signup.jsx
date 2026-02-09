import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import InputComponent from '@/components/InputComponent'
import useAuthStore from '@/store/authStore'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Signup = () => {
  const { signup, loading, regSuccess } = useAuthStore();
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname) newErrors.firstname = 'First name is required';
    if (!formData.lastname) newErrors.lastname = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    console.log({formData});

    await signup({
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password,
      role: "69546ca53f8085f2de8ab8a2"
    });
  };

  useEffect(() => {
    if(regSuccess){
      navigate("/signup-otp", { state: { email: formData.email } })
    }
  }, [regSuccess])

  return (
    <>
      <AuthLayout 
        title='Create Admin account'
        description="Enter your details to get started."
      >
        <form onSubmit={handleSignup} className="space-y-4">
          <InputComponent 
            value={formData.firstname}
            onChange={(e) => setFormData(prev => ({ ...prev, firstname: e.target.value }))}
            error={errors.firstname}
            placeholder="First name"
            type="text"
          />

          <InputComponent 
            value={formData.lastname}
            onChange={(e) => setFormData(prev => ({ ...prev, lastname: e.target.value }))}
            error={errors.lastname}
            placeholder="Last name"
            type="text"
          />
          
          <InputComponent 
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            error={errors.email}
            placeholder="Email address"
            type="email"
          />
          
          <InputComponent 
            password={true}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            error={errors.password}
          />
          
          <ButtonComponent 
            variant="primary"
            label={loading ? 'Signing up...' : 'Continue'}
            buttonStyles='h-[52px] w-full mt-4'
            type="submit"
            disabled={loading}
          />
        </form>
        <div className="px-8 py-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Already have an account? <Link to={"/signin"} className="text-[#3B3B8F] hover:underline">Sign in</Link>
          </p>
        </div>
      </AuthLayout>
    </>
  )
}