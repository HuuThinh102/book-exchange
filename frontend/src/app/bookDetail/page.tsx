'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, message } from 'antd';
import Image from 'next/image';
import axios from 'axios';
import styles from './BookDetail.module.scss';
import { useBookContext } from '../bookContext/page';
import { Book } from '@/models/Book'

const BookDetail: React.FC = () => {
    const [book, setBook] = useState<Book | null>(null);
    const { bookId, setBookId } = useBookContext();
    const router = useRouter();

    useEffect(() => {
        const storedBookId = localStorage.getItem('bookId');
        if (!bookId && storedBookId) {
            setBookId(Number(storedBookId));
        }
        const fetchBookDetail = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/books/${bookId}/`);
                const bookData = response.data;
                setBook(bookData);
            } catch (error) {
                message.error('Lỗi khi tải chi tiết sách: ' + error);
            }
        };

        if (bookId && storedBookId) {
            fetchBookDetail();
        }
    }, [bookId, setBookId]);

    const handleChat = async () => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/chat/`, { recipient: book?.owner });
            const chatId = response.data.id;
            router.push(`/chat/${chatId}`);
        } catch (error) {
            message.error('Lỗi khi mở phòng chat: ' + error);
        }
    };

    if (!book) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className={styles.bookDetailContainer}>
            <div className={styles.bookImage}>
                <Image alt={book.title} src={book.image || '/bia.jpg'} width={350} height={450} />
            </div>

            <div className={styles.bookInfo}>
                <h2>{book.title}</h2>
                <p>Tác giả: <strong>{book.authors}</strong></p>
                <p>Nhà xuất bản: <strong>{book.publisher}</strong></p>
                <p>Người đăng: <strong>{book.owner}</strong></p>

                <Button type="primary" onClick={handleChat}>
                    💬 Chat với<strong>{book.owner}</strong>
                </Button>
            </div>
        </div>
    );
};

export default BookDetail;
