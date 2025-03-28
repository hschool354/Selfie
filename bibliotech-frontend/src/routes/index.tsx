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
import Achievements from '../pages/Achievements';
import Favorites from '../pages/Favorites';
import Wallet from '../pages/Wallet';
import Premium from '../pages/Premium';
import Settings from '../pages/Setting';
import Support from '../pages/Support';
import InfomationBook from '../pages/informationBook';
import BookCheckout from '../pages/BookCheckout';
import ExploreAllBooks from '../pages/ExploreAllBooks';
import CategoriesBook from '../pages/CategoriesBook';

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
      { path: "achievements", element: <Achievements /> },
      { path: "favorites", element: <Favorites /> },
      { path: "wallet", element: <Wallet /> },
      { path: "premium", element: <Premium /> },
      { path: "setting", element: <Settings /> },
      { path: "Support", element: <Support /> },
      { path: "informationBook", element: <InfomationBook /> }, 
      { path: "exploreAllBook", element: <ExploreAllBooks /> },
      { path: "categoriesBook", element: <CategoriesBook /> },
      { path: "bookCheckout", element: <BookCheckout /> },
    ],
  }
]);

export default router;