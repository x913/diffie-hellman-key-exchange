// example of using ECDH wthi AES 256

const crypto = require('crypto');

const alice = crypto.createECDH('secp256k1');
alice.generateKeys();

const bob = crypto.createECDH('secp256k1');
bob.generateKeys();

const alicePublicKeysBase64 = alice.getPublicKey().toString('base64');
const bobPublicKeysBase64 = bob.getPublicKey().toString('base64');

const aliceSharedKey = alice.computeSecret(bobPublicKeysBase64, 'base64', 'hex');
const bobSharedKey = bob.computeSecret(alicePublicKeysBase64, 'base64', 'hex');

//console.log(aliceSharedKey === bobSharedKey);
// console.log(aliceSharedKey);
// console.log(bobSharedKey);

const aes256 = require('aes256');
const message = 'this is some random message...';
const encrypted = aes256.encrypt(aliceSharedKey, message);

const decrypted = aes256.decrypt(bobSharedKey, encrypted);
console.log(encrypted);
console.log(decrypted);