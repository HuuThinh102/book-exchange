import React from 'react'
import styles from './loading.module.scss'
import { Spin } from 'antd';

const Loading = () => {
    return (
        <div className={styles.spinWrapper}>
            <Spin size="large" />
        </div>
    )
}

export default Loading
