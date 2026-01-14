import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiSend, FiPaperclip, FiMoreVertical, FiPhone, FiVideo, FiTrash2 } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const Messages = () => {
  const { user } = useAuthStore();
  const messagesEndRef = useRef(null);
  
  const [conversations] = useState([
    { id: 1, name: 'Tech Solutions (AI)', role: 'Employer', lastMessage: 'AI-powered conversation', time: 'Now', unread: 0, avatar: 'T', online: true },
    { id: 2, name: 'ABC Constructions (AI)', role: 'Employer', lastMessage: 'AI-powered conversation', time: 'Now', unread: 0, avatar: 'A', online: true },
    { id: 3, name: 'Rajesh Kumar (AI)', role: 'Worker', lastMessage: 'AI-powered conversation', time: 'Now', unread: 0, avatar: 'R', online: true },
    { id: 4, name: 'Green Homes (AI)', role: 'Employer', lastMessage: 'AI-powered conversation', time: 'Now', unread: 0, avatar: 'G', online: true },
  ]);

  const [selectedChat, setSelectedChat] = useState(conversations[0]);
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clear messages when switching conversations
    setMessages([]);
  }, [selectedChat]);

  const formatTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'me',
      text: messageText.trim(),
      time: formatTime()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentMessage = messageText;
    setMessageText('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat/ai/message', {
        message: currentMessage,
        conversationId: `chat-${selectedChat.id}`,
        role: user?.role || 'worker' // Use actual user role
      });

      const aiMessage = {
        id: Date.now() + 1,
        sender: 'other',
        text: response.data.data.message,
        time: formatTime()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Remove the user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConversation = async () => {
    if (!window.confirm('Clear this conversation?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/chat/ai/conversation/chat-${selectedChat.id}`);
      setMessages([]);
      toast.success('Conversation cleared');
    } catch (error) {
      console.error('Error clearing conversation:', error);
      toast.error('Failed to clear conversation');
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="grid lg:grid-cols-3 gap-6 h-full">
        {/* Chat List */}
        <div className="lg:col-span-1 card flex flex-col h-full">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Messages</h2>
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search conversations..." className="input pl-10" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                className={`w-full p-4 rounded-lg text-left transition ${
                  selectedChat.id === conv.id
                    ? 'bg-primary-50 border-2 border-primary-200'
                    : 'bg-white hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                      {conv.avatar}
                    </div>
                    {conv.online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-slate-900 truncate">{conv.name}</h3>
                      <span className="text-xs text-slate-500">{conv.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 mb-1">{conv.role}</p>
                    <p className="text-sm text-slate-600 truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
                      {conv.unread}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2 card flex flex-col h-full">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-lg">
                  {selectedChat.avatar}
                </div>
                {selectedChat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{selectedChat.name}</h3>
                <p className="text-sm text-slate-600">{selectedChat.online ? 'Online' : 'Offline'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Call">
                <FiPhone className="w-5 h-5 text-slate-600" />
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg transition" title="Video Call">
                <FiVideo className="w-5 h-5 text-slate-600" />
              </button>
              <button onClick={handleClearConversation} className="p-2 hover:bg-rose-100 rounded-lg transition" title="Clear Chat">
                <FiTrash2 className="w-5 h-5 text-rose-600" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-slate-500 py-8">
                <p className="text-lg mb-2">Start a conversation with {selectedChat.name}</p>
                <p className="text-sm">This is an AI-powered chat using Groq API</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${
                  msg.sender === 'me'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-100 text-slate-900'
                } rounded-2xl px-4 py-2`}>
                  <p className="text-sm">{msg.text}</p>
                  <p className={`text-xs mt-1 ${
                    msg.sender === 'me' ? 'text-primary-100' : 'text-slate-500'
                  }`}>{msg.time}</p>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl px-4 py-2">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4 border-t">
            <button type="button" className="p-2 hover:bg-slate-100 rounded-lg transition">
              <FiPaperclip className="w-5 h-5 text-slate-600" />
            </button>
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your message..."
              className="input flex-1"
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading || !messageText.trim()}>
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Messages;
