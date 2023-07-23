const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../../models/user')
const Record = require('../../models/record')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
    res.render('login')
})

// 加入 middleware，驗證 request 登入狀態
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {

    res.render('register')
    // res.render('register')
})

router.post('/register', (req, res) => {
    const { name, account, password, confirmPassword } = req.body
    const errors = []
    if (!name || !account || !password || !confirmPassword) {
        errors.push({ message: '所有欄位都是必填！' })
    }
    if (password !== confirmPassword) {
        errors.push({ message: '密碼 與 確認密碼 不相符！' })
    }
    if (errors.length) {
        return res.render('register', {
            errors,
            name,
            account,
            password,
            confirmPassword
        })
    }
    User.findOne({ account }).then(user => {
        if (user) {
            errors.push({ message: '這個 帳號 已經註冊過了。' })
            return res.render('register', {
                errors,
                name,
                account,
                password,
                confirmPassword
            })
        }
        return bcrypt
            .genSalt(10) // 產生「鹽」，並設定複雜度係數為 10
            .then(salt => bcrypt.hash(password, salt)) // 為使用者密碼「加鹽」，產生雜湊值
            .then(hash => User.create({
                name,
                account,
                password: hash // 用雜湊值取代原本的使用者密碼
            }))
            .then(() => res.redirect('/'))
            .catch(err => console.log(err))
    })
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', '你已經成功登出。')
    res.redirect('/users/login')
})

module.exports = router;
