import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import OTPWithCountdown from '@/components/_AuthComponents/OTPWithCountdown'


import PhoneInput from '@/components/PhoneInput'

export const SignUpOTP = () => {
  return (
    <div>
    <AuthLayout 
    title='Enter OTP Code'
    description='Check your messages for a code from us.'
    >
      <OTPWithCountdown />
    </AuthLayout>
    </div>
  )
}