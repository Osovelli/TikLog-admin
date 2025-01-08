import { CustomButton } from "../CustomButton";

export const TimeframeButton = ({ label, active, onClick }) => (
  <CustomButton 
  onClick={onClick}
  className={`px-2 py-1.5 text-sm rounded-lg transition-colors ${
    active 
      ? 'bg-indigo-600 text-white' 
      : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
  >
    {label}
  </CustomButton>

    /* <button
      onClick={onClick}
      className={`px-2 py-1.5 text-sm rounded-lg transition-colors ${
        active 
          ? 'bg-indigo-600 text-white' 
          : 'bg-white text-gray-600 hover:bg-gray-50'
      }`}
    >
      {label}
    </button> */
  );