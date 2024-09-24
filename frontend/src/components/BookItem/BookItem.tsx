import React from 'react';
import { Card } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import styles from './BookItem.module.scss';
import { Book } from '@/models/Book';

const { Meta } = Card;

const BookItem: React.FC<Book> = ({ id, title, image }) => {
    return (
        <Card
            hoverable
            className={styles.bookCard}
            cover={
                <Link href={`/books/${id}`} passHref>
                    <Image alt={title} src={image || '/bia.jpg'} width={200} height={200} className={styles.bookCover} />
                </Link>
            }
        >
            <Meta title={title} />
        </Card>
    );
};

export default BookItem;
