import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) { setError('Заполните все поля'); return; }
    setLoading(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gov-50 to-gov-100 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="bg-white rounded-2xl shadow-lg border border-gov-100 p-8 sm:p-10">
          {/* Logo / Title */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-gov-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gov-900">Портал ФРПиКП</h1>
            <p className="text-sm text-gov-500 mt-1">Брянская область</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gov-700 mb-1">Логин</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Email или имя пользователя"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gov-200 bg-white text-gov-900 placeholder-gov-400 focus:outline-none focus:ring-2 focus:ring-gov-400 focus:border-transparent transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gov-700 mb-1">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="··········"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gov-200 bg-white text-gov-900 placeholder-gov-400 focus:outline-none focus:ring-2 focus:ring-gov-400 focus:border-transparent transition text-sm"
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-gov-800 hover:bg-gov-900 text-white font-medium rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {loading ? 'Вход...' : 'Войти в систему'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gov-400">Техническая поддержка: ИТ-отдел</p>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-4 p-3 bg-gov-50 rounded-lg border border-gov-100">
            <p className="text-xs text-gov-500 mb-1 font-medium">Демо-доступ:</p>
            <div className="text-xs text-gov-400 space-y-0.5">
              <p>director / 123 — Директор</p>
              <p>clerk / 123 — Секретарь</p>
              <p>employee / 123 — Сотрудник</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}