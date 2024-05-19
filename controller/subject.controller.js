import fs from 'fs';
import path from 'path';
import db from '../db/subjects.db.js';

export async function subjectRemover(req, res) {
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

export async function subjectAdder(req, res) {
  if (req.body.subjectId && req.body.subjName && req.body.subjDesc) {
    try {
      const subject = {
        subjID: req.body.subjectId,
        subjName: req.body.subjName,
        subjDesc: req.body.subjDesc,
        userID: await db.getUserByName(req.body.userName),
      };

      if (!subject.userID[0][0]) {
        const raisedErr = { message: 'User not found!' };
        throw raisedErr;
      }
      subject.userID = subject.userID[0][0].UserID;
      await db.insertSubject(subject);
    } catch (err) {
      console.log(`${err.message}`);
      res.render('error', { message: `Insertion unsuccessful: ${err.message}` });
      return;
    }

    const [subjects] = await db.getAllSubjects();
    res.render('subjects', { subjects, errorMsg: '' });
    return;
  }
  const [subjects] = await db.getAllSubjects();
  res.render('subjects', { subjects, errorMsg: 'Bad request!' });
}
