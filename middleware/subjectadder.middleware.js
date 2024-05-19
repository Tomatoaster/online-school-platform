import db from '../db/subjects.db.js';

export default async function subjectAdder(req, res) {
  if (req.body.subjectId && req.body.subjName && req.body.subjDesc) {
    try {
      const subject = {
        subjID: req.body.subjectId,
        subjName: req.body.subjName,
        subjDesc: req.body.subjDesc,
        userID: await db.getUserByName(req.body.userName),
      };

      if (!subject.userID[0][0]) {
        const raisedErr = { message: 'User not found!' };
        throw raisedErr;
      }
      subject.userID = subject.userID[0][0].UserID;
      await db.insertSubject(subject);
    } catch (err) {
      console.log(`${err.message}`);
      res.render('error', { message: `Insertion unsuccessful: ${err.message}` });
      return;
    }

    const [subjects] = await db.getAllSubjects();
    res.render('subjects', { subjects, errorMsg: '' });
    return;
  }
  const [subjects] = await db.getAllSubjects();
  res.render('subjects', { subjects, errorMsg: 'Bad request!' });
}
