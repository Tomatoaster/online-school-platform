import path from 'path';
import express from 'express';
import multer from 'multer';
import { getAllSubjects, subjectAdder, subjectRemover, getUserSubjects } from '../controller/subject.controller.js';
import { listAssignments, removeAssignment, addAssignment } from '../controller/assignment.controller.js';
import handleNotFound from '../middleware/error.middleware.js';
import { checkPassword, registerUser } from '../controller/login.controller.js';
import { authorize } from '../middleware/authorize.middleware.js';
import { authenticateToken } from '../middleware/authenticate.middleware.js';
import {
  acceptInvitation,
  addInvitation,
  getUserInvitations,
  rejectInvitation,
} from '../controller/invitation.controller.js';
import { getAllUsers } from '../controller/user.controller.js';

const router = express.Router();

const pdfDir = path.join(process.cwd(), 'data', 'docs');
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfDir);
  },
});
const upload = multer({ storage: diskStorage });

router.use(express.urlencoded({ extended: true }));

router.get('/showAssignments', authenticateToken, listAssignments);

router.post('/addSubject', authenticateToken, authorize(['teacher', 'admin']), subjectAdder);
router.post('/deleteSubject', authenticateToken, authorize(['teacher', 'admin']), subjectRemover);

router.get('/getAllUsers', authenticateToken, getAllUsers);
router.post('/inviteUser', authenticateToken, addInvitation);
router.get('/getUserInvitations', authenticateToken, getUserInvitations);
router.post('/acceptInvitation', authenticateToken, acceptInvitation);
router.post('/rejectInvitation', authenticateToken, rejectInvitation);

router.post(
  '/addAssignment',
  authenticateToken,
  authorize(['teacher', 'admin']),
  upload.single('hwFile'),
  addAssignment,
);
router.post('/removeAssignment', authenticateToken, authorize(['teacher', 'admin']), removeAssignment);

router.get('/allSubjects', authenticateToken, authorize(['teacher', 'admin']), getAllSubjects);
router.get('/userSubjects', authenticateToken, getUserSubjects);

router.post('/login', checkPassword);
router.post('/register', registerUser);
router.use(handleNotFound);
export default router;
