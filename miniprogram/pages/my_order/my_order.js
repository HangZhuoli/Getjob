// const { time } = require("console");
let openid = ''
// miniprogram/pages/my_order/my_order.js
let order_status=['待支付','待前辈确认','订单待开始','前辈已拒绝','订单进行中','待评价','订单已结束','订单已取消']
Page({
  data: {
    iReserve: true,
    reserveI: false,
    datalist: '',
    countdown: [],
    lefttime: [],
    big_order: [],
    start_time:'',
    end_time:'',
    min:'',
  },
  // countDown(i) {
  //   var that = this
  //   // console.log(that.data.datalist)
  //   var starttime = new Date(that.data.datalist[i].time).getTime();
  //   var start = starttime
  //   var endTime = start + 15 * 60000
  //   var date = new Date(); //现在时间
  //   var now = date.getTime(); //现在时间戳
  //   var allTime = endTime - now
  //   var m, s;
  //   if (allTime > 0) {
  //       m = Math.floor(allTime / 1000 / 60 % 60);
  //       s = Math.floor(allTime / 1000 % 60);
  //       that.setData({
  //         countdown: m + "分" + s + "秒",
  //       })
  //     setTimeout(that.countDown(i), 1000);
  //   } else {
  //     console.log('已截止')
  //     that.setData({
  //       countdown: '00分00秒'
  //     })
  //   }
  // },
  /**
   * 未支付订单倒计时
   */
  goToMine: function () {
    wx.switchTab({
      url: '../mine/mine'
    });
  },
  iReserve: function () {
    this.setData({
      iReserve: true,
      reserveI: false
    })
  },
  reserveI: function () {
    this.setData({
      iReserve: false,
      reserveI: true
    })
  },
  onLoad(options) {
    openid = options.id
    //获取11我收到的订单数据
    console.log(openid)
    wx.cloud.database().collection("11orderget").where({
      p:openid
    }).get().then(res => {
      let time  = res.data
      console.log(res,"预约我的")
      console.log(time)
      this.setData({
        big_order: res.data
      })
    })
    //获取11我发起的订单数据
    wx.cloud.database().collection("11orderon").where({
      p:openid
    }).get().then(res=>{

    })
    //获取群面分享会我发起的订单
    wx.cloud.database().collection("my_order").get().then(res => {
      this.setData({
        datalist: res.data
      })
      var ccountdown = new Array()
      let len = this.data.datalist.length;
      for (var i = 0; i < len; i++) {
        if (this.data.datalist[i].status == 0) {
          ccountdown[i] = this.data.datalist[i].time
        } else {
          ccountdown[i] = 0
        }
        this.setData({
          countdown: ccountdown
        })
      }
      this.countDown()
    }).catch(err => {
      console.log(err)
    })
    
  },
  countDown: function () {
    var that = this;
    var ddatalist = that.data.datalist
    var llefttime = new Array()
    that.data.timer = setInterval(function () {
      var orders = that.data.countdown;
      for (var i = 0; i < orders.length; i++) {
        if (orders[i] != 0) {
          var create_time = orders[i];
          //计算剩余时间差值
          var leftTime = (new Date(create_time).getTime()) - (new Date().getTime());
          if (leftTime > 0) {
            //计算剩余的分钟
            var minutes = Math.floor(parseInt(leftTime / 1000 / 60 % 60, 10));
            //计算剩余的秒数
            var seconds = Math.floor(parseInt(leftTime / 1000 % 60, 10));
            var left_time = minutes + ":" + seconds;
            llefttime[i] = left_time
          } else {
            //移除超时未支付的订单
            llefttime[i] = 1
            
          }
        }
      }
      that.setData({
        lefttime: llefttime
      })
    }, 1000);
    this.remove()
  },
  remove() {
    console.log(this.data)
    var del = this.data.lefttime
    for (var i = 0; i < del.length; i++) {
      if (del[i] == 1) {
        target = this.data.datalist[i]._id
        wx.cloud.database().collection("my_order").doc(target).remove().then(res => {
          console.log("已删除")
        })
      }
    }
  },
  //退款功能
  re_money(tradeNO,fee) {
    var nonce = this.nonceCode()
    var out_refund_no = this.orderCode()
    console.log(nonce)
    wx.cloud.callFunction({
      name: 'return_money',
      data: {
        nonce_str: nonce,
        out_trade_no: tradeNO, //某条订单的订单号
        out_refund_no:out_refund_no,
        total_fee:fee,//对应订单的总额
        refund_fee:fee,//全款退钱
      },success(res){
        console.log(res,"退款成功")
        //修改对应订单的状态，status=>已退款
      },fail(err){
        console.log(err,"退款出错")
      }
    })
  },
  orderCode() {
    let ordercode = ''
    for (var i = 0; i < 6; i++) {
      ordercode += Math.floor(Math.random() * 10);
    }
    ordercode = 'W' + new Date().getTime() + ordercode
    return ordercode
  },
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
  agree(e){
    let that = this
    console.log(e.currentTarget.dataset.item)
    let order_id = e.currentTarget.dataset.item._id
    wx.cloud.database().collection("11orderget").doc(order_id).update({
      data:{
        status:3
      },success(res){
        wx.cloud.database().collection("11orderon").doc(order_id).update({
          data:{
            status:3
          },success(res){
            wx.cloud.database().collection("11orderget").where({
              p:openid
            }).get().then(res=>{
              that.setData({
                big_order:res.data
              })
            })
          }
        })
      }
    })
    // wx.cloud.database().collection("11orderget").doc()
  },
  reject(e){
    console.log(e.currentTarget.dataset.item)
    let that = this
    let order_id = e.currentTarget.dataset.item._id
    let fee = e.currentTarget.dataset.item.totalfee
    console.log(fee)
    wx.cloud.database().collection("11orderget").doc(order_id).update({
      data:{
        status:4
      },success(res){
        wx.cloud.database().collection("11orderon").doc(order_id).update({
          data:{
            status:4
          },success(res){
            wx.cloud.database().collection("11orderget").where({
              p:openid
            }).get().then(res=>{
              that.re_money(order_id,fee);
              that.setData({
                big_order:res.data
              })
            })
          }
        })
      }
    })
  },
  gotodetail(e){
    
  },
  gotodetail_big(e){
    console.log(e.currentTarget)
    var staus = e.currentTarget.dataset.item.status
    var id = e.currentTarget.dataset.item._id
    wx.navigateTo({
      url: '/pages/bigreserve/bigreserve?status='+staus+'&id='+id,
    })
  }
})