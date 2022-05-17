let id = ''
let meetNum = ''
let meetAdd = ''
let reason = ''
Page({
  data: {
    steps: ["确认订单", "开始订单", "待评论"],
    minutes: 0,
    reserve_time: "2021.7.7 下午2:00至3:00",
    reserve_price: 50,
    check: false,
    reserve_price: 50,
    items: [{
        value: 'yes',
        name: '是'
      },
      {
        value: 'no',
        name: '否'
      }
    ],
    comment: [], //评论内容数组
    userstar: [
      "../../img/lightstar.png",
      "../../img/lightstar.png",
      "../../img/lightstar.png",
      "../../img/lightstar.png",
      "../../img/lightstar.png",
    ],
    score: 0,
    meeting: 214324243,
    status: 0,
    money: 300, //后辈已支付金额
    datalist: ''
  },
  onLoad(options) {
    var sta = options.status
    id = options.id
    this.setData({
      status: sta
    })
    wx.cloud.database().collection('11orderget').doc(id).get().then(res => {
      console.log(res)
      this.setData({
        datalist: res.data
      })
    })
  },
  back() {
    wx.navigateBack()
  },
  //状态1下接受或拒绝
  refuse() {
    this.setData({
      status: 4
    })
  },
  accept() {
    let that = this
    wx.cloud.database().collection('11orderget').doc(id).update({
      data: {
        status: 3
      },
      success(res) {
        wx.cloud.database().collection('11orderon').doc(id).update({
          data: {
            status: 3
          },
          success(res) {
            that.setData({
              status: 3
            })
          }
        })
      }
    })
  },
  //状态3下提交
  meet_number(e) {
    meetNum = e.detail.value
  },
  meet_address(e) {
    meetAdd = e.detail.value
  },
  submit() {
    let that = this
    if (meetAdd == '' || meetNum == '') {
      wx.showToast({
        title: '请填写链接',
        icon:'none'
      })
    } else {
      wx.cloud.database().collection('11orderon').doc(id).update({
        data: {
          meetNum: meetNum,
          meetAdd: meetAdd
        },
        success(res) {
          wx.cloud.database().collection('11orderget').doc(id).update({
            data: {
              meetNum: meetNum,
              meetAdd: meetAdd
            },success(res){
              console.log(res)
              that.setData({
                status:6
              })
            }
          })
        }
      })
    }
  },
  //状态4下拒绝
  add_reason(e){
    reason = e.detail.value
  },
  cancel(){
    this.setData({
      status:1
    })
  },
  finish(){
    let that = this
    if(reason==''){
      wx.showToast({
        title: '请填写拒绝理由',
        icon:'none'
      })
    }else{
      wx.cloud.database().collection('11orderget').doc(id).update({
        data:{
          status:4,
          reason:reason
        },success(res){
          wx.cloud.database().collection('11orderon').doc(id).update({
            data:{
              status:4,
              reason:reason
            },success(res){
              that.reMoney(id)

            }
          })
        }
      })
    }
  },
  //退款接口
  reMoney(orderId,fee){
    var nonce = this.nonceCode()
    var outRefundNo = this.orderCode()
    wx.cloud.callFunction({
      name:'return_money',
      data:{
        nonce_str:nonce,
        out_trade_no:orderId,
        out_refund_no:outRefundNo,
        total_fee:fee,
        refund_fee:fee,
      },success(res){
        console.log(res,'退款成功')
      },fail(err){
        console.log(err,'退款失败')
      }
    })
  },
  //退款uuid
  nonceCode() {
    var s = []
    var hex = "0123456789abcdef"
    for (var i = 0; i < 32; i++) {
      s[i] = hex.substr(Math.random() * 0x10, 1)
    }
    s[14] = 4
    s[19] = hex.substr((s[19] & 0x3) | 0x8, 1)
    var uuid = s.join("").replace("-", "")
    return uuid
  },
  //退款的订单号
  orderCode() {
    let ordercode = ''
    for (var i = 0; i < 6; i++) {
      ordercode += Math.floor(Math.random() * 10);
    }
    ordercode = 'W' + new Date().getTime() + ordercode
    return ordercode
  },
  
})