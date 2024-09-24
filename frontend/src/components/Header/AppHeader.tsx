'use client';

import { Layout, Input, Button, Dropdown, Space, Menu } from 'antd';
import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import Link from 'next/link';
import styles from '@/components/Header/header.module.scss';
import Image from 'next/image';
import { useAuth } from '@/app/authContext/page';
import { menuItems, userMenu } from '@/models/MenuItem';

const { Header } = Layout;
const { Search } = Input;

const AppHeader: React.FC = () => {
    const { isLoggedIn, username, login } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUsername = localStorage.getItem('username');
        if (token && savedUsername) {
            login(savedUsername);
        }
    }, [login]);

    return (
        <Header className={styles.header}>
            <div className={styles.logo}>
                <Link href="/"><Image alt='logo' src='/logo.png' width={350} height={350} className={styles.logoimage} /></Link>
            </div>
            <Menu
                mode="horizontal"
                defaultSelectedKeys={['home']}
                triggerSubMenuAction={'click'}
                items={menuItems}
                className={styles.menu}
            />

            <Search
                placeholder="Tìm kiếm sách"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                className={styles.search}
            />

            {isLoggedIn ? (
                <Dropdown menu={userMenu} trigger={['click']}>
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            <UserOutlined />
                            {username}
                        </Space>
                    </a>
                </Dropdown>
            ) : (
                <>
                    <Button type="default" className={styles.button}>
                        <Link href="/login">Đăng nhập</Link>
                    </Button>
                    <Button type="primary">
                        <Link href="/register">Đăng ký</Link>
                    </Button>
                </>
            )}
        </Header>
    );
};

export default AppHeader;
