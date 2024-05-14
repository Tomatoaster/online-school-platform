import db from '../db/requests.db.js';

export default async function requestLogger(req, res, next) {
  try {
    const [header] = await db.insertRequest(req);
    console.log(`Inserted request. Affected rows: ${header.affectedRows}`);
    next();
  } catch (err) {
    res.status(500).render('error', { message: `Insertion unsuccessful: ${err.message}` });
  }
}
