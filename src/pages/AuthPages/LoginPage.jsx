import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppleIcon, EyeIcon, EyeOffIcon,  } from 'lucide-react'
import CustomInput from '@/components/InputComponent'
import PhoneInput from '@/components/PhoneInput'
import { AuthLayout } from '@/components/_AuthComponents/AuthLayout'
import { ButtonComponent } from '@/components/ButtonComponent'
import { Apple, Google } from '@/icon/Icons'
import InputComponent from '@/components/InputComponent'
import { Link } from 'react-router-dom'


export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)

  const handlePhoneChange = (phoneData) => {
    console.log(phoneData); // { countryCode: '+234', nationalNumber: '8012345678', fullNumber: '+2348012345678' }
  };

  return (
   <>
   <AuthLayout
    title="Welcome Back!"
    description="Enter your phone number to continue"
    >
      <div className='flex flex-col gap-3'>
        <PhoneInput />
        <InputComponent password={true} type={showPassword ? "text" : "password"} placeholder="Password" />
      </div>
      <ButtonComponent
      label="Login"
      variant="primary"
      buttonStyles="h-[52px] w-full"
       />
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
        </div>
        <Link to={"/forgot-password"}>
          <span className="text-sm text-[#3B3B8F] hover:underline">
            Forgot password?
          </span>
        </Link>
      </div>
      <div className="text-center text-gray-500">or</div>
      <div className='w-full space-y-2'>
        <ButtonComponent 
          buttonStyles='h-[52px] w-full bg-white border-2 hover:bg-transparent' 
          icon={<Google />}
          variant={'outline'}>
        </ButtonComponent>
        <ButtonComponent 
          buttonStyles='h-[52px] w-full bg-white border-2 text-sm font-medium text-black hover:bg-transparent' 
          icon={<Apple />} 
          label="Sign in with Apple"
          variant={"outline"}>
        </ButtonComponent>
      </div>
      <div className="px-8 py-4 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          New to Tiklog? <Link to={"/signup"} className="text-[#3B3B8F] hover:underline">
            Create Account
          </Link>
        </p>
      </div>
    </AuthLayout>
   </>
  );
}