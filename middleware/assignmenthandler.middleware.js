import db from '../db/subjects.db.js';

export default async function displayAssignments(req, res) {
  const id = new URLSearchParams(req.url.split('?')[1]).get('id');
  if (!id) {
    res.render('error', { message: 'Subject not found!' });
    return;
  }

  try {
    const [assignments] = await db.getSubjectAssignments(id);
    res.render('assignments', { assignments, activeID: id });
  } catch (err) {
    res.render('error', { message: err.message });
  }
}
