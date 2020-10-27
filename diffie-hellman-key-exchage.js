// example of using Diffie-Hellman key exchange

const crypto = require('crypto');

const alice = crypto.getDiffieHellman("modp15");
const bob = crypto.getDiffieHellman("modp15");

// console.log(alice.getPrime().toString("hex"));

// now we are generating public and private keys for Alice and Bob
alice.generateKeys();
bob.generateKeys();

// console.log("Alice prime (p):",alice.getPrime().toString('hex'),"\nAlice generator (G):",alice.getGenerator().toString('hex'));

// console.log("\nAlice private key:",alice.getPrivateKey().toString('hex'));
// console.log("\nBob private key:",bob.getPrivateKey().toString('hex'));

// console.log("\nAlice public key:",alice.getPublicKey().toString('hex'));
// console.log("\nBob public key:",bob.getPublicKey().toString('hex'));

// next we need to compute shared key between them
const aliceSecret = alice.computeSecret(bob.getPublicKey(), null, 'hex');
const bobSecret = bob.computeSecret(alice.getPublicKey(), null, 'hex');

console.log(aliceSecret === bobSecret);

// This is shared secret Alice and Bob can use it to encrypt and decrypt messages between them

console.log('Alice shared secret:', aliceSecret);
console.log();
console.log('Bob shared secret:', bobSecret);