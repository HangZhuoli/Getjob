// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.cloudPay.refund({
    "functionName":'paycallback',
    "envId":'cloud1-7gzdxtdh37ab3a0f',
    "sub_mch_id":'1612654793',
    "nonce_str":event.nonce_str,
    "out_trade_no":event.out_trade_no,
    "out_refund_no":event.out_refund_no,
    "total_fee":event.total_fee,
    "refund_fee":event.total_fee,
  })
  return res
}