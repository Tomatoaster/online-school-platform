import path from 'path';
import express from 'express';
import fs from 'fs';
import multer from 'multer';

const staticDir = path.join(process.cwd(), 'public');
const subjFileName = path.join(process.cwd(), 'data', 'subjects.json');

function getSubjects() {
  if (!fs.existsSync(subjFileName)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(subjFileName, 'utf-8'));
}

const app = express();
app.use(express.static(staticDir));
app.use(express.urlencoded({ extended: true }));

const pdfDir = path.join(process.cwd(), 'data', 'docs');
const memStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pdfDir);
  },
});
const upload = multer({ storage: memStorage });

app.post('/addSubject', (req, res) => {
  // Mindegyik csak egy nem ures string
  const idRegex = /..*/;
  if (idRegex.test(req.body.subjectId) && idRegex.test(req.body.subjName) && idRegex.test(req.body.subjDesc)) {
    const subjects = getSubjects();
    for (let i = 0; i < subjects.length; i++) {
      if (subjects[i].subjectId === req.body.subjectId) {
        res.sendStatus(400);
        return;
      }
    }

    req.body.pdfs = [];
    subjects.push(req.body);
    fs.writeFile(subjFileName, JSON.stringify(subjects), (error) => {
      if (error) {
        throw error;
      }
    });
    res.sendStatus(200);
    return;
  }

  res.sendStatus(400);
});

app.post('/addHomework', upload.single('hwFile'), (req, res) => {
  // console.log(req.body);
  const subjects = getSubjects();
  let found = false;
  let ind = -1;
  for (let i = 0; i < subjects.length; i++) {
    if (subjects[i].subjectId === req.body.hwSubject) {
      found = true;
      ind = i;
    }
  }
  const idRegex = /..*/;
  console.log(req.file.filename);
  if (
    !found ||
    Number.isNaN(Date.parse(req.body.dueDate)) ||
    !idRegex.test(req.body.hwDesc) ||
    req.file.mimetype !== 'application/pdf'
  ) {
    res.sendStatus(400);
    return;
  }

  console.log('OK');
  const newPdf = {};
  newPdf.pdfFile = req.file.filename;
  newPdf.dueDate = req.body.dueDate;
  newPdf.desc = req.body.hwDesc;
  subjects[ind].pdfs.push(newPdf);
  fs.writeFile(subjFileName, JSON.stringify(subjects), (error) => {
    if (error) {
      throw error;
    }
  });

  res.sendStatus(200);
});

app.post('/deleteSubject', (req, res) => {
  const subjects = getSubjects();
  let ind = -1;
  for (let i = 0; i < subjects.length; i++) {
    if (subjects[i].subjectId === req.body.delSubject) {
      ind = i;
    }
    for (let j = 0; j < subjects[i].pdfs.length; j++) {
      fs.rm(path.join(pdfDir, subjects[i].pdfs[j].pdfFile), (err) => {
        if (err) {
          console.log("Couldn't delete subject!");
        }
      });
    }
  }
  if (ind === -1) {
    res.sendStatus(400);
    return;
  }
  subjects.splice(ind, 1);
  fs.writeFile(subjFileName, JSON.stringify(subjects), (error) => {
    if (error) {
      throw error;
    }
  });
  res.sendStatus(200);
});

app.listen(8080, () => {
  console.log('Server is listening!');
});
