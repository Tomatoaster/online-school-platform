import path from 'path';
import express from 'express';
import multer from 'multer';
import db from '../db/subjects.db.js';
import { getAllSubjects, subjectAdder, subjectRemover } from '../controller/subject.controller.js';
import { displayAssignments, removeAssignment, addAssignment } from '../controller/assignment.controller.js';
import handleNotFound from '../middleware/error.middleware.js';
import { checkPassword } from '../controller/login.controller.js';
import { authorize } from '../middleware/authorize.middleware.js';
import { authenticateToken } from '../middleware/authenticate.middleware.js';

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
    res.status(200).render('subjects', { subjects, errorMsg: '', username: req.user.username, role: req.user.role });
  } catch (err) {
    res.status(400).render('error', {
      message: `Selection unsuccessful: ${err.message}`,
      username: req.user.username,
      role: req.user.role,
    });
  }
});

router.get(
  ['/addSubject', '/addSubject.html'],
  authenticateToken,
  authorize(['teacher', 'admin']),
  async (req, res) => {
    try {
      const [users] = await db.getAllUsers();
      res.status(200).render('addSubject', { users, username: req.user.username, role: req.user.role });
    } catch (err) {
      res.status(500).render('error', {
        message: `Selection unsuccessful: ${err.message}`,
        username: req.user.username,
        role: req.user.role,
      });
    }
  },
);

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
  res.status(200).render('loginForm', { answer: '', username: req.user.username, role: req.user.role });
});

router.get('/showAssignments', displayAssignments);

router.post('/addSubject', authenticateToken, authorize(['teacher', 'admin']), subjectAdder);
router.post('/deleteSubject', authenticateToken, authorize(['teacher', 'admin']), subjectRemover);
router.post('/addHomework', authenticateToken, authorize(['teacher', 'admin']), upload.single('hwFile'), addAssignment);
router.post('/removeAssignment', authenticateToken, authorize(['teacher', 'admin']), removeAssignment);

router.get('/allSubjects', getAllSubjects);

router.post('/login', checkPassword);
router.use(handleNotFound);
export default router;
