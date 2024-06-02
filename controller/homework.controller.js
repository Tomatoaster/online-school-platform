import fs from 'fs';
import path from 'path';
import db from '../db/subjects.db.js';

export default async function homeworkAdder(req, res) {
  if (!req.file) {
    res
      .status(400)
      .render('error', { message: 'Invalid file upload!', username: req.session.username, role: req.session.role });
    return;
  }

  if (req.file.mimetype !== 'application/pdf') {
    const [assignments] = await db.getSubjectAssignments(req.body.hwSubject);
    const [owner] = await db.getSubjectOwner(req.body.hwSubject);

    res.status(400).render('assignments', {
      assignments,
      activeID: req.query.id,
      errorMsg: 'Wrong file type uploaded!',
      username: req.session.username,
      role: req.session.role,
      owner: owner[0].UserID,
    });
    fs.rm(path.join(process.cwd(), 'data', 'docs', req.file.filename), (err) => {
      if (err) {
        console.log(`Could not delete file: ${err}`);
      }
    });
    return;
  }

  if (req.body.hwSubject && req.body.hwDesc && req.body.dueDate && req.file) {
    let assignment = {};

    const [owner] = await db.getSubjectOwner(req.body.hwSubject);

    if (!owner[0]) {
      res.status(400).render('error', {
        message: 'Invalid assignment details!',
        username: req.session.username,
        role: req.session.role,
      });
      fs.rm(path.join(process.cwd(), 'data', 'docs', req.file.filename), (rmerr) => {
        if (rmerr) {
          console.log(`Could not delete file: ${rmerr}`);
        }
      });
      return;
    }

    // Csak saját tantárgyhoz tudjon beszúrni
    console.log(owner);
    console.log(req.session.username);
    if (owner[0].UserID !== req.session.username) {
      res.status(403).render('error', {
        message: 'You do not have permission to perform this operation!',
        username: req.session.username,
        role: req.session.role,
      });
      fs.rm(path.join(process.cwd(), 'data', 'docs', req.file.filename), (rmerr) => {
        if (rmerr) {
          console.log(`Could not delete file: ${rmerr}`);
        }
      });
      return;
    }

    try {
      assignment = {
        subjID: req.body.hwSubject,
        hwDesc: req.body.hwDesc,
        dueDate: req.body.dueDate,
        fileName: req.file.filename,
      };
      await db.insertAssignment(assignment);
    } catch (err) {
      res.status(400).render('error', {
        message: `Insertion unsuccessful: ${err.message}`,
        username: req.session.username,
        role: req.session.role,
      });
      fs.rm(path.join(process.cwd(), 'data', 'docs', assignment.fileName), (rmerr) => {
        if (rmerr) {
          console.log(`Could not delete file: ${rmerr}`);
        }
      });
      return;
    }
    const [newAssignments] = await db.getSubjectAssignments(req.body.hwSubject);
    res.status(200).render('assignments', {
      assignments: newAssignments,
      activeID: req.query.id,
      errorMsg: '',
      username: req.session.username,
      role: req.session.role,
      owner: owner[0].UserID,
    });
    return;
  }

  res.status(400).render('error', { message: 'Bad request!', username: req.session.username, role: req.session.role });
}
