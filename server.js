import path from 'path';
import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import subjectRoutes from './routes/subjects.routes.js';

const staticDir = path.join(process.cwd(), 'public');

const app = express();

app.use(express.static(staticDir));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'EuDsj21pjo',
    resave: false,
    saveUninitialized: true,
    cookie: { httpOnly: true },
  }),
);

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use(morgan('tiny'));

app.use(subjectRoutes);

app.listen(8080, () => {
  console.log('Server is listening!');
});
