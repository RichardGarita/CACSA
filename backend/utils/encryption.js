const crypto = require('crypto');

const encrypt = (text) => {
  // Definir una clave secreta y un vector de inicialización (IV) para el cifrado AES
  const secretKey = crypto.scryptSync(process.env.SECRET_KEY, 'GfF', 32);

  const iv = crypto.randomBytes(16); // Generar un IV aleatorio para cada cifrado
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted.toString();
}

const decrypt = (text) => {
  // Definir una clave secreta y un vector de inicialización (IV) para el cifrado AES
  const secretKey = crypto.scryptSync(process.env.SECRET_KEY, 'GfF', 32);

  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted.toString();
}

module.exports = {
  encrypt,
  decrypt
};
