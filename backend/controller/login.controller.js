import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import db from '../db/subjects.db.js';
import { secret } from '../config/config.js';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.createHash('sha512').update(password).update(salt).digest();
  const hashWithSalt = `${salt.toString('base64')}:${hash.toString('base64')}`;

  return hashWithSalt;
}

export async function checkPassword(req, res) {
  const { password, username } = req.body;

  console.log(req.body);

  if (!password || !username) {
    res.json('Invalid Username/Password!');
    return;
  }

  const [userDetails] = await db.getUserDetails(username);
  if (userDetails[0]) {
    const [saltB64, expectedHashB64] = userDetails[0].Password.split(':');
    const expectedHash = Buffer.from(expectedHashB64, 'base64');
    const salt = Buffer.from(saltB64, 'base64');

    const actualHash = crypto.createHash('sha512').update(password).update(salt).digest();
    if (expectedHash.equals(actualHash)) {
      const token = jwt.sign({ username: userDetails[0].UserName, role: userDetails[0].Role }, secret, {
        expiresIn: '24h',
      });
      res.status(200).json({ token, user: { username: userDetails[0].UserName, role: userDetails[0].Role } });
      return;
    }
  }

  res.status(401).json('Incorrect Username/Password!');
}
