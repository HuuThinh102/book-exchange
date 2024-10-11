'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Input, Button } from 'antd';
import { useChatContext } from '@/app/chatContext/page';

interface Message {
    id: number;
    sender: string;
    content: string;
    timestamp: string;
}

const ChatWindow: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const { chatId } = useChatContext();

    useEffect(() => {
        const fetchMessages = async () => {
            if (chatId) {
                const response = await axios.get(`http://127.0.0.1:8000/chat/messages/received/${chatId}/`);
                setMessages(response.data);
            }
        };
        fetchMessages();
    }, [chatId]);

    const sendMessage = async () => {
        if (!newMessage.trim()) return;
        await axios.post('http://127.0.0.1:8000/chat/messages/', {
            chatroom_id: chatId,
            message: newMessage,
        });
        setNewMessage('');
    };

    return (
        <div>
            <List
                dataSource={messages}
                renderItem={item => (
                    <List.Item
                        style={{
                            textAlign: item.sender === 'me' ? 'right' : 'left',
                        }}
                    >
                        <List.Item.Meta
                            title={item.sender}
                            description={item.content}
                        />
                    </List.Item>
                )}
            />
            <Input.TextArea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={3}
            />
            <Button onClick={sendMessage} type="primary">Gửi</Button>
        </div>
    );
};

export default ChatWindow;
