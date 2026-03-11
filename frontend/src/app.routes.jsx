import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import Protected from './features/auth/components/Protected'
import Home from './features/interview/pages/Home'
import Interview from './features/interview/pages/interview'
import LandingPage from './pages/LandingPage/LandingPage'
import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '/generator',
        element: <Protected><Home /></Protected>
    },

    {
        path: '/interview/:interviewId',
        element: <Protected><Interview /></Protected>
    },

    {
        path: '/login',
        element: <LoginPage />
    },
    {
        path: '/register',
        element: <RegisterPage />
    },




])