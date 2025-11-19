import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import Loans from '../pages/Loans';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Forms from '../pages/Forms';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'loans',
        element: <Loans />,
      },
      {
        path: 'forms',
        element: <Forms />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'contact',
        element: <Contact />,
      },
    ],
  },
]);



