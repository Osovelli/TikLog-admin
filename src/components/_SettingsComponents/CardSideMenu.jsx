import SideSheet from "../SheetComponent";

export const CardSideMenu = ({ isOpen, onClose, content }) => {
    return (
      <SideSheet
        isOpen={isOpen}
        onClose={onClose}
        title="View card details"
      >
        {content}
      </SideSheet>
    );
  };