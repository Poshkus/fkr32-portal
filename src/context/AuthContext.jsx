import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const MOCK_USERS = [
  { name: 'Петров Иван Иванович', username: 'director', password: '123', role: 'director', dept: 'Руководство' },
  { name: 'Соколова Анна Сергеевна', username: 'clerk', password: '123', role: 'clerk', dept: 'Секретариат' },
  { name: 'Кузнецов Алексей Петрович', username: 'employee', password: '123', role: 'employee', dept: 'Капитальный ремонт' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('frpikp_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (username, password) => {
    // Simulate backend call
    await new Promise(r => setTimeout(r, 600));
    const found = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (!found) throw new Error('Неверный логин или пароль');
    const userData = { name: found.name, role: found.role, dept: found.dept };
    localStorage.setItem('frpikp_user', JSON.stringify(userData));
    localStorage.setItem('frpikp_token', 'mock-jwt-' + username);
    setUser(userData);
    return userData;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('frpikp_user');
    localStorage.removeItem('frpikp_token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);