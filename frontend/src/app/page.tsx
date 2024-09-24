import React from 'react';
import BookList from '@/app/client-components/BookList/BookList';
import styles from '@/styles/home.module.scss'


const Home: React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>
        <h2>DANH SÁCH GIÁO TRÌNH</h2>
      </div>
      <BookList />
    </div>
  );
};

export default Home;
