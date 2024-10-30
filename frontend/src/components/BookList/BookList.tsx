'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BookItem from '@/components/BookItem/BookItem';
import { Spin, Carousel } from 'antd';
import { Book } from '@/models/Book';
import SearchBar from '@/components/SearchBar/SearchBar';
import styles from './bookList.module.scss';

const BookList: React.FC = () => {
    const [newBooks, setNewBooks] = useState<Book[]>([]);
    const [searchBooks, setSearchBooks] = useState<Book[]>([]);
    const [itBooks, setItBooks] = useState<Book[]>([]);
    const [argiBooks, setArgiBooks] = useState<Book[]>([]);
    const [economicsBooks, setEconomicsBooks] = useState<Book[]>([]);
    const [polyBooks, setPolyBooks] = useState<Book[]>([]);
    const [fisheriesBooks, setFisheriesBooks] = useState<Book[]>([]);
    const [anotherBooks, setAnotherBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const booksPerSlide = 5;
    const maxBooksPerCategory = 10;

    // Tùy chỉnh nút mũi tên
    const CustomPrevArrow = (props: React.ComponentProps<'div'>) => (
        <div {...props} style={{ color: 'gray', left: '-1rem', zIndex: 1 }}>
            <span className="slick-prev" />
        </div>
    );

    const CustomNextArrow = (props: React.ComponentProps<'div'>) => (
        <div {...props} style={{ color: 'gray', right: '-1rem', zIndex: 1 }}>
            <span className="slick-next" />
        </div>
    );

    // API endpoint URLs
    const NEW_BOOKS_API = 'http://127.0.0.1:8000/books/';
    const IT_BOOKS_API = 'http://127.0.0.1:8000/books/by_category/?category_id=1';
    const ARGI_BOOKS_API = 'http://127.0.0.1:8000/books/by_category/?category_id=2';
    const ECONOMICS_BOOKS_API = 'http://127.0.0.1:8000/books/by_category/?category_id=3';
    const POLYTECHNIC_BOOKS_API = 'http://127.0.0.1:8000/books/by_category/?category_id=4';
    const FISHERIES_BOOKS_API = 'http://127.0.0.1:8000/books/by_category/?category_id=5';
    const ANOTHER_BOOKS_API = 'http://127.0.0.1:8000/books/by_category/?category_id=6';

    // Hàm fetch dữ liệu cho tất cả các danh mục
    const fetchAllBooks = async () => {
        setLoading(true);
        try {
            const [newBooksResponse, itBooksResponse, argiBooksRespones, economicsBooksResponse, polyBooksResponse, fisheriesBooksResponse, anotherBooksResponse] = await Promise.all([
                axios.get(NEW_BOOKS_API),
                axios.get(IT_BOOKS_API),
                axios.get(ARGI_BOOKS_API),
                axios.get(ECONOMICS_BOOKS_API),
                axios.get(POLYTECHNIC_BOOKS_API),
                axios.get(FISHERIES_BOOKS_API),
                axios.get(ANOTHER_BOOKS_API),
            ]);

            setNewBooks(newBooksResponse.data.slice(0, maxBooksPerCategory));
            setItBooks(itBooksResponse.data.slice(0, maxBooksPerCategory));
            setArgiBooks(argiBooksRespones.data.slice(0, maxBooksPerCategory));
            setEconomicsBooks(economicsBooksResponse.data.slice(0, maxBooksPerCategory));
            setPolyBooks(polyBooksResponse.data.slice(0, maxBooksPerCategory));
            setFisheriesBooks(fisheriesBooksResponse.data.slice(0, maxBooksPerCategory));
            setAnotherBooks(anotherBooksResponse.data.slice(0, maxBooksPerCategory));
        } catch (error) {
            console.error('Error fetching books:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm gọi API khi component mount hoặc khi searchTerm thay đổi
    useEffect(() => {
        if (searchTerm) {
            fetchBooksBySearch(searchTerm);
        } else {
            fetchAllBooks();
        }
    }, [searchTerm]);

    // Hàm fetch sách theo tìm kiếm
    const fetchBooksBySearch = async (search: string) => {
        setLoading(true);
        try {
            const searchUrl = `http://127.0.0.1:8000/books/search/?q=${encodeURIComponent(search)}`;
            const response = await axios.get(searchUrl);
            // Giả sử kết quả tìm kiếm không phân loại theo danh mục, bạn có thể tùy chỉnh theo nhu cầu
            setSearchBooks(response.data.slice(0, maxBooksPerCategory));
            setNewBooks([]);
            setItBooks([]);
            setArgiBooks([]);
            setEconomicsBooks([]);
            setPolyBooks([]);
            setFisheriesBooks([]);
            setAnotherBooks([]);

        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
        }
    };

    // Hàm chia sách thành các slide
    const renderCarouselItems = (bookList: Book[]) => {
        const items = [];
        for (let i = 0; i < bookList.length; i += booksPerSlide) {
            const slideBooks = bookList.slice(i, i + booksPerSlide);
            items.push(
                <div key={i} className={styles.carouselGroup}>
                    {slideBooks.map((book) => (
                        <div key={book.id} className={styles.carouselItem}>
                            <BookItem
                                id={book.id}
                                title={book.title}
                                image={book.image}
                            />
                        </div>
                    ))}
                </div>
            );
        }
        return items;
    };

    return (
        <>
            <div className={styles.searchBarWrapper}>
                <SearchBar onSearch={setSearchTerm} />
            </div>

            {loading ? (
                <div className={styles.spinWrapper}>
                    <Spin size="large" />
                </div>
            ) : (
                <div className={styles.bookCategories}>
                    {searchTerm && searchBooks.length > 0 && (
                        <div className={styles.category}>
                            <h2>Kết quả tìm kiếm: </h2>
                            <Carousel
                                arrows
                                infinite={false}
                                dots={false}
                                prevArrow={<CustomPrevArrow />}
                                nextArrow={<CustomNextArrow />}
                                slidesToShow={1}
                                slidesToScroll={1}
                            >
                                {renderCarouselItems(searchBooks)}
                            </Carousel>
                        </div>
                    )}

                    {newBooks.length > 0 && (
                        <div className={styles.category}>
                            <h2>Sách mới đăng gần đây</h2>
                            <Carousel
                                arrows
                                infinite={false}
                                dots={false}
                                prevArrow={<CustomPrevArrow />}
                                nextArrow={<CustomNextArrow />}
                                slidesToShow={1}
                                slidesToScroll={1}
                            >
                                {renderCarouselItems(newBooks)}
                            </Carousel>
                        </div>
                    )}

                    {itBooks.length > 0 && (
                        <div className={styles.category}>
                            <h2>Giáo trình Trường CNTT&TT</h2>
                            <Carousel
                                arrows
                                infinite={false}
                                dots={false}
                                prevArrow={<CustomPrevArrow />}
                                nextArrow={<CustomNextArrow />}
                                slidesToShow={1}
                                slidesToScroll={1}
                            >
                                {renderCarouselItems(itBooks)}
                            </Carousel>
                        </div>
                    )}

                    {argiBooks.length > 0 && (
                        <div className={styles.category}>
                            <h2>Giáo trình Trường Nông nghiệp</h2>
                            <Carousel
                                arrows
                                infinite={false}
                                dots={false}
                                prevArrow={<CustomPrevArrow />}
                                nextArrow={<CustomNextArrow />}
                                slidesToShow={1}
                                slidesToScroll={1}
                            >
                                {renderCarouselItems(argiBooks)}
                            </Carousel>
                        </div>
                    )}

                    {economicsBooks.length > 0 && (
                        <div className={styles.category}>
                            <h2>Giáo trình Trường Kinh tế</h2>
                            <Carousel
                                arrows
                                infinite={false}
                                dots={false}
                                prevArrow={<CustomPrevArrow />}
                                nextArrow={<CustomNextArrow />}
                                slidesToShow={1}
                                slidesToScroll={1}
                            >
                                {renderCarouselItems(economicsBooks)}
                            </Carousel>
                        </div>
                    )}

                    {polyBooks.length > 0 && (
                        <div className={styles.category}>
                            <h2>Giáo trình Trường Bách khoa</h2>
                            <Carousel
                                arrows
                                infinite={false}
                                dots={false}
                                prevArrow={<CustomPrevArrow />}
                                nextArrow={<CustomNextArrow />}
                                slidesToShow={1}
                                slidesToScroll={1}
                            >
                                {renderCarouselItems(polyBooks)}
                            </Carousel>
                        </div>
                    )}

                    {fisheriesBooks.length > 0 && (
                        <div className={styles.category}>
                            <h2>Giáo trình Trường Thuỷ sản</h2>
                            <Carousel
                                arrows
                                infinite={false}
                                dots={false}
                                prevArrow={<CustomPrevArrow />}
                                nextArrow={<CustomNextArrow />}
                                slidesToShow={1}
                                slidesToScroll={1}
                            >
                                {renderCarouselItems(fisheriesBooks)}
                            </Carousel>
                        </div>
                    )}

                    {anotherBooks.length > 0 && (
                        <div className={styles.category}>
                            <h2>Sách khác</h2>
                            <Carousel
                                arrows
                                infinite={false}
                                dots={false}
                                prevArrow={<CustomPrevArrow />}
                                nextArrow={<CustomNextArrow />}
                                slidesToShow={1}
                                slidesToScroll={1}
                            >
                                {renderCarouselItems(anotherBooks)}
                            </Carousel>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default BookList;
