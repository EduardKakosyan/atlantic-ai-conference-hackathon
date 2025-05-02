'use client';

import { Card } from "@/components/ui/card"
import { type CoreMessage } from 'ai';
import { useState } from 'react';
import { dualResponseConversation } from '@/app/actions';
import { readStreamableValue } from 'ai/rsc';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IconArrowUp } from "@/components/ui/icons";
import AboutCard from "@/components/cards/aboutcard";

export const maxDuration = 60;

export default function Chat() {
  const [messages, setMessages] = useState<CoreMessage[]>([]);
  const [response1Messages, setResponse1Messages] = useState<CoreMessage[]>([]);
  const [response2Messages, setResponse2Messages] = useState<CoreMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    setIsLoading(true);
    const userMessage = { content: input, role: 'user' as const };
    
    const newMessages: CoreMessage[] = [
      ...messages,
      userMessage,
    ];
    setMessages(newMessages);
    
    // Add user message to both response arrays
    const newResponse1Messages = [...response1Messages, userMessage];
    const newResponse2Messages = [...response2Messages, userMessage];
    
    setResponse1Messages(newResponse1Messages);
    setResponse2Messages(newResponse2Messages);
    
    setInput('');
    
    try {
      const result = await dualResponseConversation(newMessages);
      
      // Create placeholder for assistant responses
      setResponse1Messages([...newResponse1Messages, { role: 'assistant', content: '' }]);
      setResponse2Messages([...newResponse2Messages, { role: 'assistant', content: '' }]);
      
      // Handle first response stream
      const processStream1 = async () => {
        let accumulatedContent1 = '';
        for await (const chunk of readStreamableValue(result.response1)) {
          accumulatedContent1 = chunk as string;
          setResponse1Messages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { 
              role: 'assistant', 
              content: accumulatedContent1 
            };
            return newMessages;
          });
        }
      };
      
      // Handle second response stream
      const processStream2 = async () => {
        let accumulatedContent2 = '';
        for await (const chunk of readStreamableValue(result.response2)) {
          accumulatedContent2 = chunk as string;
          setResponse2Messages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { 
              role: 'assistant', 
              content: accumulatedContent2 
            };
            return newMessages;
          });
        }
      };
      
      // Process both streams simultaneously
      await Promise.all([processStream1(), processStream2()]);
    } catch (error) {
      console.error('Error processing chat:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  return (    
    <div className="group w-full overflow-auto">
      {messages.length <= 0 ? ( 
        <AboutCard />  
      ) 
      : (
        <div className="flex flex-col md:flex-row gap-4 mt-10 mb-24 mx-auto max-w-7xl px-4 h-[calc(100vh-180px)]">
          {/* First Response Area */}
          <div className="flex-1 border rounded-lg p-4 overflow-y-auto h-full">
            <h2 className="text-lg font-medium mb-4">Before</h2>
            <div className="space-y-4">
              {response1Messages.map((message, index) => (
                <div key={index} className="whitespace-pre-wrap flex">
                  <div className={`${message.role === 'user' ? 'bg-sky-100 ml-auto' : 'bg-transparent'} p-2 rounded-lg w-full ${message.role === 'user' ? 'text-right' : ''}`}>
                    {message.content as string}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Second Response Area */}
          <div className="flex-1 border rounded-lg p-4 overflow-y-auto h-full">
            <h2 className="text-lg font-medium mb-4">After being exposed to fake news</h2>
            <div className="space-y-4">
              {response2Messages.map((message, index) => (
                <div key={index} className="whitespace-pre-wrap flex">
                  <div className={`${message.role === 'user' ? 'bg-sky-100 ml-auto' : 'bg-transparent'} p-2 rounded-lg w-full ${message.role === 'user' ? 'text-right' : ''}`}>
                    {message.content as string}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <div className="fixed inset-x-0 bottom-10 w-full">
        <div className="w-full max-w-xl mx-auto">
          <Card className="p-2">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="flex">
                <Input
                  type="text"
                  value={input}
                  onChange={event => {
                    setInput(event.target.value);
                  }}
                  autoComplete="off"
                  className="w-[95%] mr-2 border-0 ring-offset-0 focus-visible:ring-0 focus-visible:outline-none focus:outline-none focus:ring-0 ring-0 focus-visible:border-none border-transparent focus:border-transparent focus-visible:ring-none"
                  placeholder='Ask me anything...'
                />
                <Button disabled={!input.trim() || isLoading}>
                  <IconArrowUp />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}