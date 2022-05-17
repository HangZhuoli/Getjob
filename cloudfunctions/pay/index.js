// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const res = await cloud.cloudPay.unifiedOrder({
    "body":event.good_name,//商品名称
    "outTradeNo":event.tradeNO,//订单号
    "spbillCreateIp":"127.0.0.1",
    "subMchId":"1612654793",//商户号
    "totalFee":event.totalFee,//支付金额，单位分
    "envId":"cloud1-7gzdxtdh37ab3a0f",
    "functionName":"pay_back"
  })
  return res
}