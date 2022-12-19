import crypto from 'crypto';

const randomHex = (size = 20) => crypto.randomBytes(size).toString('hex');

export { randomHex };
