import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';
import { CardComponent } from '../CardComponent';

export const OngoingDelivery = () => {
  return (
    <CardComponent
      title={
        <div className="flex w-full justify-between items-center">
          <span>Ongoing Delivery</span>
          {/* <span className="text-blue-500 text-sm font-normal">#123354</span> */}
        </div>
      }
      highlight={"#123354"}
      content={
        <div className="space-y-4">
          {/* Map Placeholder */}
          <div className="bg-gray-200 h-48 rounded-lg relative overflow-hidden">
            <img src="Localy Maps.png" alt="Map placeholder" className="w-full h-full object-cover" />
            {/* Map icons */}
            <div className="absolute inset-0 flex items-center justify-between px-4">
              <MapPin className="text-blue-500" size={24} />
              <div className="w-1/2 h-1 bg-orange-300"></div>
              <MapPin className="text-green-500" size={24} />
            </div>
          </div>

          {/* Dispatcher Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src="Avatar1.png" alt="Jane Doe" className="w-12 h-12 rounded-full" />
              <div>
                <h4 className="font-semibold">Jane Doe</h4>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-gray-500">Toyota Corolla: ABJ 123 YZ</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 bg-blue-100 text-blue-500 rounded-full">
                <Phone size={20} />
              </button>
              <button className="p-2 bg-blue-100 text-blue-500 rounded-full">
                <Mail size={20} />
              </button>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-2">
            <div className="flex items-start">
              <div className="mt-1 mr-3 w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-semibold">Pickup location</p>
                <p className="text-sm text-gray-500">100, Ebute metta str, off alagbado avenue ijebu road</p>
              </div>
              <span className="ml-auto text-sm text-gray-500">~2 mins away</span>
            </div>
            <div className="flex items-start">
              <div className="mt-1 mr-3 w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-semibold">Delivery location</p>
                <p className="text-sm text-gray-500">100, Ebute metta str, off alagbado avenue ijebu road</p>
              </div>
            </div>
          </div>
        </div>
      }
      className="mb-6"
    />
  );
};