import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import Cookies

const Avatar = ({ children, className = '' }) => (
  <div className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}>{children}</div>
);
const AvatarImage = ({ src, alt, onError }) => (
  <img src={src} alt={alt} className="aspect-square h-full w-full" onError={onError} />
);
const AvatarFallback = ({ children, className = '' }) => (
  <span className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-gray-600 ${className}`}>{children}</span>
);
const Button = ({ children, variant = 'primary', size = 'default', className = '', ...props }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50";
  const variantClasses = {
    primary: "bg-black text-white hover:bg-black/90",
    secondary: "bg-gray-200 text-black hover:bg-gray-300",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
  };
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
  };
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
const Input = React.forwardRef(({ className, ...props }, ref) => (
  <input className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-black ${className}`} ref={ref} {...props} />
));

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUser, setIsFetchingUser] = useState(true);
  const [userInvestmentPrefs, setUserInvestmentPrefs] = useState(null); // New state for preferences
  const chatEndRef = useRef(null);

  const backendUrl = 'http://localhost:3000';
  const fastApiUrl = 'http://127.0.0.1:8000'; // FastAPI agent URL

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/get-user`, { withCredentials: true });
      setUser(response.data.data || { id: 'mock-123', username: 'Devansh' });
    } catch (error) {
      console.warn("Backend unreachable. Using mock user.");
      setUser({ id: 'mock-123', username: 'Devansh' });
    } finally {
      setIsFetchingUser(false);
      startNewChat();
    }
  };
  fetchUser();
}, []);

  useEffect(() => {
    if (user?.id) {
      const fetchUserPreferences = async () => {
        try {
          const userEmail = Cookies.get('userEmail');
          if (!userEmail) {
            console.warn("User email not found in cookies. Cannot fetch preferences.");
            return;
          }
          const response = await axios.get(`${backendUrl}/api/user/get-investment-prefs-by-email?email=${userEmail}`, { withCredentials: true });
          setUserInvestmentPrefs(response.data.data);
          console.log("User preferences fetched:", response.data.data);
        } catch (error) {
          console.error("Error fetching user preferences:", error);
          setUserInvestmentPrefs(null); // Ensure null on error
        }
      };
      fetchUserPreferences();
    }
  }, [user?.id, backendUrl]); // Dependency on user.id and backendUrl

  useEffect(() => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, [messages]);

const startNewChat = () => {
  setSessions(prevSessions => {
    const newSessionId = `session-${Date.now()}`;
    const newSession = { 
      id: newSessionId, 
      name: `Chat ${prevSessions.length + 1}`, 
      messages: [] 
    };
    setActiveSessionId(newSessionId);
    setMessages([]);
    setInputMessage('');
    return [...prevSessions, newSession];
  });
};

  const switchSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSessionId(session.id);
      setMessages(session.messages);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !user) return;

    const userMessage = { sender: 'user', text: inputMessage };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const initialPreferenceData = {
        goal_type: "RETIREMENT",
        target_amount: 500000,
        target_years: 20,
        risk_tolerance: "HIGH",
        volatility_tolerance: "HIGH",
        portfolio_style: "AGGRESSIVE_GROWTH",
        preferred_sectors: ["TECHNOLOGY", "HEALTHCARE"],
        excluded_sectors: ["TOBACCO"],
        initial_investment: 10000,
        liquidity: 5000
      };

      const response = await axios.post(`${fastApiUrl}/agent/chat`, {
        sessionId: activeSessionId,
        userId: user.id,
        data: {
          message: inputMessage,
          initialPreferenceData: currentMessages.length === 1 ? userInvestmentPrefs : null,
        },
      }, { withCredentials: true });

      const agentMessageText = response.data?.response || "Sorry, I received an unexpected response.";
      const agentMessage = { sender: 'agent', text: agentMessageText };
      const finalMessages = [...currentMessages, agentMessage];
      setMessages(finalMessages);

      setSessions(prev => prev.map(session =>
        session.id === activeSessionId
          ? { ...session, messages: finalMessages }
          : session
      ));

    } catch (error) {
      console.error("Error sending message:", error);
      setMessages(prev => [...prev, { sender: 'agent', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${backendUrl}/api/user/logout`, {}, { withCredentials: true });
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isFetchingUser) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-white text-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <div>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-white text-black">
      <nav className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <a href="/" className="text-2xl font-bold text-black">AI Assistant</a>
        <div className="flex items-center space-x-4">
          {user && <span className="font-semibold hidden sm:inline">Welcome, {user.username}!</span>}
          <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          <a href="/profile">
            <Avatar>
              {user?.username ? (
                <AvatarImage
                  src={`https://api.dicebear.com/8.x/initials/svg?seed=${user.username}`}
                  alt="User Avatar"
                  onError={(e) => e.target.style.display = 'none'}
                />
              ) : (
                <AvatarFallback>{user?.username?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
              )}
            </Avatar>
          </a>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-gray-200 bg-white p-4 flex flex-col space-y-4 overflow-y-auto">
          <h2 className="text-lg font-semibold">Sessions</h2>
          <div className="flex flex-col space-y-2">
            {sessions.map((session) => (
              <div key={session.id} onClick={() => switchSession(session.id)}
                   className={`p-2 rounded-md cursor-pointer text-sm truncate ${activeSessionId === session.id ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}`}>
                {session.name}
              </div>
            ))}
          </div>
          <div className="mt-auto">
            <Button variant="secondary" className="w-full" onClick={startNewChat}>+ New Session</Button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col bg-gray-50">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="flex justify-center items-center h-full">
                <div className="text-center text-gray-500">
                  <div className="text-xl mb-2">👋</div>
                  <div>Welcome to your AI Financial Assistant!</div>
                  <div className="text-sm">Start a conversation by typing below.</div>
                </div>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-lg max-w-lg shadow-sm ${msg.sender === 'user' ? 'bg-black text-white' : 'bg-white border'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border p-3 rounded-lg max-w-md shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white flex items-center space-x-2">
            <Input
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <Button type="submit" disabled={isLoading || !inputMessage.trim()}>Send</Button>
          </form>
        </main>
      </div>
    </div>
  );
};

export default HomePage;