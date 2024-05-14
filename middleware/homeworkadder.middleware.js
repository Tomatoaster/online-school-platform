import fs from 'fs';
import path from 'path';
import db from '../db/subjects.db.js';

export default async function homeworkAdder(req, res) {
  if (!req.file) {
    res.render('error', { message: 'Invalid file upload!' });
    return;
  }

  if (req.file.mimetype !== 'application/pdf') {
    res.render('error', { message: 'Invalid file upload!' });
    console.log(process.cwd());
    fs.rm(path.join(process.cwd(), 'data', 'docs', req.file.filename), (err) => {
      console.log(`Could not delete file: ${err.message}`);
    });
    return;
  }

  if (req.body.hwSubject && req.body.hwDesc && req.body.dueDate && req.file) {
    let assignment = {};
    try {
      assignment = {
        subjID: req.body.hwSubject,
        hwDesc: req.body.hwDesc,
        dueDate: req.body.dueDate,
        fileName: req.file.filename,
      };
      await db.insertAssignment(assignment);
    } catch (err) {
      res.render('error', { message: `Insertion unsuccessful: ${err.message}` });
      fs.rm(path.join(process.cwd(), 'data', 'docs', assignment.fileName), (rmerr) => {
        console.log(`Could not delete file: ${rmerr.message}`);
      });
      return;
    }

    const [assignments] = await db.getSubjectAssignments(assignment.subjID);
    res.render('assignments', { assignments, activeID: assignment.subjID });
    return;
  }

  res.render('error', { message: 'Bad request!' });
}
