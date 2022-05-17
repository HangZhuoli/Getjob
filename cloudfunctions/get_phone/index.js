// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxcontext = cloud.getWXContext()
  return {
    event,
    openid:wxcontext.OPENID
  }
  }