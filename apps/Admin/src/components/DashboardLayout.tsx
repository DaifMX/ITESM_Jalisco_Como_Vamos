import { ComponentType, ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';

import { authClient } from '@/lib/auth-client';

import {
    BarChart3Icon,
    LayersIcon,
    LogOutIcon,
    Loader2Icon,
    SparklesIcon,
    UsersIcon,
    WrenchIcon,
    HelpCircleIcon,
} from 'lucide-react';

interface DashboardLayoutProps {
    children: ReactNode;
}

interface NavItem {
    id: string;
    path: string;
    icon: ComponentType<{ className?: string }>;
    label: string;
}

const navItems: NavItem[] = [
    { id: 'dashboard', path: '/', icon: BarChart3Icon, label: 'Dashboard' },
    { id: 'users', path: '/users', icon: UsersIcon, label: 'Usuarios' },
    { id: 'questions', path: '/questions', icon: HelpCircleIcon, label: 'Preguntas' },
    { id: 'roles', path: '/roles', icon: SparklesIcon, label: 'Roles y permisos' },
    { id: 'settings', path: '/settings', icon: WrenchIcon, label: 'Configuración' },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const session = authClient.useSession();

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);
        try {
            await authClient.signOut();
            navigate('/login', { replace: true });
        } catch {
            setIsLoggingOut(false);
        }
    };

    const isActive = (path: string) => {
        if (path === '/') {
            return location.pathname === '/';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <>
            <style>
                {`body, html { 
                    background-color: #030712; 
                    margin: 0;
                    padding: 0;
                    height: 100%;
                    overflow: hidden;
                }
                #root {
                    height: 100vh;
                    overflow: hidden;
                }
                `}
            </style>
            <div className="flex h-screen w-full bg-gray-950 text-gray-100 font-sans selection:bg-indigo-500/30 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 h-screen bg-gray-900 border-r border-gray-800 flex flex-col shrink-0 overflow-hidden">
                    <div className="p-6 flex items-center gap-3 shrink-0">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <LayersIcon className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">
                            Admin<span className="text-indigo-500">Panel</span>
                        </span>
                    </div>

                    <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                        {navItems.map((item) => {
                            const IconComponent = item.icon;
                            const active = isActive(item.path);
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-3 px-2 py-3 rounded-xl transition-all duration-200 group ${active
                                        ? 'bg-indigo-600/10 text-indigo-400 shadow-inner'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                                        }`}
                                >
                                    <IconComponent
                                        className={`w-5 h-5 transition-colors ${active ? 'text-indigo-400' : 'group-hover:text-gray-200'}`}
                                    />
                                    <span className="font-normal">{item.label}</span>
                                    {active && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-800 shrink-0">
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700/50">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                                {session.data?.user?.name?.charAt(0).toUpperCase() || session.data?.user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{session.data?.user?.name || 'Usuario'}</p>
                                <p className="text-xs text-gray-500 truncate">{session.data?.user?.email || 'email@example.com'}</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Logout"
                            >
                                {isLoggingOut ? (
                                    <Loader2Icon className="w-4 h-4 animate-spin" />
                                ) : (
                                    <LogOutIcon className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 h-screen flex flex-col overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950">
                    {/* Header */}
                    <header className="h-16 shrink-0 border-b border-gray-800 flex items-center justify-between px-8 bg-gray-900/50 backdrop-blur-sm z-10">
                        <h2 className="text-lg font-semibold text-gray-200">
                            {navItems.find((item) => isActive(item.path))?.label || 'Dashboard'}
                        </h2>
                    </header>

                    {/* Content Area */}
                    <main className="flex-1 overflow-y-auto p-8">{children}</main>
                </div>
            </div>
        </>
    );
}