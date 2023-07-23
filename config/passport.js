const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const User = require('../models/user')
const Record = require('../models/record')
const bcrypt = require('bcryptjs')
// const FacebookStrategy = require('passport-facebook').Strategy

module.exports = app => {
    // 初始化 Passport 模組
    app.use(passport.initialize())
    app.use(passport.session())
    // 設定本地登入策略
    passport.use(new LocalStrategy({ usernameField: 'account' , passReqToCallback: true}, (req, account, password, done) => {
        User.findOne({ account })
            .then(user => {
                if (!user) {
                    return done(null, false, req.flash('warning_msg', '此帳號尚未註冊！'))
                }
                return bcrypt.compare(password, user.password).then(isMatch => {
                    if (!isMatch) {
                        return done(null, false, req.flash('warning_msg', '帳號或密碼出現錯誤！'))
                    }
                    return done(null, user)
                })
            })
            .catch(err => done(err, false))
    }))

    // 設定序列化與反序列化
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser((_id, done) => {
        User.findById(_id)
            .lean()
            .then(user => done(null, user))
            .catch(err => done(err, null))
    })
}