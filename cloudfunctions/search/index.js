// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const DB = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  const {
    key,
  } = event;
  return DB.collection('action').where(_.or([{
        shop_name: DB.RegExp({
          regexp: key,
          options: 'i',
        })
      },
      {
        big: DB.RegExp({
          regexp: key,
          options: 'i'
        })
      },
      {
        start_date:DB.RegExp({
          regexp:key,
          options:'i'
        })
      },
      {
        tap:DB.RegExp({
          regexp:key,
          options:'i'
        })
      }
    ]))
    .get()
    .then(res => {
      console.log('success', res)
    })
}