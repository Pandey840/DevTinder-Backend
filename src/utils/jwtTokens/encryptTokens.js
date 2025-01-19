const crypto = require('crypto');

const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET;

// Encryption algorithm and initialization vector
const algorithm = 'aes-256-cbc';
const iv = crypto.randomBytes(16); // Generate a random IV
const key = Buffer.from(
  process.env.ACCESS_TOKEN_SECRET.padEnd(32, '0'),
  'utf-8',
);

const encryptToken = (token) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {encryptedToken: encrypted, iv: iv.toString('hex')}; // Return encrypted token and IV
};

const decryptToken = (encryptedToken, iv) => {
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex'),
  );
  let decrypted = decipher.update(encryptedToken, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = {encryptToken, decryptToken};
