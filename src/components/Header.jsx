import { useAuth } from '../context/AuthContext';

export default function Header({ activeMenu, onToggleChat, onToggleDocs }) {
  const { user, logout } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gov-100 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gov-800 rounded-lg flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
          </svg>
        </div>
        <span className="text-sm font-semibold text-gov-800 hidden sm:block">ФРПиКП Брянской области</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Mobile nav toggle */}
        <div className="flex sm:hidden gap-1">
          <button onClick={onToggleChat} className={`px-3 py-1.5 text-xs rounded-md transition ${activeMenu === 'chat' ? 'bg-gov-100 text-gov-800 font-medium' : 'text-gov-500 hover:text-gov-700'}`}>Чат</button>
          <button onClick={onToggleDocs} className={`px-3 py-1.5 text-xs rounded-md transition ${activeMenu === 'docs' ? 'bg-gov-100 text-gov-800 font-medium' : 'text-gov-500 hover:text-gov-700'}`}>Контроль</button>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-right">
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gov-800 leading-tight">{user.name}</p>
                <p className="text-xs text-gov-400">{user.dept}</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-gov-200 flex items-center justify-center text-gov-700 text-sm font-medium">
                {user.name?.[0] || '?'}
              </div>
            </div>
            <button onClick={logout} className="text-xs text-gov-400 hover:text-gov-600 transition px-2 py-1" title="Выйти">
              Выход
            </button>
          </div>
        )}
      </div>
    </header>
  );
}