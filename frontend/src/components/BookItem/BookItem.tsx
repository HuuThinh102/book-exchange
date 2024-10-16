import React from 'react';
import { Card } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import styles from './bookitem.module.scss';
import { Book } from '@/models/Book';
import { useBookContext } from '@/app/bookContext/page';

const { Meta } = Card;

const BookItem: React.FC<Book> = ({ id, title, image }) => {
    const { setBookId } = useBookContext();

    const handleBookClick = () => {
        setBookId(Number(id));
        localStorage.setItem('bookId', id);
    };

    return (
        <Card
            hoverable
            className={styles.bookCard}
            cover={
                <Link href={`/bookDetail/`} passHref onClick={handleBookClick}>
                    <Image alt={title} src={image || '/bia.jpg'} width={0} height={0} sizes="100vw" priority={true} className={styles.bookCover} />
                </Link>
            }
        >
            <Meta title={title} />
        </Card>
    );
};

export default BookItem;
