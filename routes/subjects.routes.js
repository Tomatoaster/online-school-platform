import path from 'path';
import express from 'express';
import multer from 'multer';
import db from '../db/subjects.db.js';
import { subjectAdder, subjectRemover } from '../controller/subject.controller.js';
import { displayAssignments, removeAssignment } from '../controller/assignment.controller.js';
import homeworkAdder from '../controller/homework.controller.js';
import handleNotFound from '../middleware/error.middleware.js';
import { checkPassword, logout } from '../controller/login.controller.js';
import { authorize } from '../middleware/authorize.middleware.js';

const router = express.Router();

const pdfDir = path.join(process.cwd(), 'data', 'docs');
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfDir);
  },
});
const upload = multer({ storage: diskStorage });

router.use(express.urlencoded({ extended: true }));

// router.use((req, res, next) => {
//   console.log(req.session);
//   next();
// });

router.get(['/', '/index', '/index.html'], async (req, res) => {
  try {
    const [subjects] = await db.getAllSubjects();
    res
      .status(200)
      .render('subjects', { subjects, errorMsg: '', username: req.session.username, role: req.session.role });
  } catch (err) {
    res.status(400).render('error', {
      message: `Selection unsuccessful: ${err.message}`,
      username: req.session.username,
      role: req.session.role,
    });
  }
});

router.get(['/addSubject', '/addSubject.html'], authorize(['teacher', 'admin']), async (req, res) => {
  try {
    const [users] = await db.getAllUsers();
    res.status(200).render('addSubject', { users, username: req.session.username, role: req.session.role });
  } catch (err) {
    res.status(500).render('error', {
      message: `Selection unsuccessful: ${err.message}`,
      username: req.session.username,
      role: req.session.role,
    });
  }
});

router.get('/showDescription', async (req, res) => {
  try {
    const [desc] = await db.getSubjectDescription(req.query.id);
    res.status(200).json(desc[0].SubjDesc);
    // console.log(desc[0].SubjDesc);
  } catch (err) {
    res.status(400).json("Couldn't retrieve description!");
  }
});

router.get(['/loginForm', '/loginForm.html'], (req, res) => {
  res.status(200).render('loginForm', { answer: '', username: req.session.username, role: req.session.role });
});

router.get('/showAssignments', displayAssignments);

router.post('/addSubject', authorize(['teacher', 'admin']), subjectAdder);
router.post('/deleteSubject', authorize(['teacher', 'admin']), subjectRemover);
router.post('/addHomework', authorize(['teacher', 'admin']), upload.single('hwFile'), homeworkAdder);
router.post('/removeAssignment', authorize(['teacher', 'admin']), removeAssignment);

router.post('/login', checkPassword);
router.get('/logout', logout);
router.use(handleNotFound);
export default router;
