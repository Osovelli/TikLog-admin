import { CustomButton } from "../CustomButton";

export const TabButton = ({ label, active, onClick }) => (
  <CustomButton
    buttonVariant={"outline"}
    onClick={onClick}
    className={`px-3 py-2 border-0  rounded-b-none text-sm font-medium transition-colors ${
    active 
      ? 'text-indigo-600 border-b-2 border-indigo-600' 
      : 'text-gray-500 hover:text-gray-700'
    }`}
  >
    {label}
  </CustomButton>
    /* <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium transition-colors ${
        active 
          ? 'text-indigo-600 border-b-2 border-indigo-600' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button> */
    
  );