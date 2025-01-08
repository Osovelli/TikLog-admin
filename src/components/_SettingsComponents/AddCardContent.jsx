import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { ButtonComponent } from "../ButtonComponent";

export const AddCardContent = ({ onClose, onAddCard }) => {
    const [formData, setFormData] = useState({
      cardNumber: '',
      cvv: '',
      expiry: '',
      setAsDefault: false
    });
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onAddCard({
        id: Date.now(),
        type: formData.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard',
        isDefault: formData.setAsDefault,
        cardNumber: '•••• ' + formData.cardNumber.slice(-4)
      });
      onClose();
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-72 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card number</Label>
            <Input
              id="cardNumber"
              placeholder="Card number"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="CVV"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiry">MM/YY</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              />
            </div>
          </div>
  
          <div className="flex items-center space-x-2">
            <Checkbox
              id="setAsDefault"
              checked={formData.setAsDefault}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, setAsDefault: checked })
              }
            />
            <Label htmlFor="setAsDefault">Set as default</Label>
          </div>
        </div>
  
        <ButtonComponent
          variant={"primary"}
          label={"Add Card"}
        />
          
      </form>
    );
  };