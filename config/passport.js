const passport = require('passport')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth2').Strategy

module.exports = app => {
  app.use(passport.initialize())
  app.use(passport.session())

  //本地驗證策略
  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email })
      .then(user => {
        if (!user) return done(null, false, { message: '該信箱未註冊。' })
        return bcrypt.compare(password, user.password).then(isMatch => {
          if (!isMatch) {
            return done(null, false, { message: '信箱或密碼輸入錯誤。' })
          }
          return done(null, user)
        })
      })
      .catch(err => done(err, false))
  }))

  //Facebook驗證策略
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK,
    profileFields: ['email', 'displayName']   //向facebook請求開放的資料
  }, (accessToken, refreshToken, profile, done) => {
    // console.log(profile)
    const { name, email } = profile._json

    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8)

        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
  }))

  //Google驗證策略
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
    profileFields: ['email', 'displayName']
  }, (req, accessToken, refreshToken, profile, done) => {
    const { email, name } = profile._json
    User.findOne({ email })
      .then(user => {
        if (user) return done(null, user)
        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt.genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash => User.create({
            name,
            email,
            password: hash
          }))
          .then(user => done(null, user))
          .catch(err => done(err, null))
      })
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