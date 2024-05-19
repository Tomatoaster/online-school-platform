import path from 'path';
import express from 'express';
import multer from 'multer';
import db from '../db/subjects.db.js';
import { subjectAdder, subjectRemover } from '../controller/subject.controller.js';
import displayAssignments from '../controller/assignment.controller.js';
import homeworkAdder from '../controller/homework.controller.js';
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

router.get('/showDescription', async (req, res) => {
  try {
    const [desc] = await db.getSubjectDescription(req.query.id);
    res.json(desc[0].SubjDesc);
    // console.log(desc[0].SubjDesc);
  } catch (err) {
    res.json("Couldn't retrieve description!");
  }
});

router.get('/showAssignments', displayAssignments);

router.post('/addSubject', subjectAdder);
router.post('/deleteSubject', subjectRemover);
router.post('/addHomework', upload.single('hwFile'), homeworkAdder);

router.use(handleNotFound);
export default router;
