import path from 'path';
import express from 'express';
import multer from 'multer';
import db from '../db/subjects.db.js';
import subjectAdder from '../middleware/subjectadder.middleware.js';
import subjectRemover from '../middleware/subjectremover.middleware.js';
import displayAssignments from '../middleware/assignmenthandler.middleware.js';
import homeworkAdder from '../middleware/homeworkadder.middleware.js';
import handleNotFound from '../middleware/error.middleware.js';

const router = express.Router();

const pdfDir = path.join(process.cwd(), 'data', 'docs');
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfDir);
  },
});
const upload = multer({ storage: diskStorage });

router.use(express.urlencoded({ extended: true }));

router.get(['/', '/index', '/index.html'], async (req, res) => {
  try {
    const [subjects] = await db.getAllSubjects();
    res.render('subjects', { subjects, errorMsg: '' });
  } catch (err) {
    res.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

router.get(['/addSubject', '/addSubject.html'], async (req, res) => {
  try {
    const [users] = await db.getAllUsers();
    res.render('addSubject', { users });
  } catch (err) {
    res.status(500).render('error', { message: `Selection unsuccessful: ${err.message}` });
  }
});

router.get('/showAssignments', displayAssignments);

router.post('/addSubject', subjectAdder);
router.post('/deleteSubject', subjectRemover);
router.post('/addHomework', upload.single('hwFile'), homeworkAdder);

router.use(handleNotFound);
export default router;
