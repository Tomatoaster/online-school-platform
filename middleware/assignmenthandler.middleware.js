import db from '../db/subjects.db.js';

export default async function displayAssignments(req, res) {
  // Nem kell manuálisan lekérni az ID-t, benne van a requestben
  if (!req.query.id) {
    res.render('error', { message: 'Subject not found!' });
    return;
  }

  try {
    const [assignments] = await db.getSubjectAssignments(req.query.id);
    res.render('assignments', { assignments, activeID: req.query.id, errorMsg: '' });
  } catch (err) {
    res.render('error', { message: err.message });
  }
}
