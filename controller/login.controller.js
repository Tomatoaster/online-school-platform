import crypto from 'crypto';
import db from '../db/subjects.db.js';

export function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.createHash('sha512').update(password).update(salt).digest();
  const hashWithSalt = `${salt.toString('base64')}:${hash.toString('base64')}`;

  return hashWithSalt;
}

export async function checkPassword(req, res) {
  const { password, username } = req.body;

  const [userDetails] = await db.getUserDetails(username);
  if (userDetails[0]) {
    const [saltB64, expectedHashB64] = userDetails[0].Password.split(':');
    const expectedHash = Buffer.from(expectedHashB64, 'base64');
    const salt = Buffer.from(saltB64, 'base64');

    const actualHash = crypto.createHash('sha512').update(password).update(salt).digest();
    if (expectedHash.equals(actualHash)) {
      req.session.username = userDetails[0].UserName;
      req.session.role = userDetails[0].Role;

      // const [subjects] = await db.getAllSubjects();
      // res
      //   .status(200)
      //   .render('subjects', { subjects, errorMsg: '', username: req.session.username, role: req.session.role });
      res.status(200).redirect('/');
      return;
    }
  }

  res.status(401).render('loginForm', {
    answer: 'Incorrect Username/Password!',
    username: req.session.username,
    role: req.session.role,
  });
}

export function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render('error', { message: err.message, username: req.session.username, role: req.session.role });
    }

    // const [subjects] = await db.getAllSubjects();
    // res.status(200).render('subjects', { subjects, errorMsg: '', username: undefined, role: undefined });
    res.status(200).redirect('/');
  });
}
