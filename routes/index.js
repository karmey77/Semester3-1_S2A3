const express = require('express')
const router = express.Router()
// const { authenticator } = require('../middleware/auth')  // 掛載 middleware
const home = require('./modules/home') // 引入 home 模組程式碼
const records = require('./modules/records')
// const users = require('./modules/users')
// const auth = require('./modules/auth')
// const updater = require('./modules/updater')
// const leaderboard = require('./modules/leaderboard')

// router.use('/users', users)
// router.use('/auth', auth)
// router.use('/update-kiss-count', authenticator, updater)
// router.use('/leaderboard', authenticator, leaderboard)
// router.use('/', authenticator, home) // 將網址結構符合 / 字串的 request 導向 home 模組
router.use('/records', records)
router.use('/', home) // 將網址結構符合 / 字串的 request 導向 home 模組

// 匯出路由器
module.exports = router