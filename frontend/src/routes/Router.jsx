import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import SubjectTable from '../components/SubjectTable';
import Layout from '../components/Layout';
import Login from '../components/Login';
import Register from '../components/Register';
import AddSubject from '../components/AddSubject';
import AssignmentTable from '../components/AssignmentTable';

function Router() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Layout>
          <Outlet />
        </Layout>
      ),
      children: [
        {
          path: '',
          element: (
            <>
              <div className="invites"></div>
              <div className="subjects">
                <SubjectTable />
              </div>
            </>
          ),
        },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'addSubject', element: <AddSubject /> },
        { path: 'showAssignments/:id', element: <AssignmentTable /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
