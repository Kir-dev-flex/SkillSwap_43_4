import { Navigate, useLocation } from 'react-router-dom';
import { useAppState } from '../shared/hooks/storeHooks';

interface PrivateRouteProps {
  children: React.ReactNode;
}

/**
 * Компонент для защиты маршрутов, доступных только авторизованным пользователям
 * @param {PrivateRouteProps} props - Свойства компонента
 * @returns {JSX.Element} Защищенный маршрут или редирект на страницу входа
 */
// eslint-disable-next-line react/prop-types
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAppState();
  const location = useLocation();
  const isLogged = user !== null;

  if (!isLogged) {
    return <Navigate to='/login' replace state={{ from: location.pathname + location.search }} />;
  }

  return children as React.ReactElement;
};

export default PrivateRoute;
