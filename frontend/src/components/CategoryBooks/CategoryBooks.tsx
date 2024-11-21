'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookItem from '../BookItem/BookItem';
import styles from './categorybooks.module.scss';
import { Book } from '@/models/Book';
import Loading from '@/components/Loading/page'


interface CategoryBooksProps {
    categoryId: number;
    categoryName: string;
}

const CategoryBooks: React.FC<CategoryBooksProps> = ({ categoryId, categoryName }) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchBooksByCategory = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://127.0.0.1:8000/books/by_category/?category_id=${categoryId}`);
                setBooks(response.data);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooksByCategory();
    }, [categoryId]);

    return (
        <div className={styles.categoryBooksContainer}>
            <h2>{categoryName}</h2>
            {loading ? (
                <Loading />
            ) : books.length > 0 ? (
                <div className={styles.bookList}>
                    {books.map((book) => (
                        <BookItem key={book.id} id={book.id} title={book.title} image={book.image} />
                    ))}
                </div>
            ) : (
                <p style={{ textAlign: 'center' }}>Không có sách nào trong danh mục này.</p>
            )}
        </div>
    );
};

export default CategoryBooks;
