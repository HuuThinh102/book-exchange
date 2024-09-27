'use client';

import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import styles from './MyBooks.module.scss';
import { Book } from '@/models/Book'
import Link from 'next/link';
import { useBookContext } from '@/app/bookContext/page';

const MyBooks: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const { setBookId } = useBookContext();


    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://127.0.0.1:8000/users/my-books/', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setBooks(response.data);
        } catch (error) {
            message.error('Không thể tải danh sách sách.' + error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/books/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            message.success('Xóa sách thành công.');
            fetchBooks();
        } catch (error) {
            message.error('Xóa sách thất bại.' + error);
        }
    };

    const handleEdit = (id: number) => {
        setBookId(id);
    };

    const columns: ColumnsType<Book> = [
        {
            title: 'STT',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Tên sách',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'is_approved',
            key: 'is_approved',
            render: (is_approved) =>
                is_approved ? 'Đã được duyệt ✅' : 'Chưa được duyệt ❌',
        },
        {
            title: 'Tuỳ chỉnh',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <Link href={`/editBook/`}>
                        <Button type="link" onClick={() => handleEdit(Number(record.id))}>Chỉnh sửa ✎</Button>
                    </Link>
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa không?"
                        onConfirm={() => handleDelete(Number(record.id))}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type="link" danger>
                            Xoá 🗑️
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.myBooksContainer}>
            <h2 className={styles.title}>Sách của tôi</h2>
            <Table
                columns={columns}
                dataSource={books}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default MyBooks;
