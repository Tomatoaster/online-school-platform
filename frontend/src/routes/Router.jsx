import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Error404 from '../components/Error404';
import Layout from '../components/Layout';
import Login from '../components/Login';
import Register from '../components/Register';
import AddSubject from '../components/AddSubject';
import AssignmentTable from '../components/AssignmentTable';
import UserList from '../components/UserList';
import MainPage from '../components/MainPage';

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
          element: <MainPage />,
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
