
import { ButtonComponent } from "../ButtonComponent";
import { NewDeliveryForm } from "../NewDeliveryForm";
import SideSheet from "../SheetComponent";


const NewDeliverySideMenu = ({ isOpen, onClose, openModal }) => {
    return (
      <SideSheet
        isOpen={isOpen}
        onClose={onClose}
        title="New Delivery"
      >
        <NewDeliveryForm openDeliveryModal={openModal} />
      </SideSheet>
    );
  };
  
  export default NewDeliverySideMenu;