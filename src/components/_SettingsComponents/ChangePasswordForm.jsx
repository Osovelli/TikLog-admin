/* import React, { useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ChangePasswordForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  });

  const currentPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const PasswordInput = ({ name, value, placeholder, ref }) => (
    <div className="relative">
      <Input
        type={showPasswords[name] ? "text" : "password"}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="pr-10"
        ref={ref}
      />
      <button
        type="button"
        onClick={() => togglePasswordVisibility(name)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPasswords[name] ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  );

  return (
    <form className="space-y-4" onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}>
        
      <div className="space-y-2">
        <PasswordInput
          name="currentPassword"
          value={formData.currentPassword}
          placeholder="Enter current password"
          ref={currentPasswordRef}
        />
      </div>

      <div className="space-y-2">
        <PasswordInput
          name="newPassword"
          value={formData.newPassword}
          placeholder="Enter new password"
          ref={newPasswordRef}
        />
      </div>

      <div className="space-y-2">
        <PasswordInput
          name="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Confirm new password"
          ref={confirmPasswordRef}
        />
      </div>
    </form>
  );
};

export default ChangePasswordForm; */

import React, { useEffect, useRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../ui/input';
import { ButtonComponent } from '../ButtonComponent';

const PasswordInput = ({ name, value, placeholder, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef = useRef(null);
  
    const togglePasswordVisibility = () => {
      setShowPassword(prev => !prev);
    };
  
    useEffect(() => {
      // Ensure the input field maintains focus when toggling password visibility
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, [showPassword]);
  
    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="pr-10"
          ref={inputRef}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    );
  };

const ChangePasswordForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(formData);
      }}
    >
      <div className="space-y-2">
        <PasswordInput
          name="currentPassword"
          value={formData.currentPassword}
          placeholder="Enter current password"
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <PasswordInput
          name="newPassword"
          value={formData.newPassword}
          placeholder="Enter new password"
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <PasswordInput
          name="confirmPassword"
          value={formData.confirmPassword}
          placeholder="Confirm new password"
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

export default ChangePasswordForm;