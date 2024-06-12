import path from 'path';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import subjectRoutes from './routes/subjects.routes.js';

const staticDir = path.join(process.cwd(), 'public');

const app = express();

app.use(express.static(staticDir));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use(morgan('tiny'));

app.use(subjectRoutes);

app.listen(8080, () => {
  console.log('Server is listening!');
});
