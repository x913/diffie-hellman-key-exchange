// example of using ECDH with AES 256 GCM 

const crypto = require('crypto');

const alice = crypto.createECDH('secp256k1');
alice.generateKeys();

const bob = crypto.createECDH('secp256k1');
bob.generateKeys();

const alicePublicKeysBase64 = alice.getPublicKey().toString('base64');
const bobPublicKeysBase64 = bob.getPublicKey().toString('base64');

const aliceSharedKey = alice.computeSecret(bobPublicKeysBase64, 'base64', 'hex');
const bobSharedKey = bob.computeSecret(alicePublicKeysBase64, 'base64', 'hex');

console.log(aliceSharedKey === bobSharedKey);

const MESSAGE = 'This is some random message...';

const IV = crypto.randomBytes(16);
const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(aliceSharedKey, 'hex'), IV);

let encrypted = cipher.update(MESSAGE, 'utf8', 'hex');
encrypted += cipher.final('hex');

const auth_tag = cipher.getAuthTag().toString('hex');
console.table({
    IV: IV.toString('hex'),
    encrypted: encrypted,
    auth_tag: auth_tag,
});

const payload = IV.toString('hex') + encrypted + auth_tag;
const payloadBase64 = Buffer.from(payload, 'hex').toString('base64');

// encrypted message for bob
console.log(payloadBase64);

// Bob will do from here to decrypt payloadBase64
const bob_payload = Buffer.from(payloadBase64, 'base64').toString('hex');

// Payload represented as:
//  / -- \    -------> IV (32 chars long)
//  | -- |    -------> Encrypted Message
//  \ -- /    -------> Authentication tag (32 chars long)

const bob_iv = bob_payload.substr(0, 32);
const bob_encrypted = bob_payload.substr(32, bob_payload.length - 64);
const bob_auth_tag = bob_payload.substr(bob_payload.length - 32, 32);

console.table({ bob_iv, bob_encrypted, bob_auth_tag });

try {
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm', 
        Buffer.from(bobSharedKey, 'hex'), 
        Buffer.from(bob_iv, 'hex')
    );
    decipher.getAuthTag
    decipher.setAuthTag(Buffer.from(bob_auth_tag, 'hex'));
    let decrypted = decipher.update(bob_encrypted, 'hex', 'utf-8');
    decrypted += decipher.final('utf-8');
    console.log("Decrypted message:", decrypted);
} catch(error) {
    console.log(error.message);
}