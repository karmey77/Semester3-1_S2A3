module.exports = {
    authenticator: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('warning_msg', '請先登入！')  // 加入這行
        res.redirect('/users/login')
    }
}