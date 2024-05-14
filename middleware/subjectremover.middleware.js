import fs from 'fs';
import path from 'path';
import db from '../db/subjects.db.js';

export default async function subjectRemover(req, res) {
  const id = new URLSearchParams(req.url.split('?')[1]).get('id');
  // console.log(id);
  if (id) {
    try {
      const [subjAssignments] = await db.getSubjectAssignments(id);
      subjAssignments.forEach((assignment) => {
        fs.rm(path.join(process.cwd(), 'data', 'docs', assignment.FileName), (err) => {
          if (err) {
            console.log(`Could not delete file ${assignment.FileName}!`);
          }
        });
      });

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
