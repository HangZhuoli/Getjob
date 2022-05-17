// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  cloud.database().collection('action').orderBy("start_date", "desc")
    .get()
    .then(res => {
      cloud.database().collection('action').get().then(
        res => {
          return res
        }
      )
    }).catch(err => {
      return err
    })
}