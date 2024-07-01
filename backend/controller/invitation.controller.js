import db from '../db/subjects.db.js';

export async function addInvitation(req, res) {
  const { subjID, username } = req.body;
  // console.log(subjID, username);
  if (!subjID || !username) {
    res.status(400).json('Bad request!');
    return;
  }

  const [owner] = await db.getSubjectOwner(subjID);
  if (!owner[0] || owner[0].UserID !== req.user.username) {
    res.status(403).json('You do no have permission to invite students to this subject!');
    return;
  }

  try {
    const [alreadyEnrolled] = await db.getEnrollment(subjID, username);
    if (alreadyEnrolled[0]) {
      res.status(400).json('User is already attending this class!');
      return;
    }

    const [alreadyInvited] = await db.getInvitation(subjID, username);
    if (alreadyInvited[0]) {
      res.status(400).json('User is already invited to this class!');
      return;
    }

    await db.insertInvitation(subjID, username);
    res.status(200).json('Invitation successful!');
  } catch (err) {
    res.status(400).json(`Invitation unsuccessful: ${err.message}`);
  }
}

export async function getUserInvitations(req, res) {
  try {
    const [invitations] = await db.getUserInvitations(req.user.username);
    res.status(200).json(invitations);
  } catch (err) {
    res.status(400).json('Could not retrieve invitations!');
  }
}

export async function acceptInvitation(req, res) {
  if (!req.body.subjID) {
    res.status(400).json("Invite doesn't exist!");
    return;
  }
  try {
    const [invite] = await db.getInvitation(req.body.subjID, req.user.username);
    if (!invite[0]) {
      res.status(400).json("Invite doesn't exist!");
      return;
    }
    await db.deleteInvitation(req.body.subjID, req.user.username);
    await db.insertEnrollment(req.body.subjID, req.user.username);
    res.status(200).json('Invite accepted successfully!');
  } catch (err) {
    res.status(400).json('An error occured!');
  }
}

export async function rejectInvitation(req, res) {
  if (!req.body.subjID) {
    res.status(400).json("Invite doesn't exist!");
    return;
  }
  try {
    const [invite] = await db.getInvitation(req.body.subjID, req.user.username);
    if (!invite[0]) {
      res.status(400).json("Invite doesn't exist!");
      return;
    }
    await db.deleteInvitation(req.body.subjID, req.user.username);
    res.status(200).json('Invite rejected successfully!');
  } catch (err) {
    res.status(400).json('An error occured!');
  }
}
