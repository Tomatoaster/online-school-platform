import fs from 'fs';
import path from 'path';
import db from '../db/subjects.db.js';

export async function subjectRemover(req, res) {
  if (req.query.id) {
    const [owner] = await db.getSubjectOwner(req.query.id);
    if (req.user.role !== 'admin' && (!owner[0] || owner[0].UserID !== req.user.username)) {
      res.status(403).json('You do not have permission to delete this subject!');
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
      res.status(200).json({ SubjID: req.query.id });
    } catch (err) {
      res.status(400).json(`Delete unsuccessful: ${err.message}`);
    }
    return;
  }
  res.status(400).json('Subject not found!');
}

export async function subjectAdder(req, res) {
  if (req.body.subjectId && req.body.subjName && req.body.subjDesc) {
    try {
      const subject = {
        subjID: req.body.subjectId,
        subjName: req.body.subjName,
        subjDesc: req.body.subjDesc,
        userID: req.user.username,
      };

      await db.insertSubject(subject);
    } catch (err) {
      console.log(`${err.message}`);
      res.status(400).json(`Insertion unsuccessful: ${err.message}`);
      return;
    }

    res.status(200).json('Inserted successfully!');
    return;
  }
  res.status(400).json('Bad request!');
}

export async function getAllSubjects(req, res) {
  const [subjects] = await db.getAllSubjects();

  res.status(200).json(subjects);
}

export async function getUserSubjects(req, res) {
  const [subjects] = await db.getUserSubjects(req.user.username);
  if (!subjects) {
    res.status(200).json([]);
    return;
  }
  res.status(200).json(subjects);
}
