import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Modal from '../ModalComponent';
import { CustomButton } from '../CustomButton';
import { CustomDropdown } from '../CustomDropDown';


const ColorPicker = ({ color, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const colors = ['Red', 'Blue', 'Black', 'White', 'Silver', 'Gray'];

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left border rounded-lg flex items-center justify-between bg-white"
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded-sm border" 
            style={{ backgroundColor: color.toLowerCase() }}
          />
          <span className="text-gray-900">{color}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg p-2">
          <div className="grid grid-cols-3 gap-2">
            {colors.map((colorOption) => (
              <button
                key={colorOption}
                onClick={() => {
                  onChange(colorOption);
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
              >
                <div 
                  className="w-5 h-5 rounded-sm border" 
                  style={{ backgroundColor: colorOption.toLowerCase() }}
                />
                <span className="text-sm">{colorOption}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ImageUpload = ({ index, onImageChange }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageChange(index, file);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="hidden"
        id={`image-upload-${index}`}
      />
      <label 
        htmlFor={`image-upload-${index}`}
        className="cursor-pointer block"
      >
        {preview ? (
          <div className="aspect-square rounded-lg overflow-hidden">
            <img 
              src={preview} 
              alt="Vehicle" 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors">
            <svg 
              className="w-8 h-8 text-gray-400" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M20 15l-5-5L5 20" />
            </svg>
          </div>
        )}
      </label>
    </div>
  );
};

export const VehicleInfoModal = ({ isOpen, onClose, vehicle }) => {
  const [vehicleData, setVehicleData] = useState({
    make: vehicle?.make || 'Toyota',
    model: vehicle?.model || 'Corolla',
    year: vehicle?.year || '2023',
    color: vehicle?.color || 'Red',
    licensePlate: vehicle?.licensePlate || 'ABC - 1234 - IKJ',
    driverName: vehicle?.driverName || 'Remi Aluko',
    images: vehicle?.images || []
  });

  const makeOptions = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes'];
  const modelOptions = {
    Toyota: ['Corolla', 'Camry', 'RAV4', 'Highlander'],
    Honda: ['Civic', 'Accord', 'CR-V', 'Pilot'],
    Ford: ['Focus', 'Fusion', 'Escape', 'Explorer'],
    BMW: ['3 Series', '5 Series', 'X3', 'X5'],
    Mercedes: ['C-Class', 'E-Class', 'GLC', 'GLE']
  };
  const yearOptions = Array.from({ length: 10 }, (_, i) => (2024 - i).toString());

  const handleImageChange = (index, file) => {
    const newImages = [...vehicleData.images];
    newImages[index] = file;
    setVehicleData({ ...vehicleData, images: newImages });
  };

  const handleSave = () => {
    console.log('Saving vehicle data:', vehicleData);
    onClose();
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Vehicle Information"
    >
      <div className="space-y-4">
        <CustomDropdown
          value={vehicleData.make}
          options={makeOptions}
          onChange={(make) => setVehicleData({ 
            ...vehicleData, 
            make,
            model: modelOptions[make][0] // Reset model when make changes
          })}
        />

        <div className="grid grid-cols-2 gap-4">
          <CustomDropdown
            value={vehicleData.model}
            options={modelOptions[vehicleData.make] || []}
            onChange={(model) => setVehicleData({ ...vehicleData, model })}
          />
          <CustomDropdown 
            value={vehicleData.year}
            options={yearOptions}
            onChange={(year) => setVehicleData({ ...vehicleData, year })}
          />
        </div>

        <ColorPicker 
          color={vehicleData.color}
          onChange={(color) => setVehicleData({ ...vehicleData, color })}
        />

        <CustomDropdown 
          value={vehicleData.licensePlate}
          options={[vehicleData.licensePlate]}
          onChange={(licensePlate) => setVehicleData({ ...vehicleData, licensePlate })}
        />

        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <ImageUpload 
              key={index}
              index={index}
              onImageChange={handleImageChange}
            />
          ))}
        </div>

        <CustomDropdown 
          value={vehicleData.driverName}
          options={[vehicleData.driverName]}
          onChange={(driverName) => setVehicleData({ ...vehicleData, driverName })}
        />

        <div className="pt-4">
          <CustomButton
            buttonVariant={'primary'}
            onClick={handleSave}
            className="w-full  py-3 px-4 rounded-lg  transition-colors"
          >
            Save changes
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};