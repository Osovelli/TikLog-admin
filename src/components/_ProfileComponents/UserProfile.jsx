  import { useRef, useState } from 'react';
  import { format } from 'date-fns';
  import { Button } from '@/components/ui/button';
  import { Calendar } from '@/components/ui/calendar';
  import { Input } from '@/components/ui/input';
  import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
  import { CalendarIcon, Copy, Edit, MapPin, PencilIcon, Trash2, Upload } from 'lucide-react';
  import CountryCodeSelect from '../GetCountryCode';
  import { ButtonComponent } from '../ButtonComponent';
  import { useModal } from '@/lib/ModalContext';
import AddressForm from './AddressForm';
  

  function ProfileHeader({ profilePicture, onProfilePictureChange }) {
    // Create a reference to the file input
    const fileInputRef = useRef(null);

    const handleUploadClick = (e) => {
      e.preventDefault(); // Prevent default button behavior
      fileInputRef.current.click(); // Trigger file input click
    };

    return (
      <div className="relative">
        <div className="h-48 w-full bg-sky-100 relative">
          <img
            src="Image-wrap.png"
            alt="Profile banner"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute bottom-12 left-8 transform translate-y-1/2">
          <div className="relative">
            <img
              src={profilePicture || 'profile-pic.png'}
              alt="Profile picture"
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <label htmlFor="profile-picture" className="absolute bottom-0 right-0 cursor-pointer">
              <input
                ref={fileInputRef}
                type="file"
                id="profile-picture"
                accept="image/*"
                className="hidden"
                onChange={onProfilePictureChange}
              />
              <Button 
                onClick={handleUploadClick} 
                variant="ghost" 
                size="icon" 
                className="bg-white rounded-full shadow-md"
              >
                <Upload className="h-4 w-4 text-gray-500" />
              </Button>
            </label>
          </div>
        </div>
        <div className="ml-48 pt-4">
          <h1 className="text-2xl font-semibold">John Doe Messi</h1>
          <p className="text-gray-500">johndoe@tiklog.com</p>
        </div>
      </div>
    );
  }
  
  function PersonalInfo() {
    const [formData, setFormData] = useState({
      username: "",
      image: '',
      email: '',
      phone: '',
      date: '',
      address: '',
      profilePicture: null,
    });
    
  
    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleDateChange = (date) => {
      setFormData({ ...formData, date });
    };
  
    return (
      <div className="mt-8 mb-8 flex flex-col md:flex-row px-4 md:gap-10 justify-between">
        <div className="">
          <h2 className="text-lg font-semibold">Personal info</h2>
          <p className="text-gray-500 mb-6">Update your photo and personal details.</p>
        </div>
  
        <div className="space-y-4 w-full md:w-1/2">
          <div className="relative">
            <Input
              name="username"
              value={formData.username}
              placeholder="Enter username"
              onChange={handleInputChange}
              className="h-12"
            />
          </div>
  
          <div className="flex gap-4">
            <CountryCodeSelect />
            <div className="relative flex-1">
              <Input
                name="phone"
                placeholder="08000000000"
                value={formData.phone}
                onChange={handleInputChange}
                className="h-12"
              />
            </div>
          </div>
  
          <div className="relative">
            <Popover>
              <PopoverTrigger asChild>
                <div className="h-12 w-full rounded border px-3 flex items-center justify-between cursor-pointer">
                  {formData.date ? format(formData.date, 'dd - MM - yyyy') : '22-02-2022'}
                  <CalendarIcon className="mr-2 h-4 w-4" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateChange}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
  
          <div className="relative">
            <Input
              name="address"
              value={formData.address}
              placeholder="Enter address"
              onChange={handleInputChange}
              className="h-12"
            />
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
  
          <div className="flex justify-end">
            <ButtonComponent label={'Save Changes'} variant={'primary'} />
          </div>
        </div>
      </div>
    );
  }
  
  function AddressSection() {
    const {openModal, closeModal} = useModal() 

    const handleAddNewAddress = () => {
      openModal({
        title: "New Address",
        content: <AddressForm />,
        buttons: [
          {
            label: "Add new",
            primary: true,
            onClick: () => {
              // Handle password change logic here
              closeModal();
            },
          }
        ]
      });
    };

    const addresses = [
      { type: 'Home', address: '56 Opebi road, Sabo Yaba.' },
      { type: 'Office', address: '56 Opebi road, Sabo Yaba.' },
    ];
  
    return (
      <div className="mb-8 flex flex-col md:flex-row px-4 md:gap-10 justify-between">
        <div className="">
          <h2 className="text-lg font-semibold">Address</h2>
          <p className="text-gray-500 mb-6">Below is your address</p>
        </div>
  
        <div className="space-y-4 max-w-2xl md:w-1/2 w-full">
          {addresses.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg bg-white"
            >
              <div className='w-full flex items-center justify-between'>
                <div className='flex items-center gap-4'>
                  <h3 className="font-medium">{item.type}</h3>
                  <span className="text-gray-500 text-sm p-2 shadow-sm border px-4">{item.address}</span>
                </div>             
                <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Trash2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <PencilIcon className="h-4 w-4" />
                </Button>
              </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end gap-2 mt-6 max-w-2xl">
            <ButtonComponent label={'Add new'} variant={'white'} onClick={handleAddNewAddress} />
            <ButtonComponent label={'Save Changes'} variant={'primary'} />
          </div>
        </div>
      </div>
    );
  }
  
  export default function UserProfile() {
    const [profilePicture, setProfilePicture] = useState(null)

    const handleProfilePictureChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Create a URL for the selected image file
        const imageUrl = URL.createObjectURL(file);
        setProfilePicture(imageUrl); // Just set the URL string directly
      }
    };

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-[1200px] mx-auto">
          <h1 className="text-2xl font-semibold p-6">Profile</h1>
  
          <div className="bg-white rounded-lg border">
            <ProfileHeader
            profilePicture={profilePicture}
            onProfilePictureChange={handleProfilePictureChange}
            />
  
            <div className="p-6">
              <PersonalInfo />
              <AddressSection />
            </div>
          </div>
        </div>
      </div>
    );
  }