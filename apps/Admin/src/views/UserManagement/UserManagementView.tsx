import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

import { 
  UsersIcon,
  UserCheckIcon,
  UserXIcon,
  SearchIcon,
  PlusIcon,
  Loader2Icon,
  EditIcon,
  CheckCircleIcon,
  BanIcon,
  Trash2Icon,
  ShieldIcon,
  PenToolIcon,
  UserIcon,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'banned' | 'pending';
  createdAt: string;
}

export default function HomeView() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const activeUsers = users.filter(u => u.status === 'active').length;
  const bannedUsers = users.filter(u => u.status === 'banned').length;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await authClient.admin.listUsers({
        query: {
          limit: 100,
          offset: 0
        }
      });
      
      if (response.data && 'users' in response.data) {
        const rawUsers = response.data.users as unknown[];
        const mappedUsers: User[] = rawUsers.map((user: unknown) => {
          const u = user as { 
            id: string; 
            name?: string; 
            email: string; 
            role?: string; 
            banned?: boolean; 
            createdAt?: string;
          };
          return {
            id: u.id,
            name: u.name || u.email?.split('@')[0] || 'Unknown',
            email: u.email,
            role: u.role || 'user',
            status: u.banned ? 'banned' : 'active',
            createdAt: u.createdAt || new Date().toISOString(),
          };
        });
        setUsers(mappedUsers);
      }
    } catch { /* empty */ } 
    finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await authClient.admin.banUser({
        userId
      });
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'banned' } : u));
    } catch (error) {
      console.error("Failed to ban user", error);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await authClient.admin.unbanUser({
        userId
      });
      setUsers(users.map(u => u.id === userId ? { ...u, status: 'active' } : u));
    } catch (error) {
      console.error("Failed to activate user", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        await authClient.admin.removeUser({
          userId
        });
        setUsers(users.filter(u => u.id !== userId));
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'banned': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <ShieldIcon className="w-4 h-4 text-purple-400" />;
      case 'editor': return <PenToolIcon className="w-4 h-4 text-blue-400" />;
      default: return <UserIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UsersIcon className="w-16 h-16 text-indigo-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Usuarios Totales</p>
          <h3 className="text-3xl font-bold text-white">{users.length.toLocaleString('es-MX')}</h3>
          <div className="mt-4 flex items-center text-xs text-gray-400 bg-gray-700/30 w-fit px-2 py-1 rounded-full">
            Total registrados
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserCheckIcon className="w-16 h-16 text-green-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Usuarios Activos</p>
          <h3 className="text-3xl font-bold text-white">{activeUsers.toLocaleString('es-MX')}</h3>
          <div className="mt-4 flex items-center text-xs text-green-400 bg-green-500/10 w-fit px-2 py-1 rounded-full">
            No bloqueados
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <UserXIcon className="w-16 h-16 text-red-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Usuarios Bloqueados</p>
          <h3 className="text-3xl font-bold text-white">{bannedUsers.toLocaleString('es-MX')}</h3>
          <div className="mt-4 flex items-center text-xs text-red-400 bg-red-500/10 w-fit px-2 py-1 rounded-full">
            Acción requerida
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-800 backdrop-blur-sm">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar usuarios por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
            <PlusIcon className="w-4 h-4" /> Agregar Usuario
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Usuario</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Rol</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Registrado</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <Loader2Icon className="w-4 h-4 animate-spin inline-block mr-2" /> Cargando usuarios...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No se encontraron usuarios que coincidan con tu búsqueda.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-bold text-gray-300 border border-gray-700">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-200">{user.name}</div>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        {getRoleIcon(user.role)}
                        <span className="capitalize">{user.role}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                          title="Editar Usuario"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        {user.status === 'banned' ? (
                          <button 
                            onClick={() => handleActivateUser(user.id)}
                            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Desbloquear Usuario"
                          >
                            <CheckCircleIcon className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleBanUser(user.id)}
                            className="p-2 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                            title="Bloquear Usuario"
                          >
                            <BanIcon className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar Usuario"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-gray-800 bg-gray-800/20 flex items-center justify-between text-xs text-gray-500">
          <span>Mostrando {filteredUsers.length} de {users.length} usuarios</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-800 hover:bg-gray-800 disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 rounded-lg border border-gray-800 hover:bg-gray-800 disabled:opacity-50" disabled>Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
