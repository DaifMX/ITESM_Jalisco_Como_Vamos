import { useEffect, useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useNavigate } from 'react-router';
import { 
  LayersIcon, 
  AlertCircleIcon, 
  MailIcon, 
  LockIcon, 
  EyeIcon, 
  EyeOffIcon, 
  Loader2Icon, 
  ArrowRightIcon 
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [totpCode, setTotpCode] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');
  
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await authClient.getSession();
        if (session.data) {
          navigate('/', { replace: true });
        }
      } catch {
        // Not logged in, stay on login page
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });
      
      if (result.error) {
        await authClient.signOut();
        setError(result.error.message || 'Invalid email or password');
      }  
      
      if (result.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((result.data as any).twoFactorRedirect) {
          setShow2FADialog(true);
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTwoFactorError('');

    try {
      const result = await authClient.twoFactor.verifyTotp({
        code: totpCode,
      });

      if (result.error) {
        setTwoFactorError(result.error.message || 'Código inválido');
      } else if (result.data) {
        // Verificación exitosa, obtener sesión
        const session = await authClient.getSession();
        if (session.data?.user) {
          setShow2FADialog(false);
          navigate('/');
        }
      }
    } catch (err) {
      console.error('2FA error:', err);
      setTwoFactorError('Error al verificar el código. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>
        {`
          body, html { 
            background-color: #030712; 
            margin: 0;
            padding: 0;
            height: 100%;
          }
          #artifact_react {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
        `}
      </style>

      <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950 text-gray-100 font-sans p-4">

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-4">
              <LayersIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-4xl tracking-tight">Admin<span className="text-indigo-500">Panel</span></span>
          </div>

          {/* Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-5">

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-pulse">
                  <AlertCircleIcon className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Correo Electrónico</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className="w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-950/50 border border-gray-800 text-gray-200 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                    placeholder="admin@sys.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Contraseña</label>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className="w-4 h-4 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-950/50 border border-gray-800 text-gray-200 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="bg-transparent absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="w-4 h-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Iniciar Sesión
                    <ArrowRightIcon className="w-4 h-4 opacity-70" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* 2FA Dialog */}
          {show2FADialog && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl w-full max-w-md relative">
                <button
                  onClick={() => {
                    setShow2FADialog(false);
                    setTotpCode('');
                    setTwoFactorError('');
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mx-auto mb-4">
                    <LockIcon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-100 mb-2">Verificación de Dos Factores</h2>
                  <p className="text-sm text-gray-400">Ingresa el código de tu aplicación de autenticación</p>
                </div>

                <form onSubmit={handle2FASubmit} className="space-y-5">
                  {twoFactorError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2 animate-pulse">
                      <AlertCircleIcon className="w-4 h-4" />
                      {twoFactorError}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Código TOTP</label>
                    <input
                      type="text"
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full bg-gray-950/50 border border-gray-800 text-gray-200 text-center text-2xl font-mono rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600 tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      autoComplete="off"
                      autoFocus
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || totpCode.length !== 6}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2Icon className="w-4 h-4 animate-spin" />
                        Verificando...
                      </>
                    ) : (
                      <>
                        Verificar
                        <ArrowRightIcon className="w-4 h-4 opacity-70" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
             <p className="text-xs text-gray-600">
               © 2025 daif/AdminPanel All rights reserved.
             </p>
          </div>
        </div>
      </div>
    </>
  );
}