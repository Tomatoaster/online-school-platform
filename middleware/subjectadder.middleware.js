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
      // Nem csak az ID-t térítette vissza, hanem az oszlopot is, mint objektum
      if (!subject.userID[0][0]) {
        res.render('error', { message: `Insertion unsuccessful: ${req.body.userName} not found!` });
        return;
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

  res.render('error', { message: 'Bad request!' });
}
