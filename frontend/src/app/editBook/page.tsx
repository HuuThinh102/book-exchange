'use client';
import { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { UploadFile } from 'antd/es/upload/interface';
import { UploadChangeParam } from 'antd/lib/upload';
import axios from 'axios';
import Image from 'next/image';
import styles from '../bookUpload/BookUpload.module.scss';
import { useBookContext } from '../bookContext/page';

const EditBookForm: React.FC = () => {
    const [form] = Form.useForm();
    const router = useRouter();
    const { bookId } = useBookContext();
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (bookId) {
            const fetchBook = async () => {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/books/${bookId}`);
                    const bookData = response.data;
                    console.log('Fetched book data:', bookData);
                    form.setFieldsValue({
                        title: bookData.title,
                        authors: bookData.authors,
                        publisher: bookData.publisher,
                        category: bookData.category,
                        status: bookData.status,
                    });
                    setImageUrl(bookData.image);
                } catch (error) {
                    message.error('Lỗi khi tải dữ liệu sách: ' + error);
                }
            };

            fetchBook();
        }
    }, [bookId, form]);

    const handleImageUpload = (info: UploadChangeParam<UploadFile<File>>) => {
        const selectedFile = info.fileList[0]?.originFileObj;

        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = () => setImageUrl(reader.result as string);
            reader.readAsDataURL(selectedFile);
            setFile(selectedFile);
        }
    };

    const onFinish = async (values: { title: string; authors: string; publisher: string; category: string; status: string }) => {
        if (!file && !imageUrl) {
            message.error('Vui lòng upload ảnh giáo trình.');
            return;
        }
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('authors', values.authors);
        formData.append('publisher', values.publisher);
        formData.append('category', values.category);
        formData.append('status', values.status);
        if (file) {
            formData.append('image', file);
        }

        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://127.0.0.1:8000/books/${bookId}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}`, },
            });
            message.success('Cập nhật sách thành công!');
            router.push('/myBook');
        } catch (error) {
            message.error('Cập nhật sách thất bại: ' + error);
        }
    };

    return (
        <Form form={form} layout="vertical" onFinish={onFinish}>
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
                        </Select>
                    </Form.Item>

                    <Form.Item label="Tình trạng sách" name="status" rules={[{ required: true, message: 'Vui lòng nhập tình trạng sách' }]}>
                        <Input placeholder="VD: 90%" />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Cập nhật</Button>
                    </Form.Item>
                </div>
            </div>
        </Form>
    );
};

export default EditBookForm;
