// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await cloud.database().collection("my_freetime").doc(event.id).update({
    data:{
      my_freetime:event.time
    }
  }).then(res=>{
    return res
  }).catch(err=>{
    return err
  })
}