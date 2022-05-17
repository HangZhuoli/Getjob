// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection("apply_big_info").get({
    success(res){
      return res
    },
    fail(err){
      return err
    }
  })
}