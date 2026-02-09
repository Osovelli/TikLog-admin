import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { X, Camera, Loader2, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import useRiderStore from '@/store/riderStore';
import useUploadStore from '@/store/uploadStore';
import toast from 'react-hot-toast';

const AddRiderModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    othername: '',
    email: '',
    password: '',
    countryCode: '+234',
    phone: '',
    dob: null,
    profileImage: null,
    profileImagePreview: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const profileImageRef = useRef(null);

  const { createVendorRider } = useRiderStore();
  const { uploadFile } = useUploadStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    setFormData(prev => ({
      ...prev,
      profileImage: file,
      profileImagePreview: URL.createObjectURL(file),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      let profileImageData = null;
      if (formData.profileImage) {
        profileImageData = await uploadFile(formData.profileImage, 'riders/profiles');
      }

      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        othername: formData.othername,
        email: formData.email,
        password: formData.password,
        countryCode: formData.countryCode,
        phone: formData.phone,
        dob: formData.dob ? format(formData.dob, 'yyyy-MM-dd') : null,
        nationality: 'Nigerian',
        ...(profileImageData && {
          profileImage: {
            url: profileImageData.url,
            publicId: profileImageData.publicId,
          },
        }),
      };

      await createVendorRider(payload);
      handleClose();
    } catch (error) {
      console.error('Error creating rider:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      firstname: '',
      lastname: '',
      othername: '',
      email: '',
      password: '',
      countryCode: '+234',
      phone: '',
      dob: null,
      profileImage: null,
      profileImagePreview: null,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Add New Rider</h2>
          <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="mt-4">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                {formData.profileImagePreview ? (
                  <img src={formData.profileImagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => profileImageRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={profileImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageUpload}
              />
            </div>
          </div>

        <div className="space-y-4">
          <Input
            name="firstname"
            value={formData.firstname}
            onChange={handleInputChange}
            placeholder="First name*"
            className={errors.firstname ? "border-red-500" : ""}
          />
          {errors.firstname && <p className="text-red-500">{errors.firstname}</p>}

          <Input
            name="lastname"
            value={formData.lastname}
            onChange={handleInputChange}
            placeholder="Last name*"
            className={errors.lastname ? "border-red-500" : ""}
          />
          {errors.lastname && <p className="text-red-500">{errors.lastname}</p>}

          <Input
            name="othername"
            value={formData.othername}
            onChange={handleInputChange}
            placeholder="Other name"
          />

          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address*"
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          <Input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password*"
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-red-500">{errors.password}</p>}

          <Input
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Phone number*"
            className={errors.phone ? "border-red-500" : ""}
          />
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          
          <Button onClick={handleSubmit} disabled={isSubmitting} className="mt-4 w-full bg-blue-600 hover:bg-blue-700">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Rider'
            )}
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AddRiderModal;