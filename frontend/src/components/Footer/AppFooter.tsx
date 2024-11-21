import React from 'react'
import style from './footer.module.scss'

const AppFooter = () => {
    return (
        <div className={style.wrapper}>
            <div className={style.info}>
                <h2>Giới thiệu</h2>
                <p>👨‍💼: Trần Hữu Thịnh</p>
                <p>🪪: B2017082</p>
                <p>🏫: Khoa học máy tính</p>
            </div>
            <div className={style.contact}>
                <h2>Liên hệ</h2>
                <p>📍: Đại học Cần Thơ, Khu II, đường 3/2, Xuân Khánh, Ninh Kiều, Cần Thơ, Việt Nam</p>
                <p>📞: 0987654312</p>
            </div>
        </div>
    )
}
export default AppFooter;

