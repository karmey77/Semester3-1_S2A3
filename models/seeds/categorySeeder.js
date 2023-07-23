if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const Category = require('../category')
const db = require('../../config/mongoose')
const { Promise } = require('mongoose')


const SEED_CATEGORIES = [{
    id: 1,
    name: '家居物業'
}, {
    id: 2,
    name: '交通出行'
}, {
    id: 3,
    name: '休閒娛樂'
}, {
    id: 4,
    name: '餐飲食品'
}, {
    id: 5,
    name: '其他'
}]

db.once('open', async () => {
    try {
        await Promise.all(
            SEED_CATEGORIES.map(async (SEED_CATEGORY) => {
                await Category.create({ id: SEED_CATEGORY.id, name: SEED_CATEGORY.name })
            })
        )

        console.log('category done.')
        process.exit()

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '發生錯誤，無法更新點擊次數' })
    }
})