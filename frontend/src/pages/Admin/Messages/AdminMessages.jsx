import React from 'react';
import { 
  Search, User as UserIcon, Phone, MoreVertical, Send, Edit2, Trash2, MessageSquare 
} from 'lucide-react';

const AdminMessages = ({ 
  users, selectedUser, setSelectedUser, messageSearchTerm, setMessageSearchTerm,
  sentMessages, isMessageForUser, messagesLoading, editingMessageId, editingMessageText,
  setEditingMessageText, handleSaveEditMessage, setEditingMessageId, handleDeleteMessage,
  messageText, setMessageText, handleSendMessage, messagesEndRef
}) => {
  return (
    <div className="h-[calc(100vh-12rem)] flex gap-6 animate-in fade-in zoom-in-95 duration-500">
      {/* Sidebar: User List */}
      <div className="w-80 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800">
          <h3 className="text-lg font-bold mb-4">Conversations</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={messageSearchTerm}
              onChange={(e) => setMessageSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
          {users.filter(user => 
            user.role !== 'admin' && (
              user.name?.toLowerCase().includes(messageSearchTerm.toLowerCase()) ||
              user.email?.toLowerCase().includes(messageSearchTerm.toLowerCase())
            )
          ).map((user) => {
            const isActive = selectedUser?._id === user._id;
            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-4 rounded-2xl flex items-center gap-3 transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-slate-800/50 text-slate-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border ${
                  isActive ? 'bg-white/20 border-white/20 text-white' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}>
                  {user.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1 text-left overflow-hidden">
                  <p className={`text-sm font-bold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>{user.name}</p>
                  <p className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>{user.email}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl relative">
        {selectedUser ? (
          <>
            <div className="p-6 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedUser.name}</h3>
                  <p className="text-xs text-slate-500">Contacting as Administrator</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><Phone size={18} /></button>
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><MoreVertical size={18} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#0b141a]/30">
              {sentMessages.filter(msg => isMessageForUser(msg, selectedUser))
                .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                .map((msg) => {
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div key={msg._id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] group relative ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div className={`px-4 py-3 rounded-2xl shadow-lg relative ${
                          isAdmin 
                          ? 'bg-blue-600 text-white rounded-tr-none' 
                          : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                        }`}>
                          {editingMessageId === msg._id ? (
                            <div className="space-y-2">
                              <textarea 
                                value={editingMessageText}
                                onChange={(e) => setEditingMessageText(e.target.value)}
                                className="w-full p-2 bg-black/20 rounded-lg text-white border-none focus:ring-0 text-sm"
                                rows="2"
                              />
                              <div className="flex gap-2">
                                <button onClick={() => handleSaveEditMessage(msg._id)} className="px-2 py-1 bg-white text-blue-600 rounded-lg text-[10px] font-bold">Save</button>
                                <button onClick={() => setEditingMessageId(null)} className="px-2 py-1 bg-white/20 text-white rounded-lg text-[10px] font-bold">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                              <div className="flex items-center justify-end gap-2 mt-1 opacity-60">
                                <span className="text-[10px]">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                {isAdmin && (
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingMessageId(msg._id); setEditingMessageText(msg.message); }} className="p-1 hover:text-white transition-colors"><Edit2 size={10} /></button>
                                    <button onClick={() => handleDeleteMessage(msg._id)} className="p-1 hover:text-red-400 transition-colors"><Trash2 size={10} /></button>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        {msg.reply && (
                          <div className="mt-2 ml-4 p-3 bg-green-500/10 border border-green-500/20 rounded-2xl rounded-tl-none">
                            <p className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1">User Reply</p>
                            <p className="text-xs text-slate-300">{msg.reply}</p>
                            <p className="text-[9px] text-slate-500 mt-1 text-right">{new Date(msg.replyAt).toLocaleTimeString()}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-slate-900/60 backdrop-blur-md border-t border-slate-800">
              <div className="flex items-center gap-4 bg-slate-800/50 rounded-3xl p-2 pl-6 shadow-inner">
                <textarea 
                  placeholder="Type your message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white resize-none py-2 scrollbar-hide max-h-32"
                  rows="1"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                  className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/30 disabled:opacity-50 disabled:grayscale"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
            <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center text-slate-700 mb-6 border border-slate-700/50 animate-pulse">
              <MessageSquare size={48} />
            </div>
            <h3 className="text-xl font-bold text-white">Select a user to chat</h3>
            <p className="text-sm text-slate-500 max-w-xs mt-2">Manage customer inquiries and agent communication directly from here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMessages;
