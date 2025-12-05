import { lazy } from "react";

import { useRoutes } from "react-router";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NotFoundView } from "@/components/NotFoundView";

export const HomePage = lazy(() => import('@/views/Home/HomeView'));
export const UsersPage = lazy(() => import('@/views/UserManagement/UserManagementView'));
export const QuestionsPage = lazy(() => import('@/views/Questions/QuestionView'));
export const RolesPage = lazy(() => import('@/views/Roles/RolesView'));
export const SettingsPage = lazy(() => import('@/views/Settings/SettingsView'));
export const LoginPage = lazy(() => import('@/views/Login/LoginView'));

export function Router() {
    const routes = useRoutes([
        { path: '/login', element: <LoginPage /> },
        { 
            path: '/', 
            element: (
                <ProtectedRoute>
                    <HomePage />
                </ProtectedRoute>
            ) 
        },
        { 
            path: '/users', 
            element: (
                <ProtectedRoute>
                    <UsersPage />
                </ProtectedRoute>
            ) 
        },
        { 
            path: '/questions', 
            element: (
                <ProtectedRoute>
                    <QuestionsPage />
                </ProtectedRoute>
            ) 
        },
        { 
            path: '/roles', 
            element: (
                <ProtectedRoute>
                    <RolesPage />
                </ProtectedRoute>
            ) 
        },
        { 
            path: '/settings', 
            element: (
                <ProtectedRoute>
                    <SettingsPage />
                </ProtectedRoute>
            ) 
        },
        { 
            path: '*', 
            element: (
                <ProtectedRoute>
                    <NotFoundView />
                </ProtectedRoute>
            ) 
        },
    ]);

    return routes;
}