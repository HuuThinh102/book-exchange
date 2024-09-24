'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookItem from '@/components/BookItem/BookItem';
import { Pagination, Spin } from 'antd';
import { Book } from '@/models/Book';
import styles from '@/styles/home.module.scss';

const BookList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const booksPerPage = 15;

    const fetchAllBooks = async () => {
        let allBooks: Book[] = [];
        let url = 'http://127.0.0.1:8000/books/';
        try {
            while (url) {
                const response = await axios.get(url);
                const data = response.data;
                allBooks = [...allBooks, ...data.results];
                url = data.next;
            }
            setBooks(allBooks);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching books:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllBooks();
    }, []);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

    return (
        <>
            {loading ? (
                <Spin size="large" />
            ) : (
                <>
                    <div className={styles.booklist}>
                        {currentBooks.map((book) => (
                            <BookItem
                                key={book.id}
                                id={book.id}
                                title={book.title}
                                image={book.image}
                            />
                        ))}
                    </div>
                    <div className={styles.paginationWrapper}>
                        <Pagination
                            current={currentPage}
                            pageSize={booksPerPage}
                            total={books.length}
                            onChange={handlePageChange}
                        />
                    </div>
                </>
            )}
        </>
    );
};

export default BookList;
