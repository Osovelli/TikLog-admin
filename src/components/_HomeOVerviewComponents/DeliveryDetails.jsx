export const DeliveryDetails = () => (
<>
<h2 className="text-xl font-semibold mb-4">Delivery amount</h2>
      <p className="text-2xl font-bold mb-4">NGN 3,000.00</p>
      <div className="text-left space-y-2 mb-4 p-2 rounded-md bg-[#F6F8FA]">
        <div className="flex items-center">
          <span className="w-3 h-3 bg-indigo-600 rounded-full mr-2"></span>
          <span className="font-semibold">Pickup location</span>
        </div>
        <p className="ml-5">100, Ebute metta str, off alagbado avenue ijebu road</p>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span className="font-semibold">Delivery location</span>
        </div>
        <p className="ml-5">100, Ebute metta str, off alagbado avenue ijebu road</p>
      </div>
</>
  );