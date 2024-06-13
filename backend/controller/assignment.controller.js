import fs from 'fs';
import path from 'path';
import db from '../db/subjects.db.js';

export async function listAssignments(req, res) {
  if (!req.query.id) {
    res.status(400).json('Subject not found!');
    return;
  }

  try {
    const [assignments] = await db.getSubjectAssignments(req.query.id);
    const [owner] = await db.getSubjectOwner(req.query.id);
    res.status(200).json({ assignments, owner: owner[0].UserID });
  } catch (err) {
    res.status(400).json(err.message);
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
  if (!owner[0] || owner[0].UserID !== req.user.username) {
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
    res.status(400).json('Invalid file upload!');
    return;
  }

  if (req.file.mimetype !== 'application/pdf') {
    res.status(400).json('Wrong file type uploaded!');
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
      res.status(400).json('Invalid assignment details!');
      fs.rm(path.join(process.cwd(), 'data', 'docs', req.file.filename), (rmerr) => {
        if (rmerr) {
          console.log(`Could not delete file: ${rmerr}`);
        }
      });
      return;
    }

    // Csak saját tantárgyhoz tudjon beszúrni
    if (owner[0].UserID !== req.user.username) {
      res.status(403).json('You do not have permission to perform this operation!');
      fs.rm(path.join(process.cwd(), 'data', 'docs', req.file.filename), (rmerr) => {
        if (rmerr) {
          console.log(`Could not delete file: ${rmerr}`);
        }
      });
      return;
    }

    try {
      assignment = {
        SubjID: req.body.hwSubject,
        ADesc: req.body.hwDesc,
        DueDate: req.body.dueDate,
        FileName: req.file.filename,
      };
      const inserted = await db.insertAssignment(assignment);
      assignment.AID = inserted[0].insertId;
      res.status(200).json(assignment);
      return;
    } catch (err) {
      res.status(400).json(`Insertion unsuccessful: ${err.message}`);
      fs.rm(path.join(process.cwd(), 'data', 'docs', assignment.FileName), (rmerr) => {
        if (rmerr) {
          console.log(`Could not delete file: ${rmerr}`);
        }
      });
      return;
    }
  }

  res.status(400).json('Bad request!');
}
