import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privatekey, setprivatekey] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
        privatekey={privatekey}
        setprivatekey={setprivatekey}
      />
      <Transfer 
      setBalance={setBalance} 
      address={address}
      privatekey={privatekey}  
      />
    </div>
  );
}

export default App;
