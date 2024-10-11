'use client';

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './LoginForm.module.scss';
import { useAuth } from '@/app/authContext/page';
import { LoginFormValues } from '@/models/LoginFormValues';
import Link from 'next/link';


const LoginForm: React.FC = () => {
    const router = useRouter();
    const { login } = useAuth();

    const onFinish = async (values: LoginFormValues) => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/users/token/', values);
            const { access, refresh } = response.data;

            localStorage.setItem('token', access);
            localStorage.setItem('refreshToken', refresh);
            localStorage.setItem('username', values.username);
            message.success('Đăng nhập thành công!');
            login(values.username);
            router.push('/');
        } catch {
            message.error('Đăng nhập thất bại!');
        }
    };

    return (
        <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            className={styles.loginForm}
        >
            <h2>Đăng nhập</h2>
            <p>Bạn chưa có tài khoản? Tạo <Link href={'/register'}>tài khoản</Link></p>
            <Form.Item
                name="username"
                label="Tên người dùng"
                rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Nhập tên người dùng" />
            </Form.Item>

            <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.submitButton}>
                    Đăng nhập
                </Button>
            </Form.Item>
        </Form>
    );
};

export default LoginForm;
