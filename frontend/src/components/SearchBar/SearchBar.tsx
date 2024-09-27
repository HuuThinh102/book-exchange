import React, { useState } from 'react';
import { Input, Button } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './searchbar.module.scss';

interface SearchBarProps {
    onSearch: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState<string>('');

    const handleSearch = () => {
        onSearch(inputValue.trim());
    };

    return (
        <div className={styles.searchBar}>
            <Input
                placeholder="Tìm kiếm sách"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onPressEnter={handleSearch}
                className={styles.input}
            />
            <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                className={styles.button}
            >
                Tìm kiếm
            </Button>
        </div>
    );
};

export default SearchBar;
