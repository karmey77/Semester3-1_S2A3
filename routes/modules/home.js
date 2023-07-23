// 引用 Express 與 Express 路由器
const express = require('express')
const router = express.Router()
const Category = require('../../models/category')
const User = require('../../models/user')
const Record = require('../../models/record')

// 定義首頁路由
router.get('/', (req, res) => {
    // const userId = req.user._id   // 變數設定

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    Record.find()         // 加入查詢條件{ userId }
        .lean()
        .sort({ date: 'desc' })
        .then(records => {

            let totalAmount = records.reduce((sum, record) => sum + record.amount, 0)

            records.forEach(record => {
                const CATEGORY = {
                    家居物業: "./assets/1.png",
                    交通出行: "./assets/2.png",
                    休閒娛樂: "./assets/3.png",
                    餐飲食品: "./assets/4.png",
                    其他: "./assets/5.png"
                }
                record.iconUrl = CATEGORY[Object.keys(CATEGORY)[record.categoryId-1]]
                record.formattedDate = formatDate(record.date); // 假設有一個 formatDate 函式可以將日期格式化為 "YYYY-MM-DD" 字串
            })

            res.render('index', {
                records: records,
                totalAmount: totalAmount
            })
        })
        // .then(records => console.log(records))
        .catch(error => console.error(error))
})

// 匯出路由模組
module.exports = router