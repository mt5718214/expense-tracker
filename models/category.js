const mongoose = require('mongoose')
const Schema = mongoose.Schema

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    //mongoose內建驗證器, enum枚舉：指定該字段的允許值集合。
    enum: ['家居物業', '交通出行', '休閒娛樂', '餐飲食品', '其他']
  },
  icon: {
    type: String
  }
})

module.exports = mongoose.model('Category', categorySchema)