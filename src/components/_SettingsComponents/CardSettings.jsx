import { Plus } from "lucide-react";
import { ButtonComponent } from "../ButtonComponent";
import { useState } from "react";
import { CardSideMenu } from "./CardSideMenu";
import { AddCardContent } from "./AddCardContent";
import CardItemContent from "./CardItemContent";

  const CardItem = ({ type, isDefault, cardNumber, onSetDefault }) => {
    const [isOpen, setIsOpen] = useState(false);

    const CardIcon = () => {
      if (type === "Mastercard") {
        return (
          <div className="w-10 h-6 bg-[#EB001B]/10 rounded flex items-center justify-center">
            <div className="flex -space-x-3">
              <div className="w-3 h-3 bg-[#EB001B] rounded-full" />
              <div className="w-3 h-3 bg-[#F79E1B] rounded-full opacity-80" />
            </div>
          </div>
        );
      } else {
        return (
          <div className="w-10 h-6 bg-[#1434CB]/10 rounded flex items-center justify-center">
            <span className="text-[#1434CB] font-bold text-sm">V</span>
          </div>
        );
      }
    };

    const handleClose = () => {
      setIsOpen(false);
    };
  
    return (
      <>
      <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors rounded-lg group">
        <div className="flex items-center gap-3">
          <CardIcon />
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{type}</span>
              {isDefault && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  DEFAULT
                </span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <span>Debit</span>
              <span className="mx-2">•</span>
              <span>{cardNumber}</span>
            </div>
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" onClick={() => setIsOpen(true)}>
            <path 
              fill="currentColor" 
              d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
            />
          </svg>
        </button>
      </button>
      <CardSideMenu
       isOpen={isOpen} 
       onClose={handleClose}
        content={
          <CardItemContent
            onClose={handleClose}
            cardNumber={cardNumber}
            isDefault={isDefault}
            onSetDefault={onSetDefault}
          />
        }/>
      </>
    );
  };
  
  export const CardSettings = () => {
    const [cards, setCards] = useState([
      {
        id: 1,
        type: "Mastercard",
        isDefault: true,
        cardNumber: "•••• 0000"
      },
      {
        id: 2,
        type: "Visa",
        isDefault: false,
        cardNumber: "•••• 0000"
      }
    ]);
    const [isAddCardOpen, setIsAddCardOpen] = useState(false);

    const handleSetDefault = (cardId) => {
      setCards(cards.map(card => ({
        ...card,
        isDefault: card.id === cardId
      })));
    };

    const handleAddCard = (newCard) => {
      setCards(prevCards => {
        // If the new card is set as default, update other cards
        if (newCard.isDefault) {
          return [...prevCards.map(card => ({ ...card, isDefault: false })), newCard];
        }
        return [...prevCards, newCard];
      });
    };

    return (
      <div className="space-y-6 bg-white p-2 rounded-md">
          <div className="flex items-center justify-between">
              <div>
                  <h2 className="text-base font-medium text-blue-600">Card</h2>
                  <p className="text-sm text-gray-500">Add, remove and manage bank card</p>
              </div>
              <ButtonComponent 
              label={"Add Card"} 
              icon={<Plus size={20} />} 
              variant={"primary"} 
              className="flex items-center gap-2 px-4 py-2 bg-[#27115F] text-white rounded-lg hover:bg-[#27115F]/90 transition-colors" 
              onClick={() => setIsAddCardOpen(true)}
              />
          </div>
          <div className="space-y-2">
            {cards.map(card => (
              <CardItem
                key={card.id}
                type={card.type}
                isDefault={card.isDefault}
                cardNumber={card.cardNumber}
                onSetDefault={() => handleSetDefault(card.id)}
              />
            ))}
          </div>
          <CardSideMenu 
          isOpen={isAddCardOpen}
          onClose={() => setIsAddCardOpen(false)}
          title="Add card"
          content={
            <AddCardContent
              onClose={() => setIsAddCardOpen(false)}
              onAddCard={handleAddCard}
            />
          }
        />
      </div>
    )
  }
  