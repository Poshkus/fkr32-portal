import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import DocumentControl from './components/DocumentControl';

function ProtectedApp() {
  const { isAuth } = useAuth();
  const [activeMenu, setActiveMenu] = useState('chat');
  const [activeChannel, setActiveChannel] = useState('general');

  if (!isAuth) return <LoginPage />;

  return (
    <div className="h-screen flex flex-col bg-gov-50">
      <Header
        activeMenu={activeMenu}
        onToggleChat={() => setActiveMenu('chat')}
        onToggleDocs={() => setActiveMenu('docs')}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeMenu={activeMenu}
          onMenuChange={setActiveMenu}
          onChannelChange={setActiveChannel}
          activeChannel={activeChannel}
        />
        {/* Mobile bottom nav */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeMenu === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden" key="chat">
              <ChatArea initialChannel={activeChannel} />
            </div>
          )}
          {activeMenu === 'docs' && (
            <div className="flex-1 flex flex-col overflow-hidden" key="docs">
              <DocumentControl />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  );
}