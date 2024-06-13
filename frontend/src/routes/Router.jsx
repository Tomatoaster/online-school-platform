import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Error404 from '../components/Error404';
import SubjectTable from '../components/SubjectTable';
import Layout from '../components/Layout';
import Login from '../components/Login';
import Register from '../components/Register';
import AddSubject from '../components/AddSubject';
import AssignmentTable from '../components/AssignmentTable';
import UserList from '../components/UserList';
import InviteList from '../components/InviteList';

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
              <InviteList />
              <SubjectTable />
            </>
          ),
        },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'addSubject', element: <AddSubject /> },
        { path: 'showAssignments/:id', element: <AssignmentTable /> },
        { path: 'inviteUsers/:id', element: <UserList /> },
      ],
    },
    {
      path: '*',
      element: (
        <Layout>
          <Error404 />
        </Layout>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
