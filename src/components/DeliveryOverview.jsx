import { CardComponent } from "./CardComponent";

export const DeliveryOverview = () => {
    const stats = [
      { title: 'All time', value: '205' },
      { title: 'Delivered', value: '200' },
      { title: 'Cancelled', value: '3' },
      { title: 'In Progress', value: '2' },
    ];
  
    return (
      <CardComponent
        title="Delivery Overview"
        action="This week"
        content={
          <div className="grid sm:grid-cols-4 grid-cols-2 gap-4 mt-4">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            ))}
          </div>
        }
        className="mb-6"
      />
    );
  };
  
/*   export const WalletCard = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold">Wallet</h3>
          <select className="text-sm border-none bg-transparent text-gray-500">
            <option>Fund wallet</option>
          </select>
        </div>
        <p className="text-3xl font-bold">NGN 20,000</p>
      </div>
    );
  }; */