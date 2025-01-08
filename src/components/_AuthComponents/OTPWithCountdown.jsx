import React, { useState, useEffect } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator
} from "@/components/ui/input-otp"
import { ButtonComponent } from '../ButtonComponent';
import { useNavigate } from 'react-router';

export default function OTPWithCountdown() {
  const [timer, setTimer] = useState(90); // 90 seconds = 1:30
  const [otp, setOtp] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const navigate = useNavigate()

  const handleContinue = () => {
    navigate('/reset-password/success')
  }

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setIsDisabled(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleResend = () => {
    setTimer(90);
    setIsDisabled(false);
    setOtp("");
    // Add your resend logic here
  };

  return (
    <div className="flex flex-col space-y-4">
      <InputOTP
        value={otp}
        onChange={setOtp}
        maxLength={4}
        disabled={isDisabled}
      >
        <InputOTPGroup className='flex gap-3'>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSeparator className=""/>
          <InputOTPSlot index={2} className='' />
          <InputOTPSlot index={3} className='' />
        </InputOTPGroup>
      </InputOTP>
      <div className="flex items-center space-x-12 text-sm">
        <button
          onClick={handleResend}
          disabled={!isDisabled}
          className="text-blue-600 disabled:text-gray-400"
        >
          Send code reload in
        </button>
        <span className={isDisabled ? "text-blue-600" : "text-gray-500"}>
          {formatTime(timer)}
        </span>
      </div>
      <ButtonComponent 
      buttonStyles={'w-full'} 
      variant="primary" 
      label="Continue"
      onClick={handleContinue}
      />
    </div>
  );
}