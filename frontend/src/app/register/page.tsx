'use client';

import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { LockOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import styles from './RegisterForm.module.scss';

interface RegisterFormValues {
    username: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

const RegisterForm: React.FC = () => {
    const [form] = Form.useForm();
    const router = useRouter();

    const validatePassword = (value: string) => {
        if (!value || form.getFieldValue('password') === value) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
    };

    const onFinish = async (values: RegisterFormValues) => {
        try {
            const { username, phone, password } = values;
            await axios.post('http://127.0.0.1:8000/users/register/', {
                username,
                phone_number: phone,
                password,
            });
            message.success('Đăng ký thành công! Hãy vào trang đăng nhập');
            router.push('/');
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Đăng ký không thành công!';
            message.error(errorMessage);
        }
    };

    return (
        <Form
            form={form}
            name="register"
            onFinish={onFinish}
            layout="vertical"
            className={styles.registerForm}
            initialValues={{ remember: true }}
        >
            <h2>Đăng ký</h2>
            <Form.Item
                name="username"
                label="Tên người dùng"
                rules={[{ required: true, message: 'Vui lòng nhập tên người dùng!' }]}
            >
                <Input prefix={<UserOutlined />} placeholder="Nhập tên người dùng" />
            </Form.Item>

            <Form.Item
                name="phone"
                label="Số điện thoại"
                rules={[
                    { required: true, message: 'Vui lòng nhập số điện thoại!' },
                    { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' },
                ]}
            >
                <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                hasFeedback
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item
                name="confirmPassword"
                label="Nhập lại mật khẩu"
                dependencies={['password']}
                rules={[
                    { required: true, message: 'Vui lòng nhập lại mật khẩu!' },
                    { validator: (_, value) => validatePassword(value) },
                ]}
                hasFeedback
            >
                <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" className={styles.submitButton}>
                    Đăng ký
                </Button>
            </Form.Item>
        </Form>
    );
};

export default RegisterForm;
