import fs from 'fs';
import path from 'path';
import db from '../db/subjects.db.js';

export async function subjectRemover(req, res) {
  // csak saját tantárgyat tudjon törölni

  if (req.query.id) {
    const [owner] = await db.getSubjectOwner(req.query.id);
    if (!owner[0] || owner[0].UserID !== req.session.username) {
      res.status(403).render('error', {
        message: 'You do not have permission to delete this subject!',
        username: req.session.username,
        role: req.session.role,
      });
      return;
    }

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
      res
        .status(200)
        .render('subjects', { subjects, errorMsg: '', username: req.session.username, role: req.session.role });
    } catch (err) {
      res.status(400).render('error', {
        message: `Delete unsuccessful: ${err.message}`,
        username: req.session.username,
        role: req.session.role,
      });
    }
    return;
  }
  const [subjects] = await db.getAllSubjects();
  res.status(400).render('subjects', {
    subjects,
    errorMsg: 'Subject not found!',
    username: req.session.username,
    role: req.session.role,
  });
}

export async function subjectAdder(req, res) {
  if (req.body.subjectId && req.body.subjName && req.body.subjDesc) {
    try {
      const subject = {
        subjID: req.body.subjectId,
        subjName: req.body.subjName,
        subjDesc: req.body.subjDesc,
        userID: req.session.username,
      };

      await db.insertSubject(subject);
    } catch (err) {
      console.log(`${err.message}`);
      res.status(400).render('error', {
        message: `Insertion unsuccessful: ${err.message}`,
        username: req.session.username,
        role: req.session.role,
      });
      return;
    }

    const [subjects] = await db.getAllSubjects();
    res
      .status(200)
      .render('subjects', { subjects, errorMsg: '', username: req.session.username, role: req.session.role });
    return;
  }
  const [subjects] = await db.getAllSubjects();
  res
    .status(400)
    .render('subjects', { subjects, errorMsg: 'Bad request!', username: req.session.username, role: req.session.role });
}

export async function getAllSubjects(req, res) {
  const [subjects] = await db.getAllSubjects();

  res.status(200).json(subjects);
}
