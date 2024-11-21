import { MenuProps, Dropdown } from 'antd';
import Link from 'next/link';
import { Space } from 'antd';
import { CaretDownOutlined, } from '@ant-design/icons';


const handleUploadClick = (e: React.MouseEvent, router: any) => {
    const token = localStorage.getItem('token');

    if (!token) {
        e.preventDefault();
        router.push('/login');
    } else {
        router.push('/bookUpload');
    }
};


export const categoryItems: MenuProps['items'] = [
    {
        label: <Link href="/categoryPages/cntt">Trường CNTT&TT</Link>,
        key: '1',
    },
    {
        label: <Link href="/categoryPages/nn">Trường Nông nghiệp</Link>,
        key: '2',
    },
    {
        label: <Link href="/categoryPages/kt">Trường Kinh Tế</Link>,
        key: '3',
    },
    {
        label: <Link href="/categoryPages/bk">Trường Bách khoa</Link>,
        key: '4',
    },
    {
        label: <Link href="/categoryPages/ts">Trường Thuỷ sản</Link>,
        key: '5',
    },
    {
        label: <Link href="/categoryPages/another">Sách khác</Link>,
        key: '6',
    },
];

export const createMenuItems = (router: any): MenuProps['items'] => [
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
            <a onClick={(e) => handleUploadClick(e, router)}>
                Đăng sách
            </a>
        ),
        key: 'upload',
    },
];

export const userMenu: MenuProps = {
    items: [
        {
            key: 'myBooks',
            label: <Link href="/myBook">Sách đã đăng</Link>,
        },
        {
            key: 'logout',
            label: (
                <a onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('username');
                    window.location.href = '/';
                }}>
                    Đăng xuất
                </a>
            ),
        },
    ],
};
