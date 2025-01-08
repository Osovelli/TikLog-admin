import React, { useState } from 'react';
import { ButtonComponent } from '../ButtonComponent';

const AddressForm = () => {
  const [addressType, setAddressType] = useState('home');
  const [addressName, setAddressName] = useState('56 Opebi road, Sabo Yaba.');

  const handleTypeChange = (event) => {
    setAddressType(event.target.value);
  };

  const handleNameChange = (event) => {
    setAddressName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here
    console.log('Address Type:', addressType);
    console.log('Address Name:', addressName);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <select
          id="address-type"
          value={addressType}
          onChange={handleTypeChange}
          className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-500"
        >
          <option value="home">Home</option>
          <option value="office">Office</option>
        </select>
      </div>

      <div className="mb-4">
        <input
          type="text"
          id="address-name"
          value={addressName}
          onChange={handleNameChange}
          className="w-full border rounded-md py-2 px-3 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>
    </form>
  );
};

export default AddressForm;