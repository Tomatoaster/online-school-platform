import fs from 'fs/promises';
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

    await fs.rm(path.join(process.cwd(), 'data', 'docs', filename));
    await db.deleteAssignment(req.query.id);

    res.status(200).json('Assignment deleted successfully!');
  } catch (err) {
    res.status(400).json('Error: Could not delete assignment!');
  }
}
