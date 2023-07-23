if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
const User = require('../user')
const Record = require('../record')
const Category = require('../category')
const db = require('../../config/mongoose')
const bcrypt = require('bcryptjs')
const { Promise } = require('mongoose')

const SEED_USERS = [{
    id: 2,
    name: '小新',
    account: 'user1@example.com',
    password: '123456'
}, {
    id: 1,
    name: '廣治',
    account: 'user2@example.com',
    password: '123456'
}]

const SEED_RECORDS = [{
    id: 1,
    name: '午餐',
    date: '2019.4.23',
    amount: 60,
    userId: 1,
    categoryId: 4
}, {
    id: 2,
    name: '晚餐',
    date: '2019.4.23',
    amount: 60,
    userId: 1,
    categoryId: 4
}, {
    id: 3,
    name: '捷運',
    date: '2019.4.23',
    amount: 120,
    userId: 1,
    categoryId: 2
}, {
    id: 4,
    name: '電影：驚奇隊長',
    date: '2019.4.23',
    amount: 220,
    userId: 2,
    categoryId: 3
}, {
    id: 5,
    name: '租金',
    date: '2015.4.01',
    amount: 25000,
    userId: 1,
    categoryId: 1
}]

db.once('open', async () => {
    try {
        await Promise.all(
            SEED_USERS.map(async (SEED_USER, user_index) => {
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(SEED_USER.password, salt)
                const user = await User.create({
                    id: SEED_USER.id,
                    name: SEED_USER.name,
                    account: SEED_USER.account,
                    password: hash
                })
                const userId = user._id
                return SEED_RECORDS.filter((SEED_RECORD) => SEED_RECORD.userId === SEED_USER.id).map(async (SEED_RECORD) => {
                    await Record.create({
                        id: SEED_RECORD.id,
                        name: SEED_RECORD.name,
                        date: new Date(SEED_RECORD.date),
                        amount: SEED_RECORD.amount,
                        userId: user._id,
                        categoryId: Number(SEED_RECORD.categoryId)
                    });
                });
            })
        )

        console.log('user & record done.');
        process.exit();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '發生錯誤，無法更新點擊次數' })
    }

})