import { MenuProps, Dropdown } from 'antd';
import Link from 'next/link';
import { Space } from 'antd';
import { CaretDownOutlined, } from '@ant-design/icons';


const handleUploadClick = (e: React.MouseEvent) => {
    const token = localStorage.getItem('token');
    if (!token) {
        e.preventDefault();
        window.location.href = '/login';
    }
};

export const categoryItems: MenuProps['items'] = [
    {
        label: <Link href="/cntt-tt">Trường CNTT&TT</Link>,
        key: '1',
    },
    {
        label: <Link href="/kinh-te">Trường Kinh Tế</Link>,
        key: '2',
    },
    {
        label: <Link href="/nong-nghiep">Trường Nông nghiệp</Link>,
        key: '3',
    },
    {
        label: <Link href="/thuy-san">Trường Thuỷ sản</Link>,
        key: '4',
    },
    {
        label: <Link href="/bach-khoa">Trường Bách khoa</Link>,
        key: '5',
    },
    {
        label: <Link href="/luat">Khoa luật</Link>,
        key: '6',
    },
];

export const menuItems: MenuProps['items'] = [
    {
        label: <Link href="/">Trang chủ</Link>,
        key: 'home',
    },
    {
        label: (
            <Dropdown menu={{ items: categoryItems }}>
                <a onClick={(e) => e.preventDefault()}>
                    <Space>
                        Danh mục sách
                        <CaretDownOutlined />
                    </Space>
                </a>
            </Dropdown>
        ),
        key: 'categories',
    },
    {
        label: (
            <Link href="/bookUpload" onClick={handleUploadClick}>
                Đăng sách
            </Link>
        ),
        key: 'upload',
    },
];

export const userMenu: MenuProps = {
    items: [
        {
            key: 'myBooks',
            label: <Link href="/myBook">Sách của tôi</Link>,
        },
        {
            key: 'logout',
            label: (
                <a onClick={() => {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }}>
                    Đăng xuất
                </a>
            ),
        },
    ],
};
