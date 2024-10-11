'use client';

import { createContext, useContext, useState } from 'react';

interface ChatContextProps {
    userId: number;
    chatId: number | null;
    setChatId: (id: number) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [chatId, setChatId] = useState<number | null>(null);
    const userId = 1; // Mock userId, replace with actual logic to get user ID

    return (
        <ChatContext.Provider value={{ userId, chatId, setChatId }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};
