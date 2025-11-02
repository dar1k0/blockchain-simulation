import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { keccak256 } from "ethereum-cryptography/keccak";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils";


function Transfer({ address, setBalance ,privatekey}) {

  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [status, setstatus] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  function hash(messg){
    return keccak256(utf8ToBytes(JSON.stringify(messg)));
  }
  
  async function transfer(evt) {
    evt.preventDefault();

    setstatus("processing");//inintial message as well as to give it some value 

    const messg = {
      sender:address,
      amount:parseInt(sendAmount),   //message
      recipient
    }
    const hsh = hash(messg);
    const sig= await secp.secp256k1.sign(hsh,privatekey);
    console.log(sig);
    
    
    try {
      const {
        data: { balance , valid},
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
// ✅ signature 
      signature: {
        r: sig.r.toString(),
        s: sig.s.toString(),
        recovery: sig.recovery
}
      });
      setBalance(balance);

      if(valid){
        setstatus("Transaction verified");
        setSendAmount("");
        setRecipient("");

        setTimeout(() => {
          setstatus("");
      }, 10000);
    }else{
      setstatus("invalid signature");
    }
  }
    catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
      {status && <p>{status}</p>}
    </form>
  );
}

export default Transfer;
