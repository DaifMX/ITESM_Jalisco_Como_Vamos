import { FileQuestionIcon, HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router';

export function NotFoundView() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="w-24 h-24 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 border border-gray-800 shadow-xl relative">
        <FileQuestionIcon className="w-12 h-12 text-red-500" />
        <div className="absolute -top-2 -right-2 w-16 h-16 bg-red-500/10 rounded-full blur-xl"></div>
      </div>
      <h1 className="text-6xl font-bold text-gray-200 mb-3">404</h1>
      <h2 className="text-2xl font-semibold text-gray-300 mb-4">Page Not Found</h2>
      <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-8">
        The page you're looking for doesn't exist or has been moved. Please check the URL or return to the dashboard.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
      >
        <HomeIcon className="w-4 h-4" />
        Back to Dashboard
      </button>
    </div>
  );
}
