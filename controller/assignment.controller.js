import fs from 'fs';
import path from 'path';
import db from '../db/subjects.db.js';

export async function displayAssignments(req, res) {
  // Nem kell manuálisan lekérni az ID-t, benne van a requestben
  if (!req.query.id) {
    res
      .status(400)
      .render('error', { message: 'Subject not found!', username: req.session.username, role: req.session.role });
    return;
  }

  try {
    const [assignments] = await db.getSubjectAssignments(req.query.id);
    const [owner] = await db.getSubjectOwner(req.query.id);

    res.status(200).render('assignments', {
      assignments,
      activeID: req.query.id,
      errorMsg: '',
      username: req.session.username,
      role: req.session.role,
      owner: owner[0].UserID,
    });
  } catch (err) {
    res.status(400).render('error', { message: err.message, username: req.session.username, role: req.session.role });
  }
}

export async function removeAssignment(req, res) {
  if (!req.query.id) {
    res.status(400).json("Couldn't delete assignment!");
    return;
  }

  const [subjID] = await db.getAssignmentSubject(req.query.id);
  if (!subjID[0] || !subjID[0].SubjID) {
    res.status(400).json('Error: Invalid assignment!');
    return;
  }

  // Csak saját tantárgyból tudjon házit törölni
  const [owner] = await db.getSubjectOwner(subjID[0].SubjID);
  if (!owner[0] || owner[0].UserID !== req.session.username) {
    res.status(403).json('You do not have permission to delete this assignment!');
    return;
  }

  try {
    let [filename] = await db.getAssignmentFile(req.query.id);
    filename = filename[0].FileName;

    fs.rm(path.join(process.cwd(), 'data', 'docs', filename), (err) => {
      if (err) {
        console.log(`Error: ${err.message}`);
      }
    });
    await db.deleteAssignment(req.query.id);

    res.status(200).json('Assignment deleted successfully!');
  } catch (err) {
    res.status(400).json('Error: Could not delete assignment!');
  }
}

export async function addAssignment(req, res) {
  if (!req.file) {
    res
      .status(400)
      .render('error', { message: 'Invalid file upload!', username: req.session.username, role: req.session.role });
    return;
  }

  console.log(path.join(process.cwd(), 'data', 'docs', req.file.filename));
  if (req.file.mimetype !== 'application/pdf') {
    const [assignments] = await db.getSubjectAssignments(req.body.hwSubject);
    const [owner] = await db.getSubjectOwner(req.body.hwSubject);

    res.status(400).render('assignments', {
      assignments,
      activeID: req.body.hwSubject,
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
      activeID: req.body.hwSubject,
      errorMsg: '',
      username: req.session.username,
      role: req.session.role,
      owner: owner[0].UserID,
    });
    return;
  }

  res.status(400).render('error', { message: 'Bad request!', username: req.session.username, role: req.session.role });
}
