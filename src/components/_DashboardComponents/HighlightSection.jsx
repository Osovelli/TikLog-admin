import { HighlightCard } from "./HighlightCard";

export const HighlightSection = () => {
    const highlights = [
      {
        icon: 'user',
        currentValue: 65422,
        previousValue: 58000,
        label: 'Customers'
      },
      {
        icon: 'store',
        currentValue: 643,
        previousValue: 570,
        label: 'Vendors'
      },
      {
        icon: 'bicycle',
        currentValue: 12340,
        previousValue: 14000,
        label: 'Riders'
      },
      {
        icon: 'users',
        currentValue: 28,
        previousValue: 25,
        label: 'Admin Users'
      }
    ];
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {highlights.map((highlight, index) => (
          <HighlightCard
            key={index}
            icon={highlight.icon}
            currentValue={highlight.currentValue}
            previousValue={highlight.previousValue}
            label={highlight.label}
          />
        ))}
      </div>
    );
  };