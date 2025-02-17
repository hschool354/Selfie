import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import SplashScreen from '../pages/SplashScreen';
import FirstLogin from '../pages/FirstLogin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/splash',
    element: <SplashScreen />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/signup',
    element: <SignUp />
  },
  {
    path: '/first-login',
    element: <FirstLogin />
  }
]);

export default router;