import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuth } from '../context/AuthContext';

const CHANNELS_MAP = {
  general: { label: 'общий-чат', color: 'bg-gov-500' },
  cap_repair: { label: 'капремонт', color: 'bg-amber-500' },
  legal: { label: 'юристы', color: 'bg-emerald-500' },
  ai: { label: 'ИИ-Ассистент', color: 'bg-violet-500' },
};

const INITIAL_MESSAGES = {
  general: [
    { id: 1, user: 'Петров И.И.', text: 'Коллеги, всем доброе утро!', time: '09:15', role: 'director' },
    { id: 2, user: 'Соколова А.С.', text: 'Доброе утро, Иван Иванович!', time: '09:17', role: 'clerk' },
    { id: 3, user: 'Кузнецов А.П.', text: 'Доброе утро! Подготовил отчёт по капремонту.', time: '09:20', role: 'employee' },
  ],
  cap_repair: [
    { id: 1, user: 'Кузнецов А.П.', text: 'Нужны подписи по акту выполненных работ по ул. Победы, 8.', time: '10:30', role: 'employee' },
  ],
  legal: [
    { id: 1, user: 'Соколова А.С.', text: 'Коллеги, напоминаю о сроках подачи документов.', time: '11:00', role: 'clerk' },
  ],
  ai: [
    { id: 1, user: '🤖 ИИ-Ассистент', text: 'Здравствуйте! Я — ИИ-помощник портала ФРПиКП. Могу помочь с анализом документов, подготовкой резолюций и ответами на вопросы. Чем могу быть полезен?', time: '00:00', role: 'ai' },
  ],
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={handleCopy} className="text-xs text-gov-400 hover:text-gov-600 transition flex items-center gap-1 px-2 py-0.5 rounded hover:bg-gov-50">
      {copied ? '✓ Скопировано' : '📋 Копировать'}
    </button>
  );
}

export default function ChatArea({ initialChannel }) {
  const { user } = useAuth();
  const [channel, setChannel] = useState(initialChannel || 'general');
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const bottomRef = useRef(null);
  const channelInfo = CHANNELS_MAP[channel];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, channel]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = {
      id: Date.now(),
      user: user?.name || 'Пользователь',
      text: input.trim(),
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
      role: 'user',
    };
    const updated = { ...messages, [channel]: [...(messages[channel] || []), newMsg] };
    setMessages(updated);
    setInput('');

    // AI response for AI channel
    if (channel === 'ai') {
      setAiLoading(true);
      await new Promise(r => setTimeout(r, 1500));
      const aiReply = {
        id: Date.now() + 1,
        user: '🤖 ИИ-Ассистент',
        text: generateAiResponse(newMsg.text),
        time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }),
        role: 'ai',
      };
      setMessages(prev => ({ ...prev, ai: [...(prev.ai || []), aiReply] }));
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Channel header */}
      <div className="h-12 border-b border-gov-100 flex items-center px-4 gap-2 shrink-0 bg-white">
        <div className={`w-2.5 h-2.5 rounded-full ${channelInfo?.color || 'bg-gov-500'}`} />
        <span className="text-sm font-medium text-gov-800">{channelInfo?.label || channel}</span>
        {/* Channel tabs */}
        <div className="flex gap-1 ml-4 overflow-x-auto">
          {Object.entries(CHANNELS_MAP).map(([id, info]) => (
            <button
              key={id}
              onClick={() => setChannel(id)}
              className={`text-xs px-2.5 py-1 rounded-md whitespace-nowrap transition ${
                channel === id ? 'bg-gov-100 text-gov-800 font-medium' : 'text-gov-400 hover:text-gov-600'
              }`}
            >
              #{info.label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {(messages[channel] || []).map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}>
            <div className={`max-w-[75%] ${msg.role === 'user' ? 'bg-gov-800 text-white rounded-2xl rounded-br-md' : 'bg-white border border-gov-100 rounded-2xl rounded-bl-md'} px-4 py-2.5 shadow-sm`}>
              {msg.role !== 'user' && (
                <p className={`text-xs font-medium mb-0.5 ${msg.role === 'ai' ? 'text-violet-600' : 'text-gov-500'}`}>{msg.user}</p>
              )}
              {msg.role === 'ai' ? (
                <div className="ai-response text-sm text-gov-800">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                  <div className="mt-2"><CopyButton text={msg.text} /></div>
                </div>
              ) : (
                <p className="text-sm">{msg.text}</p>
              )}
              <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-gov-400'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        {aiLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gov-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gov-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-gov-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-gov-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gov-100 p-3 bg-white shrink-0">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={channel === 'ai' ? 'Спросите ИИ-ассистента...' : 'Введите сообщение...'}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gov-200 bg-gov-50 text-sm text-gov-900 placeholder-gov-400 focus:outline-none focus:ring-2 focus:ring-gov-400 focus:border-transparent transition"
          />
          <button onClick={sendMessage} className="px-4 py-2.5 bg-gov-800 hover:bg-gov-900 text-white rounded-xl transition flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function generateAiResponse(question) {
  const q = question.toLowerCase();
  if (q.includes('документ') || q.includes('письмо')) {
    return 'По вашему запросу найден документ № **01-15/1245** от 22.05.2025.\n\n**Тема:** О выделении средств на капремонт кровли ул. Советская, 12\n**Статус:** Новое\n**Рекомендованный отдел:** Капитальный ремонт\n\nДля полного анализа откройте раздел **Контроль писем** и выберите этот документ.';
  }
  if (q.includes('статистик') || q.includes('отчёт')) {
    return '## Статистика портала за май 2025\n\n| Показатель | Значение |\n|---|---|\n| Всего писем | **24** |\n| Новых | **8** |\n| В работе | **11** |\n| Просрочено | **3** |\n| Исполнено | **2** |\n\nИсточник: база данных Аракс Group (n8n синхронизация).';
  }
  if (q.includes('резолюц') || q.includes('направить')) {
    return 'Для утверждения резолюции:\n\n1. Откройте раздел **Контроль писем**\n2. Выберите нужное письмо\n3. Нажмите **"Запустить ИИ-анализ"**\n4. Проверьте сгенерированный текст резолюции\n5. Нажмите **"⚡ Утвердить и направить"**\n\nРезолюция будет отправлена в соответствующий отдел, а статус письма изменится на "В работе".';
  }
  return `**Ответ ИИ-ассистента:**\n\nСпасибо за ваш запрос. \n\nЯ могу помочь с:\n- 🔍 **Поиском документов** по номеру или теме\n- 📝 **Подготовкой проекта резолюции**\n- 📊 **Статистикой** по входящим документам\n- ❓ **Ответами** на вопросы по работе портала\n\nУточните, пожалуйста, что именно вас интересует?`;
}