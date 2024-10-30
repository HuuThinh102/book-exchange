'use client';
import { useState, useEffect, useRef, FormEvent } from 'react';

interface MessageData {
    message: string;
}

export default function Chat() {
    const [messages, setMessages] = useState<string[]>([]);
    const [message, setMessage] = useState<string>('');
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        const socketUrl = `ws://localhost:8000/ws/chat/thinh/`;
        ws.current = new WebSocket(socketUrl);

        ws.current.onmessage = (event: MessageEvent) => {
            const data: MessageData = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };

        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, []);

    const sendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (ws.current && message.trim()) {
            ws.current.send(JSON.stringify({ message }));
            setMessage('');
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-messages">
                {messages.map((msg, idx) => (
                    <div key={idx} className="message">
                        {msg}
                    </div>
                ))}
            </div>
            <form onSubmit={sendMessage}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Nhập nội dung tin nhắn"
                />
                <button type="submit">Gửi</button>
            </form>
        </div>
    );
}
