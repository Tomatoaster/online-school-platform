import fs from 'fs/promises';
import path from 'path';
import db from '../db/subjects.db.js';

export async function displayAssignments(req, res) {
  // Nem kell manuálisan lekérni az ID-t, benne van a requestben
  if (!req.query.id) {
    res.render('error', { message: 'Subject not found!' });
    return;
  }

  try {
    const [assignments] = await db.getSubjectAssignments(req.query.id);
    res.render('assignments', { assignments, activeID: req.query.id, errorMsg: '' });
  } catch (err) {
    res.render('error', { message: err.message });
  }
}

export async function removeAssignment(req, res) {
  if (!req.query.id) {
    res.json("Couldn't delete assignment!");
    return;
  }

  try {
    let [filename] = await db.getAssignmentFile(req.query.id);
    filename = filename[0].FileName;

    await fs.rm(path.join(process.cwd(), 'data', 'docs', filename));
    await db.deleteAssignment(req.query.id);

    res.status(200).json('Assignment deleted successfully!');
  } catch (err) {
    res.status(400).json(`Error: ${err.message}`);
  }
}
