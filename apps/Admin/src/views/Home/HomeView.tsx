import { useEffect, useState } from "react";
import {
  BarChart3Icon,
  UsersIcon,
  ActivityIcon,
  Loader2Icon,
} from "lucide-react";

import { useNavigate } from "react-router";

interface DashboardStats {
  totalUsers: {
    count: number;
    percentageChange: number;
    trend: 'up' | 'down' | 'stable';
  };
  activeSessions: {
    count: number;
    percentageChange: number;
    trend: 'up' | 'down' | 'stable';
  };
  totalResponses: {
    count: number;
    percentageChange: number;
    trend: 'up' | 'down' | 'stable';
  };
  activeUsers: {
    count: number;
    percentageChange: number;
    trend: 'up' | 'down' | 'stable';
  };
}

export default function HomeView() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/stats/dashboard`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const data = await response.json();
      if (data.success && data.data) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-MX').format(num);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white mb-2">Bienvenido a Admin Panel</h1>
        <p className="text-indigo-100">Monitorea y administra tu aplicación desde este panel.</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:border-indigo-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UsersIcon className="w-16 h-16 text-indigo-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Cantidad de Usuarios</p>
          {loading ? (
            <div className="flex items-center gap-2 my-2">
              <Loader2Icon className="w-5 h-5 animate-spin text-gray-500" />
              <span className="text-gray-500 text-sm">Cargando...</span>
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-white mb-2">
                {stats ? formatNumber(stats.totalUsers.count) : '0'}
              </h3>
            </>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:border-green-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ActivityIcon className="w-16 h-16 text-green-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Sesiones Activas</p>
          {loading ? (
            <div className="flex items-center gap-2 my-2">
              <Loader2Icon className="w-5 h-5 animate-spin text-gray-500" />
              <span className="text-gray-500 text-sm">Cargando...</span>
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-white mb-2">
                {stats ? formatNumber(stats.activeSessions.count) : '0'}
              </h3>
            </>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:border-purple-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3Icon className="w-16 h-16 text-purple-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Total de Preguntas</p>
          {loading ? (
            <div className="flex items-center gap-2 my-2">
              <Loader2Icon className="w-5 h-5 animate-spin text-gray-500" />
              <span className="text-gray-500 text-sm">Cargando...</span>
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-white mb-2">
                {stats ? formatNumber(stats.totalResponses.count) : '0'}
              </h3>
            </>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm relative overflow-hidden group hover:border-yellow-500/30 transition-all">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ActivityIcon className="w-16 h-16 text-yellow-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Usuarios Activos</p>
          {loading ? (
            <div className="flex items-center gap-2 my-2">
              <Loader2Icon className="w-5 h-5 animate-spin text-gray-500" />
              <span className="text-gray-500 text-sm">Cargando...</span>
            </div>
          ) : (
            <>
              <h3 className="text-3xl font-bold text-white mb-2">
                {stats ? formatNumber(stats.activeUsers.count) : '0'}
              </h3>
            </>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-white mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-all text-left group" onClick={() => navigate('/users')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-600/30 transition-colors">
                <UsersIcon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="font-medium text-gray-200">Administrar Usuarios</p>
                <p className="text-xs text-gray-500">Ver y administrar todos los usuarios</p>
              </div>
            </div>
          </button>

          <button className="p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center group-hover:bg-green-600/30 transition-colors">
                <BarChart3Icon className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="font-medium text-gray-200">Ver Analíticas</p>
                <p className="text-xs text-gray-500">Revisar respuestas de encuestas</p>
              </div>
            </div>
          </button>

          <button className="p-4 bg-gray-800/50 hover:bg-gray-800 border border-gray-700 rounded-xl transition-all text-left group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center group-hover:bg-purple-600/30 transition-colors">
                <ActivityIcon className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-gray-200">Estado del Sistema</p>
                <p className="text-xs text-gray-500">Monitorear estado del sistema</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-semibold text-white mb-4">Actividad Reciente</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-200 text-sm">Nuevo usuario registrado</p>
              <p className="text-gray-500 text-xs">Hace 2 minutos</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-200 text-sm">Encuesta completada</p>
              <p className="text-gray-500 text-xs">Hace 15 minutos</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-xl">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-gray-200 text-sm">Rol de usuario actualizado</p>
              <p className="text-gray-500 text-xs">Hace 1 hora</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
