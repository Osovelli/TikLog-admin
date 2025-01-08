import { TrendingDown,  TrendingUp, User, Store, Users } from "lucide-react";
import { FaBicycle } from "react-icons/fa";
import { Card } from "./Card";


export const HighlightCard = ({ icon, currentValue, previousValue, label }) => {
    const percentageChange = ((currentValue - previousValue) / previousValue) * 100;
    const hasIncreased = currentValue > previousValue;
    
    const Icon = () => {
      switch (icon) {
        case 'user':
          return <User className="w-5 h-5 text-gray-500" />;
        case 'store':
          return <Store className="w-5 h-5 text-gray-500" />;
        case 'bicycle':
          return (
            <FaBicycle className="w-5 h-5 text-gray-500" />
          );
        case 'users':
          return <Users className="w-5 h-5 text-gray-500" />;
        default:
          return null;
      }
    };
  
    return (
      <Card>
        <div className="p-6 space-y-2">
          <Icon />
          <div className="text-2xl font-bold">
            {currentValue.toLocaleString()}
          </div>
          <div className="flex justify-between">
            <div className="text-sm text-gray-500">
                {label}
            </div>
            <div className={`text-sm flex items-center gap-1 ${
                hasIncreased ? 'text-green-600' : 'text-red-600'
            }`}
            >
                {hasIncreased ? (
                <TrendingUp className="w-4 h-4" />
                ) : (
                <TrendingDown className="w-4 h-4" />
                )}
                <span>{Math.abs(percentageChange).toFixed(1)}% {hasIncreased ? 'more' : 'less'}</span>
            </div>
          </div>     
        </div>
      </Card>
    );
  };
  