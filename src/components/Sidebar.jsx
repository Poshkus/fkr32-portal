import { useState } from 'react';

const CHANNELS = [
  { id: 'general', label: 'общий-чат', icon: '#' },
  { id: 'cap_repair', label: 'капремонт', icon: '#' },
  { id: 'legal', label: 'юристы', icon: '#' },
  { id: 'ai', label: 'ИИ-Ассистент', icon: '🤖', isAI: true },
];

export default function Sidebar({ activeMenu, onMenuChange, onChannelChange, activeChannel }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex flex-col w-56 bg-white border-r border-gov-100 shrink-0 animate-slide-in">
        {/* Menu section */}
        <div className="p-3 space-y-1">
          <button
            onClick={() => onMenuChange('chat')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
              activeMenu === 'chat' ? 'bg-gov-50 text-gov-800 font-medium' : 'text-gov-500 hover:text-gov-700 hover:bg-gov-50'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
            </svg>
            Чат фонда
          </button>
          <button
            onClick={() => onMenuChange('docs')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${
              activeMenu === 'docs' ? 'bg-gov-50 text-gov-800 font-medium' : 'text-gov-500 hover:text-gov-700 hover:bg-gov-50'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            Контроль писем
          </button>
        </div>

        {/* Channels (only when chat active) */}
        {activeMenu === 'chat' && (
          <div className="flex-1 px-3 pb-3">
            <p className="text-xs font-medium text-gov-400 uppercase tracking-wider px-3 mb-1">Каналы</p>
            <div className="space-y-0.5">
              {CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => onChannelChange(ch.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition ${
                    activeChannel === ch.id ? 'bg-gov-100 text-gov-800 font-medium' : 'text-gov-500 hover:text-gov-700 hover:bg-gov-50'
                  }`}
                >
                  <span className="text-xs w-5 text-center shrink-0">{ch.icon}</span>
                  <span className="truncate">{ch.label}</span>
                  {ch.isAI && <span className="ml-auto text-xs bg-gov-100 text-gov-600 px-1.5 py-0.5 rounded">AI</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Mobile sidebar overlay */}
      {expanded && (
        <div className="fixed inset-0 z-40 sm:hidden" onClick={() => setExpanded(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <aside className="relative w-64 bg-white h-full border-r border-gov-100 p-4 animate-slide-in" onClick={e => e.stopPropagation()}>
            <div className="space-y-2 mb-4">
              <button onClick={() => { onMenuChange('chat'); setExpanded(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${activeMenu === 'chat' ? 'bg-gov-50 text-gov-800 font-medium' : 'text-gov-500'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
                Чат фонда
              </button>
              <button onClick={() => { onMenuChange('docs'); setExpanded(false); }} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition ${activeMenu === 'docs' ? 'bg-gov-50 text-gov-800 font-medium' : 'text-gov-500'}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg>
                Контроль писем
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export { CHANNELS };