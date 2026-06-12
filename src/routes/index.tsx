import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { GroupsPage } from '../pages/GroupsPage';
import { KnockoutPage } from '../pages/KnockoutPage';
import { StatisticsPage } from '../pages/StatisticsPage';
import { SearchPage } from '../pages/SearchPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'groups', element: <GroupsPage /> },
      { path: 'knockout', element: <KnockoutPage /> },
      { path: 'statistics', element: <StatisticsPage /> },
      { path: 'search', element: <SearchPage /> },
    ],
  },
]);
