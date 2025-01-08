import { CardComponent } from "../CardComponent";


export const WalletCard = () => {
    return (
      <CardComponent
        title="Wallet"
        action="Fund wallet"
        content={<p className="text-3xl font-bold mt-2">NGN 20,000</p>}
        className="mb-6"
      />
    );
  };