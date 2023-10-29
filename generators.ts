import elliptic from "elliptic"
import crypto from "crypto"
const EC = elliptic.ec;
const ec = new EC('secp256k1');
// Encryption settings
const ENCRYPTION_ALGORITHM = 'aes-256-cbc';
const HMAC_SECRET_KEY = "myhmacsecretkey";
const ENCRYPTION_KEY = crypto.randomBytes(32); // Generate a secure encryption key
const ENCRYPTION_IV = crypto.randomBytes(16); // Generate a secure initialization vector
// Generate key pair for a user
export const generateKeyPair = () => {
    // Generate a new key pair for the user
    const keyPair = ec.genKeyPair();
    const publicKey = keyPair.getPublic('hex');
    const privateKey = keyPair.getPrivate('hex');
    // Encrypts the private key using the encryption key and initialization vector
    function encryptPrivateKey(privateKey: string) {
        const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, ENCRYPTION_IV);
        let encrypted = cipher.update(privateKey, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        // Calculate HMAC of the encrypted private key
        const hmac = crypto.createHmac('sha256', HMAC_SECRET_KEY);
        hmac.update(encrypted);
        const hmacDigest = hmac.digest('hex');
        return encrypted + hmacDigest; // Append HMAC to the encrypted private key
    }
    // Encrypt the private key
    const encryptedPrivateKey = encryptPrivateKey(privateKey);
    return { publicKey, encryptedPrivateKey };
};
// Decrypts the private key using the encryption key and initialization vector
export const decryptPrivateKey = (encryptedPrivateKey: string) => {
    const hmac = encryptedPrivateKey.slice(-64); // Extract HMAC from the end
    const encrypted = encryptedPrivateKey.slice(0, -64); // Remove HMAC from the end
    const hmacToVerify = crypto.createHmac('sha256', HMAC_SECRET_KEY)
        .update(encrypted)
        .digest('hex');
    if (hmac === hmacToVerify) {
        const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, ENCRYPTION_KEY, ENCRYPTION_IV);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } else {
        throw new Error("verification failed(HMAC). The encrypted private key may have been tampered with.");
    }
};