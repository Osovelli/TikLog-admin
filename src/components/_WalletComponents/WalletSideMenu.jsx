import SideSheet from "../SheetComponent";

const WalletSideMenu = ({ isOpen, onClose, openModal }) => {
    return (
      <SideSheet
        isOpen={isOpen}
        onClose={onClose}
        title="New Delivery"
      >
        {content}
      </SideSheet>
    );
  };
  
export default WalletSideMenu;