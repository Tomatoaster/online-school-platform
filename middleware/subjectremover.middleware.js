import fs from 'fs';
import path from 'path';
import db from '../db/subjects.db.js';

export default async function subjectRemover(req, res) {
  if (req.query.id) {
    try {
      const [subjAssignments] = await db.getSubjectAssignments(req.query.id);
      subjAssignments.forEach((assignment) => {
        fs.rm(path.join(process.cwd(), 'data', 'docs', assignment.FileName), (err) => {
          if (err) {
            console.log(`Could not delete file ${assignment.FileName}!`);
          }
        });
      });

      await db.deleteSubject(req.query.id);
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
