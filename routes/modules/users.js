const passport = require('passport')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const express = require('express')
const router = express.Router()

//使用者登入頁面
router.get('/login', (req, res) => {
  res.render('login')
})

//驗證登入表單
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true,
}))

//使用者註冊頁面
router.get('/register', (req, res) => {
  res.render('register')
})

//驗證註冊表單
router.post('/register', async (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []

  try {
    if (!(name && email && password && confirmPassword)) {
      errors.push({ message: '所有欄位都是必填。' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '密碼與確認密碼不相符！' })
    }
    if (errors.length) {
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      await User.create({
        name,
        email,
        password: hash
      })
      return res.redirect('/')
    }
    errors.push({ message: '這個 Email 已經註冊過了。' })
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  } catch (error) {
    console.log(error)
  }
})

//使用者登出
router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router