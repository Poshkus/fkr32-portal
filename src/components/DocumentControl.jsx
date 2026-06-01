import { useState, useEffect } from 'react';
import { fetchDocuments, aiAnalyze, approveDocument, statusMeta, DEPARTMENTS } from '../api/documents';
import { useAuth } from '../context/AuthContext';

export default function DocumentControl() {
  const { user } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [resolution, setResolution] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [approving, setApproving] = useState(false);
  const [approveMsg, setApproveMsg] = useState('');

  useEffect(() => {
    fetchDocuments().then(data => { setDocs(data); setLoading(false); });
  }, []);

  const selectDoc = (doc) => {
    setSelectedDoc(doc);
    setAiResult(null);
    setResolution('');
    setSelectedDept('');
    setApproveMsg('');
  };

  const runAiAnalysis = async (docId) => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const result = await aiAnalyze(docId);
      setAiResult(result);
      setResolution(result.suggested_resolution);
      setSelectedDept(result.recommended_department);
    } catch (e) {
      setAiResult({ summary: 'Ошибка анализа. Попробуйте позже.', recommended_department: '', suggested_resolution: '' });
    } finally {
      setAiLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!resolution || !selectedDept) return;
    setApproving(true);
    try {
      const res = await approveDocument(selectedDoc.id, resolution, selectedDept);
      setApproveMsg(res.message);
      setDocs(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, status: 'in_progress' } : d));
      setSelectedDoc(prev => ({ ...prev, status: 'in_progress' }));
    } catch (e) {
      setApproveMsg('Ошибка при утверждении');
    } finally {
      setApproving(false);
    }
  };

  const statusFilter = (status) => {
    if (!selectedDoc) return;
    const filtered = docs.filter(d => d.status === status || status === 'all');
    setDocs(filtered);
    setSelectedDoc(null);
    // Reset — re-fetch
    fetchDocuments().then(data => {
      if (status === 'all') setDocs(data);
      else setDocs(data.filter(d => d.status === status));
    });
  };

  return (
    <div className="flex h-full animate-fade-in">
      {/* Left column — Document list */}
      <div className="w-full md:w-[380px] lg:w-[420px] border-r border-gov-100 flex flex-col shrink-0 bg-white">
        {/* Filters */}
        <div className="h-12 border-b border-gov-100 flex items-center px-3 gap-1.5 shrink-0 bg-white">
          {[
            { id: 'all', label: 'Все', color: 'bg-gov-500' },
            { id: 'new', label: 'Новые', color: 'bg-blue-500' },
            { id: 'in_progress', label: 'В работе', color: 'bg-amber-500' },
            { id: 'overdue', label: 'Просрочено', color: 'bg-red-500' },
          ].map(f => (
            <button key={f.id} onClick={() => statusFilter(f.id)} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md text-gov-500 hover:text-gov-700 hover:bg-gov-50 transition whitespace-nowrap">
              <span className={`w-1.5 h-1.5 rounded-full ${f.color}`} />
              {f.label}
            </button>
          ))}
        </div>

        {/* Document cards */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gov-400 text-sm">Загрузка...</div>
          ) : docs.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-gov-400 text-sm">Нет документов</div>
          ) : docs.map(doc => {
            const meta = statusMeta[doc.status];
            return (
              <button
                key={doc.id}
                onClick={() => selectDoc(doc)}
                className={`w-full text-left p-3 rounded-xl border transition ${
                  selectedDoc?.id === doc.id
                    ? 'border-gov-300 bg-gov-50 shadow-sm'
                    : 'border-gov-100 hover:border-gov-200 hover:bg-gov-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="text-xs text-gov-400 font-mono shrink-0">№{doc.reg_num}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${meta.class}`}>{meta.label}</span>
                </div>
                <p className="text-sm text-gov-800 leading-snug line-clamp-2">{doc.subject}</p>
                <p className="text-xs text-gov-400 mt-1">{doc.date}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right column — Detail + AI */}
      <div className="hidden md:flex flex-1 flex-col bg-gov-50">
        {!selectedDoc ? (
          <div className="flex-1 flex items-center justify-center text-gov-400 text-sm">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto mb-3 text-gov-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <p>Выберите письмо из списка</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="h-12 border-b border-gov-100 flex items-center px-4 gap-3 shrink-0 bg-white">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gov-800 truncate">{selectedDoc.subject}</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-gov-600 hover:text-gov-800 bg-gov-100 hover:bg-gov-200 px-3 py-1.5 rounded-lg transition whitespace-nowrap">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                Посмотреть скан
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Meta */}
              <div className="bg-white rounded-xl border border-gov-100 p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gov-400">Номер:</span><p className="text-gov-800 font-mono text-xs mt-0.5">{selectedDoc.reg_num}</p></div>
                  <div><span className="text-gov-400">Дата:</span><p className="text-gov-800 mt-0.5">{selectedDoc.date}</p></div>
                  <div className="col-span-2">
                    <span className="text-gov-400">Статус:</span>
                    <span className={`ml-2 text-xs font-medium px-2 py-0.5 rounded border ${statusMeta[selectedDoc.status].class}`}>{statusMeta[selectedDoc.status].label}</span>
                  </div>
                </div>
              </div>

              {/* AI Analysis */}
              {!aiResult && !aiLoading && (
                <button onClick={() => runAiAnalysis(selectedDoc.id)} className="w-full py-3 px-4 bg-gradient-to-r from-gov-700 to-gov-800 text-white rounded-xl text-sm font-medium hover:from-gov-800 hover:to-gov-900 transition flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                  </svg>
                  Запустить ИИ-анализ
                </button>
              )}

              {aiLoading && (
                <div className="bg-white rounded-xl border border-gov-100 p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-gov-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gov-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gov-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <p className="text-sm text-gov-400">ИИ анализирует документ...</p>
                </div>
              )}

              {aiResult && (
                <>
                  {/* Summary */}
                  <div className="bg-white rounded-xl border border-gov-100 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
                      </svg>
                      <span className="text-sm font-medium text-gov-800">ИИ-резюме</span>
                    </div>
                    <p className="text-sm text-gov-700 leading-relaxed">{aiResult.summary}</p>
                  </div>

                  {/* Department selector */}
                  <div className="bg-white rounded-xl border border-gov-100 p-4">
                    <label className="text-sm font-medium text-gov-800 block mb-2">Ответственный отдел</label>
                    <select
                      value={selectedDept}
                      onChange={e => setSelectedDept(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gov-200 bg-white text-sm text-gov-800 focus:outline-none focus:ring-2 focus:ring-gov-400"
                    >
                      <option value="">Выберите отдел</option>
                      {DEPARTMENTS.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.label} {d.id === aiResult.recommended_department ? '(рекомендовано)' : ''}
                        </option>
                      ))}
                    </select>
                    {aiResult.recommended_department && (
                      <p className="text-xs text-gov-400 mt-1 flex items-center gap-1">
                        <svg className="w-3 h-3 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                        ИИ рекомендует: {DEPARTMENTS.find(d => d.id === aiResult.recommended_department)?.label}
                      </p>
                    )}
                  </div>

                  {/* Resolution */}
                  <div className="bg-white rounded-xl border border-gov-100 p-4">
                    <label className="text-sm font-medium text-gov-800 block mb-2">Текст резолюции</label>
                    <textarea
                      value={resolution}
                      onChange={e => setResolution(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-lg border border-gov-200 bg-white text-sm text-gov-800 placeholder-gov-400 focus:outline-none focus:ring-2 focus:ring-gov-400 resize-none"
                    />
                    {(user?.role === 'director' || user?.role === 'clerk') && (
                      <p className="text-xs text-gov-400 mt-1">Директор может отредактировать текст резолюции вручную</p>
                    )}
                  </div>

                  {/* Approve button */}
                  {(user?.role === 'director' || user?.role === 'clerk') && (
                    <button
                      onClick={handleApprove}
                      disabled={approving || !resolution || !selectedDept}
                      className="w-full py-3 px-4 bg-gradient-to-r from-gov-700 to-gov-900 text-white rounded-xl text-sm font-medium hover:from-gov-800 hover:to-gov-950 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {approving ? (
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      )}
                      {approving ? 'Отправка...' : '⚡ Утвердить и направить'}
                    </button>
                  )}

                  {approveMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                      {approveMsg}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}