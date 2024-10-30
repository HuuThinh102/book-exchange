'use client';
import React, { useState } from 'react';
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { UploadOutlined, RobotOutlined } from '@ant-design/icons';
import { UploadFile } from 'antd/es/upload/interface';
import { UploadChangeParam } from 'antd/lib/upload';
import axios from 'axios';
import Image from 'next/image';
import styles from './BookUpload.module.scss';


const BookUploadForm: React.FC = () => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [form] = Form.useForm();

    const handleImageUpload = async (info: UploadChangeParam<UploadFile<File>>) => {
        const selectedFile = info.fileList[0].originFileObj;

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => setImageUrl(reader.result as string);
            reader.readAsDataURL(selectedFile);
            setFile(selectedFile);
        }
    };

    const handleClick = async () => {
        try {
            const response = await axios.get(
                "https://b059-34-124-180-206.ngrok-free.app/",
                {
                    headers: {
                        "ngrok-skip-browser-warning": "69420",
                    }
                }
            );

            let { title, authors, publisher, category }: { title: string, authors: string, publisher: string, category: string } = response.data;


            // Loại bỏ cụm "Tác giả sách là" nếu có trong authors
            if (authors.startsWith("Tác giả sách là")) {
                authors = authors.replace("Tác giả sách là ", "");
            }

            // Xử lý category từ file JSON để khớp với các giá trị có sẵn
            if (category.includes('Danh mục của cuốn sách này là')) {
                category = category.replace('Danh mục của cuốn sách này là "', '').replace('"', '');

                // Mapping từ tên đầy đủ trong JSON về các giá trị của Select.Option
                const categoryMapping: { [key: string]: string } = {
                    'Trường Công nghệ thông tin và Truyền thông': 'Trường CNTT&TT',
                    'Trường Nông nghiệp': 'Trường Nông nghiệp',
                    'Trường Kinh tế': 'Trường Kinh tế',
                    'Trường Bách khoa': 'Trường Bách khoa',
                    'Trường Thuỷ sản': 'Trường Thuỷ sản',
                    'Sách khác': 'Sách khác'
                };

                // Ánh xạ giá trị category từ file JSON sang giá trị của Select.Option
                category = categoryMapping[category];
            }
            // console.log(response.data);
            form.setFieldsValue({
                title,
                authors: Array.isArray(authors) ? authors.join(', ') : authors,
                publisher,
                category,
            });

            message.success('Thông tin sách đã được tự động điền!');
        } catch (error) {
            message.error('Không thể lấy thông tin sách.' + error);
            console.log(error);
        }
    };

    const onFinish = async (values: { title: string; authors: string; publisher: string; category: string }) => {
        if (!file) {
            message.error('Vui lòng upload ảnh giáo trình.');
            return;
        }
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('authors', values.authors);
        formData.append('publisher', values.publisher);
        formData.append('category', values.category);
        formData.append('image', file);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://127.0.0.1:8000/books/', formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}`, },
            });
            message.success('Đăng sách thành công! Hãy đợi Admin duyệt sách');
            form.resetFields();
            setImageUrl(null);

        } catch (e) {
            message.error('Đăng sách thất bại.' + e);
        }
    };

    return (
        <Form layout="vertical" onFinish={onFinish} form={form}>
            <div className={styles.container}>
                <div className={styles.leftSide}>
                    <Form.Item label="Hình ảnh sách" valuePropName="fileList">
                        <Upload
                            listType="picture"
                            maxCount={1}
                            accept="image/*"
                            showUploadList={false}
                            beforeUpload={() => false}
                            onChange={handleImageUpload}
                        >
                            <Button icon={<UploadOutlined />}>Nhấn để tải lên</Button>
                        </Upload>
                        {imageUrl && (
                            <div className={styles.previewImage}>
                                <Image src={imageUrl} alt="Bìa sách" width={400} height={450} />
                            </div>
                        )}
                    </Form.Item>
                </div>

                <div className={styles.rightSide}>
                    <Button type="primary" onClick={handleClick}><RobotOutlined />Điền thông tin tự động</Button>
                    <Form.Item label="Tên giáo trình" name="title" rules={[{ required: true, message: 'Vui lòng điền tên sách' }]}>
                        <Input placeholder="VD: Nguyên lý máy học" />
                    </Form.Item>

                    <Form.Item label="Tác giả" name="authors" rules={[{ required: true, message: 'Vui lòng điền tên tác giả' }]}>
                        <Input placeholder="VD: Phạm Thế Phi" />
                    </Form.Item>

                    <Form.Item label="Nhà xuất bản" name="publisher" rules={[{ required: true, message: 'Vui lòng điền nhà xuất bản' }]}>
                        <Input placeholder="VD: Nhà xuất bản Đại học Cần Thơ" />
                    </Form.Item>

                    <Form.Item label="Danh mục" name="category" rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}>
                        <Select placeholder="Vui lòng chọn danh mục">
                            <Select.Option value="Trường CNTT&TT">Trường CNTT&TT</Select.Option>
                            <Select.Option value="Trường Nông nghiệp">Trường Nông nghiệp</Select.Option>
                            <Select.Option value="Trường Kinh tế">Trường Kinh tế</Select.Option>
                            <Select.Option value="Trường Bách khoa">Trường Bách khoa</Select.Option>
                            <Select.Option value="Trường Thuỷ sản">Trường Thuỷ sản</Select.Option>
                            <Select.Option value="Sách khác">Sách khác</Select.Option>
                        </Select>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Đăng</Button>
                    </Form.Item>
                </div>
            </div>
        </Form>
    );
};

export default BookUploadForm;
