'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, Avatar } from 'antd';
import { useChatContext } from '@/app/chatContext/page';

interface ChatRoom {
    id: number;
    participants: { id: number; username: string }[];
}

const ChatList: React.FC = () => {
    const { setChatId } = useChatContext();
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

    useEffect(() => {
        const fetchChatRooms = async () => {
            const response = await axios.get('http://127.0.0.1:8000/chat/rooms/');
            setChatRooms(response.data);
        };
        fetchChatRooms();
    }, []);

    return (
        <List
            itemLayout="horizontal"
            dataSource={chatRooms}
            renderItem={chatRoom => (
                <List.Item onClick={() => setChatId(chatRoom.id)}>
                    <List.Item.Meta
                        avatar={<Avatar icon="user" />}
                        title={chatRoom.participants.map(p => p.username).join(', ')}
                    />
                </List.Item>
            )}
        />
    );
};

export default ChatList;
