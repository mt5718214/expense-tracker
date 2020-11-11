const passport = require('passport')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  //本地驗證策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) return done(null, false)
        if (user.password !== password) return done(null, false)
        return done(null, user)
      })
      .catch(err => done(err, false))
  }))

  //資料序列化
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  //資料反序列化
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then(user => done(null, user))
      .catch(err => done(err, null))
  })
}