import { RouterProvider } from 'react-router-dom';
import { createBrowserRouter, Outlet } from 'react-router-dom';
import SubjectTable from '../components/SubjectTable';
import Layout from '../components/Layout';
import Login from '../components/Login';

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
          element: <SubjectTable />,
        },
        { path: 'login', element: <Login /> },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default Router;
