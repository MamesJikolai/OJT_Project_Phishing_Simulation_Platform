import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.tsx'
import Dashboard from './pages/admin/Dashboard.tsx'
import Home from './pages/user/Home.tsx'
import Courses from './pages/admin/Courses.tsx'
import MyCourses from './pages/user/MyCourses.tsx'
import Assessments from './pages/admin/Assessments.tsx'
import Settings from './pages/admin/Settings.tsx'
import Achievements from './pages/user/Achievements.tsx'
import Campaigns from './pages/admin/Campaigns.tsx'
import Analytics from './pages/admin/Analytics.tsx'
import Notifications from './pages/admin/Notifications.tsx'
import Account from './pages/admin/Account.tsx'
import Users from './pages/admin/Users.tsx'
import LogIn from './pages/LogIn.tsx'
import PhishingPage from './pages/PhishingPage.tsx'

const router = createBrowserRouter([
    {
        path: '/',
        children: [
            {
                path: '/login',
                element: <LogIn />,
            },
            {
                index: true,
                element: <PhishingPage />,
            },
        ],
    },
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/home',
                element: <Home />,
            },
            {
                path: '/dashboard',
                element: <Dashboard />,
            },
            {
                path: '/campaigns',
                element: <Campaigns />,
            },
            {
                path: '/users',
                element: <Users />,
            },
            {
                path: '/courses',
                element: <Courses />,
            },
            {
                path: '/my-courses',
                element: <MyCourses />,
            },
            {
                path: '/assessments',
                element: <Assessments />,
            },
            {
                path: '/analytics',
                element: <Analytics />,
            },
            {
                path: '/achievements',
                element: <Achievements />,
            },
            {
                path: '/settings',
                element: <Settings />,
            },
            {
                path: '/notifications',
                element: <Notifications />,
            },
            {
                path: '/account',
                element: <Account />,
            },
        ],
    },
])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <RouterProvider router={router} />
    </StrictMode>
)
