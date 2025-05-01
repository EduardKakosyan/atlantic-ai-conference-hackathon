'use client';

import { useChat } from '@ai-sdk/react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { ChatLoading } from '@/components/ui/chat-loading';
import { formatMessageTime } from '@/lib/utils';

export default function Page() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageTimestamps, setMessageTimestamps] = useState<Map<string, string>>(new Map());
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
    
    // Add timestamps for new messages
    const newTimestamps = new Map(messageTimestamps);
    messages.forEach(message => {
      if (!newTimestamps.has(message.id)) {
        newTimestamps.set(message.id, formatMessageTime());
      }
    });
    
    if (newTimestamps.size !== messageTimestamps.size) {
      setMessageTimestamps(newTimestamps);
    }
  }, [messages]);
  
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    handleSubmit(e);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat with AI</h1>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 rounded-lg bg-slate-50 dark:bg-slate-900 p-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">
            Ask me anything and I'll try to help
          </div>
        ) : (
          messages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                }`}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
                <div className={`text-xs mt-1 text-right ${message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {messageTimestamps.get(message.id)}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-muted">
              <ChatLoading />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 p-3 rounded-md border focus:outline-none focus:ring-2 focus:ring-primary"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          aria-label="Send message"
        >
          <Send className="size-4" />
          <span className="sr-only">Send</span>
        </Button>
      </form>
    </div>
  );
}