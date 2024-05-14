import db from '../db/subjects.db.js';

export default async function subjectRemover(req, res) {
  const id = new URLSearchParams(req.url.split('?')[1]).get('id');
  // console.log(id);
  if (id) {
    try {
      await db.deleteSubject(id);
      const [subjects] = await db.getAllSubjects();
      res.render('subjects', { subjects, errorMsg: '' });
    } catch (err) {
      res.render('error', { message: `Delete unsuccessful: ${err.message}` });
    }
    return;
  }
  const [subjects] = await db.getAllSubjects();
  res.render('subjects', { subjects, errorMsg: 'Subject not found!' });
}
