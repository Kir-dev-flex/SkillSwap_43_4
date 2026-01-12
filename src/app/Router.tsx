import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home/Home';
import SkillPage from '../pages/SkillPage/SkillPage';
import Error404 from '../pages/error404/Error404';
import FirstStepRegistration from '../pages/registration-pages/firstStepRegistration/firstStepRegistration';
import SecondStepRegistration from '../pages/registration-pages/secondStepRegistration/SecondStepRegistration';
import ThirdStepRegistration from '../pages/registration-pages/thirdStepRegistration/thirdStepRegistration';
import PrivateRoute from './PrivateRoute';
// import LoginPage from '../pages/LoginPage/LoginPage';
// import ProfilePage from '../pages/ProfilePage/ProfilePage';
import FavoritesPage from '../pages/FavoritesPage/FavoritesPage';

/**
 * Компонент роутинга приложения
 * Определяет все маршруты приложения и их доступность
 * @returns {JSX.Element} Маршруты приложения
 */
const Router = () => (
  <Routes>
    {/* Главная страница - доступна всем */}
    <Route path='/' element={<Home />} />

    {/* Страница навыка - доступна всем */}
    <Route path='/skill' element={<SkillPage />} />

    {/* Страница входа - доступна всем */}
    {/* <Route path="/login" element={<LoginPage />} /> */}

    {/* Страницы регистрации - доступны всем */}
    <Route path='/registration-step-1' element={<FirstStepRegistration />} />
    <Route path='/registration-step-2' element={<SecondStepRegistration />} />
    <Route path='/registration-step-3' element={<ThirdStepRegistration />} />

    {/* Защищенные маршруты - только для авторизованных */}
    {/* <Route
        path="/profile"
        element={
          <PrivateRoute>
            <ProfilePage />
          </PrivateRoute>
        }
      /> */}
    <Route
      path='/favorites'
      element={
        <PrivateRoute>
          <FavoritesPage />
        </PrivateRoute>
      }
    />

    {/* Страница 404 - доступна всем, должна быть последней */}
    <Route path='*' element={<Error404 />} />
  </Routes>
);

export default Router;
