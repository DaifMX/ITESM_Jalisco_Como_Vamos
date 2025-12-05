import { useState } from "react";
import useSWR from "swr";

import { 
  HelpCircleIcon,
  SearchIcon,
  Loader2Icon,
  TagIcon,
  EyeIcon,
  EyeOffIcon,
} from "lucide-react";

interface Question {
  id: string;
  xlsxCode: string;
  value: string;
  valueShort: string | null;
  categoryId: string;
  categoryName?: string;
  isHidden: boolean;
}

export default function QuestionsView() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: questions = [], isLoading, mutate } = useSWR<Question[]>('/question');

  const handleToggleHidden = async (questionId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/question/${questionId}/toggle-hidden`, {
        method: 'PATCH',
        credentials: 'include',
      });
      
      if (response.ok) {
        mutate();
      }
    } catch (error) {
      console.error("Failed to toggle question visibility", error);
    }
  };

  const filteredQuestions = questions.filter(question => 
    question.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    question.xlsxCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <HelpCircleIcon className="w-16 h-16 text-indigo-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Preguntas Totales</p>
          <h3 className="text-3xl font-bold text-white">{questions.length.toLocaleString('es-MX')}</h3>
          <div className="mt-4 flex items-center text-xs text-gray-400 bg-gray-700/30 w-fit px-2 py-1 rounded-full">
            Total registradas
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <SearchIcon className="w-16 h-16 text-green-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Resultados de Búsqueda</p>
          <h3 className="text-3xl font-bold text-white">{filteredQuestions.length.toLocaleString('es-MX')}</h3>
          <div className="mt-4 flex items-center text-xs text-green-400 bg-green-500/10 w-fit px-2 py-1 rounded-full">
            Coincidencias actuales
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TagIcon className="w-16 h-16 text-purple-500" />
          </div>
          <p className="text-gray-400 text-sm font-medium mb-1">Categorías</p>
          <h3 className="text-3xl font-bold text-white">
            {new Set(questions.map(q => q.categoryId)).size.toLocaleString('es-MX')}
          </h3>
          <div className="mt-4 flex items-center text-xs text-purple-400 bg-purple-500/10 w-fit px-2 py-1 rounded-full">
            Diferentes categorías
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-900/50 p-4 rounded-2xl border border-gray-800 backdrop-blur-sm">
        <div className="relative w-full sm:w-96">
          <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar preguntas por texto o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 text-gray-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-800/50 border-b border-gray-800">
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Código</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Pregunta</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Versión Corta</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    <Loader2Icon className="w-4 h-4 animate-spin inline-block mr-2" /> Cargando preguntas...
                  </td>
                </tr>
              ) : filteredQuestions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">
                    No se encontraron preguntas que coincidan con tu búsqueda.
                  </td>
                </tr>
              ) : (
                filteredQuestions.map((question) => (
                  <tr key={question.id} className="group hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-medium">
                          {question.xlsxCode}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-200 max-w-lg">
                        {question.value}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-400 max-w-xs">
                        {question.valueShort || '—'}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        question.isHidden 
                          ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' 
                          : 'bg-green-500/20 text-green-400 border-green-500/30'
                      }`}>
                        {question.isHidden ? 'Oculta' : 'Visible'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleToggleHidden(question.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            question.isHidden
                              ? 'text-gray-400 hover:text-green-400 hover:bg-green-500/10'
                              : 'text-gray-400 hover:text-orange-400 hover:bg-orange-500/10'
                          }`}
                          title={question.isHidden ? 'Mostrar Pregunta' : 'Ocultar Pregunta'}
                        >
                          {question.isHidden ? <EyeIcon className="w-4 h-4" /> : <EyeOffIcon className="w-4 h-4" />}
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
          <span>Mostrando {filteredQuestions.length} de {questions.length} preguntas</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-800 hover:bg-gray-800 disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 rounded-lg border border-gray-800 hover:bg-gray-800 disabled:opacity-50" disabled>Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
