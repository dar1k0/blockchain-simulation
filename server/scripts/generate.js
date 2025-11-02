const {secp256k1}= require('ethereum-cryptography/secp256k1');
const {keccak256} = require('ethereum-cryptography/keccak');
const secp = require('ethereum-cryptography/secp256k1');
const {toHex , utf8ToBytes}= require('ethereum-cryptography/utils');

const privatekey = secp256k1.utils.randomPrivateKey();
console.log(toHex(privatekey));

const publickey = secp256k1.getPublicKey(privatekey);
console.log(toHex(publickey));

let walletaddy = (publickey) => {
    const hash = keccak256(publickey.slice(1));
    const walletadd = hash.slice(-20);
    return walletadd;
}
console.log("wallet address :" ,"0x"+toHex(walletaddy(publickey)));