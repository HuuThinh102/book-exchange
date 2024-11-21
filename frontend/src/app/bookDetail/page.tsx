'use client';

import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import Image from 'next/image';
import axios from 'axios';
import styles from './BookDetail.module.scss';
import { useBookContext } from '../bookContext/page';
import { Book } from '@/models/Book'
import { Spin } from "antd";

const BookDetail: React.FC = () => {
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { bookId, setBookId } = useBookContext();

    useEffect(() => {
        const storedBookId = localStorage.getItem('bookId');
        if (!bookId && storedBookId) {
            setBookId(Number(storedBookId));
        }
        const fetchBookDetail = async () => {
            setLoading(true);
            if (bookId) {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/books/${bookId}/`);
                    const bookData = response.data;
                    setBook(bookData);
                } catch (error) {
                    message.error('Lỗi khi tải chi tiết sách: ' + error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchBookDetail();
    }, [bookId, setBookId]);

    if (!book) {
        return <div>Không tìm thấy sách.</div>;
    }

    return (
        <div className={styles.bookDetailContainer}>
            <div className={styles.bookImage}>
                {loading ? (<div className={styles.spinWrapper}>
                    <Spin size="large" />
                </div>) :
                    (<Image alt={book.title} src={book.image || '/bia.jpg'} width={300} height={400} priority />)
                }
            </div>

            <div className={styles.bookInfo}>
                <h2>{book.title}</h2>
                <p>Tác giả: <strong>{book.authors}</strong></p>
                <p>Nhà xuất bản: <strong>{book.publisher}</strong></p>
                <p>Người đăng: <strong>{book.owner}</strong></p>
                <p>Liên hệ với chủ sách: <strong>{book.owner_phone_number}</strong></p>
            </div>
        </div>
    );
};

export default BookDetail;
