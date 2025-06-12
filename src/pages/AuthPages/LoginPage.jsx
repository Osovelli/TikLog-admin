import { useEffect, useState } from 'react'
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
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import axiosInstance from '@/lib/utils/axiosInstance'


export const LoginPage = () => {
  //const [email, setEmail] = useState('')
  //const [password, setPassword] = useState('')
  const { login, loading, isLoggedIn } = useAuthStore();
  const [formData, setFormData] = useState({
      email: '',
      password: '',
    });  
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();


  const handleEmailChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      email: e.target.value,
    }));
    //setEmail(e.target.value)
    console.log("Email:", e.target.value)
  }

  const handlePasswordChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      password: e.target.value,
    }));
    //setPassword(e.target.value) 
    console.log("Password:", e.target.value)
  }

  const handleSignIn = async (e) => {
    e.preventDefault();
    /// Validate form fields
    //if (!validateForm()) return;
    console.log({email: formData.email, password: formData.password})
    login({
      email: formData.email,
      password: formData.password
    })

  } 

 /*  const handlePhoneChange = (phoneData) => {
    console.log(phoneData); // { countryCode: '+234', nationalNumber: '8012345678', fullNumber: '+2348012345678' }
  };
 */

  useEffect(() => {
    if(isLoggedIn){
      //toast.success("Signup successful");
      navigate("/dashboard");
    }
    },[isLoggedIn]
  )

  return (
   <>
   <AuthLayout
    title="Welcome Back!"
    description="Enter your phone number to continue"
    >
      <div className='flex flex-col gap-3'>
        {/* <PhoneInput /> */}
        <InputComponent 
        type="text" 
        placeholder="Email" 
        onChange={handleEmailChange} 
        value={formData.email}
        disabled={loading} 
        />

        <InputComponent 
        password={true}
        value={formData.password} 
        type={showPassword ? "text" : "password"} 
        placeholder="Password" 
        onChange={handlePasswordChange}
        disabled={loading} 
        />
      </div>
      <ButtonComponent
      label="Login"
      variant="primary"
      buttonStyles="h-[52px] w-full"
      onClick={handleSignIn}
      disabled={loading || !formData.email || !formData.password}
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