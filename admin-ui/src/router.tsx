import { createBrowserRouter } from 'react-router-dom';
import Root from './layouts/Root';
import Dashboard from './layouts/Dashboard';
import NonAuth from './layouts/NonAuth';
import LoginPage from './pages/login/login';
import HomePage from './pages/HomePage';
import UsersPage from './pages/users/UsersPage';
import RestaurantsPage from './pages/restaurants/RestaurantsPage';
import ProductsPage from './pages/products/ProductsPage';
import Orders from './pages/orders/Orders';
import SingleOrder from './pages/orders/SingleOrder';
import PromosPage from './pages/promos/PromosPage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            {
                path: '/',
                element: <Dashboard />,
                children: [
                    { path: '/', element: <HomePage /> },
                    { path: '/users', element: <UsersPage /> },
                    { path: '/restaurants', element: <RestaurantsPage /> },
                    { path: '/products', element: <ProductsPage /> },
                    { path: '/orders', element: <Orders /> },
                    { path: '/orders/:orderId', element: <SingleOrder /> },
                    { path: '/promos', element: <PromosPage /> },
                ],
            },
            {
                path: '/auth',
                element: <NonAuth />,
                children: [{ path: 'login', element: <LoginPage /> }],
            },
        ],
    },
]);
