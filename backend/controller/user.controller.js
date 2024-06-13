import db from '../db/subjects.db.js';

export async function getAllUsers(req, res) {
  if (!req.user) {
    res.status(401).json('You are not logged in!');
    return;
  }

  if (req.user.role !== 'admin' && req.user.role !== 'teacher') {
    res.status(403).json('You do not have permission to list all students!');
    return;
  }
  const [users] = await db.getAllUsers();
  res.status(200).json(users);
}
