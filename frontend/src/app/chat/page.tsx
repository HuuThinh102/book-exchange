'use client';
import React from 'react';
import ChatList from '@/components/Chat/ChatList/ChatList';
import ChatWindow from '@/components/Chat/ChatWindow/ChatWindow';
import { Layout } from 'antd';
import { ChatProvider } from '@/app/chatContext/page';

const { Sider, Content } = Layout;

const ChatPage: React.FC = () => {
    return (
        <ChatProvider>
            <Layout>
                <Sider width={300} className="chat-list-sider">
                    <ChatList />
                </Sider>
                <Layout>
                    <Content>
                        <ChatWindow />
                    </Content>
                </Layout>
            </Layout>
        </ChatProvider>
    );
};

export default ChatPage;
