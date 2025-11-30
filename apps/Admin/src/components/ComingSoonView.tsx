import { Wrench as IconWrench, Sparkles as IconSparkles } from 'lucide-react';

interface ComingSoonViewProps {
  title?: string;
  message?: string;
  icon?: 'wrench' | 'sparkles';
}

export function ComingSoonView({ 
  title = "Estamos trabajando en ello", 
  message = "Esta funcionalidad está actualmente en desarrollo. ¡Mantente atento a las actualizaciones!",
  icon = 'wrench'
}: ComingSoonViewProps) {
  const IconComponent = icon === 'sparkles' ? IconSparkles : IconWrench;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 border border-gray-800 shadow-xl">
        <IconComponent className="w-10 h-10 text-indigo-500 animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-gray-200 mb-3">{title}</h2>
      <p className="text-gray-400 max-w-md text-sm leading-relaxed">{message}</p>
      <div className="mt-8 flex items-center gap-2 text-xs text-gray-500">
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}
