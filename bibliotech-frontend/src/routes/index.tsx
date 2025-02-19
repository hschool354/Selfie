import { createBrowserRouter } from 'react-router-dom';
import Welcome from '../pages/Welcome';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import SplashScreen from '../pages/SplashScreen';
import FirstLogin from '../pages/FirstLogin';
import ForgotPassword from '../pages/ForgotPassword';
import OTPVerification from '../pages/OTPVerification';
import Home from '../pages/Home';
import Discover from '../pages/Discover';
import Category from '../pages/Category';
import MyLibrary from '../pages/MyLibrary';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Welcome />
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
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />
  },
  {
    path: '/otp-verification',
    element: <OTPVerification />
  },
  {
    path: '/home',
    element: <Home />,
    children: [
      { index: true, element: <Discover /> }, 
      { path: "discover", element: <Discover /> },
      { path: "category", element: <Category /> },
      { path: "myLibrary", element: <MyLibrary /> },
    ],
  }
]);

export default router;