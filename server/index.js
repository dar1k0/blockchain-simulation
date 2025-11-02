const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {keccak256}= require("ethereum-cryptography/keccak");
const {utf8ToBytes,hexToBytes,toHex}= require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

app.use(cors());
app.use(express.json());

const balances = {
  "0xcbf7c978ee795ada5b418bf5d17f6aed22c68cf6": 100,
  "0x59f3d8f175078747427a3f4b44f7aeb3a3413b25": 50,
  "0xd9a651b5a3b2c46a572f464b08af6d044f0f4e4d": 75,
};
const privatekeys = {
  "0xcbf7c978ee795ada5b418bf5d17f6aed22c68cf6":"a52cc54e4b1c7bf1e159624a076e7458583727f25c1b4de659d2dbeda38b2631",
  "0xd9a651b5a3b2c46a572f464b08af6d044f0f4e4d":"a6aef6b51c74b5fa0d870928b1252ebe1223b2024ef75d7384024ba42e2d392d",
  "0x59f3d8f175078747427a3f4b44f7aeb3a3413b25":"2c243181ff62e6e6831ce679f307a82ea3afe8f51ced13d3f7601e28671840fa",
}


app.get("/balance/:address", (req, res) => {
    console.log("Received:", req.body); 
  const { address } = req.params;
  const balance = balances[address] || 0;
  const privatekey= privatekeys[address] ;
  res.send({ balance,privatekey } );
  
});

app.post("/send", (req, res) => {
  console.log("=== Received Request ===");
  console.log("2. Body:", JSON.stringify(req.body, null, 2));
  const { sender, recipient, amount ,signature} = req.body;
  const {r,s,recovery}=signature ;
  const msg = {sender, amount, recipient};
  const hsh = keccak256(utf8ToBytes(JSON.stringify(msg)));
  function verify(){
    // ✅ signa
    const signa = new secp.secp256k1.Signature(BigInt(r), BigInt(s), recovery);
    const rpk = signa.recoverPublicKey(hsh);
    const pk = toHex(rpk.toRawBytes());
    return secp.secp256k1.verify(signa, hsh, pk);

  }
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] , valid:verify()});
    
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
